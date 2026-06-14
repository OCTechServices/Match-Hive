import type { Match, Team } from '@/types'

export interface StandingRow {
  team: Team
  mp: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  gd: number
  pts: number
}

export function computeGroupStandings(
  group: string,
  matches: Match[],
  teams: Team[]
): StandingRow[] {
  const rows: Record<string, StandingRow> = {}
  for (const team of teams.filter((t) => t.group === group)) {
    rows[team.name] = { team, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
  }

  for (const m of matches.filter((m) => m.group === group)) {
    if (m.homeScore == null || m.awayScore == null) continue
    const home = rows[m.homeTeam]
    const away = rows[m.awayTeam]
    if (!home || !away) continue

    home.mp++; away.mp++
    home.gf += m.homeScore; home.ga += m.awayScore; home.gd = home.gf - home.ga
    away.gf += m.awayScore; away.ga += m.homeScore; away.gd = away.gf - away.ga

    if (m.homeScore > m.awayScore) {
      home.w++; home.pts += 3; away.l++
    } else if (m.homeScore < m.awayScore) {
      away.w++; away.pts += 3; home.l++
    } else {
      home.d++; home.pts++; away.d++; away.pts++
    }
  }

  return Object.values(rows).sort(
    (a, b) =>
      b.pts - a.pts ||
      b.gd - a.gd ||
      b.gf - a.gf ||
      a.team.name.localeCompare(b.team.name)
  )
}
