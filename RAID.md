# RAID Log: match-hive
# Tier 1 — Enterprise Grade | OCTech Services
# Last Updated: 2026-06-13

---

## Risks
| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R01 | Secrets or credentials accidentally committed to git | Low | Critical | .gitignore covers .env files; inspect-projects.sh scans on each governance cycle |
| R02 | Scope creep — features added beyond CLAUDE.md definition | Medium | High | Review CLAUDE.md at every session start; question any task not traceable to Section 1 |
| R03 | External API dependency breaks or changes without notice | Medium | Medium | Pin dependency versions; document all integrations in CLAUDE.md Section 4 |
| R04 | CLAUDE.md becomes stale — Claude operates from outdated context | Medium | High | Update CLAUDE.md at session end whenever anything meaningful changes |
| R05 | Schedule data inaccuracy — wrong dates or times displayed to users | Medium | High | Verify all changes to data/wc2026.ts against NBC Sports / FIFA official schedule |

## Assumptions
| ID | Assumption |
|---|---|
| A01 | Stack and integrations documented in CLAUDE.md Section 2 are accurate |
| A02 | Environment variables follow the naming convention in .env.example |
| A03 | One CLAUDE.md per project — located at project root |
| A04 | All match times in data/wc2026.ts are stored in UTC and verified against NBC Sports source |
| A05 | Vercel auto-deploys on push to main — no manual deploy step required |

## Issues
| ID | Issue | Source | Priority | Status |
|---|---|---|---|---|
| I01 | `metadataBase` not set — OG/Twitter image URLs resolve to localhost in build output | Build warning | Low | Open — pre-existing, non-blocking |
| I02 | ICS uid uses old project name `watch-party-sphere` — may cause duplicate calendar entries if user re-downloads | Code review | Low | Resolved 2026-06-16 — uid updated to `mh-{id}@match-hive` |

## Dependencies
| ID | Dependency | Type | Notes |
|---|---|---|---|
| D01 | Next.js 16.2.9 | Framework | Breaking changes vs prior versions — read node_modules/next/dist/docs/ before writing Next.js code |
| D02 | Clerk @clerk/nextjs ^7.5.1 | Auth | v7 has breaking changes vs v5/v6 |
| D03 | Supabase @supabase/supabase-js ^2.108.1 | Database | JS client v2 |
| D04 | ics ^3.12.0 | Calendar generation | Used in /api/ics route |
| D05 | Meta Pixel 1538010084523329 | Analytics | PageView + Lead events — embedded in layout |
| D06 | Lovable (external frontend) | API consumer | Calls /api/ics via open CORS — coordinate before restricting CORS |
| D07 | Vercel | Hosting / CI | Auto-deploy on push to main |
| D08 | football-data.org (free tier) | Live data | `FOOTBALL_DATA_API_KEY` — feeds /schedule scores and /standings. Fails silently if unavailable. |
