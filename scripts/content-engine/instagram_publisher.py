"""
instagram_publisher.py — Publish Instagram posts via Graph API

Flow per post:
  1. Upload rendered PNG to imgbb → get public URL
  2. Create Instagram media container with image URL + caption
  3. Wait for container to finish processing, then publish immediately

Required env vars:
  IG_ACCESS_TOKEN   — from Meta for Developers → Use cases → Instagram API
  IG_USER_ID        — numeric Instagram User ID
  IMGBB_API_KEY     — from imgbb.com account
"""

import os
import time
import base64
import requests
from pathlib import Path
from datetime import datetime, timezone

GRAPH_API_BASE = "https://graph.instagram.com/v21.0"
IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload"


def _get_credentials() -> tuple[str, str, str]:
    token = os.environ.get("IG_ACCESS_TOKEN")
    user_id = os.environ.get("IG_USER_ID")
    imgbb_key = os.environ.get("IMGBB_API_KEY")
    if not token:
        raise ValueError("IG_ACCESS_TOKEN not set")
    if not user_id:
        raise ValueError("IG_USER_ID not set")
    if not imgbb_key:
        raise ValueError("IMGBB_API_KEY not set")
    return token, user_id, imgbb_key


def _upload_image(image_path: Path, imgbb_key: str) -> str:
    """Upload image to imgbb. Returns public URL."""
    with open(image_path, "rb") as f:
        image_b64 = base64.b64encode(f.read()).decode("utf-8")
    resp = requests.post(IMGBB_UPLOAD_URL, data={"key": imgbb_key, "image": image_b64})
    resp.raise_for_status()
    result = resp.json()
    if not result.get("success"):
        raise ValueError(f"imgbb upload failed: {result}")
    return result["data"]["url"]


def _build_caption(post: dict) -> str:
    """Assemble Instagram caption from post fields."""
    parts = []
    hook = post.get("hook", "").strip()
    body = post.get("body", "").strip()
    cta = post.get("cta", "match-hive.vercel.app").strip()
    hashtags = post.get("hashtags", "").strip()
    if hook:
        parts.append(hook)
    if body:
        parts.append(body)
    parts.append(cta)
    if hashtags:
        parts.append(hashtags)
    return "\n\n".join(parts)


def _create_container(user_id: str, image_url: str, caption: str, access_token: str) -> str:
    """Create Instagram media container. Returns container ID."""
    resp = requests.post(
        f"{GRAPH_API_BASE}/{user_id}/media",
        params={"image_url": image_url, "caption": caption, "access_token": access_token},
    )
    resp.raise_for_status()
    result = resp.json()
    if "id" not in result:
        raise ValueError(f"Container creation failed: {result}")
    return result["id"]


def _wait_for_container(container_id: str, access_token: str, max_wait: int = 30) -> None:
    """Poll container status until FINISHED or raise on ERROR/timeout."""
    for _ in range(max_wait):
        resp = requests.get(
            f"{GRAPH_API_BASE}/{container_id}",
            params={"fields": "status_code", "access_token": access_token},
        )
        resp.raise_for_status()
        status = resp.json().get("status_code")
        if status == "FINISHED":
            return
        if status == "ERROR":
            raise ValueError(f"Container processing failed: {container_id}")
        time.sleep(1)
    raise TimeoutError(f"Container {container_id} did not finish within {max_wait}s")


def _publish_container(user_id: str, container_id: str, access_token: str) -> str:
    """Publish a finished container. Returns media ID."""
    resp = requests.post(
        f"{GRAPH_API_BASE}/{user_id}/media_publish",
        params={"creation_id": container_id, "access_token": access_token},
    )
    resp.raise_for_status()
    result = resp.json()
    if "id" not in result:
        raise ValueError(f"Publish failed: {result}")
    return result["id"]


def publish_post(post: dict, image_path: Path) -> str:
    """
    Publish one Instagram post immediately.
    Returns media ID on success. Raises on failure.
    """
    token, user_id, imgbb_key = _get_credentials()

    image_url = post.get("image_url")
    if image_url:
        print(f"  Using pre-uploaded image: {image_url}")
    else:
        image_url = _upload_image(image_path, imgbb_key)
        print(f"  Image uploaded: {image_url}")

    caption = _build_caption(post)
    container_id = _create_container(user_id, image_url, caption, token)
    print(f"  Container created: {container_id}")

    _wait_for_container(container_id, token)
    media_id = _publish_container(user_id, container_id, token)
    print(f"  Published: {media_id}")
    return media_id
