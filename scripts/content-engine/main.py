"""
main.py — Match-Hive content engine daily entrypoint

Runs daily. Pulls live WC data → generates content → renders image →
uploads to imgbb → publishes to Instagram + Twitter → saves schedule files.

Usage:
  cd scripts/content-engine
  python main.py

  python main.py --date=2026-07-01   # generate + publish for a specific date
  python main.py --generate-only     # generate + render without publishing
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv
from signal_pull import build_signal_brief
from content import generate_instagram_post, generate_twitter_post, generate_facebook_copy
from render import render_all

load_dotenv()

OUTPUT_DIR = Path(__file__).parent / "output"
SCHEDULE_PATH = OUTPUT_DIR / "schedule.json"
TWITTER_SCHEDULE_PATH = OUTPUT_DIR / "twitter_schedule.json"
FACEBOOK_COPY_PATH = OUTPUT_DIR / "facebook_copy.json"
POSTED_EVENTS_PATH = OUTPUT_DIR / "posted_events.json"


def _is_posted(post_key: str) -> bool:
    if not POSTED_EVENTS_PATH.exists():
        return False
    return post_key in json.loads(POSTED_EVENTS_PATH.read_text())


def _mark_posted(post_key: str) -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    events: list = []
    if POSTED_EVENTS_PATH.exists():
        events = json.loads(POSTED_EVENTS_PATH.read_text())
    if post_key not in events:
        events.append(post_key)
        POSTED_EVENTS_PATH.write_text(json.dumps(events, indent=2))


def run(publish: bool = True, twitter_only: bool = False) -> None:
    print("=== Match-Hive Content Engine ===\n")
    if twitter_only:
        print("  Mode: Twitter-only\n")

    print("[1/5] Pulling WC signal brief...")
    brief = build_signal_brief()
    print(f"  Date:          {brief['date']}")
    print(f"  Phase:         {brief['tournament_phase']}")
    print(f"  Today matches: {len(brief['today_matches'])}")
    print(f"  Yesterday FT:  {len(brief['yesterday_results'])}")

    print("\n[2/5] Generating content...")

    if not twitter_only:
        ig_post = generate_instagram_post(brief)
        print(f"  IG  [{ig_post.get('template')}]: {ig_post.get('hook', '')[:60]}...")

    twitter_post = generate_twitter_post(brief)
    print(f"  TW  [{twitter_post.get('topic')}]: {twitter_post.get('body', '')[:60]}...")

    if not twitter_only:
        fb_copy = generate_facebook_copy(brief)
        print(f"  FB  [{fb_copy.get('topic')}]: {fb_copy.get('body', '')[:60]}...")

    OUTPUT_DIR.mkdir(exist_ok=True)

    if not twitter_only:
        print("\n[3/5] Rendering image...")
        image_paths = render_all([ig_post])
        ig_post["image_path"] = f"output/{image_paths[0].name}"
        print(f"  → {image_paths[0].name}")

        # Pre-upload to imgbb so schedule.json is self-contained for GitHub Actions
        imgbb_key = os.environ.get("IMGBB_API_KEY")
        if imgbb_key:
            print("\n[3.5/5] Uploading image to imgbb...")
            from instagram_publisher import _upload_image
            url = _upload_image(image_paths[0], imgbb_key)
            ig_post["image_url"] = url
            print(f"  → {url}")
        else:
            print("\n[3.5/5] IMGBB_API_KEY not set — skipping pre-upload")
    else:
        print("\n[3/5] Skipped (Twitter-only mode)")

    # Save schedule files (always, before any publish attempt)
    if not twitter_only:
        existing_schedule = []
        if SCHEDULE_PATH.exists():
            try:
                existing_schedule = json.loads(SCHEDULE_PATH.read_text())
            except Exception:
                existing_schedule = []
        existing_schedule = [p for p in existing_schedule if p.get("scheduled_date") != ig_post["scheduled_date"]]
        existing_schedule.append(ig_post)
        SCHEDULE_PATH.write_text(json.dumps(existing_schedule, indent=2, ensure_ascii=False))

    existing_twitter = []
    if TWITTER_SCHEDULE_PATH.exists():
        try:
            existing_twitter = json.loads(TWITTER_SCHEDULE_PATH.read_text())
        except Exception:
            existing_twitter = []
    existing_twitter = [p for p in existing_twitter if p.get("scheduled_date") != twitter_post["scheduled_date"]]
    existing_twitter.append(twitter_post)
    TWITTER_SCHEDULE_PATH.write_text(json.dumps(existing_twitter, indent=2, ensure_ascii=False))

    if not twitter_only:
        existing_fb = []
        if FACEBOOK_COPY_PATH.exists():
            try:
                existing_fb = json.loads(FACEBOOK_COPY_PATH.read_text())
            except Exception:
                existing_fb = []
        existing_fb = [p for p in existing_fb if p.get("scheduled_date") != fb_copy["scheduled_date"]]
        existing_fb.append(fb_copy)
        FACEBOOK_COPY_PATH.write_text(json.dumps(existing_fb, indent=2, ensure_ascii=False))

    print(f"\n[4/5] Schedules saved")
    if not twitter_only:
        print(f"  IG:       output/schedule.json")
    print(f"  Twitter:  output/twitter_schedule.json")
    if not twitter_only:
        print(f"  Facebook: output/facebook_copy.json (manual post via Meta Business Suite)")

    if not publish:
        print("\n[5/5] --generate-only flag set — skipping publish")
        print("\n=== Done (generate only) ===")
        return

    print("\n[5/5] Publishing...")
    from publish_today import publish_instagram, publish_twitter, print_facebook_copy
    target = brief["date"]
    if not twitter_only:
        publish_instagram(target)
    publish_twitter(target)
    if not twitter_only:
        print_facebook_copy(target)

    print("\n=== Done ===")


def run_halftime(publish: bool = True) -> None:
    print("=== Match-Hive Content Engine — Half-Time ===\n")
    from signal_pull import get_halftime_matches, build_halftime_brief

    print("[1/4] Checking for half-time matches...")
    matches = get_halftime_matches()
    if not matches:
        print("  No match at half-time right now — exiting.")
        return

    for m in matches:
        print(f"  HT: {m['home']} {m['home_score']} – {m['away_score']} {m['away']}")

    brief = build_halftime_brief(matches)
    post_key = brief["post_key"]

    if _is_posted(post_key):
        print(f"  Already posted ({post_key}) — exiting.")
        return

    print("\n[2/4] Generating content...")
    from content import generate_halftime_posts
    ig_post, tw_post = generate_halftime_posts(brief)
    print(f"  IG: {ig_post.get('hook', '')[:70]}")
    print(f"  TW: {tw_post.get('body', '')[:70]}")

    if not publish:
        print("\n[3/4] --generate-only — skipping publish")
        print(json.dumps({"ig": ig_post, "tw": tw_post}, indent=2, ensure_ascii=False))
        return

    print("\n[3/4] Rendering IG image...")
    from render import render_all
    image_paths = render_all([ig_post])
    ig_post["image_path"] = f"output/{image_paths[0].name}"

    imgbb_key = os.environ.get("IMGBB_API_KEY")
    if imgbb_key:
        from instagram_publisher import _upload_image
        ig_post["image_url"] = _upload_image(image_paths[0], imgbb_key)

    print("\n[4/4] Publishing...")
    try:
        from instagram_publisher import publish_post
        publish_post(ig_post, Path(__file__).parent / ig_post["image_path"])
        print("  [IG] Done")
    except Exception as e:
        print(f"  [IG] Failed: {e}")

    try:
        from twitter_publisher import post_tweet, build_tweet_text
        post_tweet(build_tweet_text(tw_post))
        print("  [TW] Done")
    except Exception as e:
        print(f"  [TW] Failed: {e}")

    _mark_posted(post_key)
    print(f"\n=== Done (Half-Time · {post_key}) ===")


def run_post_match(publish: bool = True) -> None:
    print("=== Match-Hive Content Engine — Post-Match ===\n")
    from signal_pull import get_recently_finished_matches, build_post_match_brief

    print("[1/4] Checking for recently finished matches...")
    matches = get_recently_finished_matches(window_hours=3)
    if not matches:
        print("  No matches finished in the last 3 hours — exiting.")
        return

    for m in matches:
        print(f"  FT: {m['home']} {m['home_score']} – {m['away_score']} {m['away']}")

    brief = build_post_match_brief(matches)
    post_key = brief["post_key"]

    if _is_posted(post_key):
        print(f"  Already posted ({post_key}) — exiting.")
        return

    print("\n[2/4] Generating content...")
    from content import generate_post_match_posts
    ig_post, tw_post = generate_post_match_posts(brief)
    print(f"  IG: {ig_post.get('hook', '')[:70]}")
    print(f"  TW: {tw_post.get('body', '')[:70]}")

    if not publish:
        print("\n[3/4] --generate-only — skipping publish")
        print(json.dumps({"ig": ig_post, "tw": tw_post}, indent=2, ensure_ascii=False))
        return

    print("\n[3/4] Rendering IG image...")
    from render import render_all
    image_paths = render_all([ig_post])
    ig_post["image_path"] = f"output/{image_paths[0].name}"

    imgbb_key = os.environ.get("IMGBB_API_KEY")
    if imgbb_key:
        from instagram_publisher import _upload_image
        ig_post["image_url"] = _upload_image(image_paths[0], imgbb_key)

    print("\n[4/4] Publishing...")
    try:
        from instagram_publisher import publish_post
        publish_post(ig_post, Path(__file__).parent / ig_post["image_path"])
        print("  [IG] Done")
    except Exception as e:
        print(f"  [IG] Failed: {e}")

    try:
        from twitter_publisher import post_tweet, build_tweet_text
        post_tweet(build_tweet_text(tw_post))
        print("  [TW] Done")
    except Exception as e:
        print(f"  [TW] Failed: {e}")

    _mark_posted(post_key)
    print(f"\n=== Done (Post-Match · {post_key}) ===")


if __name__ == "__main__":
    generate_only = "--generate-only" in sys.argv
    twitter_only  = "--twitter-only"  in sys.argv
    mode = next((a.split("=")[1] for a in sys.argv if a.startswith("--mode=")), "daily")

    if mode == "halftime":
        run_halftime(publish=not generate_only)
    elif mode == "post-match":
        run_post_match(publish=not generate_only)
    else:
        run(publish=not generate_only, twitter_only=twitter_only)
