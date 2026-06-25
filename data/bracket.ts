// =====================================================================
// FIFA WORLD CUP 2026 — KNOCKOUT BRACKET STRUCTURE
// =====================================================================
// Source: Official FIFA 2026 knockout schedule (Matches 73–104)
// 48 teams → R32 (Jun 28–Jul 3) → R16 (Jul 4–7) → QF → SF → Final
// Match IDs use FIFA official numbering: M73–M104
// All times UTC. slot = display/bracket-tree order within round.
// =====================================================================

export interface BracketMatch {
  id: string                           // 'M73', 'M74', ..., 'M104'
  round: 'r32' | 'r16' | 'qf' | 'sf' | '3rd' | 'final'
  slot: number                         // bracket-position order within round
  home_team: string | null             // null = TBD
  away_team: string | null
  home_score: number | null
  away_score: number | null
  winner: string | null
  date_utc: string | null
  venue: string | null
  city: string | null
  status: 'upcoming' | 'live' | 'completed'
  // Projected teams — set by page when home_team/away_team are null.
  projected_home?: string | null
  projected_away?: string | null
}

// Round labels
export const BRACKET_ROUND_LABELS: Record<BracketMatch['round'], { en: string; es: string }> = {
  r32:   { en: 'Round of 32',   es: 'Ronda de 32'        },
  r16:   { en: 'Round of 16',   es: 'Octavos de Final'   },
  qf:    { en: 'Quarter-Final', es: 'Cuartos de Final'   },
  sf:    { en: 'Semi-Final',    es: 'Semifinal'           },
  '3rd': { en: 'Third Place',   es: 'Tercer Lugar'       },
  final: { en: 'Final',         es: 'Final'               },
}

export const BRACKET_ROUNDS: BracketMatch['round'][] = ['r32', 'r16', 'qf', 'sf', 'final']

// ── Seeded bracket — written to Supabase once at tournament start ────────
// slot ordering reflects bracket-tree position (pairs that feed the same R16
// match are adjacent: slots 1+2→M90, 3+4→M89, 5+6→M91, 7+8→M92,
// 9+10→M93, 11+12→M94, 13+14→M96, 15+16→M95).
export const BRACKET_SEED: Omit<BracketMatch, 'home_team' | 'away_team' | 'home_score' | 'away_score' | 'winner'>[] = [

  // ── ROUND OF 32 (Jun 28 – Jul 3) ─────────────────────────────────────
  // Upper half — feeds R16: M90 (Houston) · M89 (Philadelphia) · M91 (MetLife) · M92 (Mexico City)
  { id: 'M73', round: 'r32', slot: 1,  date_utc: '2026-06-28T19:00:00Z', venue: 'SoFi Stadium',           city: 'Inglewood',       status: 'upcoming' },
  { id: 'M75', round: 'r32', slot: 2,  date_utc: '2026-06-30T01:00:00Z', venue: 'Estadio BBVA',            city: 'Monterrey',       status: 'upcoming' },
  { id: 'M74', round: 'r32', slot: 3,  date_utc: '2026-06-29T20:30:00Z', venue: 'Gillette Stadium',        city: 'Foxborough',      status: 'upcoming' },
  { id: 'M77', round: 'r32', slot: 4,  date_utc: '2026-06-30T21:00:00Z', venue: 'MetLife Stadium',         city: 'East Rutherford', status: 'upcoming' },
  { id: 'M76', round: 'r32', slot: 5,  date_utc: '2026-06-29T17:00:00Z', venue: 'NRG Stadium',             city: 'Houston',         status: 'upcoming' },
  { id: 'M78', round: 'r32', slot: 6,  date_utc: '2026-06-30T17:00:00Z', venue: 'AT&T Stadium',            city: 'Arlington',       status: 'upcoming' },
  { id: 'M79', round: 'r32', slot: 7,  date_utc: '2026-07-01T01:00:00Z', venue: 'Estadio Azteca',          city: 'Mexico City',     status: 'upcoming' },
  { id: 'M80', round: 'r32', slot: 8,  date_utc: '2026-07-01T16:00:00Z', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta',         status: 'upcoming' },
  // Lower half — feeds R16: M93 (Dallas) · M94 (Seattle) · M96 (Vancouver) · M95 (Atlanta)
  { id: 'M83', round: 'r32', slot: 9,  date_utc: '2026-07-02T23:00:00Z', venue: 'BMO Field',               city: 'Toronto',         status: 'upcoming' },
  { id: 'M84', round: 'r32', slot: 10, date_utc: '2026-07-02T19:00:00Z', venue: 'SoFi Stadium',            city: 'Inglewood',       status: 'upcoming' },
  { id: 'M81', round: 'r32', slot: 11, date_utc: '2026-07-02T00:00:00Z', venue: "Levi's Stadium",          city: 'Santa Clara',     status: 'upcoming' },
  { id: 'M82', round: 'r32', slot: 12, date_utc: '2026-07-01T20:00:00Z', venue: 'Lumen Field',             city: 'Seattle',         status: 'upcoming' },
  { id: 'M85', round: 'r32', slot: 13, date_utc: '2026-07-03T03:00:00Z', venue: 'BC Place',                city: 'Vancouver',       status: 'upcoming' },
  { id: 'M87', round: 'r32', slot: 14, date_utc: '2026-07-04T01:30:00Z', venue: 'Arrowhead Stadium',       city: 'Kansas City',     status: 'upcoming' },
  { id: 'M86', round: 'r32', slot: 15, date_utc: '2026-07-03T22:00:00Z', venue: 'Hard Rock Stadium',       city: 'Miami Gardens',   status: 'upcoming' },
  { id: 'M88', round: 'r32', slot: 16, date_utc: '2026-07-03T18:00:00Z', venue: 'AT&T Stadium',            city: 'Arlington',       status: 'upcoming' },

  // ── ROUND OF 16 (Jul 4–7) ────────────────────────────────────────────
  // Slot pairs that feed each QF: 1+2→QF1, 3+4→QF2, 5+6→QF3, 7+8→QF4
  { id: 'M90', round: 'r16', slot: 1,  date_utc: '2026-07-04T17:00:00Z', venue: 'NRG Stadium',             city: 'Houston',         status: 'upcoming' },
  { id: 'M89', round: 'r16', slot: 2,  date_utc: '2026-07-04T21:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia',    status: 'upcoming' },
  { id: 'M91', round: 'r16', slot: 3,  date_utc: '2026-07-05T20:00:00Z', venue: 'MetLife Stadium',         city: 'East Rutherford', status: 'upcoming' },
  { id: 'M92', round: 'r16', slot: 4,  date_utc: '2026-07-06T00:00:00Z', venue: 'Estadio Azteca',          city: 'Mexico City',     status: 'upcoming' },
  { id: 'M93', round: 'r16', slot: 5,  date_utc: '2026-07-06T19:00:00Z', venue: 'AT&T Stadium',            city: 'Arlington',       status: 'upcoming' },
  { id: 'M94', round: 'r16', slot: 6,  date_utc: '2026-07-07T00:00:00Z', venue: 'Lumen Field',             city: 'Seattle',         status: 'upcoming' },
  { id: 'M95', round: 'r16', slot: 7,  date_utc: '2026-07-07T16:00:00Z', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta',         status: 'upcoming' },
  { id: 'M96', round: 'r16', slot: 8,  date_utc: '2026-07-07T20:00:00Z', venue: 'BC Place',                city: 'Vancouver',       status: 'upcoming' },

  // ── QUARTER-FINALS (Jul 9–11) ────────────────────────────────────────
  { id: 'M97',  round: 'qf', slot: 1,  date_utc: '2026-07-09T22:00:00Z', venue: 'Gillette Stadium',        city: 'Foxborough',      status: 'upcoming' },
  { id: 'M98',  round: 'qf', slot: 2,  date_utc: '2026-07-10T22:00:00Z', venue: 'SoFi Stadium',            city: 'Inglewood',       status: 'upcoming' },
  { id: 'M99',  round: 'qf', slot: 3,  date_utc: '2026-07-11T18:00:00Z', venue: 'Hard Rock Stadium',       city: 'Miami Gardens',   status: 'upcoming' },
  { id: 'M100', round: 'qf', slot: 4,  date_utc: '2026-07-11T22:00:00Z', venue: 'Arrowhead Stadium',       city: 'Kansas City',     status: 'upcoming' },

  // ── SEMI-FINALS (Jul 14–15) ──────────────────────────────────────────
  { id: 'M101', round: 'sf', slot: 1,  date_utc: '2026-07-14T22:00:00Z', venue: 'AT&T Stadium',            city: 'Arlington',       status: 'upcoming' },
  { id: 'M102', round: 'sf', slot: 2,  date_utc: '2026-07-15T22:00:00Z', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta',         status: 'upcoming' },

  // ── THIRD PLACE (Jul 18) ─────────────────────────────────────────────
  { id: 'M103', round: '3rd',   slot: 1, date_utc: '2026-07-18T22:00:00Z', venue: 'Hard Rock Stadium',     city: 'Miami Gardens',   status: 'upcoming' },

  // ── FINAL (Jul 19) ───────────────────────────────────────────────────
  { id: 'M104', round: 'final', slot: 1, date_utc: '2026-07-19T22:00:00Z', venue: 'MetLife Stadium',       city: 'East Rutherford', status: 'upcoming' },
]
