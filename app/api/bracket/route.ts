// GET /api/bracket
// Returns the live knockout bracket state from Supabase.
// R32 slots with null teams are enriched with projections from live group standings.
// Ordered by round and slot for predictable rendering.
// Called by Lovable frontend — CORS open to all origins.
//
// To update scores/winners: edit rows in the Supabase dashboard
// (bracket_matches table) as matches complete.

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { BracketMatch } from '@/data/bracket'
import { R32_SEEDING } from '@/lib/bracket-seeding'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const ROUND_ORDER = ['r32', 'r16', 'qf', 'sf', '3rd', 'final']

const FD_NAME_MAP: Record<string, string> = {
  'United States': 'USA',
  'Korea Republic': 'South Korea',
  "Côte d'Ivoire": 'Ivory Coast',
  'Türkiye': 'Turkiye',
  'Turkey': 'Turkiye',
  'Bosnia-Herzegovina': 'Bosnia and Herzegovina',
  'Bosnia & Herzegovina': 'Bosnia and Herzegovina',
  'Cape Verde Islands': 'Cape Verde',
  'Congo DR': 'DR Congo',
}

// Returns { 'A': ['Argentina', 'Chile', ...], 'B': [...], ... }
// Index 0 = 1st place, 1 = 2nd place. Fails silently → returns {}.
async function fetchProjections(): Promise<Record<string, string[]>> {
  const key = process.env.FOOTBALL_DATA_API_KEY
  if (!key) return {}
  try {
    const res = await fetch(
      'https://api.football-data.org/v4/competitions/WC/standings',
      { headers: { 'X-Auth-Token': key }, next: { revalidate: 300 } }
    )
    if (!res.ok) return {}
    const json = await res.json()
    const out: Record<string, string[]> = {}
    for (const g of (json.standings ?? []) as Array<{ type: string; group: string; table: Array<{ team: { name: string } }> }>) {
      if (g.type !== 'TOTAL') continue
      const letter = g.group.replace('GROUP_', '')
      out[letter] = g.table.map(row => FD_NAME_MAP[row.team.name] ?? row.team.name)
    }
    return out
  } catch {
    return {}
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET() {
  const [{ data, error }, projections] = await Promise.all([
    supabase.from('bracket_matches').select('*').order('slot', { ascending: true }),
    fetchProjections(),
  ])

  if (error) {
    console.error('Supabase bracket fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bracket data' },
      { status: 500, headers: CORS }
    )
  }

  // Enrich R32 null slots with projected teams from current standings
  const enriched = (data as BracketMatch[]).map(match => {
    if (match.round !== 'r32') return match
    if (match.home_team && match.away_team) return match
    const seeding = R32_SEEDING[match.id]
    if (!seeding) return match
    const proj = (seed: typeof seeding.home) =>
      seed.kind === 'group' ? (projections[seed.group]?.[seed.place - 1] ?? null) : null
    return {
      ...match,
      projected_home: !match.home_team ? proj(seeding.home) : null,
      projected_away: !match.away_team ? proj(seeding.away) : null,
    }
  })

  // Group by round, preserve round order
  const grouped = ROUND_ORDER.reduce<Record<string, BracketMatch[]>>((acc, round) => {
    acc[round] = enriched.filter(m => m.round === round)
    return acc
  }, {})

  return NextResponse.json(
    { bracket: grouped, updatedAt: new Date().toISOString() },
    { status: 200, headers: { ...CORS, 'Cache-Control': 'public, max-age=60' } }
  )
}
