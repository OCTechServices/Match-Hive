// =====================================================================
// FIFA WORLD CUP 2026 — KNOCKOUT BRACKET STRUCTURE
// =====================================================================
// 48 teams → Round of 32 (16 matches) → R16 → QF → SF → Final
// bracket_matches rows are seeded in Supabase at tournament start.
// Update home_team / away_team / scores / winner as matches are played.
// =====================================================================

export interface BracketMatch {
  id: string                           // "R32-1", "QF-2", "FINAL"
  round: 'r32' | 'r16' | 'qf' | 'sf' | '3rd' | 'final'
  slot: number
  home_team: string | null             // null = TBD
  away_team: string | null
  home_score: number | null
  away_score: number | null
  winner: string | null
  date_utc: string | null
  venue: string | null
  city: string | null
  status: 'upcoming' | 'live' | 'completed'
  // Projected teams — set by /api/bracket when home_team/away_team are null.
  // Based on current group standings. Absent once real teams are confirmed.
  projected_home?: string | null
  projected_away?: string | null
}

// Round labels (EN / ES)
export const BRACKET_ROUND_LABELS: Record<BracketMatch['round'], { en: string; es: string }> = {
  r32:   { en: 'Round of 32',   es: 'Ronda de 32'        },
  r16:   { en: 'Round of 16',   es: 'Octavos de Final'   },
  qf:    { en: 'Quarter-Final', es: 'Cuartos de Final'   },
  sf:    { en: 'Semi-Final',    es: 'Semifinal'           },
  '3rd': { en: 'Third Place',   es: 'Tercer Lugar'       },
  final: { en: 'Final',         es: 'Final'               },
}

// Bracket slot order for rendering (left → right, top → bottom)
export const BRACKET_ROUNDS: BracketMatch['round'][] = ['r32', 'r16', 'qf', 'sf', 'final']

// Seeded bracket slots — these get written to Supabase once.
// Dates are approximate: verify against official FIFA knockout schedule.
// Teams are null until group stage completes and assignments are known.
export const BRACKET_SEED: Omit<BracketMatch, 'home_team' | 'away_team' | 'home_score' | 'away_score' | 'winner'>[] = [
  // ── ROUND OF 32 (June 29 – July 2) ──
  { id: 'R32-1',  round: 'r32', slot: 1,  date_utc: '2026-06-29T16:00:00Z', venue: 'MetLife Stadium',             city: 'East Rutherford', status: 'upcoming' },
  { id: 'R32-2',  round: 'r32', slot: 2,  date_utc: '2026-06-29T19:00:00Z', venue: 'Hard Rock Stadium',           city: 'Miami Gardens',   status: 'upcoming' },
  { id: 'R32-3',  round: 'r32', slot: 3,  date_utc: '2026-06-29T22:00:00Z', venue: 'Rose Bowl',                   city: 'Pasadena',        status: 'upcoming' },
  { id: 'R32-4',  round: 'r32', slot: 4,  date_utc: '2026-06-30T01:00:00Z', venue: 'AT&T Stadium',                city: 'Arlington',       status: 'upcoming' },
  { id: 'R32-5',  round: 'r32', slot: 5,  date_utc: '2026-06-30T16:00:00Z', venue: 'BMO Field',                   city: 'Toronto',         status: 'upcoming' },
  { id: 'R32-6',  round: 'r32', slot: 6,  date_utc: '2026-06-30T19:00:00Z', venue: 'Gillette Stadium',            city: 'Foxborough',      status: 'upcoming' },
  { id: 'R32-7',  round: 'r32', slot: 7,  date_utc: '2026-06-30T22:00:00Z', venue: 'SoFi Stadium',                city: 'Inglewood',       status: 'upcoming' },
  { id: 'R32-8',  round: 'r32', slot: 8,  date_utc: '2026-07-01T01:00:00Z', venue: 'Lumen Field',                 city: 'Seattle',         status: 'upcoming' },
  { id: 'R32-9',  round: 'r32', slot: 9,  date_utc: '2026-07-01T16:00:00Z', venue: 'BC Place',                    city: 'Vancouver',       status: 'upcoming' },
  { id: 'R32-10', round: 'r32', slot: 10, date_utc: '2026-07-01T19:00:00Z', venue: 'Arrowhead Stadium',           city: 'Kansas City',     status: 'upcoming' },
  { id: 'R32-11', round: 'r32', slot: 11, date_utc: '2026-07-01T22:00:00Z', venue: 'Allegiant Stadium',           city: 'Las Vegas',       status: 'upcoming' },
  { id: 'R32-12', round: 'r32', slot: 12, date_utc: '2026-07-02T01:00:00Z', venue: "Levi's Stadium",              city: 'Santa Clara',     status: 'upcoming' },
  { id: 'R32-13', round: 'r32', slot: 13, date_utc: '2026-07-02T16:00:00Z', venue: 'Lincoln Financial Field',     city: 'Philadelphia',    status: 'upcoming' },
  { id: 'R32-14', round: 'r32', slot: 14, date_utc: '2026-07-02T19:00:00Z', venue: 'Estadio Azteca',              city: 'Mexico City',     status: 'upcoming' },
  { id: 'R32-15', round: 'r32', slot: 15, date_utc: '2026-07-02T22:00:00Z', venue: 'Estadio Akron',               city: 'Guadalajara',     status: 'upcoming' },
  { id: 'R32-16', round: 'r32', slot: 16, date_utc: '2026-07-03T01:00:00Z', venue: 'Estadio BBVA',                city: 'Monterrey',       status: 'upcoming' },

  // ── ROUND OF 16 (July 4–7) ──
  { id: 'R16-1',  round: 'r16', slot: 1,  date_utc: '2026-07-04T18:00:00Z', venue: 'MetLife Stadium',             city: 'East Rutherford', status: 'upcoming' },
  { id: 'R16-2',  round: 'r16', slot: 2,  date_utc: '2026-07-04T22:00:00Z', venue: 'Hard Rock Stadium',           city: 'Miami Gardens',   status: 'upcoming' },
  { id: 'R16-3',  round: 'r16', slot: 3,  date_utc: '2026-07-05T18:00:00Z', venue: 'Rose Bowl',                   city: 'Pasadena',        status: 'upcoming' },
  { id: 'R16-4',  round: 'r16', slot: 4,  date_utc: '2026-07-05T22:00:00Z', venue: 'AT&T Stadium',                city: 'Arlington',       status: 'upcoming' },
  { id: 'R16-5',  round: 'r16', slot: 5,  date_utc: '2026-07-06T18:00:00Z', venue: 'SoFi Stadium',                city: 'Inglewood',       status: 'upcoming' },
  { id: 'R16-6',  round: 'r16', slot: 6,  date_utc: '2026-07-06T22:00:00Z', venue: 'Arrowhead Stadium',           city: 'Kansas City',     status: 'upcoming' },
  { id: 'R16-7',  round: 'r16', slot: 7,  date_utc: '2026-07-07T18:00:00Z', venue: 'MetLife Stadium',             city: 'East Rutherford', status: 'upcoming' },
  { id: 'R16-8',  round: 'r16', slot: 8,  date_utc: '2026-07-07T22:00:00Z', venue: 'Hard Rock Stadium',           city: 'Miami Gardens',   status: 'upcoming' },

  // ── QUARTER-FINALS (July 10–11) ──
  { id: 'QF-1', round: 'qf', slot: 1, date_utc: '2026-07-10T18:00:00Z', venue: 'MetLife Stadium',   city: 'East Rutherford', status: 'upcoming' },
  { id: 'QF-2', round: 'qf', slot: 2, date_utc: '2026-07-10T22:00:00Z', venue: 'Rose Bowl',         city: 'Pasadena',        status: 'upcoming' },
  { id: 'QF-3', round: 'qf', slot: 3, date_utc: '2026-07-11T18:00:00Z', venue: 'AT&T Stadium',      city: 'Arlington',       status: 'upcoming' },
  { id: 'QF-4', round: 'qf', slot: 4, date_utc: '2026-07-11T22:00:00Z', venue: 'SoFi Stadium',      city: 'Inglewood',       status: 'upcoming' },

  // ── SEMI-FINALS (July 14–15) ──
  { id: 'SF-1', round: 'sf', slot: 1, date_utc: '2026-07-14T22:00:00Z', venue: 'MetLife Stadium',   city: 'East Rutherford', status: 'upcoming' },
  { id: 'SF-2', round: 'sf', slot: 2, date_utc: '2026-07-15T22:00:00Z', venue: 'Rose Bowl',         city: 'Pasadena',        status: 'upcoming' },

  // ── THIRD PLACE (July 18) ──
  { id: '3RD',   round: '3rd',   slot: 1, date_utc: '2026-07-18T22:00:00Z', venue: 'AT&T Stadium',      city: 'Arlington',       status: 'upcoming' },

  // ── FINAL (July 19, MetLife Stadium) ──
  { id: 'FINAL', round: 'final', slot: 1, date_utc: '2026-07-19T22:00:00Z', venue: 'MetLife Stadium',   city: 'East Rutherford', status: 'upcoming' },
]
