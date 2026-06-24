"""
twitter_publisher.py — Publish tweets via Twitter API v2

Authentication: OAuth 1.0a (User context — required for posting)

Required env vars:
  TWITTER_API_KEY
  TWITTER_API_SECRET
  TWITTER_ACCESS_TOKEN
  TWITTER_ACCESS_SECRET
"""

import os
import tweepy


def _get_client() -> tweepy.Client:
    api_key = os.environ.get("TWITTER_API_KEY")
    api_secret = os.environ.get("TWITTER_API_SECRET")
    access_token = os.environ.get("TWITTER_ACCESS_TOKEN")
    access_secret = os.environ.get("TWITTER_ACCESS_SECRET")

    missing = [k for k, v in {
        "TWITTER_API_KEY": api_key,
        "TWITTER_API_SECRET": api_secret,
        "TWITTER_ACCESS_TOKEN": access_token,
        "TWITTER_ACCESS_SECRET": access_secret,
    }.items() if not v]

    if missing:
        raise ValueError(f"Missing Twitter credentials: {', '.join(missing)}")

    return tweepy.Client(
        consumer_key=api_key,
        consumer_secret=api_secret,
        access_token=access_token,
        access_token_secret=access_secret,
    )


def post_tweet(text: str) -> str:
    """Post a tweet. Returns the tweet ID."""
    client = _get_client()
    response = client.create_tweet(text=text)
    return str(response.data["id"])


def build_tweet_text(post: dict) -> str:
    return post.get("body", "").strip()
