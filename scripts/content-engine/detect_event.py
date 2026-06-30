"""
detect_event.py — Lightweight event detector for GitHub Actions detect job.
Prints 'halftime', 'post-match', or '' (nothing) to stdout.
Only requires: requests (no heavy deps, no Playwright).
"""
import sys
from signal_pull import get_halftime_matches, get_recently_finished_matches

ht = get_halftime_matches()
if ht:
    print("halftime")
    sys.exit(0)

ft = get_recently_finished_matches(window_hours=5)
print("post-match" if ft else "")
