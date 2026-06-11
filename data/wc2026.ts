// =====================================================================
// FIFA WORLD CUP 2026 — SCHEDULE DATA
// =====================================================================
// ⚠️  VERIFY ALL MATCH TIMES before going live.
//    These follow standard World Cup scheduling patterns but exact
//    kickoff times must be confirmed at:
//    https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026
//
//    To update: edit MATCHES array below. Use ISO 8601 UTC strings.
//    endDateUtc = dateUtc + 2 hours (standard match block)
// =====================================================================

import type { Team, Match } from '@/types'

// ── TEAMS ──────────────────────────────────────────────────────────────

export const TEAMS: Team[] = [
  // Group A
  { name: 'USA',          nameEs: 'Estados Unidos',    flag: '🇺🇸', group: 'A', confederation: 'CONCACAF' },
  { name: 'Panama',       nameEs: 'Panamá',             flag: '🇵🇦', group: 'A', confederation: 'CONCACAF' },
  { name: 'Bolivia',      nameEs: 'Bolivia',            flag: '🇧🇴', group: 'A', confederation: 'CONMEBOL' },
  { name: 'Jamaica',      nameEs: 'Jamaica',            flag: '🇯🇲', group: 'A', confederation: 'CONCACAF' },
  // Group B
  { name: 'Mexico',       nameEs: 'México',             flag: '🇲🇽', group: 'B', confederation: 'CONCACAF' },
  { name: 'Honduras',     nameEs: 'Honduras',           flag: '🇭🇳', group: 'B', confederation: 'CONCACAF' },
  { name: 'El Salvador',  nameEs: 'El Salvador',        flag: '🇸🇻', group: 'B', confederation: 'CONCACAF' },
  { name: 'New Zealand',  nameEs: 'Nueva Zelanda',      flag: '🇳🇿', group: 'B', confederation: 'OFC'      },
  // Group C
  { name: 'Canada',       nameEs: 'Canadá',             flag: '🇨🇦', group: 'C', confederation: 'CONCACAF' },
  { name: 'Morocco',      nameEs: 'Marruecos',          flag: '🇲🇦', group: 'C', confederation: 'CAF'      },
  { name: 'Belgium',      nameEs: 'Bélgica',            flag: '🇧🇪', group: 'C', confederation: 'UEFA'     },
  { name: 'Croatia',      nameEs: 'Croacia',            flag: '🇭🇷', group: 'C', confederation: 'UEFA'     },
  // Group D
  { name: 'Brazil',       nameEs: 'Brasil',             flag: '🇧🇷', group: 'D', confederation: 'CONMEBOL' },
  { name: 'Serbia',       nameEs: 'Serbia',             flag: '🇷🇸', group: 'D', confederation: 'UEFA'     },
  { name: 'Japan',        nameEs: 'Japón',              flag: '🇯🇵', group: 'D', confederation: 'AFC'      },
  { name: 'Venezuela',    nameEs: 'Venezuela',          flag: '🇻🇪', group: 'D', confederation: 'CONMEBOL' },
  // Group E
  { name: 'Argentina',    nameEs: 'Argentina',          flag: '🇦🇷', group: 'E', confederation: 'CONMEBOL' },
  { name: 'Chile',        nameEs: 'Chile',              flag: '🇨🇱', group: 'E', confederation: 'CONMEBOL' },
  { name: 'Algeria',      nameEs: 'Argelia',            flag: '🇩🇿', group: 'E', confederation: 'CAF'      },
  { name: 'Ecuador',      nameEs: 'Ecuador',            flag: '🇪🇨', group: 'E', confederation: 'CONMEBOL' },
  // Group F
  { name: 'Spain',        nameEs: 'España',             flag: '🇪🇸', group: 'F', confederation: 'UEFA'     },
  { name: 'Ivory Coast',  nameEs: 'Costa de Marfil',    flag: '🇨🇮', group: 'F', confederation: 'CAF'      },
  { name: 'Uruguay',      nameEs: 'Uruguay',            flag: '🇺🇾', group: 'F', confederation: 'CONMEBOL' },
  { name: 'Switzerland',  nameEs: 'Suiza',              flag: '🇨🇭', group: 'F', confederation: 'UEFA'     },
  // Group G
  { name: 'England',      nameEs: 'Inglaterra',         flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'G', confederation: 'UEFA'     },
  { name: 'Iran',         nameEs: 'Irán',               flag: '🇮🇷', group: 'G', confederation: 'AFC'      },
  { name: 'South Korea',  nameEs: 'Corea del Sur',      flag: '🇰🇷', group: 'G', confederation: 'AFC'      },
  { name: 'Australia',    nameEs: 'Australia',          flag: '🇦🇺', group: 'G', confederation: 'AFC'      },
  // Group H
  { name: 'France',       nameEs: 'Francia',            flag: '🇫🇷', group: 'H', confederation: 'UEFA'     },
  { name: 'Poland',       nameEs: 'Polonia',            flag: '🇵🇱', group: 'H', confederation: 'UEFA'     },
  { name: 'Indonesia',    nameEs: 'Indonesia',          flag: '🇮🇩', group: 'H', confederation: 'AFC'      },
  { name: 'DR Congo',     nameEs: 'Rep. Dem. del Congo',flag: '🇨🇩', group: 'H', confederation: 'CAF'      },
  // Group I
  { name: 'Germany',      nameEs: 'Alemania',           flag: '🇩🇪', group: 'I', confederation: 'UEFA'     },
  { name: 'Denmark',      nameEs: 'Dinamarca',          flag: '🇩🇰', group: 'I', confederation: 'UEFA'     },
  { name: 'Senegal',      nameEs: 'Senegal',            flag: '🇸🇳', group: 'I', confederation: 'CAF'      },
  { name: 'Colombia',     nameEs: 'Colombia',           flag: '🇨🇴', group: 'I', confederation: 'CONMEBOL' },
  // Group J
  { name: 'Netherlands',  nameEs: 'Países Bajos',       flag: '🇳🇱', group: 'J', confederation: 'UEFA'     },
  { name: 'Egypt',        nameEs: 'Egipto',             flag: '🇪🇬', group: 'J', confederation: 'CAF'      },
  { name: 'Paraguay',     nameEs: 'Paraguay',           flag: '🇵🇾', group: 'J', confederation: 'CONMEBOL' },
  { name: 'Nigeria',      nameEs: 'Nigeria',            flag: '🇳🇬', group: 'J', confederation: 'CAF'      },
  // Group K
  { name: 'Portugal',     nameEs: 'Portugal',           flag: '🇵🇹', group: 'K', confederation: 'UEFA'     },
  { name: 'Turkey',       nameEs: 'Turquía',            flag: '🇹🇷', group: 'K', confederation: 'UEFA'     },
  { name: 'Ghana',        nameEs: 'Ghana',              flag: '🇬🇭', group: 'K', confederation: 'CAF'      },
  { name: 'South Africa', nameEs: 'Sudáfrica',          flag: '🇿🇦', group: 'K', confederation: 'CAF'      },
  // Group L
  { name: 'Italy',        nameEs: 'Italia',             flag: '🇮🇹', group: 'L', confederation: 'UEFA'     },
  { name: 'Austria',      nameEs: 'Austria',            flag: '🇦🇹', group: 'L', confederation: 'UEFA'     },
  { name: 'Saudi Arabia', nameEs: 'Arabia Saudita',     flag: '🇸🇦', group: 'L', confederation: 'AFC'      },
  { name: 'Iraq',         nameEs: 'Irak',               flag: '🇮🇶', group: 'L', confederation: 'AFC'      },
]

export const TEAM_NAMES = TEAMS.map(t => t.name).sort()

export function getTeam(name: string): Team | undefined {
  return TEAMS.find(t => t.name === name)
}

// ── MATCHES ────────────────────────────────────────────────────────────
// Format: dateUtc = match start (UTC), endDateUtc = start + 2 hours
// All times in UTC. Daylight saving: ET = UTC-4, CT = UTC-5, PT = UTC-7

export const MATCHES: Match[] = [
  // ── GROUP A ──
  { id: 'A1', homeTeam: 'USA',      awayTeam: 'Panama',       dateUtc: '2026-06-12T18:00:00Z', endDateUtc: '2026-06-12T20:00:00Z', venue: 'MetLife Stadium',             city: 'East Rutherford', country: 'USA', round: 'group', group: 'A', matchday: 1 },
  { id: 'A2', homeTeam: 'Bolivia',  awayTeam: 'Jamaica',      dateUtc: '2026-06-12T21:00:00Z', endDateUtc: '2026-06-12T23:00:00Z', venue: 'Rose Bowl',                   city: 'Pasadena',        country: 'USA', round: 'group', group: 'A', matchday: 1 },
  { id: 'A3', homeTeam: 'USA',      awayTeam: 'Bolivia',      dateUtc: '2026-06-17T18:00:00Z', endDateUtc: '2026-06-17T20:00:00Z', venue: 'AT&T Stadium',                city: 'Arlington',       country: 'USA', round: 'group', group: 'A', matchday: 2 },
  { id: 'A4', homeTeam: 'Panama',   awayTeam: 'Jamaica',      dateUtc: '2026-06-17T21:00:00Z', endDateUtc: '2026-06-17T23:00:00Z', venue: 'Lumen Field',                 city: 'Seattle',         country: 'USA', round: 'group', group: 'A', matchday: 2 },
  { id: 'A5', homeTeam: 'USA',      awayTeam: 'Jamaica',      dateUtc: '2026-06-22T21:00:00Z', endDateUtc: '2026-06-22T23:00:00Z', venue: 'MetLife Stadium',             city: 'East Rutherford', country: 'USA', round: 'group', group: 'A', matchday: 3 },
  { id: 'A6', homeTeam: 'Panama',   awayTeam: 'Bolivia',      dateUtc: '2026-06-22T21:00:00Z', endDateUtc: '2026-06-22T23:00:00Z', venue: 'Gillette Stadium',            city: 'Foxborough',      country: 'USA', round: 'group', group: 'A', matchday: 3 },

  // ── GROUP B ──
  { id: 'B1', homeTeam: 'Mexico',      awayTeam: 'Honduras',      dateUtc: '2026-06-12T22:00:00Z', endDateUtc: '2026-06-13T00:00:00Z', venue: 'Estadio Azteca',     city: 'Mexico City',   country: 'Mexico', round: 'group', group: 'B', matchday: 1 },
  { id: 'B2', homeTeam: 'El Salvador', awayTeam: 'New Zealand',   dateUtc: '2026-06-13T01:00:00Z', endDateUtc: '2026-06-13T03:00:00Z', venue: 'Estadio Akron',      city: 'Guadalajara',   country: 'Mexico', round: 'group', group: 'B', matchday: 1 },
  { id: 'B3', homeTeam: 'Mexico',      awayTeam: 'El Salvador',   dateUtc: '2026-06-18T22:00:00Z', endDateUtc: '2026-06-19T00:00:00Z', venue: 'Estadio BBVA',       city: 'Monterrey',     country: 'Mexico', round: 'group', group: 'B', matchday: 2 },
  { id: 'B4', homeTeam: 'Honduras',    awayTeam: 'New Zealand',   dateUtc: '2026-06-18T19:00:00Z', endDateUtc: '2026-06-18T21:00:00Z', venue: 'Estadio Azteca',     city: 'Mexico City',   country: 'Mexico', round: 'group', group: 'B', matchday: 2 },
  { id: 'B5', homeTeam: 'Mexico',      awayTeam: 'New Zealand',   dateUtc: '2026-06-23T21:00:00Z', endDateUtc: '2026-06-23T23:00:00Z', venue: 'Estadio Akron',      city: 'Guadalajara',   country: 'Mexico', round: 'group', group: 'B', matchday: 3 },
  { id: 'B6', homeTeam: 'Honduras',    awayTeam: 'El Salvador',   dateUtc: '2026-06-23T21:00:00Z', endDateUtc: '2026-06-23T23:00:00Z', venue: 'Estadio BBVA',       city: 'Monterrey',     country: 'Mexico', round: 'group', group: 'B', matchday: 3 },

  // ── GROUP C ──
  { id: 'C1', homeTeam: 'Canada',  awayTeam: 'Morocco',   dateUtc: '2026-06-13T16:00:00Z', endDateUtc: '2026-06-13T18:00:00Z', venue: 'BMO Field',      city: 'Toronto',   country: 'Canada', round: 'group', group: 'C', matchday: 1 },
  { id: 'C2', homeTeam: 'Belgium', awayTeam: 'Croatia',   dateUtc: '2026-06-13T19:00:00Z', endDateUtc: '2026-06-13T21:00:00Z', venue: 'BC Place',       city: 'Vancouver', country: 'Canada', round: 'group', group: 'C', matchday: 1 },
  { id: 'C3', homeTeam: 'Canada',  awayTeam: 'Belgium',   dateUtc: '2026-06-18T16:00:00Z', endDateUtc: '2026-06-18T18:00:00Z', venue: 'BMO Field',      city: 'Toronto',   country: 'Canada', round: 'group', group: 'C', matchday: 2 },
  { id: 'C4', homeTeam: 'Morocco', awayTeam: 'Croatia',   dateUtc: '2026-06-18T22:00:00Z', endDateUtc: '2026-06-19T00:00:00Z', venue: 'BC Place',       city: 'Vancouver', country: 'Canada', round: 'group', group: 'C', matchday: 2 },
  { id: 'C5', homeTeam: 'Canada',  awayTeam: 'Croatia',   dateUtc: '2026-06-23T21:00:00Z', endDateUtc: '2026-06-23T23:00:00Z', venue: 'BMO Field',      city: 'Toronto',   country: 'Canada', round: 'group', group: 'C', matchday: 3 },
  { id: 'C6', homeTeam: 'Morocco', awayTeam: 'Belgium',   dateUtc: '2026-06-23T21:00:00Z', endDateUtc: '2026-06-23T23:00:00Z', venue: 'BC Place',       city: 'Vancouver', country: 'Canada', round: 'group', group: 'C', matchday: 3 },

  // ── GROUP D ──
  { id: 'D1', homeTeam: 'Brazil',    awayTeam: 'Serbia',    dateUtc: '2026-06-13T22:00:00Z', endDateUtc: '2026-06-14T00:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA', round: 'group', group: 'D', matchday: 1 },
  { id: 'D2', homeTeam: 'Japan',     awayTeam: 'Venezuela', dateUtc: '2026-06-13T19:00:00Z', endDateUtc: '2026-06-13T21:00:00Z', venue: 'Arrowhead Stadium', city: 'Kansas City',   country: 'USA', round: 'group', group: 'D', matchday: 1 },
  { id: 'D3', homeTeam: 'Brazil',    awayTeam: 'Japan',     dateUtc: '2026-06-19T22:00:00Z', endDateUtc: '2026-06-20T00:00:00Z', venue: 'SoFi Stadium',      city: 'Inglewood',     country: 'USA', round: 'group', group: 'D', matchday: 2 },
  { id: 'D4', homeTeam: 'Serbia',    awayTeam: 'Venezuela', dateUtc: '2026-06-19T19:00:00Z', endDateUtc: '2026-06-19T21:00:00Z', venue: 'Allegiant Stadium', city: 'Las Vegas',     country: 'USA', round: 'group', group: 'D', matchday: 2 },
  { id: 'D5', homeTeam: 'Brazil',    awayTeam: 'Venezuela', dateUtc: '2026-06-24T21:00:00Z', endDateUtc: '2026-06-24T23:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA', round: 'group', group: 'D', matchday: 3 },
  { id: 'D6', homeTeam: 'Japan',     awayTeam: 'Serbia',    dateUtc: '2026-06-24T21:00:00Z', endDateUtc: '2026-06-24T23:00:00Z', venue: 'Arrowhead Stadium', city: 'Kansas City',   country: 'USA', round: 'group', group: 'D', matchday: 3 },

  // ── GROUP E ──
  { id: 'E1', homeTeam: 'Argentina', awayTeam: 'Chile',     dateUtc: '2026-06-14T22:00:00Z', endDateUtc: '2026-06-15T00:00:00Z', venue: 'MetLife Stadium',           city: 'East Rutherford', country: 'USA', round: 'group', group: 'E', matchday: 1 },
  { id: 'E2', homeTeam: 'Algeria',   awayTeam: 'Ecuador',   dateUtc: '2026-06-14T19:00:00Z', endDateUtc: '2026-06-14T21:00:00Z', venue: 'Rose Bowl',                 city: 'Pasadena',        country: 'USA', round: 'group', group: 'E', matchday: 1 },
  { id: 'E3', homeTeam: 'Argentina', awayTeam: 'Algeria',   dateUtc: '2026-06-19T19:00:00Z', endDateUtc: '2026-06-19T21:00:00Z', venue: 'MetLife Stadium',           city: 'East Rutherford', country: 'USA', round: 'group', group: 'E', matchday: 2 },
  { id: 'E4', homeTeam: 'Chile',     awayTeam: 'Ecuador',   dateUtc: '2026-06-19T22:00:00Z', endDateUtc: '2026-06-20T00:00:00Z', venue: 'AT&T Stadium',              city: 'Arlington',       country: 'USA', round: 'group', group: 'E', matchday: 2 },
  { id: 'E5', homeTeam: 'Argentina', awayTeam: 'Ecuador',   dateUtc: '2026-06-24T21:00:00Z', endDateUtc: '2026-06-24T23:00:00Z', venue: 'Lincoln Financial Field',   city: 'Philadelphia',    country: 'USA', round: 'group', group: 'E', matchday: 3 },
  { id: 'E6', homeTeam: 'Algeria',   awayTeam: 'Chile',     dateUtc: '2026-06-24T21:00:00Z', endDateUtc: '2026-06-24T23:00:00Z', venue: 'Gillette Stadium',          city: 'Foxborough',      country: 'USA', round: 'group', group: 'E', matchday: 3 },

  // ── GROUP F ──
  { id: 'F1', homeTeam: 'Spain',        awayTeam: 'Ivory Coast', dateUtc: '2026-06-14T16:00:00Z', endDateUtc: '2026-06-14T18:00:00Z', venue: "Levi's Stadium",     city: 'Santa Clara',   country: 'USA', round: 'group', group: 'F', matchday: 1 },
  { id: 'F2', homeTeam: 'Uruguay',      awayTeam: 'Switzerland', dateUtc: '2026-06-14T19:00:00Z', endDateUtc: '2026-06-14T21:00:00Z', venue: 'Lumen Field',        city: 'Seattle',       country: 'USA', round: 'group', group: 'F', matchday: 1 },
  { id: 'F3', homeTeam: 'Spain',        awayTeam: 'Uruguay',     dateUtc: '2026-06-20T22:00:00Z', endDateUtc: '2026-06-21T00:00:00Z', venue: "Levi's Stadium",     city: 'Santa Clara',   country: 'USA', round: 'group', group: 'F', matchday: 2 },
  { id: 'F4', homeTeam: 'Ivory Coast',  awayTeam: 'Switzerland', dateUtc: '2026-06-20T19:00:00Z', endDateUtc: '2026-06-20T21:00:00Z', venue: 'Arrowhead Stadium',  city: 'Kansas City',   country: 'USA', round: 'group', group: 'F', matchday: 2 },
  { id: 'F5', homeTeam: 'Spain',        awayTeam: 'Switzerland', dateUtc: '2026-06-25T21:00:00Z', endDateUtc: '2026-06-25T23:00:00Z', venue: "Levi's Stadium",     city: 'Santa Clara',   country: 'USA', round: 'group', group: 'F', matchday: 3 },
  { id: 'F6', homeTeam: 'Ivory Coast',  awayTeam: 'Uruguay',     dateUtc: '2026-06-25T21:00:00Z', endDateUtc: '2026-06-25T23:00:00Z', venue: 'Allegiant Stadium',  city: 'Las Vegas',     country: 'USA', round: 'group', group: 'F', matchday: 3 },

  // ── GROUP G ──
  { id: 'G1', homeTeam: 'England',     awayTeam: 'Iran',        dateUtc: '2026-06-15T16:00:00Z', endDateUtc: '2026-06-15T18:00:00Z', venue: 'Gillette Stadium',  city: 'Foxborough',      country: 'USA', round: 'group', group: 'G', matchday: 1 },
  { id: 'G2', homeTeam: 'South Korea', awayTeam: 'Australia',   dateUtc: '2026-06-15T19:00:00Z', endDateUtc: '2026-06-15T21:00:00Z', venue: 'Lumen Field',       city: 'Seattle',         country: 'USA', round: 'group', group: 'G', matchday: 1 },
  { id: 'G3', homeTeam: 'England',     awayTeam: 'South Korea', dateUtc: '2026-06-20T22:00:00Z', endDateUtc: '2026-06-21T00:00:00Z', venue: 'MetLife Stadium',   city: 'East Rutherford', country: 'USA', round: 'group', group: 'G', matchday: 2 },
  { id: 'G4', homeTeam: 'Iran',        awayTeam: 'Australia',   dateUtc: '2026-06-20T19:00:00Z', endDateUtc: '2026-06-20T21:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens',   country: 'USA', round: 'group', group: 'G', matchday: 2 },
  { id: 'G5', homeTeam: 'England',     awayTeam: 'Australia',   dateUtc: '2026-06-25T21:00:00Z', endDateUtc: '2026-06-25T23:00:00Z', venue: 'MetLife Stadium',   city: 'East Rutherford', country: 'USA', round: 'group', group: 'G', matchday: 3 },
  { id: 'G6', homeTeam: 'Iran',        awayTeam: 'South Korea', dateUtc: '2026-06-25T21:00:00Z', endDateUtc: '2026-06-25T23:00:00Z', venue: 'Gillette Stadium',  city: 'Foxborough',      country: 'USA', round: 'group', group: 'G', matchday: 3 },

  // ── GROUP H ──
  { id: 'H1', homeTeam: 'France',    awayTeam: 'Poland',    dateUtc: '2026-06-15T22:00:00Z', endDateUtc: '2026-06-16T00:00:00Z', venue: 'Allegiant Stadium', city: 'Las Vegas',   country: 'USA', round: 'group', group: 'H', matchday: 1 },
  { id: 'H2', homeTeam: 'Indonesia', awayTeam: 'DR Congo',  dateUtc: '2026-06-15T19:00:00Z', endDateUtc: '2026-06-15T21:00:00Z', venue: 'Rose Bowl',         city: 'Pasadena',    country: 'USA', round: 'group', group: 'H', matchday: 1 },
  { id: 'H3', homeTeam: 'France',    awayTeam: 'Indonesia', dateUtc: '2026-06-21T22:00:00Z', endDateUtc: '2026-06-22T00:00:00Z', venue: 'Allegiant Stadium', city: 'Las Vegas',   country: 'USA', round: 'group', group: 'H', matchday: 2 },
  { id: 'H4', homeTeam: 'Poland',    awayTeam: 'DR Congo',  dateUtc: '2026-06-21T19:00:00Z', endDateUtc: '2026-06-21T21:00:00Z', venue: 'AT&T Stadium',      city: 'Arlington',   country: 'USA', round: 'group', group: 'H', matchday: 2 },
  { id: 'H5', homeTeam: 'France',    awayTeam: 'DR Congo',  dateUtc: '2026-06-26T21:00:00Z', endDateUtc: '2026-06-26T23:00:00Z', venue: 'Allegiant Stadium', city: 'Las Vegas',   country: 'USA', round: 'group', group: 'H', matchday: 3 },
  { id: 'H6', homeTeam: 'Poland',    awayTeam: 'Indonesia', dateUtc: '2026-06-26T21:00:00Z', endDateUtc: '2026-06-26T23:00:00Z', venue: "Levi's Stadium",    city: 'Santa Clara', country: 'USA', round: 'group', group: 'H', matchday: 3 },

  // ── GROUP I ──
  { id: 'I1', homeTeam: 'Germany',  awayTeam: 'Denmark',   dateUtc: '2026-06-16T16:00:00Z', endDateUtc: '2026-06-16T18:00:00Z', venue: 'Arrowhead Stadium',       city: 'Kansas City',  country: 'USA', round: 'group', group: 'I', matchday: 1 },
  { id: 'I2', homeTeam: 'Senegal',  awayTeam: 'Colombia',  dateUtc: '2026-06-16T19:00:00Z', endDateUtc: '2026-06-16T21:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', round: 'group', group: 'I', matchday: 1 },
  { id: 'I3', homeTeam: 'Germany',  awayTeam: 'Senegal',   dateUtc: '2026-06-21T19:00:00Z', endDateUtc: '2026-06-21T21:00:00Z', venue: 'AT&T Stadium',            city: 'Arlington',    country: 'USA', round: 'group', group: 'I', matchday: 2 },
  { id: 'I4', homeTeam: 'Denmark',  awayTeam: 'Colombia',  dateUtc: '2026-06-21T22:00:00Z', endDateUtc: '2026-06-22T00:00:00Z', venue: 'Arrowhead Stadium',       city: 'Kansas City',  country: 'USA', round: 'group', group: 'I', matchday: 2 },
  { id: 'I5', homeTeam: 'Germany',  awayTeam: 'Colombia',  dateUtc: '2026-06-26T21:00:00Z', endDateUtc: '2026-06-26T23:00:00Z', venue: 'Arrowhead Stadium',       city: 'Kansas City',  country: 'USA', round: 'group', group: 'I', matchday: 3 },
  { id: 'I6', homeTeam: 'Denmark',  awayTeam: 'Senegal',   dateUtc: '2026-06-26T21:00:00Z', endDateUtc: '2026-06-26T23:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', round: 'group', group: 'I', matchday: 3 },

  // ── GROUP J ──
  { id: 'J1', homeTeam: 'Netherlands', awayTeam: 'Egypt',     dateUtc: '2026-06-16T22:00:00Z', endDateUtc: '2026-06-17T00:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA',    round: 'group', group: 'J', matchday: 1 },
  { id: 'J2', homeTeam: 'Paraguay',    awayTeam: 'Nigeria',   dateUtc: '2026-06-16T19:00:00Z', endDateUtc: '2026-06-16T21:00:00Z', venue: 'BC Place',          city: 'Vancouver',     country: 'Canada', round: 'group', group: 'J', matchday: 1 },
  { id: 'J3', homeTeam: 'Netherlands', awayTeam: 'Paraguay',  dateUtc: '2026-06-22T19:00:00Z', endDateUtc: '2026-06-22T21:00:00Z', venue: 'Rose Bowl',         city: 'Pasadena',      country: 'USA',    round: 'group', group: 'J', matchday: 2 },
  { id: 'J4', homeTeam: 'Egypt',       awayTeam: 'Nigeria',   dateUtc: '2026-06-22T22:00:00Z', endDateUtc: '2026-06-23T00:00:00Z', venue: 'Lincoln Financial', city: 'Philadelphia',  country: 'USA',    round: 'group', group: 'J', matchday: 2 },
  { id: 'J5', homeTeam: 'Netherlands', awayTeam: 'Nigeria',   dateUtc: '2026-06-26T21:00:00Z', endDateUtc: '2026-06-26T23:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA',    round: 'group', group: 'J', matchday: 3 },
  { id: 'J6', homeTeam: 'Egypt',       awayTeam: 'Paraguay',  dateUtc: '2026-06-26T21:00:00Z', endDateUtc: '2026-06-26T23:00:00Z', venue: 'Rose Bowl',         city: 'Pasadena',      country: 'USA',    round: 'group', group: 'J', matchday: 3 },

  // ── GROUP K ──
  { id: 'K1', homeTeam: 'Portugal',     awayTeam: 'Turkey',       dateUtc: '2026-06-17T16:00:00Z', endDateUtc: '2026-06-17T18:00:00Z', venue: 'SoFi Stadium',  city: 'Inglewood',  country: 'USA', round: 'group', group: 'K', matchday: 1 },
  { id: 'K2', homeTeam: 'Ghana',        awayTeam: 'South Africa', dateUtc: '2026-06-17T19:00:00Z', endDateUtc: '2026-06-17T21:00:00Z', venue: 'BMO Field',     city: 'Toronto',    country: 'Canada', round: 'group', group: 'K', matchday: 1 },
  { id: 'K3', homeTeam: 'Portugal',     awayTeam: 'Ghana',        dateUtc: '2026-06-22T19:00:00Z', endDateUtc: '2026-06-22T21:00:00Z', venue: 'SoFi Stadium',  city: 'Inglewood',  country: 'USA', round: 'group', group: 'K', matchday: 2 },
  { id: 'K4', homeTeam: 'Turkey',       awayTeam: 'South Africa', dateUtc: '2026-06-22T22:00:00Z', endDateUtc: '2026-06-23T00:00:00Z', venue: "Levi's Stadium",'city': 'Santa Clara', country: 'USA', round: 'group', group: 'K', matchday: 2 },
  { id: 'K5', homeTeam: 'Portugal',     awayTeam: 'South Africa', dateUtc: '2026-06-26T21:00:00Z', endDateUtc: '2026-06-26T23:00:00Z', venue: 'SoFi Stadium',  city: 'Inglewood',  country: 'USA', round: 'group', group: 'K', matchday: 3 },
  { id: 'K6', homeTeam: 'Ghana',        awayTeam: 'Turkey',       dateUtc: '2026-06-26T21:00:00Z', endDateUtc: '2026-06-26T23:00:00Z', venue: "Levi's Stadium", city: 'Santa Clara', country: 'USA', round: 'group', group: 'K', matchday: 3 },

  // ── GROUP L ──
  { id: 'L1', homeTeam: 'Italy',        awayTeam: 'Austria',      dateUtc: '2026-06-17T22:00:00Z', endDateUtc: '2026-06-18T00:00:00Z', venue: 'Gillette Stadium',  city: 'Foxborough', country: 'USA', round: 'group', group: 'L', matchday: 1 },
  { id: 'L2', homeTeam: 'Saudi Arabia', awayTeam: 'Iraq',         dateUtc: '2026-06-17T19:00:00Z', endDateUtc: '2026-06-17T21:00:00Z', venue: 'MetLife Stadium',   city: 'East Rutherford', country: 'USA', round: 'group', group: 'L', matchday: 1 },
  { id: 'L3', homeTeam: 'Italy',        awayTeam: 'Saudi Arabia', dateUtc: '2026-06-23T22:00:00Z', endDateUtc: '2026-06-24T00:00:00Z', venue: 'Gillette Stadium',  city: 'Foxborough', country: 'USA', round: 'group', group: 'L', matchday: 2 },
  { id: 'L4', homeTeam: 'Austria',      awayTeam: 'Iraq',         dateUtc: '2026-06-23T19:00:00Z', endDateUtc: '2026-06-23T21:00:00Z', venue: 'Lumen Field',       city: 'Seattle',    country: 'USA', round: 'group', group: 'L', matchday: 2 },
  { id: 'L5', homeTeam: 'Italy',        awayTeam: 'Iraq',         dateUtc: '2026-06-26T21:00:00Z', endDateUtc: '2026-06-26T23:00:00Z', venue: 'AT&T Stadium',      city: 'Arlington',  country: 'USA', round: 'group', group: 'L', matchday: 3 },
  { id: 'L6', homeTeam: 'Austria',      awayTeam: 'Saudi Arabia', dateUtc: '2026-06-26T21:00:00Z', endDateUtc: '2026-06-26T23:00:00Z', venue: 'Allegiant Stadium', city: 'Las Vegas',  country: 'USA', round: 'group', group: 'L', matchday: 3 },
]

// ── HELPERS ────────────────────────────────────────────────────────────

export function getMatchesForTeam(teamName: string): Match[] {
  return MATCHES.filter(
    m => m.homeTeam === teamName || m.awayTeam === teamName
  ).sort((a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime())
}

export const ROUND_LABELS: Record<Match['round'], { en: string; es: string }> = {
  group: { en: 'Group Stage',    es: 'Fase de Grupos'       },
  r32:   { en: 'Round of 32',    es: 'Ronda de 32'          },
  r16:   { en: 'Round of 16',    es: 'Octavos de Final'     },
  qf:    { en: 'Quarter-Final',  es: 'Cuartos de Final'     },
  sf:    { en: 'Semi-Final',     es: 'Semifinal'            },
  final: { en: 'Final',          es: 'Final'                },
}
