"""
content.py — Daily content generation for Match-Hive
Takes live WC signal brief, outputs one post per platform.
"""

import json
import os
from pathlib import Path
from datetime import datetime, timezone
from anthropic import Anthropic

IG_AGENT_PATH = Path(__file__).parent.parent.parent / ".claude" / "agents" / "marketing" / "match-hive-instagram.md"
TWITTER_AGENT_PATH = Path(__file__).parent.parent.parent / ".claude" / "agents" / "marketing" / "match-hive-twitter.md"


def _parse_json(text: str) -> dict:
    """Parse JSON from Claude response, stripping markdown fences if present."""
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```", 2)[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.rsplit("```", 1)[0]
    return json.loads(text.strip())


def _client() -> Anthropic:
    return Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])


def _angle(brief: dict) -> str:
    """Pick content angle based on what's available in today's brief."""
    has_results = bool(brief.get("yesterday_results"))
    has_today = bool(brief.get("today_matches"))
    phase = brief.get("tournament_phase", "Group Stage")

    if phase in ("Round of 32", "Round of 16", "Quarter-Finals", "Semi-Finals", "Final", "Third Place"):
        return "knockout update"
    if has_results and has_today:
        return "recap + preview"
    if has_results:
        return "result recap"
    if has_today:
        return "match preview"
    return "standings update"


def generate_instagram_post(brief: dict) -> dict:
    """Generate one Instagram post for today."""
    system_prompt = IG_AGENT_PATH.read_text() if IG_AGENT_PATH.exists() else ""
    angle = _angle(brief)

    prompt = f"""Generate today's Instagram post for @match.hive.

Match-Hive is a FIFA World Cup 2026 tracker — live scores, team schedules, live bracket, calendar downloads.
URL: match-hive.vercel.app
Brand voice: fan-first, direct, no hype. Speaks to people actually watching the games.

Today's signal:
{json.dumps(brief, indent=2)}

Content angle: {angle}

Return a single JSON object:
{{
  "hook": "Opening line — max 10 words, punchy fan voice, grabs attention. Include flag emojis for teams (e.g. 🇧🇷 🇦🇷). If template is Result Recap, hook MUST be exactly 'Flag Team A X – Y Team B Flag' (e.g. '🇵🇹 Portugal 5 – 0 Uzbekistan 🇺🇿').",
  "body": "2-3 sentences. Factual, specific, references real teams/results/stakes from the signal. No filler. Include flag emojis where natural.",
  "eyebrow": "Short context label — e.g. 'Group C · Matchday 2' or 'Round of 32'",
  "cta": "Track every match → match-hive.vercel.app",
  "hashtags": "5-7 hashtags — always include #WorldCup2026 #FIFA2026, add specific team/match tags",
  "template": "<Match Preview | Result Recap | Standings Update | Bracket Update>",
  "source_signal": "One sentence: what from the brief shaped this post"
}}

Rules:
- Hook is fan voice — like texting a friend who watches the same game, not a sports brand
- Body is factual and specific — real teams, real stakes, real consequences
- Never: "epic", "stunning", "incredible", "the beautiful game", generic hype
- If template is "Result Recap": hook MUST be exactly "Team A X – Y Team B" (e.g. "Portugal 5 – 0 Uzbekistan"). Score format only — no narrative text in the hook.
- If results exist: lead with the outcome or the upset
- If preview: lead with what's at stake (elimination, group lead, revenge)
- If knockout phase: lead with who advances and what's next
- CTA is always exactly: match-hive.vercel.app

Return only the JSON object. No markdown, no explanation."""

    kwargs = dict(
        model="claude-opus-4-6",
        max_tokens=1024,
        temperature=0.6,
        messages=[{"role": "user", "content": prompt}],
    )
    if system_prompt:
        kwargs["system"] = system_prompt

    response = _client().messages.create(**kwargs)
    post = _parse_json(response.content[0].text)

    return {
        **post,
        "scheduled_date": brief["date"],
        "status": "Draft",
        "ig_published": False,
    }


def generate_twitter_post(brief: dict) -> dict:
    """Generate one Twitter/X post for today."""
    system_prompt = TWITTER_AGENT_PATH.read_text() if TWITTER_AGENT_PATH.exists() else ""
    angle = _angle(brief)

    prompt = f"""Generate today's Twitter/X post for Match-Hive.

Match-Hive: FIFA World Cup 2026 tracker — schedules, live scores, bracket, calendar downloads.
URL: match-hive.vercel.app
Audience: soccer fans, sports Twitter, World Cup watchers.
Tone: reactive, fan voice. Like someone watching the same games as their followers. Lowercase is fine.

Today's signal:
{json.dumps(brief, indent=2)}

Content angle: {angle}

Write one tweet. Under 280 characters OR short multi-paragraph (both valid on X).
Lead with the most interesting thing in today's signal — a result, an upset, elimination stakes, bracket news.
Include match-hive.vercel.app naturally when it fits context (not forced).

Return a single JSON object:
{{
  "body": "Complete ready-to-post tweet text",
  "topic": "<result | preview | standings | knockout>",
  "twitter_published": false
}}

Return only the JSON object. No markdown."""

    kwargs = dict(
        model="claude-opus-4-6",
        max_tokens=512,
        temperature=0.7,
        messages=[{"role": "user", "content": prompt}],
    )
    if system_prompt:
        kwargs["system"] = system_prompt

    response = _client().messages.create(**kwargs)
    post = _parse_json(response.content[0].text)

    return {
        **post,
        "scheduled_date": brief["date"],
        "platform": "twitter",
        "status": "Draft",
    }


def generate_facebook_copy(brief: dict) -> dict:
    """
    Generate Facebook post copy.
    Not auto-published — Graph API blocked by New Pages Experience.
    Copy is saved to facebook_copy.json for manual posting via Meta Business Suite.
    """
    angle = _angle(brief)

    prompt = f"""Generate today's Facebook post for the Match-Hive page.

Match-Hive: FIFA World Cup 2026 tracker — live scores, team schedules, bracket, calendar downloads.
URL: match-hive.vercel.app
Audience: general soccer fans — casual to passionate. All ages.
Tone: warm, clear, fan-friendly. Full sentences. More conversational than Instagram.

Today's signal:
{json.dumps(brief, indent=2)}

Content angle: {angle}

Return a single JSON object:
{{
  "body": "Complete ready-to-post text. 2-4 sentences + CTA. End with match-hive.vercel.app",
  "topic": "<result | preview | standings | knockout>"
}}

Return only the JSON object."""

    response = _client().messages.create(
        model="claude-opus-4-6",
        max_tokens=512,
        temperature=0.6,
        messages=[{"role": "user", "content": prompt}],
    )
    post = _parse_json(response.content[0].text)

    return {
        **post,
        "scheduled_date": brief["date"],
        "platform": "facebook",
        "status": "Draft",
        "note": "Manual post — Facebook Graph API blocked by New Pages Experience",
    }


if __name__ == "__main__":
    test_brief = {
        "date": "2026-06-23",
        "day_of_tournament": 13,
        "tournament_phase": "Group Stage",
        "today_matches": [
            {
                "home": "Argentina", "away": "Poland",
                "utc_date": "2026-06-23T21:00:00Z",
                "status": "SCHEDULED",
                "home_score": None, "away_score": None,
                "group": "Group C", "stage": "GROUP_STAGE",
            }
        ],
        "yesterday_results": [
            {
                "home": "Brazil", "away": "Switzerland",
                "home_score": 2, "away_score": 0,
                "group": "Group E", "stage": "GROUP_STAGE",
            }
        ],
        "standings_snapshot": [],
    }
    ig = generate_instagram_post(test_brief)
    print(json.dumps(ig, indent=2))
