@AGENTS.md

# match-hive — Project Context
# Tier 1 — Enterprise Grade | OCTech Services
# Last Updated: 2026-08-11 (decommissioned — archive mode)

---

## 1. Project Overview

**Name:** match-hive
**Type:** Consumer web app — sports utility
**Purpose:** FIFA World Cup 2026 schedule tracker. Fans can view the full 72-match group stage schedule, select their team, and download matches directly to their calendar with 15-min and 5-min kickoff reminders.
**Commercial Intent:** Consumer product. Lead capture via Meta Pixel (PageView + Lead events). Revenue path through engagement and audience growth.
**Status:** Archived — WC2026 concluded July 19, 2026. App remains deployed as a read-only historical record. Supabase deleted. All external API credentials revoked. See `docs/DECOMMISSION.md`.
**Production URL:** https://match-hive.vercel.app
**Repository:** https://github.com/OCTechServices/Match-Hive.git

---

## 2. Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.9 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 | ^4 |
| Auth | Clerk | ^7.5.1 |
| Database | Supabase JS | ^2.108.1 |
| Calendar | ics | ^3.12.0 |
| Hosting | Vercel | auto-deploy on push to main |

> IMPORTANT: Next.js 16 has breaking changes vs prior versions. Read `node_modules/next/dist/docs/` before writing any Next.js code.

---

## 3. Key Components

| Route | Type | Description |
|---|---|---|
| `/` | Static | Landing page — hero + 3 CTAs (Schedule, Bracket, Standings) |
| `/schedule` | Dynamic (5m revalidate) | Full group stage schedule with live scores (FT/LIVE/HT) + TeamPicker |
| `/standings` | Dynamic (5m revalidate) | Live group standings — 12 groups, auto-updates via football-data.org |
| `/bracket` | Dynamic (revalidate=0, data 5m cached) | Live knockout bracket — reads from Supabase `bracket_matches` + live projections |
| `/submit` | Static | Venue submission form — preserved but hidden from nav (re-enable by adding nav links) |
| `/api/ics` | Dynamic | Returns `.ics` calendar file for a given team. CORS open — called by external Lovable frontend |
| `/api/bracket` | Dynamic | Bracket data |
| `/api/teams` | Dynamic | Team list |
| `/api/submit` | Dynamic | Form submission handler |
| `/profile-pic` | Dynamic | 500×500 logo image for social media |
| `/opengraph-image` | Dynamic | OG image |

**Key data file:** `data/wc2026.ts` — all 48 teams and 72 group stage matches. Source: NBC Sports / FIFA official schedule. All times stored in UTC.
**Bracket data:** `data/bracket-static.json` — all 32 knockout results (M73–M104), frozen at decommission. Scores corrected for 4 penalty-shootout matches (M74, M75, M88, M96 — was cumulative score, corrected to actual match score). **Source of truth for bracket — Supabase no longer exists.**

**Key components:**
- `components/TeamPicker.tsx` — client component, team selector + per-team schedule card + ICS download CTA
- `components/BracketView.tsx` — client component, knockout bracket UI (mobile tabs + desktop tree)
- `components/NavLogo.tsx` — nav logo
- `data/bracket.ts` — `BRACKET_SEED` (M73–M104 structure) + `BracketMatch` interface
- `lib/bracket-seeding.ts` — `R32_SEEDING` keyed by match ID (M73–M88); maps slots to group positions
- `lib/standings.ts` — pure `computeGroupStandings()` utility + `StandingRow` type
- `scripts/seed-bracket-matches.mjs` — rebuilds `bracket_matches` table. Run: `node --env-file=.env.local scripts/seed-bracket-matches.mjs`

---

## 4. External Integrations

| Integration | Purpose | Notes |
|---|---|---|
| Clerk (`@clerk/nextjs`) | Authentication | v7 — breaking changes vs v5/v6 |
| Supabase | Database | JS client v2 |
| Meta Pixel `1538010084523329` | Analytics / lead tracking | PageView + Lead events on landing page |
| Vercel | Hosting + CI/CD | Push to `main` = auto-deploy |
| Lovable (external) | External frontend consumer | Calls `/api/ics` — CORS open to all origins |
| football-data.org (free tier) | Live scores + standings | `FOOTBALL_DATA_API_KEY` env var. Feeds `/schedule` (scores) and `/standings`. 5-min cache. Rate limit: 10 req/min (well within usage). |

---

## 5. Timezone Convention

All match times are stored in UTC in `data/wc2026.ts`. Display timezone is **ET (America/New_York)** throughout the app — date grouping, date labels, and time display all use ET. This matches the official NBC Sports broadcast schedule annotation.

The ICS API returns UTC and lets the user's calendar app handle local conversion — this is correct behavior.

---

## 6. Working Rules

- Read `node_modules/next/dist/docs/` before writing any Next.js code
- Schedule data lives entirely in `data/wc2026.ts` — no database reads for schedule display
- All match data changes must be verified against the NBC Sports / FIFA official schedule
- `/api/ics` CORS is intentionally open — do not restrict without coordinating with the Lovable frontend
- Never hardcode secrets — all credentials via environment variables (see `.env.local`)

---

## 7. Content Engine (`scripts/content-engine/`)

Daily Python pipeline: `signal_pull.py` → `content.py` (Claude) → `render.py` (Playwright) → imgbb → Instagram Graph API + Twitter.

**Modes:**
- `python main.py` — daily recap (IG + Twitter + FB copy)
- `python main.py --twitter-only` — Twitter only
- `python main.py --mode=halftime` — half-time post for currently PAUSED match
- `python main.py --mode=post-match` — FT post for matches finished within last 3 hours
- `python main.py --generate-only` — generate + render, skip publish (works with all modes)

**Cron workflows:**
- `content-engine-daily.yml` — 11/15/19/23 UTC (Twitter-only) + 05 UTC (full run) — **PAUSED** (WC2026 concluded July 19; `workflow_dispatch` still active)
- `content-engine-events.yml` — polls every 30 min during 16–23 UTC and 00–06 UTC. Lightweight detect job (`pip install requests` only) auto-detects PAUSED/FINISHED matches; publish job only runs on event. Deduplication via `output/posted_events.json`. — **PAUSED** (WC2026 concluded July 19; `workflow_dispatch` still active)

**Key files:** `detect_event.py` (lightweight event checker for CI), `output/posted_events.json` (dedup log — committed to repo), `bracket_update.py` (syncs knockout results from football-data.org → Supabase `bracket_matches`; idempotent, safe to run anytime), `farewell.py` (one-shot farewell carousel — already published 2026-07-24, do not re-run).

**Carousel support:** `instagram_publisher.py` now includes `publish_carousel(posts, image_paths, caption)` — publishes a multi-slide Instagram carousel via the Graph API. Templates `tpl-farewell` and `tpl-stack` added to `templates/template.html`; mapped in `render.py`.

**Bracket update:** Run manually after each knockout match to sync scores and advance winners:
```bash
cd scripts/content-engine
source venv/bin/activate && env $(grep -v '^#' ../../.env.local | xargs) python bracket_update.py
# Add --dry-run to preview changes without writing
```
**Known structural rule:** QF→SF bracket pairs QF1 vs QF3 → SF1, QF2 vs QF4 → SF2 (not adjacent pairs). `_advance()` skips completed destination matches — API home/away is authoritative once a match is finished.

**Score lookup (schedule page):** Always use team-name key first, datetime fallback. Datetime keys collide on simultaneous kickoffs. `FD_NAME_MAP` in `app/schedule/page.tsx` must include accent variants (e.g. `Curaçao`).

---

## 8. Commands

```bash
npm run dev      # local dev server
npm run build    # production build (run before deploying manually)
npm run lint     # ESLint
```

Deploy: `git push origin main` — Vercel auto-deploys.
