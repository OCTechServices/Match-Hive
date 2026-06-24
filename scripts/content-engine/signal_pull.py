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


def get_matches_for_date(d: date) -> list[dict]:
    date_str = d.strftime("%Y-%m-%d")
    try:
        data = _fd_get(f"/competitions/WC/matches?dateFrom={date_str}&dateTo={date_str}")
        return [_parse_match(m) for m in data.get("matches", [])]
    except Exception as e:
        print(f"  Match fetch error for {date_str}: {e}")
        return []


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
    now = datetime.now(timezone.utc)
    today = now.date()
    yesterday = today - timedelta(days=1)

    print("  Fetching today's matches...")
    today_matches = get_matches_for_date(today)

    print("  Fetching yesterday's results...")
    yesterday_matches = get_matches_for_date(yesterday)
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
