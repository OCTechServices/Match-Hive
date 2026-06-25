"""
signal_pull.py — Daily WC signal pull
Source: football-data.org (same API used by /schedule and /standings)

Returns a structured brief with today's matches, yesterday's results,
and a group standings snapshot for Claude to generate content from.
"""

import os
import requests
from datetime import datetime, timedelta, timezone, date


FD_BASE = "https://api.football-data.org/v4"

FD_NAME_MAP = {
    'United States': 'USA',
    'Korea Republic': 'South Korea',
    "Côte d'Ivoire": 'Ivory Coast',
    'Türkiye': 'Turkiye',
    'Turkey': 'Turkiye',
    'Bosnia-Herzegovina': 'Bosnia and Herzegovina',
    'Bosnia & Herzegovina': 'Bosnia and Herzegovina',
    'Cape Verde Islands': 'Cape Verde',
    'Congo DR': 'DR Congo',
}


def _resolve(name: str) -> str:
    return FD_NAME_MAP.get(name, name)


def _fd_get(path: str) -> dict:
    key = os.environ.get("FOOTBALL_DATA_API_KEY")
    if not key:
        raise ValueError("FOOTBALL_DATA_API_KEY not set")
    resp = requests.get(
        f"{FD_BASE}{path}",
        headers={"X-Auth-Token": key},
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


def _get_phase(d: date) -> str:
    if d <= date(2026, 6, 28):
        return "Group Stage"
    elif d <= date(2026, 7, 3):
        return "Round of 32"
    elif d <= date(2026, 7, 7):
        return "Round of 16"
    elif d <= date(2026, 7, 11):
        return "Quarter-Finals"
    elif d <= date(2026, 7, 15):
        return "Semi-Finals"
    elif d == date(2026, 7, 18):
        return "Third Place"
    else:
        return "Final"


def _parse_match(m: dict) -> dict:
    return {
        "home": _resolve(m["homeTeam"]["name"]),
        "away": _resolve(m["awayTeam"]["name"]),
        "utc_date": m["utcDate"],
        "status": m["status"],
        "home_score": m["score"]["fullTime"].get("home"),
        "away_score": m["score"]["fullTime"].get("away"),
        "group": m.get("group", "").replace("GROUP_", "Group "),
        "stage": m.get("stage", ""),
    }


def get_matches_for_et_date(et_date: date) -> list[dict]:
    """Fetch matches that fall on et_date in ET (America/New_York).
    Late-night ET matches (e.g. 9 PM ET = 1 AM UTC next day) have a UTC date
    one day ahead, so we query both UTC dates and filter by ET date."""
    from zoneinfo import ZoneInfo
    et_tz = ZoneInfo("America/New_York")

    date_from = et_date.strftime("%Y-%m-%d")
    date_to   = (et_date + timedelta(days=1)).strftime("%Y-%m-%d")
    try:
        data = _fd_get(f"/competitions/WC/matches?dateFrom={date_from}&dateTo={date_to}")
        matches = []
        for m in data.get("matches", []):
            utc_dt = datetime.fromisoformat(m["utcDate"].replace("Z", "+00:00"))
            if utc_dt.astimezone(et_tz).date() == et_date:
                matches.append(_parse_match(m))
        return matches
    except Exception as e:
        print(f"  Match fetch error for {et_date}: {e}")
        return []


# Keep old name as thin wrapper for backward compatibility
def get_matches_for_date(d: date) -> list[dict]:
    return get_matches_for_et_date(d)


def get_standings_snapshot() -> list[dict]:
    """Top 2 (+ 3rd) from each group — compact snapshot."""
    try:
        data = _fd_get("/competitions/WC/standings")
        snapshot = []
        for g in data.get("standings", []):
            if g["type"] != "TOTAL":
                continue
            letter = g["group"].replace("GROUP_", "")
            rows = [
                {
                    "pos": i + 1,
                    "team": _resolve(r["team"]["name"]),
                    "pts": r["points"],
                    "gd": r["goalDifference"],
                    "played": r["playedGames"],
                }
                for i, r in enumerate(g["table"][:3])
            ]
            snapshot.append({"group": letter, "table": rows})
        return sorted(snapshot, key=lambda x: x["group"])
    except Exception as e:
        print(f"  Standings fetch error: {e}")
        return []


def build_signal_brief() -> dict:
    from zoneinfo import ZoneInfo
    et_tz = ZoneInfo("America/New_York")
    now_et = datetime.now(et_tz)
    today = now_et.date()          # ET date — consistent with what the app displays
    yesterday = today - timedelta(days=1)

    print("  Fetching today's matches...")
    today_matches = get_matches_for_et_date(today)

    print("  Fetching yesterday's results...")
    yesterday_matches = get_matches_for_et_date(yesterday)
    yesterday_results = [m for m in yesterday_matches if m["status"] == "FINISHED"]

    print("  Fetching standings snapshot...")
    standings = get_standings_snapshot()

    tournament_start = date(2026, 6, 11)
    day_number = (today - tournament_start).days + 1

    return {
        "date": today.strftime("%Y-%m-%d"),
        "day_of_tournament": max(1, day_number),
        "tournament_phase": _get_phase(today),
        "today_matches": today_matches,
        "yesterday_results": yesterday_results,
        "standings_snapshot": standings,
    }


if __name__ == "__main__":
    import json
    brief = build_signal_brief()
    print(json.dumps(brief, indent=2))
