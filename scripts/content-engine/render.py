"""
render.py — Generate 1080x1080 PNG images from post data using Playwright
Match-Hive branded templates: dark green + #4ade80 accent
"""

import asyncio
import re
from pathlib import Path
from playwright.async_api import async_playwright

TEMPLATE_HTML = Path(__file__).parent / "templates" / "template.html"
OUTPUT_DIR = Path(__file__).parent / "output"

TEMPLATE_MAP = {
    "Match Preview":    "preview",
    "Result Recap":     "result",
    "Standings Update": "standings",
    "Bracket Update":   "bracket",
}


def _extract_score(hook: str) -> tuple[str, str, str]:
    """
    For result cards, attempt to extract a score from the hook.
    e.g. "Brazil 2 – 0 Switzerland" → ("Brazil", "2 – 0", "Switzerland")
    Falls back to (hook, "", "") if no score pattern found.
    """
    match = re.search(r"(.+?)\s+(\d+\s*[–\-]\s*\d+)\s+(.+)", hook.strip())
    if match:
        return match.group(1).strip(), match.group(2).strip(), match.group(3).strip()
    return hook, "", ""


async def _render_post(page, post: dict, index: int) -> Path:
    OUTPUT_DIR.mkdir(exist_ok=True)

    template_key = TEMPLATE_MAP.get(post.get("template", "Match Preview"), "preview")
    hook = post.get("hook", "")
    body = post.get("body", "")
    output_path = OUTPUT_DIR / f"post_{index:02d}_{template_key}.png"

    await page.goto(f"file://{TEMPLATE_HTML.absolute()}", wait_until="networkidle")

    # Show correct template, hide others
    for key in TEMPLATE_MAP.values():
        locator = page.locator(f"#tpl-{key}")
        if key == template_key:
            await locator.evaluate("el => el.classList.remove('hidden')")
        else:
            await locator.evaluate("el => el.classList.add('hidden')")

    # Inject content
    if template_key == "preview":
        await page.locator("#preview-hook").evaluate(f"el => el.textContent = {repr(hook)}")
        await page.locator("#preview-body").evaluate(f"el => el.textContent = {repr(body)}")

    elif template_key == "result":
        home, score, away = _extract_score(hook)
        if score:
            await page.locator("#result-home").evaluate(f"el => el.textContent = {repr(home)}")
            await page.locator("#result-score").evaluate(f"el => el.textContent = {repr(score)}")
            await page.locator("#result-away").evaluate(f"el => el.textContent = {repr(away)}")
            await page.locator("#result-body").evaluate(f"el => el.textContent = {repr(body)}")
        else:
            await page.locator("#result-home").evaluate("el => el.textContent = ''")
            await page.locator("#result-score").evaluate(f"el => el.textContent = {repr(hook)}")
            await page.locator("#result-away").evaluate("el => el.textContent = ''")
            await page.locator("#result-body").evaluate(f"el => el.textContent = {repr(body)}")

    elif template_key in ("standings", "bracket"):
        await page.locator(f"#{template_key}-hook").evaluate(f"el => el.textContent = {repr(hook)}")
        await page.locator(f"#{template_key}-body").evaluate(f"el => el.textContent = {repr(body)}")

    await page.locator(f"#tpl-{template_key}").screenshot(path=str(output_path))
    return output_path


async def _render_all(posts: list[dict]) -> list[Path]:
    paths = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1080, "height": 1080})
        for i, post in enumerate(posts):
            tpl = post.get("template", "Match Preview")
            print(f"  Rendering [{tpl}]...")
            path = await _render_post(page, post, i + 1)
            paths.append(path)
            print(f"    → {path.name}")
        await browser.close()
    return paths


def render_all(posts: list[dict]) -> list[Path]:
    """Render posts as PNGs. Returns list of output file paths."""
    return asyncio.run(_render_all(posts))


if __name__ == "__main__":
    test_posts = [
        {
            "hook": "Argentina tonight. Poland on the line.",
            "body": "Group C: Argentina need a win to secure top spot. Poland need a miracle.",
            "template": "Match Preview",
        },
        {
            "hook": "Brazil 2 – 0 Switzerland",
            "body": "Brazil top Group E. Switzerland still alive — need results to go their way.",
            "template": "Result Recap",
        },
    ]
    paths = render_all(test_posts)
    print(f"\nDone. {len(paths)} images in {OUTPUT_DIR}/")
