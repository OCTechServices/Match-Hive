/**
 * migrate-bracket-venues.mjs
 * One-time script — fixes venue/date errors in bracket_matches table via Supabase REST API.
 * Run: node scripts/migrate-bracket-venues.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const fixes = [
  // R32 — wrong venues
  { id: 'R32-3',  venue: 'NRG Stadium',           city: 'Houston'       },
  { id: 'R32-11', venue: 'Mercedes-Benz Stadium', city: 'Atlanta'       },
  // R16 — wrong venue
  { id: 'R16-3',  venue: 'NRG Stadium',           city: 'Houston'       },
  // Quarter-Finals — wrong dates + venues
  { id: 'QF-1', date_utc: '2026-07-09T22:00:00Z', venue: 'Gillette Stadium',  city: 'Foxborough'    },
  { id: 'QF-2', date_utc: '2026-07-10T22:00:00Z', venue: 'SoFi Stadium',      city: 'Inglewood'     },
  { id: 'QF-3', date_utc: '2026-07-11T18:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens' },
  { id: 'QF-4', date_utc: '2026-07-11T22:00:00Z', venue: 'Arrowhead Stadium', city: 'Kansas City'   },
  // Semi-Finals — wrong venues
  { id: 'SF-1', venue: 'AT&T Stadium',          city: 'Arlington'     },
  { id: 'SF-2', venue: 'Mercedes-Benz Stadium', city: 'Atlanta'       },
  // Third place — wrong venue
  { id: '3RD',  venue: 'Hard Rock Stadium',     city: 'Miami Gardens' },
]

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
}

let ok = 0, fail = 0

for (const fix of fixes) {
  const { id, ...fields } = fix
  const url = `${SUPABASE_URL}/rest/v1/bracket_matches?id=eq.${encodeURIComponent(id)}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(fields),
  })
  if (!res.ok) {
    const body = await res.text()
    console.error(`FAIL ${id}: ${res.status} ${body}`)
    fail++
  } else {
    const label = `${fix.venue ?? ''}${fix.date_utc ? ' @ ' + fix.date_utc : ''}`
    console.log(`OK   ${id} → ${label}`)
    ok++
  }
}

console.log(`\nDone: ${ok} updated, ${fail} failed`)
