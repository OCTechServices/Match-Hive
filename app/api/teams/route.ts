// GET /api/teams
// Returns all 48 WC 2026 teams for use in the Lovable team picker dropdown.

import { NextResponse } from 'next/server'
import { TEAMS } from '@/data/wc2026'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET() {
  return NextResponse.json(
    { teams: TEAMS },
    {
      status: 200,
      headers: { ...CORS, 'Cache-Control': 'public, max-age=86400' },
    }
  )
}
