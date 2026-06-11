// =====================================================================
// FIFA WORLD CUP 2026 — SCHEDULE DATA
// =====================================================================
// Source: NBC Sports / FIFA official schedule (verified 2026-06-11)
// All kickoff times converted from ET (EDT = UTC-4) to UTC.
// endDateUtc = dateUtc + 2 hours (standard match block)
// =====================================================================

import type { Team, Match } from '@/types'

// ── TEAMS ──────────────────────────────────────────────────────────────

export const TEAMS: Team[] = [
  // Group A
  { name: 'Mexico',                  nameEs: 'México',                  flag: '🇲🇽', group: 'A', confederation: 'CONCACAF' },
  { name: 'South Africa',            nameEs: 'Sudáfrica',               flag: '🇿🇦', group: 'A', confederation: 'CAF'      },
  { name: 'South Korea',             nameEs: 'Corea del Sur',           flag: '🇰🇷', group: 'A', confederation: 'AFC'      },
  { name: 'Czechia',                 nameEs: 'República Checa',         flag: '🇨🇿', group: 'A', confederation: 'UEFA'     },
  // Group B
  { name: 'Canada',                  nameEs: 'Canadá',                  flag: '🇨🇦', group: 'B', confederation: 'CONCACAF' },
  { name: 'Bosnia and Herzegovina',  nameEs: 'Bosnia y Herzegovina',    flag: '🇧🇦', group: 'B', confederation: 'UEFA'     },
  { name: 'Qatar',                   nameEs: 'Catar',                   flag: '🇶🇦', group: 'B', confederation: 'AFC'      },
  { name: 'Switzerland',             nameEs: 'Suiza',                   flag: '🇨🇭', group: 'B', confederation: 'UEFA'     },
  // Group C
  { name: 'Brazil',                  nameEs: 'Brasil',                  flag: '🇧🇷', group: 'C', confederation: 'CONMEBOL' },
  { name: 'Morocco',                 nameEs: 'Marruecos',               flag: '🇲🇦', group: 'C', confederation: 'CAF'      },
  { name: 'Haiti',                   nameEs: 'Haití',                   flag: '🇭🇹', group: 'C', confederation: 'CONCACAF' },
  { name: 'Scotland',                nameEs: 'Escocia',                 flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C', confederation: 'UEFA'     },
  // Group D
  { name: 'USA',                     nameEs: 'Estados Unidos',          flag: '🇺🇸', group: 'D', confederation: 'CONCACAF' },
  { name: 'Paraguay',                nameEs: 'Paraguay',                flag: '🇵🇾', group: 'D', confederation: 'CONMEBOL' },
  { name: 'Australia',               nameEs: 'Australia',               flag: '🇦🇺', group: 'D', confederation: 'AFC'      },
  { name: 'Turkiye',                 nameEs: 'Turquía',                 flag: '🇹🇷', group: 'D', confederation: 'UEFA'     },
  // Group E
  { name: 'Germany',                 nameEs: 'Alemania',                flag: '🇩🇪', group: 'E', confederation: 'UEFA'     },
  { name: 'Curacao',                 nameEs: 'Curazao',                 flag: '🇨🇼', group: 'E', confederation: 'CONCACAF' },
  { name: 'Ivory Coast',             nameEs: 'Costa de Marfil',         flag: '🇨🇮', group: 'E', confederation: 'CAF'      },
  { name: 'Ecuador',                 nameEs: 'Ecuador',                 flag: '🇪🇨', group: 'E', confederation: 'CONMEBOL' },
  // Group F
  { name: 'Netherlands',             nameEs: 'Países Bajos',            flag: '🇳🇱', group: 'F', confederation: 'UEFA'     },
  { name: 'Japan',                   nameEs: 'Japón',                   flag: '🇯🇵', group: 'F', confederation: 'AFC'      },
  { name: 'Sweden',                  nameEs: 'Suecia',                  flag: '🇸🇪', group: 'F', confederation: 'UEFA'     },
  { name: 'Tunisia',                 nameEs: 'Túnez',                   flag: '🇹🇳', group: 'F', confederation: 'CAF'      },
  // Group G
  { name: 'Belgium',                 nameEs: 'Bélgica',                 flag: '🇧🇪', group: 'G', confederation: 'UEFA'     },
  { name: 'Egypt',                   nameEs: 'Egipto',                  flag: '🇪🇬', group: 'G', confederation: 'CAF'      },
  { name: 'Iran',                    nameEs: 'Irán',                    flag: '🇮🇷', group: 'G', confederation: 'AFC'      },
  { name: 'New Zealand',             nameEs: 'Nueva Zelanda',           flag: '🇳🇿', group: 'G', confederation: 'OFC'      },
  // Group H
  { name: 'Spain',                   nameEs: 'España',                  flag: '🇪🇸', group: 'H', confederation: 'UEFA'     },
  { name: 'Cape Verde',              nameEs: 'Cabo Verde',              flag: '🇨🇻', group: 'H', confederation: 'CAF'      },
  { name: 'Saudi Arabia',            nameEs: 'Arabia Saudita',          flag: '🇸🇦', group: 'H', confederation: 'AFC'      },
  { name: 'Uruguay',                 nameEs: 'Uruguay',                 flag: '🇺🇾', group: 'H', confederation: 'CONMEBOL' },
  // Group I
  { name: 'France',                  nameEs: 'Francia',                 flag: '🇫🇷', group: 'I', confederation: 'UEFA'     },
  { name: 'Senegal',                 nameEs: 'Senegal',                 flag: '🇸🇳', group: 'I', confederation: 'CAF'      },
  { name: 'Iraq',                    nameEs: 'Irak',                    flag: '🇮🇶', group: 'I', confederation: 'AFC'      },
  { name: 'Norway',                  nameEs: 'Noruega',                 flag: '🇳🇴', group: 'I', confederation: 'UEFA'     },
  // Group J
  { name: 'Argentina',               nameEs: 'Argentina',               flag: '🇦🇷', group: 'J', confederation: 'CONMEBOL' },
  { name: 'Algeria',                 nameEs: 'Argelia',                 flag: '🇩🇿', group: 'J', confederation: 'CAF'      },
  { name: 'Austria',                 nameEs: 'Austria',                 flag: '🇦🇹', group: 'J', confederation: 'UEFA'     },
  { name: 'Jordan',                  nameEs: 'Jordania',                flag: '🇯🇴', group: 'J', confederation: 'AFC'      },
  // Group K
  { name: 'Portugal',                nameEs: 'Portugal',                flag: '🇵🇹', group: 'K', confederation: 'UEFA'     },
  { name: 'DR Congo',                nameEs: 'Rep. Dem. del Congo',     flag: '🇨🇩', group: 'K', confederation: 'CAF'      },
  { name: 'Uzbekistan',              nameEs: 'Uzbekistán',              flag: '🇺🇿', group: 'K', confederation: 'AFC'      },
  { name: 'Colombia',                nameEs: 'Colombia',                flag: '🇨🇴', group: 'K', confederation: 'CONMEBOL' },
  // Group L
  { name: 'England',                 nameEs: 'Inglaterra',              flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L', confederation: 'UEFA'     },
  { name: 'Croatia',                 nameEs: 'Croacia',                 flag: '🇭🇷', group: 'L', confederation: 'UEFA'     },
  { name: 'Ghana',                   nameEs: 'Ghana',                   flag: '🇬🇭', group: 'L', confederation: 'CAF'      },
  { name: 'Panama',                  nameEs: 'Panamá',                  flag: '🇵🇦', group: 'L', confederation: 'CONCACAF' },
]

export const TEAM_NAMES = TEAMS.map(t => t.name).sort()

export function getTeam(name: string): Team | undefined {
  return TEAMS.find(t => t.name === name)
}

// ── MATCHES ────────────────────────────────────────────────────────────
// All times converted from ET (EDT = UTC-4) to UTC.
// Late ET times (10pm, 12am) reflect West Coast / Mexico evening kickoffs.

export const MATCHES: Match[] = [

  // ── GROUP A — Mexico · South Africa · South Korea · Czechia ──────────
  // Md1: June 11 3pm ET → 19:00 UTC | June 11 10pm ET → June 12 02:00 UTC
  // Md2: June 18 12pm ET → 16:00 UTC | June 18 9pm ET → June 19 01:00 UTC
  // Md3: June 24 9pm ET → June 25 01:00 UTC (simultaneous)
  { id: 'A1', homeTeam: 'Mexico',       awayTeam: 'South Africa', dateUtc: '2026-06-11T19:00:00Z', endDateUtc: '2026-06-11T21:00:00Z', venue: 'Estadio Azteca',        city: 'Mexico City',     country: 'Mexico', round: 'group', group: 'A', matchday: 1 },
  { id: 'A2', homeTeam: 'South Korea',  awayTeam: 'Czechia',      dateUtc: '2026-06-12T02:00:00Z', endDateUtc: '2026-06-12T04:00:00Z', venue: 'Estadio Akron',         city: 'Guadalajara',     country: 'Mexico', round: 'group', group: 'A', matchday: 1 },
  { id: 'A3', homeTeam: 'Czechia',      awayTeam: 'South Africa', dateUtc: '2026-06-18T16:00:00Z', endDateUtc: '2026-06-18T18:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',         country: 'USA',    round: 'group', group: 'A', matchday: 2 },
  { id: 'A4', homeTeam: 'Mexico',       awayTeam: 'South Korea',  dateUtc: '2026-06-19T01:00:00Z', endDateUtc: '2026-06-19T03:00:00Z', venue: 'Estadio Akron',         city: 'Guadalajara',     country: 'Mexico', round: 'group', group: 'A', matchday: 2 },
  { id: 'A5', homeTeam: 'Czechia',      awayTeam: 'Mexico',       dateUtc: '2026-06-25T01:00:00Z', endDateUtc: '2026-06-25T03:00:00Z', venue: 'Estadio Azteca',        city: 'Mexico City',     country: 'Mexico', round: 'group', group: 'A', matchday: 3 },
  { id: 'A6', homeTeam: 'South Africa', awayTeam: 'South Korea',  dateUtc: '2026-06-25T01:00:00Z', endDateUtc: '2026-06-25T03:00:00Z', venue: 'Estadio BBVA',          city: 'Monterrey',       country: 'Mexico', round: 'group', group: 'A', matchday: 3 },

  // ── GROUP B — Canada · Bosnia and Herzegovina · Qatar · Switzerland ──
  // Md1: June 12 3pm ET → 19:00 UTC | June 13 3pm ET → 19:00 UTC
  // Md2: June 18 3pm ET → 19:00 UTC | June 18 6pm ET → 22:00 UTC
  // Md3: June 24 3pm ET → 19:00 UTC (simultaneous)
  { id: 'B1', homeTeam: 'Canada',                 awayTeam: 'Bosnia and Herzegovina', dateUtc: '2026-06-12T19:00:00Z', endDateUtc: '2026-06-12T21:00:00Z', venue: 'BMO Field',             city: 'Toronto',         country: 'Canada', round: 'group', group: 'B', matchday: 1 },
  { id: 'B2', homeTeam: 'Qatar',                  awayTeam: 'Switzerland',            dateUtc: '2026-06-13T19:00:00Z', endDateUtc: '2026-06-13T21:00:00Z', venue: "Levi's Stadium",        city: 'Santa Clara',     country: 'USA',    round: 'group', group: 'B', matchday: 1 },
  { id: 'B3', homeTeam: 'Switzerland',            awayTeam: 'Bosnia and Herzegovina', dateUtc: '2026-06-18T19:00:00Z', endDateUtc: '2026-06-18T21:00:00Z', venue: 'SoFi Stadium',          city: 'Inglewood',       country: 'USA',    round: 'group', group: 'B', matchday: 2 },
  { id: 'B4', homeTeam: 'Canada',                 awayTeam: 'Qatar',                  dateUtc: '2026-06-18T22:00:00Z', endDateUtc: '2026-06-19T00:00:00Z', venue: 'BC Place',              city: 'Vancouver',       country: 'Canada', round: 'group', group: 'B', matchday: 2 },
  { id: 'B5', homeTeam: 'Switzerland',            awayTeam: 'Canada',                 dateUtc: '2026-06-24T19:00:00Z', endDateUtc: '2026-06-24T21:00:00Z', venue: 'BC Place',              city: 'Vancouver',       country: 'Canada', round: 'group', group: 'B', matchday: 3 },
  { id: 'B6', homeTeam: 'Bosnia and Herzegovina', awayTeam: 'Qatar',                  dateUtc: '2026-06-24T19:00:00Z', endDateUtc: '2026-06-24T21:00:00Z', venue: 'Lumen Field',           city: 'Seattle',         country: 'USA',    round: 'group', group: 'B', matchday: 3 },

  // ── GROUP C — Brazil · Morocco · Haiti · Scotland ────────────────────
  // Md1: June 13 6pm ET → 22:00 UTC | June 13 9pm ET → June 14 01:00 UTC
  // Md2: June 19 6pm ET → 22:00 UTC | June 19 9pm ET → June 20 01:00 UTC
  // Md3: June 24 6pm ET → 22:00 UTC (simultaneous)
  { id: 'C1', homeTeam: 'Brazil',   awayTeam: 'Morocco',  dateUtc: '2026-06-13T22:00:00Z', endDateUtc: '2026-06-14T00:00:00Z', venue: 'MetLife Stadium',         city: 'East Rutherford', country: 'USA', round: 'group', group: 'C', matchday: 1 },
  { id: 'C2', homeTeam: 'Haiti',    awayTeam: 'Scotland', dateUtc: '2026-06-14T01:00:00Z', endDateUtc: '2026-06-14T03:00:00Z', venue: 'Gillette Stadium',        city: 'Foxborough',      country: 'USA', round: 'group', group: 'C', matchday: 1 },
  { id: 'C3', homeTeam: 'Scotland', awayTeam: 'Morocco',  dateUtc: '2026-06-19T22:00:00Z', endDateUtc: '2026-06-20T00:00:00Z', venue: 'Gillette Stadium',        city: 'Foxborough',      country: 'USA', round: 'group', group: 'C', matchday: 2 },
  { id: 'C4', homeTeam: 'Brazil',   awayTeam: 'Haiti',    dateUtc: '2026-06-20T01:00:00Z', endDateUtc: '2026-06-20T03:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia',    country: 'USA', round: 'group', group: 'C', matchday: 2 },
  { id: 'C5', homeTeam: 'Scotland', awayTeam: 'Brazil',   dateUtc: '2026-06-24T22:00:00Z', endDateUtc: '2026-06-25T00:00:00Z', venue: 'Hard Rock Stadium',       city: 'Miami Gardens',   country: 'USA', round: 'group', group: 'C', matchday: 3 },
  { id: 'C6', homeTeam: 'Morocco',  awayTeam: 'Haiti',    dateUtc: '2026-06-24T22:00:00Z', endDateUtc: '2026-06-25T00:00:00Z', venue: 'Mercedes-Benz Stadium',   city: 'Atlanta',         country: 'USA', round: 'group', group: 'C', matchday: 3 },

  // ── GROUP D — USA · Paraguay · Australia · Turkiye ───────────────────
  // Md1: June 12 9pm ET → June 13 01:00 UTC | June 13 12am ET → June 13 04:00 UTC
  //       (12am ET = 9pm PT at BC Place, Vancouver)
  // Md2: June 19 3pm ET → 19:00 UTC | June 19 12am ET → June 19 04:00 UTC
  //       (June 19 12am ET = June 18 9pm PT at Levi's Stadium)
  // Md3: June 25 10pm ET → June 26 02:00 UTC (simultaneous)
  { id: 'D1', homeTeam: 'USA',       awayTeam: 'Paraguay',  dateUtc: '2026-06-13T01:00:00Z', endDateUtc: '2026-06-13T03:00:00Z', venue: 'SoFi Stadium',   city: 'Inglewood',   country: 'USA',    round: 'group', group: 'D', matchday: 1 },
  { id: 'D2', homeTeam: 'Australia', awayTeam: 'Turkiye',   dateUtc: '2026-06-13T04:00:00Z', endDateUtc: '2026-06-13T06:00:00Z', venue: 'BC Place',       city: 'Vancouver',   country: 'Canada', round: 'group', group: 'D', matchday: 1 },
  { id: 'D3', homeTeam: 'USA',       awayTeam: 'Australia', dateUtc: '2026-06-19T19:00:00Z', endDateUtc: '2026-06-19T21:00:00Z', venue: 'Lumen Field',    city: 'Seattle',     country: 'USA',    round: 'group', group: 'D', matchday: 2 },
  { id: 'D4', homeTeam: 'Turkiye',   awayTeam: 'Paraguay',  dateUtc: '2026-06-19T04:00:00Z', endDateUtc: '2026-06-19T06:00:00Z', venue: "Levi's Stadium", city: 'Santa Clara', country: 'USA',    round: 'group', group: 'D', matchday: 2 },
  { id: 'D5', homeTeam: 'Turkiye',   awayTeam: 'USA',       dateUtc: '2026-06-26T02:00:00Z', endDateUtc: '2026-06-26T04:00:00Z', venue: 'SoFi Stadium',   city: 'Inglewood',   country: 'USA',    round: 'group', group: 'D', matchday: 3 },
  { id: 'D6', homeTeam: 'Paraguay',  awayTeam: 'Australia', dateUtc: '2026-06-26T02:00:00Z', endDateUtc: '2026-06-26T04:00:00Z', venue: "Levi's Stadium", city: 'Santa Clara', country: 'USA',    round: 'group', group: 'D', matchday: 3 },

  // ── GROUP E — Germany · Curacao · Ivory Coast · Ecuador ──────────────
  // Md1: June 14 1pm ET → 17:00 UTC | June 14 7pm ET → 23:00 UTC
  // Md2: June 20 4pm ET → 20:00 UTC | June 20 8pm ET → June 21 00:00 UTC
  // Md3: June 25 4pm ET → 20:00 UTC (simultaneous)
  { id: 'E1', homeTeam: 'Germany',     awayTeam: 'Curacao',     dateUtc: '2026-06-14T17:00:00Z', endDateUtc: '2026-06-14T19:00:00Z', venue: 'NRG Stadium',             city: 'Houston',         country: 'USA',    round: 'group', group: 'E', matchday: 1 },
  { id: 'E2', homeTeam: 'Ivory Coast', awayTeam: 'Ecuador',     dateUtc: '2026-06-14T23:00:00Z', endDateUtc: '2026-06-15T01:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia',    country: 'USA',    round: 'group', group: 'E', matchday: 1 },
  { id: 'E3', homeTeam: 'Germany',     awayTeam: 'Ivory Coast', dateUtc: '2026-06-20T20:00:00Z', endDateUtc: '2026-06-20T22:00:00Z', venue: 'BMO Field',               city: 'Toronto',         country: 'Canada', round: 'group', group: 'E', matchday: 2 },
  { id: 'E4', homeTeam: 'Ecuador',     awayTeam: 'Curacao',     dateUtc: '2026-06-21T00:00:00Z', endDateUtc: '2026-06-21T02:00:00Z', venue: 'Arrowhead Stadium',       city: 'Kansas City',     country: 'USA',    round: 'group', group: 'E', matchday: 2 },
  { id: 'E5', homeTeam: 'Ecuador',     awayTeam: 'Germany',     dateUtc: '2026-06-25T20:00:00Z', endDateUtc: '2026-06-25T22:00:00Z', venue: 'MetLife Stadium',         city: 'East Rutherford', country: 'USA',    round: 'group', group: 'E', matchday: 3 },
  { id: 'E6', homeTeam: 'Curacao',     awayTeam: 'Ivory Coast', dateUtc: '2026-06-25T20:00:00Z', endDateUtc: '2026-06-25T22:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia',    country: 'USA',    round: 'group', group: 'E', matchday: 3 },

  // ── GROUP F — Netherlands · Japan · Sweden · Tunisia ─────────────────
  // Md1: June 14 4pm ET → 20:00 UTC | June 14 10pm ET → June 15 02:00 UTC
  // Md2: June 20 1pm ET → 17:00 UTC | June 20 12am ET → June 20 04:00 UTC
  //       (June 20 12am ET = June 19 11pm CDT in Monterrey)
  // Md3: June 25 7pm ET → 23:00 UTC (simultaneous)
  { id: 'F1', homeTeam: 'Netherlands', awayTeam: 'Japan',       dateUtc: '2026-06-14T20:00:00Z', endDateUtc: '2026-06-14T22:00:00Z', venue: 'AT&T Stadium',   city: 'Arlington',   country: 'USA',    round: 'group', group: 'F', matchday: 1 },
  { id: 'F2', homeTeam: 'Sweden',      awayTeam: 'Tunisia',     dateUtc: '2026-06-15T02:00:00Z', endDateUtc: '2026-06-15T04:00:00Z', venue: 'Estadio BBVA',   city: 'Monterrey',   country: 'Mexico', round: 'group', group: 'F', matchday: 1 },
  { id: 'F3', homeTeam: 'Netherlands', awayTeam: 'Sweden',      dateUtc: '2026-06-20T17:00:00Z', endDateUtc: '2026-06-20T19:00:00Z', venue: 'NRG Stadium',    city: 'Houston',     country: 'USA',    round: 'group', group: 'F', matchday: 2 },
  { id: 'F4', homeTeam: 'Tunisia',     awayTeam: 'Japan',       dateUtc: '2026-06-20T04:00:00Z', endDateUtc: '2026-06-20T06:00:00Z', venue: 'Estadio BBVA',   city: 'Monterrey',   country: 'Mexico', round: 'group', group: 'F', matchday: 2 },
  { id: 'F5', homeTeam: 'Japan',       awayTeam: 'Sweden',      dateUtc: '2026-06-25T23:00:00Z', endDateUtc: '2026-06-26T01:00:00Z', venue: 'AT&T Stadium',   city: 'Arlington',   country: 'USA',    round: 'group', group: 'F', matchday: 3 },
  { id: 'F6', homeTeam: 'Tunisia',     awayTeam: 'Netherlands', dateUtc: '2026-06-25T23:00:00Z', endDateUtc: '2026-06-26T01:00:00Z', venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', round: 'group', group: 'F', matchday: 3 },

  // ── GROUP G — Belgium · Egypt · Iran · New Zealand ───────────────────
  // Md1: June 15 3pm ET → 19:00 UTC | June 15 9pm ET → June 16 01:00 UTC
  // Md2: June 21 3pm ET → 19:00 UTC | June 21 9pm ET → June 22 01:00 UTC
  // Md3: June 26 11pm ET → June 27 03:00 UTC (simultaneous)
  { id: 'G1', homeTeam: 'Belgium',     awayTeam: 'Egypt',       dateUtc: '2026-06-15T19:00:00Z', endDateUtc: '2026-06-15T21:00:00Z', venue: 'Lumen Field', city: 'Seattle',   country: 'USA',    round: 'group', group: 'G', matchday: 1 },
  { id: 'G2', homeTeam: 'Iran',        awayTeam: 'New Zealand', dateUtc: '2026-06-16T01:00:00Z', endDateUtc: '2026-06-16T03:00:00Z', venue: 'SoFi Stadium', city: 'Inglewood', country: 'USA',    round: 'group', group: 'G', matchday: 1 },
  { id: 'G3', homeTeam: 'Belgium',     awayTeam: 'Iran',        dateUtc: '2026-06-21T19:00:00Z', endDateUtc: '2026-06-21T21:00:00Z', venue: 'SoFi Stadium', city: 'Inglewood', country: 'USA',    round: 'group', group: 'G', matchday: 2 },
  { id: 'G4', homeTeam: 'New Zealand', awayTeam: 'Egypt',       dateUtc: '2026-06-22T01:00:00Z', endDateUtc: '2026-06-22T03:00:00Z', venue: 'BC Place',    city: 'Vancouver', country: 'Canada', round: 'group', group: 'G', matchday: 2 },
  { id: 'G5', homeTeam: 'Egypt',       awayTeam: 'Iran',        dateUtc: '2026-06-27T03:00:00Z', endDateUtc: '2026-06-27T05:00:00Z', venue: 'Lumen Field', city: 'Seattle',   country: 'USA',    round: 'group', group: 'G', matchday: 3 },
  { id: 'G6', homeTeam: 'New Zealand', awayTeam: 'Belgium',     dateUtc: '2026-06-27T03:00:00Z', endDateUtc: '2026-06-27T05:00:00Z', venue: 'BC Place',    city: 'Vancouver', country: 'Canada', round: 'group', group: 'G', matchday: 3 },

  // ── GROUP H — Spain · Cape Verde · Saudi Arabia · Uruguay ────────────
  // Md1: June 15 12pm ET → 16:00 UTC | June 15 6pm ET → 22:00 UTC
  // Md2: June 21 12pm ET → 16:00 UTC | June 21 6pm ET → 22:00 UTC
  // Md3: June 26 8pm ET → June 27 00:00 UTC (simultaneous)
  { id: 'H1', homeTeam: 'Spain',        awayTeam: 'Cape Verde',   dateUtc: '2026-06-15T16:00:00Z', endDateUtc: '2026-06-15T18:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',       country: 'USA',    round: 'group', group: 'H', matchday: 1 },
  { id: 'H2', homeTeam: 'Saudi Arabia', awayTeam: 'Uruguay',      dateUtc: '2026-06-15T22:00:00Z', endDateUtc: '2026-06-16T00:00:00Z', venue: 'Hard Rock Stadium',     city: 'Miami Gardens', country: 'USA',    round: 'group', group: 'H', matchday: 1 },
  { id: 'H3', homeTeam: 'Spain',        awayTeam: 'Saudi Arabia', dateUtc: '2026-06-21T16:00:00Z', endDateUtc: '2026-06-21T18:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',       country: 'USA',    round: 'group', group: 'H', matchday: 2 },
  { id: 'H4', homeTeam: 'Uruguay',      awayTeam: 'Cape Verde',   dateUtc: '2026-06-21T22:00:00Z', endDateUtc: '2026-06-22T00:00:00Z', venue: 'Hard Rock Stadium',     city: 'Miami Gardens', country: 'USA',    round: 'group', group: 'H', matchday: 2 },
  { id: 'H5', homeTeam: 'Cape Verde',   awayTeam: 'Saudi Arabia', dateUtc: '2026-06-27T00:00:00Z', endDateUtc: '2026-06-27T02:00:00Z', venue: 'NRG Stadium',           city: 'Houston',       country: 'USA',    round: 'group', group: 'H', matchday: 3 },
  { id: 'H6', homeTeam: 'Uruguay',      awayTeam: 'Spain',        dateUtc: '2026-06-27T00:00:00Z', endDateUtc: '2026-06-27T02:00:00Z', venue: 'Estadio Akron',         city: 'Guadalajara',   country: 'Mexico', round: 'group', group: 'H', matchday: 3 },

  // ── GROUP I — France · Senegal · Iraq · Norway ───────────────────────
  // Md1: June 16 3pm ET → 19:00 UTC | June 16 6pm ET → 22:00 UTC
  // Md2: June 22 5pm ET → 21:00 UTC | June 22 8pm ET → June 23 00:00 UTC
  // Md3: June 26 3pm ET → 19:00 UTC (simultaneous)
  { id: 'I1', homeTeam: 'France',  awayTeam: 'Senegal', dateUtc: '2026-06-16T19:00:00Z', endDateUtc: '2026-06-16T21:00:00Z', venue: 'MetLife Stadium',         city: 'East Rutherford', country: 'USA',    round: 'group', group: 'I', matchday: 1 },
  { id: 'I2', homeTeam: 'Iraq',    awayTeam: 'Norway',  dateUtc: '2026-06-16T22:00:00Z', endDateUtc: '2026-06-17T00:00:00Z', venue: 'Gillette Stadium',        city: 'Foxborough',      country: 'USA',    round: 'group', group: 'I', matchday: 1 },
  { id: 'I3', homeTeam: 'France',  awayTeam: 'Iraq',    dateUtc: '2026-06-22T21:00:00Z', endDateUtc: '2026-06-22T23:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia',    country: 'USA',    round: 'group', group: 'I', matchday: 2 },
  { id: 'I4', homeTeam: 'Norway',  awayTeam: 'Senegal', dateUtc: '2026-06-23T00:00:00Z', endDateUtc: '2026-06-23T02:00:00Z', venue: 'MetLife Stadium',         city: 'East Rutherford', country: 'USA',    round: 'group', group: 'I', matchday: 2 },
  { id: 'I5', homeTeam: 'Norway',  awayTeam: 'France',  dateUtc: '2026-06-26T19:00:00Z', endDateUtc: '2026-06-26T21:00:00Z', venue: 'Gillette Stadium',        city: 'Foxborough',      country: 'USA',    round: 'group', group: 'I', matchday: 3 },
  { id: 'I6', homeTeam: 'Senegal', awayTeam: 'Iraq',    dateUtc: '2026-06-26T19:00:00Z', endDateUtc: '2026-06-26T21:00:00Z', venue: 'BMO Field',               city: 'Toronto',         country: 'Canada', round: 'group', group: 'I', matchday: 3 },

  // ── GROUP J — Argentina · Algeria · Austria · Jordan ─────────────────
  // Md1: June 16 12am ET → June 16 04:00 UTC (= June 15 9pm PT at Levi's)
  //       June 16 9pm ET → June 17 01:00 UTC
  // Md2: June 22 1pm ET → 17:00 UTC | June 22 11pm ET → June 23 03:00 UTC
  // Md3: June 27 10pm ET → June 28 02:00 UTC (simultaneous)
  { id: 'J1', homeTeam: 'Austria',    awayTeam: 'Jordan',   dateUtc: '2026-06-16T04:00:00Z', endDateUtc: '2026-06-16T06:00:00Z', venue: "Levi's Stadium",  city: 'Santa Clara',  country: 'USA', round: 'group', group: 'J', matchday: 1 },
  { id: 'J2', homeTeam: 'Argentina',  awayTeam: 'Algeria',  dateUtc: '2026-06-17T01:00:00Z', endDateUtc: '2026-06-17T03:00:00Z', venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', round: 'group', group: 'J', matchday: 1 },
  { id: 'J3', homeTeam: 'Argentina',  awayTeam: 'Austria',  dateUtc: '2026-06-22T17:00:00Z', endDateUtc: '2026-06-22T19:00:00Z', venue: 'AT&T Stadium',    city: 'Arlington',    country: 'USA', round: 'group', group: 'J', matchday: 2 },
  { id: 'J4', homeTeam: 'Jordan',     awayTeam: 'Algeria',  dateUtc: '2026-06-23T03:00:00Z', endDateUtc: '2026-06-23T05:00:00Z', venue: "Levi's Stadium",  city: 'Santa Clara',  country: 'USA', round: 'group', group: 'J', matchday: 2 },
  { id: 'J5', homeTeam: 'Algeria',    awayTeam: 'Austria',  dateUtc: '2026-06-28T02:00:00Z', endDateUtc: '2026-06-28T04:00:00Z', venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', round: 'group', group: 'J', matchday: 3 },
  { id: 'J6', homeTeam: 'Jordan',     awayTeam: 'Argentina',dateUtc: '2026-06-28T02:00:00Z', endDateUtc: '2026-06-28T04:00:00Z', venue: 'AT&T Stadium',    city: 'Arlington',    country: 'USA', round: 'group', group: 'J', matchday: 3 },

  // ── GROUP K — Portugal · DR Congo · Uzbekistan · Colombia ────────────
  // Md1: June 17 1pm ET → 17:00 UTC | June 17 10pm ET → June 18 02:00 UTC
  // Md2: June 23 1pm ET → 17:00 UTC | June 23 10pm ET → June 24 02:00 UTC
  // Md3: June 27 7:30pm ET → 23:30 UTC (simultaneous)
  { id: 'K1', homeTeam: 'Portugal',   awayTeam: 'DR Congo',   dateUtc: '2026-06-17T17:00:00Z', endDateUtc: '2026-06-17T19:00:00Z', venue: 'NRG Stadium',           city: 'Houston',       country: 'USA',    round: 'group', group: 'K', matchday: 1 },
  { id: 'K2', homeTeam: 'Uzbekistan', awayTeam: 'Colombia',   dateUtc: '2026-06-18T02:00:00Z', endDateUtc: '2026-06-18T04:00:00Z', venue: 'Estadio Azteca',        city: 'Mexico City',   country: 'Mexico', round: 'group', group: 'K', matchday: 1 },
  { id: 'K3', homeTeam: 'Portugal',   awayTeam: 'Uzbekistan', dateUtc: '2026-06-23T17:00:00Z', endDateUtc: '2026-06-23T19:00:00Z', venue: 'NRG Stadium',           city: 'Houston',       country: 'USA',    round: 'group', group: 'K', matchday: 2 },
  { id: 'K4', homeTeam: 'Colombia',   awayTeam: 'DR Congo',   dateUtc: '2026-06-24T02:00:00Z', endDateUtc: '2026-06-24T04:00:00Z', venue: 'Estadio Akron',         city: 'Guadalajara',   country: 'Mexico', round: 'group', group: 'K', matchday: 2 },
  { id: 'K5', homeTeam: 'Colombia',   awayTeam: 'Portugal',   dateUtc: '2026-06-27T23:30:00Z', endDateUtc: '2026-06-28T01:30:00Z', venue: 'Hard Rock Stadium',     city: 'Miami Gardens', country: 'USA',    round: 'group', group: 'K', matchday: 3 },
  { id: 'K6', homeTeam: 'DR Congo',   awayTeam: 'Uzbekistan', dateUtc: '2026-06-27T23:30:00Z', endDateUtc: '2026-06-28T01:30:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',       country: 'USA',    round: 'group', group: 'K', matchday: 3 },

  // ── GROUP L — England · Croatia · Ghana · Panama ──────────────────────
  // Md1: June 17 4pm ET → 20:00 UTC | June 17 7pm ET → 23:00 UTC
  // Md2: June 23 4pm ET → 20:00 UTC | June 23 7pm ET → 23:00 UTC
  // Md3: June 27 5pm ET → 21:00 UTC (simultaneous)
  { id: 'L1', homeTeam: 'England', awayTeam: 'Croatia', dateUtc: '2026-06-17T20:00:00Z', endDateUtc: '2026-06-17T22:00:00Z', venue: 'AT&T Stadium',            city: 'Arlington',       country: 'USA',    round: 'group', group: 'L', matchday: 1 },
  { id: 'L2', homeTeam: 'Ghana',   awayTeam: 'Panama',  dateUtc: '2026-06-17T23:00:00Z', endDateUtc: '2026-06-18T01:00:00Z', venue: 'BMO Field',               city: 'Toronto',         country: 'Canada', round: 'group', group: 'L', matchday: 1 },
  { id: 'L3', homeTeam: 'England', awayTeam: 'Ghana',   dateUtc: '2026-06-23T20:00:00Z', endDateUtc: '2026-06-23T22:00:00Z', venue: 'Gillette Stadium',        city: 'Foxborough',      country: 'USA',    round: 'group', group: 'L', matchday: 2 },
  { id: 'L4', homeTeam: 'Panama',  awayTeam: 'Croatia', dateUtc: '2026-06-23T23:00:00Z', endDateUtc: '2026-06-24T01:00:00Z', venue: 'BMO Field',               city: 'Toronto',         country: 'Canada', round: 'group', group: 'L', matchday: 2 },
  { id: 'L5', homeTeam: 'Panama',  awayTeam: 'England', dateUtc: '2026-06-27T21:00:00Z', endDateUtc: '2026-06-27T23:00:00Z', venue: 'MetLife Stadium',         city: 'East Rutherford', country: 'USA',    round: 'group', group: 'L', matchday: 3 },
  { id: 'L6', homeTeam: 'Croatia', awayTeam: 'Ghana',   dateUtc: '2026-06-27T21:00:00Z', endDateUtc: '2026-06-27T23:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia',    country: 'USA',    round: 'group', group: 'L', matchday: 3 },

]

// ── HELPERS ────────────────────────────────────────────────────────────

export function getMatchesForTeam(teamName: string): Match[] {
  return MATCHES.filter(
    m => m.homeTeam === teamName || m.awayTeam === teamName
  ).sort((a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime())
}

export const ROUND_LABELS: Record<Match['round'], { en: string; es: string }> = {
  group: { en: 'Group Stage',   es: 'Fase de Grupos'   },
  r32:   { en: 'Round of 32',   es: 'Ronda de 32'      },
  r16:   { en: 'Round of 16',   es: 'Octavos de Final' },
  qf:    { en: 'Quarter-Final', es: 'Cuartos de Final' },
  sf:    { en: 'Semi-Final',    es: 'Semifinal'        },
  final: { en: 'Final',         es: 'Final'            },
}
