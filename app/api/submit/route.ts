// POST /api/submit
// Venue submission endpoint — decommissioned with WC2026 (July 19, 2026).
// Returns 410 Gone. Database has been shut down.

import { NextResponse } from 'next/server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST() {
  return NextResponse.json(
    { error: 'This service has been decommissioned. FIFA World Cup 2026 concluded July 19, 2026.' },
    { status: 410, headers: CORS }
  )
}
