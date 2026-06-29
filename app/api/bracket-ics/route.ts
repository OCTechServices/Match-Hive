// GET /api/bracket-ics?match=M86
// Returns a single .ics file for one knockout bracket match.
// Date/venue are always fixed. Team names are whatever is currently known (may be TBD).

import { NextRequest, NextResponse } from 'next/server'
import { createEvents } from 'ics'
import type { EventAttributes } from 'ics'
import { supabase } from '@/lib/supabase'

const ROUND_LABELS: Record<string, string> = {
  r32:   'Round of 32',
  r16:   'Round of 16',
  qf:    'Quarter-Final',
  sf:    'Semi-Final',
  '3rd': 'Third Place',
  final: 'Final',
}

export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get('match')?.trim().toUpperCase()

  if (!matchId) {
    return NextResponse.json({ error: 'Missing required query param: match' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('bracket_matches')
    .select('*')
    .eq('id', matchId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: `Match not found: ${matchId}` }, { status: 404 })
  }

  if (!data.date_utc) {
    return NextResponse.json({ error: 'Match date not available' }, { status: 404 })
  }

  const home = (data.home_team as string | null) ?? 'TBD'
  const away = (data.away_team as string | null) ?? 'TBD'
  const roundLabel = ROUND_LABELS[data.round as string] ?? (data.round as string)
  const venue = (data.venue as string | null) ?? ''
  const city  = (data.city  as string | null) ?? ''

  const start = new Date(data.date_utc as string)
  const end   = new Date(start.getTime() + 2 * 60 * 60 * 1000) // +2 h

  const event: EventAttributes = {
    uid: `mh-${matchId}@match-hive`,
    start: [
      start.getUTCFullYear(),
      start.getUTCMonth() + 1,
      start.getUTCDate(),
      start.getUTCHours(),
      start.getUTCMinutes(),
    ] as [number, number, number, number, number],
    startInputType: 'utc',
    end: [
      end.getUTCFullYear(),
      end.getUTCMonth() + 1,
      end.getUTCDate(),
      end.getUTCHours(),
      end.getUTCMinutes(),
    ] as [number, number, number, number, number],
    endInputType: 'utc',
    title: `${home} vs ${away} — FIFA World Cup 2026`,
    description: `${roundLabel}\nVenue: ${[venue, city].filter(Boolean).join(', ')}\n\nWatch parties & schedule: https://match-hive.vercel.app`,
    location: [venue, city].filter(Boolean).join(', '),
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    alarms: [
      {
        action: 'display',
        description: `Kickoff soon: ${home} vs ${away}`,
        trigger: { minutes: 15, before: true },
      },
      {
        action: 'display',
        description: `Kickoff in 5 min: ${home} vs ${away}`,
        trigger: { minutes: 5, before: true },
      },
    ],
  }

  const { error: icsError, value } = createEvents([event])

  if (icsError || !value) {
    console.error('ICS generation error:', icsError)
    return NextResponse.json({ error: 'ICS generation failed' }, { status: 500 })
  }

  return new NextResponse(value, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${matchId}-wc2026.ics"`,
      'Cache-Control': 'public, max-age=300',
    },
  })
}
