// GET /api/ics?team=USA
// Returns a .ics calendar file for all group-stage matches of the requested team.
// Includes a 15-minute VALARM reminder on each match.
// Called by Lovable frontend — CORS open to all origins.

import { NextRequest, NextResponse } from 'next/server'
import { createEvents } from 'ics'
import type { EventAttributes } from 'ics'
import { getMatchesForTeam, getTeam, ROUND_LABELS } from '@/data/wc2026'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(request: NextRequest) {
  const team = request.nextUrl.searchParams.get('team')?.trim()

  if (!team) {
    return NextResponse.json(
      { error: 'Missing required query param: team' },
      { status: 400, headers: CORS }
    )
  }

  const teamData = getTeam(team)
  if (!teamData) {
    return NextResponse.json(
      { error: `Team not found: "${team}". Use the exact team name from /api/teams.` },
      { status: 404, headers: CORS }
    )
  }

  const matches = getMatchesForTeam(team)
  if (matches.length === 0) {
    return NextResponse.json(
      { error: `No matches found for team: "${team}"` },
      { status: 404, headers: CORS }
    )
  }

  const events: EventAttributes[] = matches.map((match) => {
    const start = new Date(match.dateUtc)
    const end = new Date(match.endDateUtc)

    const roundLabel = ROUND_LABELS[match.round]?.en ?? match.round
    const groupLabel = match.group ? ` — Group ${match.group}` : ''
    const matchday = match.matchday ? `, Matchday ${match.matchday}` : ''

    return {
      uid: `wps-${match.id}@watch-party-sphere`,
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
      title: `${match.homeTeam} vs ${match.awayTeam} — FIFA World Cup 2026`,
      description: `${roundLabel}${groupLabel}${matchday}\nVenue: ${match.venue}, ${match.city}, ${match.country}\n\nFind a watch party near you: https://match-hive.vercel.app`,
      location: `${match.venue}, ${match.city}, ${match.country}`,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      alarms: [
        {
          action: 'display',
          description: `Kickoff in 15 minutes: ${match.homeTeam} vs ${match.awayTeam}`,
          trigger: { minutes: 15, before: true },
        },
      ],
    }
  })

  const { error, value } = createEvents(events)

  if (error || !value) {
    console.error('ICS generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate ICS file' },
      { status: 500, headers: CORS }
    )
  }

  const safeTeamName = team.replace(/[^a-zA-Z0-9-_]/g, '-')

  return new NextResponse(value, {
    status: 200,
    headers: {
      ...CORS,
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeTeamName}-wc2026.ics"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
