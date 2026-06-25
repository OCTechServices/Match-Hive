/**
 * seed-bracket-matches.mjs
 * Rebuilds the bracket_matches table from scratch using official FIFA match numbers.
 * Safe to run multiple times — deletes all rows then re-inserts.
 *
 * Run after updating .env.local with the new Supabase secret key:
 *   node -r dotenv/config scripts/seed-bracket-matches.mjs dotenv_config_path=.env.local
 *
 * Or set env vars manually:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-bracket-matches.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const headers = {
  'apikey':        SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type':  'application/json',
  'Prefer':        'return=minimal',
}

const BASE = `${SUPABASE_URL}/rest/v1/bracket_matches`

// ── Official bracket data ─────────────────────────────────────────────────
// slot = bracket-tree position within round (pair-adjacent slots feed same
// next-round match: R32 1+2→M90, 3+4→M89, 5+6→M91, 7+8→M92,
// 9+10→M93, 11+12→M94, 13+14→M96, 15+16→M95)
const rows = [
  // ── ROUND OF 32 (Jun 28 – Jul 3) ──────────────────────────────────────
  { id: 'M73',  round: 'r32',   slot: 1,  date_utc: '2026-06-28T19:00:00Z', venue: 'SoFi Stadium',            city: 'Inglewood',       status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M75',  round: 'r32',   slot: 2,  date_utc: '2026-06-30T01:00:00Z', venue: 'Estadio BBVA',             city: 'Monterrey',       status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M74',  round: 'r32',   slot: 3,  date_utc: '2026-06-29T20:30:00Z', venue: 'Gillette Stadium',         city: 'Foxborough',      status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M77',  round: 'r32',   slot: 4,  date_utc: '2026-06-30T21:00:00Z', venue: 'MetLife Stadium',          city: 'East Rutherford', status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M76',  round: 'r32',   slot: 5,  date_utc: '2026-06-29T17:00:00Z', venue: 'NRG Stadium',              city: 'Houston',         status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M78',  round: 'r32',   slot: 6,  date_utc: '2026-06-30T17:00:00Z', venue: 'AT&T Stadium',             city: 'Arlington',       status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M79',  round: 'r32',   slot: 7,  date_utc: '2026-07-01T01:00:00Z', venue: 'Estadio Azteca',           city: 'Mexico City',     status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M80',  round: 'r32',   slot: 8,  date_utc: '2026-07-01T16:00:00Z', venue: 'Mercedes-Benz Stadium',    city: 'Atlanta',         status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M83',  round: 'r32',   slot: 9,  date_utc: '2026-07-02T23:00:00Z', venue: 'BMO Field',                city: 'Toronto',         status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M84',  round: 'r32',   slot: 10, date_utc: '2026-07-02T19:00:00Z', venue: 'SoFi Stadium',             city: 'Inglewood',       status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M81',  round: 'r32',   slot: 11, date_utc: '2026-07-02T00:00:00Z', venue: "Levi's Stadium",           city: 'Santa Clara',     status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M82',  round: 'r32',   slot: 12, date_utc: '2026-07-01T20:00:00Z', venue: 'Lumen Field',              city: 'Seattle',         status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M85',  round: 'r32',   slot: 13, date_utc: '2026-07-03T03:00:00Z', venue: 'BC Place',                 city: 'Vancouver',       status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M87',  round: 'r32',   slot: 14, date_utc: '2026-07-04T01:30:00Z', venue: 'Arrowhead Stadium',        city: 'Kansas City',     status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M86',  round: 'r32',   slot: 15, date_utc: '2026-07-03T22:00:00Z', venue: 'Hard Rock Stadium',        city: 'Miami Gardens',   status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M88',  round: 'r32',   slot: 16, date_utc: '2026-07-03T18:00:00Z', venue: 'AT&T Stadium',             city: 'Arlington',       status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },

  // ── ROUND OF 16 (Jul 4–7) ─────────────────────────────────────────────
  { id: 'M90',  round: 'r16',   slot: 1,  date_utc: '2026-07-04T17:00:00Z', venue: 'NRG Stadium',              city: 'Houston',         status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M89',  round: 'r16',   slot: 2,  date_utc: '2026-07-04T21:00:00Z', venue: 'Lincoln Financial Field',  city: 'Philadelphia',    status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M91',  round: 'r16',   slot: 3,  date_utc: '2026-07-05T20:00:00Z', venue: 'MetLife Stadium',          city: 'East Rutherford', status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M92',  round: 'r16',   slot: 4,  date_utc: '2026-07-06T00:00:00Z', venue: 'Estadio Azteca',           city: 'Mexico City',     status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M93',  round: 'r16',   slot: 5,  date_utc: '2026-07-06T19:00:00Z', venue: 'AT&T Stadium',             city: 'Arlington',       status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M94',  round: 'r16',   slot: 6,  date_utc: '2026-07-07T00:00:00Z', venue: 'Lumen Field',              city: 'Seattle',         status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M95',  round: 'r16',   slot: 7,  date_utc: '2026-07-07T16:00:00Z', venue: 'Mercedes-Benz Stadium',    city: 'Atlanta',         status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M96',  round: 'r16',   slot: 8,  date_utc: '2026-07-07T20:00:00Z', venue: 'BC Place',                 city: 'Vancouver',       status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },

  // ── QUARTER-FINALS (Jul 9–11) ─────────────────────────────────────────
  { id: 'M97',  round: 'qf',    slot: 1,  date_utc: '2026-07-09T22:00:00Z', venue: 'Gillette Stadium',         city: 'Foxborough',      status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M98',  round: 'qf',    slot: 2,  date_utc: '2026-07-10T22:00:00Z', venue: 'SoFi Stadium',             city: 'Inglewood',       status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M99',  round: 'qf',    slot: 3,  date_utc: '2026-07-11T18:00:00Z', venue: 'Hard Rock Stadium',        city: 'Miami Gardens',   status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M100', round: 'qf',    slot: 4,  date_utc: '2026-07-11T22:00:00Z', venue: 'Arrowhead Stadium',        city: 'Kansas City',     status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },

  // ── SEMI-FINALS (Jul 14–15) ───────────────────────────────────────────
  { id: 'M101', round: 'sf',    slot: 1,  date_utc: '2026-07-14T22:00:00Z', venue: 'AT&T Stadium',             city: 'Arlington',       status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
  { id: 'M102', round: 'sf',    slot: 2,  date_utc: '2026-07-15T22:00:00Z', venue: 'Mercedes-Benz Stadium',    city: 'Atlanta',         status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },

  // ── THIRD PLACE (Jul 18) ──────────────────────────────────────────────
  { id: 'M103', round: '3rd',   slot: 1,  date_utc: '2026-07-18T22:00:00Z', venue: 'Hard Rock Stadium',        city: 'Miami Gardens',   status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },

  // ── FINAL (Jul 19) ────────────────────────────────────────────────────
  { id: 'M104', round: 'final', slot: 1,  date_utc: '2026-07-19T22:00:00Z', venue: 'MetLife Stadium',          city: 'East Rutherford', status: 'upcoming', home_team: null, away_team: null, home_score: null, away_score: null, winner: null },
]

async function run() {
  // 1. Delete all existing rows
  console.log('Deleting existing bracket_matches rows...')
  const del = await fetch(`${BASE}?id=neq.IMPOSSIBLE_ID_TO_MATCH_ALL`, {
    method: 'DELETE',
    headers: { ...headers, 'Prefer': 'return=minimal' },
  })
  // Supabase requires a filter; delete with always-true filter
  const delAll = await fetch(`${BASE}?slot=gte.0`, {
    method: 'DELETE',
    headers,
  })
  if (!delAll.ok) {
    const body = await delAll.text()
    console.error('Delete failed:', delAll.status, body)
    process.exit(1)
  }
  console.log('Deleted.')

  // 2. Insert all new rows
  console.log(`Inserting ${rows.length} rows...`)
  const ins = await fetch(BASE, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify(rows),
  })
  if (!ins.ok) {
    const body = await ins.text()
    console.error('Insert failed:', ins.status, body)
    process.exit(1)
  }
  console.log(`Done — ${rows.length} rows inserted.`)
}

run()
