@AGENTS.md

# match-hive — Project Context
# Tier 1 — Enterprise Grade | OCTech Services
# Last Updated: 2026-06-16

---

## 1. Project Overview

**Name:** match-hive
**Type:** Consumer web app — sports utility
**Purpose:** FIFA World Cup 2026 schedule tracker. Fans can view the full 72-match group stage schedule, select their team, and download matches directly to their calendar with 15-min and 5-min kickoff reminders.
**Commercial Intent:** Consumer product. Lead capture via Meta Pixel (PageView + Lead events). Revenue path through engagement and audience growth.
**Status:** Live — post-launch, active maintenance
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
| `/bracket` | Static | Live bracket viewer |
| `/submit` | Static | Venue submission form — preserved but hidden from nav (re-enable by adding nav links) |
| `/api/ics` | Dynamic | Returns `.ics` calendar file for a given team. CORS open — called by external Lovable frontend |
| `/api/bracket` | Dynamic | Bracket data |
| `/api/teams` | Dynamic | Team list |
| `/api/submit` | Dynamic | Form submission handler |
| `/profile-pic` | Dynamic | 500×500 logo image for social media |
| `/opengraph-image` | Dynamic | OG image |

**Key data file:** `data/wc2026.ts` — all 48 teams and 72 group stage matches. Source: NBC Sports / FIFA official schedule. All times stored in UTC.

**Key components:**
- `components/TeamPicker.tsx` — client component, team selector + per-team schedule card + ICS download CTA
- `components/NavLogo.tsx` — nav logo
- `lib/standings.ts` — pure `computeGroupStandings()` utility + `StandingRow` type (local fallback, not used in production flow)

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

## 7. Commands

```bash
npm run dev      # local dev server
npm run build    # production build (run before deploying manually)
npm run lint     # ESLint
```

Deploy: `git push origin main` — Vercel auto-deploys.
