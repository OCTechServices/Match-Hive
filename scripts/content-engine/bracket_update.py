"""
bracket_update.py — Sync WC 2026 knockout results → Supabase bracket_matches.

Fetches all WC matches from football-data.org, updates bracket_matches with:
  • home_team / away_team  (once determined from group stage results)
  • home_score / away_score / winner / status='completed'  (when FINISHED)
  • Advances each winner to their next-round slot in Supabase

Idempotent — safe to run at any time, at any frequency.
Run:
  python bracket_update.py
  python bracket_update.py --dry-run   # print changes, no Supabase writes
"""

import os
import sys
import json
import requests
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

from signal_pull import _fd_get, _resolve


# ── Bracket advancement map ───────────────────────────────────────────────────
# ADVANCEMENT[match_id] = (next_match_id, 'home' | 'away')
# Winner of match_id fills next_match_id's home_team or away_team slot.
ADVANCEMENT: dict = {
    # R32 → R16
    "M73": ("M90", "home"), "M75": ("M90", "away"),
    "M74": ("M89", "home"), "M77": ("M89", "away"),
    "M76": ("M91", "home"), "M78": ("M91", "away"),
    "M79": ("M92", "home"), "M80": ("M92", "away"),
    "M83": ("M93", "home"), "M84": ("M93", "away"),
    "M81": ("M94", "home"), "M82": ("M94", "away"),
    "M85": ("M96", "home"), "M87": ("M96", "away"),
    "M86": ("M95", "home"), "M88": ("M95", "away"),
    # R16 → QF
    "M90": ("M97", "home"),  "M89": ("M97", "away"),
    "M91": ("M98", "home"),  "M92": ("M98", "away"),
    "M93": ("M99", "home"),  "M94": ("M99", "away"),
    "M95": ("M100", "home"), "M96": ("M100", "away"),
    # QF → SF  (upper bracket: QF1 vs QF3 → SF1; lower: QF2 vs QF4 → SF2)
    "M97":  ("M101", "home"), "M99":  ("M101", "away"),
    "M98":  ("M102", "home"), "M100": ("M102", "away"),
    # SF winners → Final
    "M101": ("M104", "home"), "M102": ("M104", "away"),
}

# SF losers → Third-place match
SF_LOSER: dict = {
    "M101": ("M103", "home"),
    "M102": ("M103", "away"),
}


# ── Supabase helpers ──────────────────────────────────────────────────────────

def _sb_base() -> str:
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    if not url:
        raise ValueError("NEXT_PUBLIC_SUPABASE_URL not set")
    return f"{url}/rest/v1/bracket_matches"


def _sb_headers(prefer_minimal: bool = False) -> dict:
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not key:
        raise ValueError("SUPABASE_SERVICE_ROLE_KEY not set")
    h = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if prefer_minimal:
        h["Prefer"] = "return=minimal"
    return h


def sb_get_all() -> list[dict]:
    resp = requests.get(
        _sb_base(),
        headers=_sb_headers(),
        params={"select": "*"},
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


def sb_update(match_id: str, updates: dict, dry_run: bool = False) -> None:
    if dry_run:
        print(f"    [DRY] {match_id}: {json.dumps(updates)}")
        return
    resp = requests.patch(
        _sb_base(),
        headers=_sb_headers(prefer_minimal=True),
        params={"id": f"eq.{match_id}"},
        json=updates,
        timeout=10,
    )
    resp.raise_for_status()
    print(f"    [OK]  {match_id}: {json.dumps(updates)}")


# ── Helpers ───────────────────────────────────────────────────────────────────

def _utc_key(s: Optional[str]) -> Optional[str]:
    """Return YYYY-MM-DDTHH:MM (first 16 chars) for loose timestamp matching."""
    return s[:16] if s else None


# ── Core sync ─────────────────────────────────────────────────────────────────

def run(dry_run: bool = False) -> None:
    print("=== Bracket Update ===\n")

    # 1. Current Supabase state
    print("[1/3] Fetching bracket_matches from Supabase...")
    sb_rows = sb_get_all()
    sb_by_id: dict[str, dict] = {r["id"]: r for r in sb_rows}
    print(f"  Loaded {len(sb_rows)} rows")

    # 2. All WC matches from football-data.org
    print("\n[2/3] Fetching WC matches from football-data.org...")
    try:
        data = _fd_get("/competitions/WC/matches")
    except Exception as e:
        print(f"  ERROR: {e}", file=sys.stderr)
        sys.exit(1)

    api_matches = data.get("matches", [])
    print(f"  Got {len(api_matches)} total matches")

    # 3. Sync each bracket row
    print("\n[3/3] Processing rows...\n")
    # Collect (match_id, winner, home_name, away_name) for post-loop advancement
    finished: list = []  # (match_id, winner, home_name, away_name)

    for sb_row in sorted(sb_rows, key=lambda r: r.get("date_utc") or ""):
        match_id = sb_row["id"]
        key = _utc_key(sb_row.get("date_utc"))

        # Find matching API match:
        # 1. Exact UTC-minute key match
        # 2. Fallback: team-name match (covers rescheduled kickoffs)
        # 3. Fallback: either-order team match (bracket home/away ≠ API home/away)
        api_m = None
        sb_home = sb_row.get("home_team")
        sb_away = sb_row.get("away_team")

        if key:
            candidates = [m for m in api_matches if _utc_key(m.get("utcDate")) == key]
            if len(candidates) == 1:
                api_m = candidates[0]
            elif len(candidates) > 1:
                for c in candidates:
                    ch = _resolve((c.get("homeTeam") or {}).get("name") or "")
                    ca = _resolve((c.get("awayTeam") or {}).get("name") or "")
                    if (not sb_home or ch == sb_home) and (not sb_away or ca == sb_away):
                        api_m = c
                        break
                if not api_m:
                    api_m = candidates[0]

        # Team-name fallback for rescheduled matches
        if not api_m and sb_home and sb_away:
            for m in api_matches:
                ch = _resolve((m.get("homeTeam") or {}).get("name") or "")
                ca = _resolve((m.get("awayTeam") or {}).get("name") or "")
                if (ch == sb_home and ca == sb_away) or (ch == sb_away and ca == sb_home):
                    api_m = m
                    break

        if not api_m:
            continue

        home_name = _resolve((api_m.get("homeTeam") or {}).get("name") or "") or None
        away_name = _resolve((api_m.get("awayTeam") or {}).get("name") or "") or None
        api_status = api_m.get("status", "")
        score = api_m.get("score") or {}
        full_time = score.get("fullTime") or {}
        home_score = full_time.get("home")
        away_score = full_time.get("away")
        winner_side = score.get("winner")  # "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null

        updates: dict = {}

        # Correct date_utc if API has a different kickoff time (rescheduled matches)
        api_utc = api_m.get("utcDate")
        if api_utc and _utc_key(api_utc) != _utc_key(sb_row.get("date_utc")):
            updates["date_utc"] = api_utc

        # Populate team names when API has them and Supabase doesn't
        if home_name and sb_row.get("home_team") != home_name:
            updates["home_team"] = home_name
        if away_name and sb_row.get("away_team") != away_name:
            updates["away_team"] = away_name

        if api_status == "FINISHED":
            # Resolve winner name
            eff_home = home_name or sb_row.get("home_team")
            eff_away = away_name or sb_row.get("away_team")
            winner_name: Optional[str] = None
            if winner_side == "HOME_TEAM":
                winner_name = eff_home
            elif winner_side == "AWAY_TEAM":
                winner_name = eff_away

            if home_score is not None and sb_row.get("home_score") != home_score:
                updates["home_score"] = home_score
            if away_score is not None and sb_row.get("away_score") != away_score:
                updates["away_score"] = away_score
            if winner_name and sb_row.get("winner") != winner_name:
                updates["winner"] = winner_name
            if sb_row.get("status") != "completed":
                updates["status"] = "completed"

            if winner_name:
                finished.append((match_id, winner_name, eff_home, eff_away))

        elif api_status in ("IN_PLAY", "PAUSED") and sb_row.get("status") != "live":
            updates["status"] = "live"
            if home_score is not None:
                updates["home_score"] = home_score
            if away_score is not None:
                updates["away_score"] = away_score

        if updates:
            print(f"  {match_id} ({sb_row.get('round')}):")
            sb_update(match_id, updates, dry_run=dry_run)
        else:
            print(f"  {match_id}: up to date")

    # Advance winners to next-round slots
    if finished:
        print("\n--- Advancing winners ---\n")
        for match_id, winner, home, away in finished:
            _advance(match_id, winner, home, away, sb_by_id, dry_run=dry_run)
    else:
        print("\nNo finished matches to advance.")

    print("\n=== Done ===")


def _advance(
    match_id: str,
    winner: str,
    home: Optional[str],
    away: Optional[str],
    sb_by_id: dict,
    dry_run: bool = False,
) -> None:
    """Write winner (and loser for SF) to the correct next-round Supabase slot."""
    # Winner → next round
    if match_id in ADVANCEMENT:
        next_id, slot = ADVANCEMENT[match_id]
        next_row = sb_by_id.get(next_id, {})
        # Skip: if the destination match is already completed, the API's home/away
        # assignment is authoritative — advancement-slot order may differ from API.
        if next_row.get("status") == "completed":
            print(f"  {winner} → {next_id} ({slot}): skipped (match completed, API home/away authoritative)")
            return
        field = f"{slot}_team"
        if next_row.get(field) != winner:
            print(f"  {winner} → {next_id} ({slot})")
            sb_update(next_id, {field: winner}, dry_run=dry_run)
        else:
            print(f"  {winner} → {next_id} ({slot}): already set")

    # SF loser → third-place match
    if match_id in SF_LOSER:
        loser = away if winner == home else home
        if loser:
            next_id, slot = SF_LOSER[match_id]
            field = f"{slot}_team"
            if sb_by_id.get(next_id, {}).get(field) != loser:
                print(f"  {loser} (loser) → {next_id} ({slot})")
                sb_update(next_id, {field: loser}, dry_run=dry_run)
            else:
                print(f"  {loser} (loser) → {next_id} ({slot}): already set")


if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    if dry_run:
        print("[DRY RUN — no Supabase writes]\n")
    run(dry_run=dry_run)
