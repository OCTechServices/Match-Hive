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


def run(publish: bool = True) -> None:
    print("=== Match-Hive Content Engine ===\n")

    print("[1/5] Pulling WC signal brief...")
    brief = build_signal_brief()
    print(f"  Date:          {brief['date']}")
    print(f"  Phase:         {brief['tournament_phase']}")
    print(f"  Today matches: {len(brief['today_matches'])}")
    print(f"  Yesterday FT:  {len(brief['yesterday_results'])}")

    print("\n[2/5] Generating content...")
    ig_post = generate_instagram_post(brief)
    print(f"  IG  [{ig_post.get('template')}]: {ig_post.get('hook', '')[:60]}...")

    twitter_post = generate_twitter_post(brief)
    print(f"  TW  [{twitter_post.get('topic')}]: {twitter_post.get('body', '')[:60]}...")

    fb_copy = generate_facebook_copy(brief)
    print(f"  FB  [{fb_copy.get('topic')}]: {fb_copy.get('body', '')[:60]}...")

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

    # Save schedule files (always, before any publish attempt)
    OUTPUT_DIR.mkdir(exist_ok=True)

    existing_schedule = []
    if SCHEDULE_PATH.exists():
        try:
            existing_schedule = json.loads(SCHEDULE_PATH.read_text())
        except Exception:
            existing_schedule = []
    # Replace today's entry if it exists, otherwise append
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
    print(f"  IG:       output/schedule.json")
    print(f"  Twitter:  output/twitter_schedule.json")
    print(f"  Facebook: output/facebook_copy.json (manual post via Meta Business Suite)")

    if not publish:
        print("\n[5/5] --generate-only flag set — skipping publish")
        print("\n=== Done (generate only) ===")
        return

    print("\n[5/5] Publishing...")
    from publish_today import publish_instagram, publish_twitter, print_facebook_copy
    target = brief["date"]
    publish_instagram(target)
    publish_twitter(target)
    print_facebook_copy(target)

    print("\n=== Done ===")


if __name__ == "__main__":
    generate_only = "--generate-only" in sys.argv
    run(publish=not generate_only)
