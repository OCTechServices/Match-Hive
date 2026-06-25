import type { Metadata } from 'next'
import { TEAMS, MATCHES } from '@/data/wc2026'
import { supabase } from '@/lib/supabase'
import { R32_SEEDING, type SeedRef } from '@/lib/bracket-seeding'
import { computeGroupStandings } from '@/lib/standings'
import type { BracketMatch } from '@/data/bracket'
import type { Match } from '@/types'
import BracketView from '@/components/BracketView'

export const metadata: Metadata = {
  title: 'Match-Hive — FIFA World Cup 2026 Knockout Bracket',
  description: 'Live FIFA World Cup 2026 knockout bracket. Track the clear path and projected path to the Final.',
}

// Dynamic rendering — avoids build-time API rate-limit failures during
// concurrent static generation. The fetch below still caches for 300s.
export const revalidate = 0

// ── Team name normalisation (matches schedule page) ──────────────────────
const FD_NAME_MAP: Record<string, string> = {
  'United States':        'USA',
  'Korea Republic':       'South Korea',
  "Côte d'Ivoire":        'Ivory Coast',
  'Türkiye':              'Turkiye',
  'Turkey':               'Turkiye',
  'Bosnia-Herzegovina':   'Bosnia and Herzegovina',
  'Bosnia & Herzegovina': 'Bosnia and Herzegovina',
  'Cape Verde Islands':   'Cape Verde',
  'Congo DR':             'DR Congo',
  'Czech Republic':       'Czechia',
}

// ── Projections — uses matches endpoint (shared cache with schedule page) ─
async function fetchProjections(): Promise<Record<string, string[]>> {
  const key = process.env.FOOTBALL_DATA_API_KEY
  if (!key) return {}
  try {
    const res = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches',
      { headers: { 'X-Auth-Token': key }, next: { revalidate: 300 } }
    )
    if (!res.ok) return {}
    const json = await res.json()

    const scoreMap: Record<string, { home: number; away: number }> = {}
    for (const m of json.matches ?? []) {
      if (m.status !== 'FINISHED') continue
      const h = m.score?.fullTime?.home
      const a = m.score?.fullTime?.away
      if (h == null || a == null) continue
      const hn = FD_NAME_MAP[m.homeTeam?.name] ?? m.homeTeam?.name ?? ''
      const an = FD_NAME_MAP[m.awayTeam?.name] ?? m.awayTeam?.name ?? ''
      if (hn && an) {
        scoreMap[`${hn}|${an}`] = { home: h, away: a }
        scoreMap[`${an}|${hn}`] = { home: a, away: h }
      }
    }

    const enrichedMatches: Match[] = MATCHES.map(m => {
      const score = scoreMap[`${m.homeTeam}|${m.awayTeam}`]
      return score ? { ...m, homeScore: score.home, awayScore: score.away } : m
    })

    const out: Record<string, string[]> = {}
    for (const g of ['A','B','C','D','E','F','G','H','I','J','K','L']) {
      const rows = computeGroupStandings(g, enrichedMatches, TEAMS)
      if (rows.length > 0) out[g] = rows.map(r => r.team.name)
    }
    return out
  } catch {
    return {}
  }
}

// ── Page ─────────────────────────────────────────────────────────────────
export default async function BracketPage() {
  const [{ data, error }, projections] = await Promise.all([
    supabase.from('bracket_matches').select('*').order('slot', { ascending: true }),
    fetchProjections(),
  ])

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-64 text-white/40 text-sm">
        Failed to load bracket data. Please refresh.
      </div>
    )
  }

  // Enrich R32 slots with live projection data
  function resolveProjection(seed: SeedRef): string | null {
    if (seed.kind === 'group') return projections[seed.group]?.[seed.place - 1] ?? null
    return null  // best3rd: can't project until group stage ends
  }

  const enriched = (data as BracketMatch[]).map(match => {
    if (match.round !== 'r32') return match
    if (match.home_team && match.away_team) return match
    const seeding = R32_SEEDING[match.id]
    if (!seeding) return match
    return {
      ...match,
      projected_home: !match.home_team ? resolveProjection(seeding.home) : null,
      projected_away: !match.away_team ? resolveProjection(seeding.away) : null,
    }
  })

  return <BracketView matches={enriched} />
}
