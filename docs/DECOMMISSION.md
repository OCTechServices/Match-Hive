# Decommission Record — match-hive
# OCTech Services | Tier 1
# Mode: Archive
# Executed: 2026-08-11
# Authorized by: Dan (OCTech)

---

## Decision

**Mode:** Archive — app remains deployed as a permanent historical record of FIFA World Cup 2026.
**Rationale:** Tournament concluded July 19, 2026. Monthly Supabase cost eliminated by migrating to static data. All external API credentials revoked.

---

## Pre-Decommission Data Validation

Performed before any data freeze. All 32 knockout match results verified against FIFA.com, ESPN, and corroborating sources.

### Errors Found and Corrected

Four matches were stored in Supabase with cumulative scores (regular_time + penalty_goals), not the actual match score. Corrected in the static JSON freeze:

| Match | Was (Supabase) | Corrected To | Actual Result |
|---|---|---|---|
| M74 Germany vs Paraguay | 4–5 | 1–1 | Paraguay wins 4–3 on pens |
| M75 Netherlands vs Morocco | 3–4 | 1–1 | Morocco wins 3–2 on pens |
| M88 Australia vs Egypt | 3–5 | 1–1 | Egypt wins 4–2 on pens |
| M96 Switzerland vs Colombia | 4–3 | 0–0 | Switzerland wins 4–3 on pens |

Winners were correct in all four cases. Only the displayed scores were wrong.

### Final Results — Verified

**Final:** Spain 1–0 Argentina (a.e.t., Ferran Torres 106') — Spain wins WC2026
**3rd Place:** France 4–6 England (Saka hat-trick)
**Semi-finals:** France 0–2 Spain | England 1–2 Argentina
**Quarter-finals:** France 2–0 Morocco | Norway 1–2 England | Spain 2–1 Belgium | Argentina 3–1 Switzerland
**Round of 16:** Canada 0–3 Morocco | Paraguay 0–1 France | Brazil 1–2 Norway | Mexico 2–3 England | Portugal 0–1 Spain | USA 1–4 Belgium | Argentina 3–2 Egypt | Switzerland 0–0 Colombia (SUI 4–3 pens)

---

## Code Changes (Applied 2026-08-11)

### Supabase Elimination
- **Created** `data/bracket-static.json` — all 32 knockout matches, corrected and frozen
- **Rewrote** `app/api/bracket/route.ts` — serves static JSON; removed Supabase + football-data.org calls
- **Rewrote** `app/bracket/page.tsx` — imports static JSON directly; removed Supabase + football-data.org calls
- **Rewrote** `app/api/bracket-ics/route.ts` — looks up matches from static JSON; removed Supabase
- **Rewrote** `app/api/submit/route.ts` — returns HTTP 410 Gone (database shut down)

### Live Data Cutoff
- **Edited** `app/standings/page.tsx` — `fetchStandings` returns `[]` instead of throwing on missing API key; page shows "Tournament concluded" message
- **Schedule page** (`app/schedule/page.tsx`) — already fails silently on missing API key; no code change needed

### Net result
- Zero outbound API calls from the deployed app
- Zero Supabase dependencies remaining in application code
- `lib/supabase.ts` is now dead code (no imports) — safe to ignore or delete

---

## Manual Steps (Dan — External Services)

Complete these after the code changes are deployed.

### Phase 1 — Credential Revocation
- [ ] **football-data.org** — revoke API key in dashboard
- [ ] **Instagram Graph API** — revoke `MATCH_HIVE_IG_ACCESS_TOKEN`
- [ ] **imgbb** — revoke API key
- [ ] **Clerk** — disable the application (Settings → Danger Zone) if zero active users

### Phase 2 — Supabase Shutdown
- [ ] Confirm `bracket-static.json` is deployed and serving correctly via `/api/bracket`
- [ ] Delete Supabase project → billing stops immediately
- [ ] Remove Supabase env vars from Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- [ ] Remove football-data.org env var from Vercel (`FOOTBALL_DATA_API_KEY`)

### Phase 3 — Cleanup
- [ ] Remove revoked credentials from `.env.local`
- [ ] **GitHub** — archive repository (Settings → Archive this repository → makes it read-only)

---

## Post-Decommission State

| Layer | Status | Notes |
|---|---|---|
| Vercel deployment | Live | Static archive — no charge for free tier usage |
| GitHub repo | Archived (read-only) | Code preserved for reference |
| Supabase | Deleted | Data preserved in `data/bracket-static.json` |
| Clerk | Disabled | No active users |
| football-data.org | Key revoked | Schedule page shows fixtures, no scores |
| Instagram Graph API | Token revoked | Content engine already paused since July 19 |
| GitHub Actions crons | Paused | `workflow_dispatch` still active on both workflows |

---

## Verification Checklist (Post-Deploy)

- [ ] `/bracket` — loads and shows all 32 results correctly, including penalty match scores (1–1, 1–1, 1–1, 0–0)
- [ ] `/api/bracket` — returns valid JSON with correct bracket data
- [ ] `/schedule` — loads fixture list; no scores shown (API key gone — expected)
- [ ] `/standings` — shows "Tournament concluded" message
- [ ] `/api/submit` — returns HTTP 410 Gone
- [ ] `npm run build` — clean build, no errors
- [ ] `npm run lint` — no lint errors

---

## Sign-off

- Data validation completed: 2026-08-11
- Code changes applied: 2026-08-11
- Authorized by: Dan (OCTech)
- Executed by: Claude Code (claude-sonnet-4-6)
