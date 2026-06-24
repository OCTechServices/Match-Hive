"""
publish_today.py — Publish today's content (Instagram + Twitter)

Reads schedule files written by main.py and publishes today's posts.
Runs daily via GitHub Actions at 3 PM UTC (8 AM PDT).

Idempotent: if Instagram post was already published (ig_published: true),
it is skipped — safe to re-run without double-posting.

Facebook: copy is in facebook_copy.json — post manually via Meta Business Suite.

Usage:
  python3 publish_today.py              # publishes today's post
  python3 publish_today.py 2026-07-01   # backfill a specific date
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

SCHEDULE_PATH = Path(__file__).parent / "output" / "schedule.json"
TWITTER_SCHEDULE_PATH = Path(__file__).parent / "output" / "twitter_schedule.json"
FACEBOOK_COPY_PATH = Path(__file__).parent / "output" / "facebook_copy.json"


def publish_instagram(target_date: str) -> None:
    if not SCHEDULE_PATH.exists():
        print("[IG] No schedule.json — run main.py first")
        return

    schedule = json.loads(SCHEDULE_PATH.read_text())
    post = next((p for p in schedule if p.get("scheduled_date") == target_date), None)

    if not post:
        print(f"[IG] No post scheduled for {target_date}")
        return

    if post.get("ig_published"):
        print(f"[IG] Already published — skipping (ig_published: true)")
        return

    from instagram_publisher import publish_post
    image_path = Path(__file__).parent / post["image_path"]

    try:
        media_id = publish_post(post, image_path)
        post["ig_published"] = True
        SCHEDULE_PATH.write_text(json.dumps(schedule, indent=2, ensure_ascii=False))
        print(f"[IG] Done — media_id: {media_id}")
    except Exception as e:
        print(f"[IG] Failed: {e}")


def publish_twitter(target_date: str) -> None:
    if not TWITTER_SCHEDULE_PATH.exists():
        print("[Twitter] No twitter_schedule.json — skipping")
        return

    schedule = json.loads(TWITTER_SCHEDULE_PATH.read_text())
    post = next((p for p in schedule if p.get("scheduled_date") == target_date), None)

    if not post:
        print(f"[Twitter] No post scheduled for {target_date} — skipping")
        return

    if post.get("twitter_published"):
        print("[Twitter] Already published — skipping")
        return

    try:
        from twitter_publisher import post_tweet, build_tweet_text
        text = build_tweet_text(post)
        tweet_id = post_tweet(text)
        post["twitter_published"] = True
        TWITTER_SCHEDULE_PATH.write_text(json.dumps(schedule, indent=2, ensure_ascii=False))
        print(f"[Twitter] Done — tweet_id: {tweet_id}")
    except Exception as e:
        print(f"[Twitter] Failed: {e}")
        if hasattr(e, "response") and e.response is not None:
            print(f"[Twitter] Error body: {e.response.text[:500]}")


def print_facebook_copy(target_date: str) -> None:
    """Facebook is manual — print the copy for posting via Meta Business Suite."""
    if not FACEBOOK_COPY_PATH.exists():
        return

    data = json.loads(FACEBOOK_COPY_PATH.read_text())
    posts = data if isinstance(data, list) else [data]
    post = next((p for p in posts if p.get("scheduled_date") == target_date), None)

    if post:
        print(f"\n[Facebook] Copy ready for manual post (Meta Business Suite):")
        print(f"  {post.get('body', '')[:200]}...")


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else datetime.now(timezone.utc).strftime("%Y-%m-%d")
    print(f"=== Publishing for {target} ===\n")
    publish_instagram(target)
    publish_twitter(target)
    print_facebook_copy(target)
    print("\nDone.")
