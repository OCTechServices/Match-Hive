// GET /api/bracket
// Returns the final knockout bracket — WC2026 concluded July 19, 2026.
// Data served from static JSON (frozen from Supabase at decommission).
// Scores corrected for 4 penalty-shootout matches (M74, M75, M88, M96).
// Called by Lovable frontend — CORS open to all origins.

import { NextResponse } from 'next/server'
import type { BracketMatch } from '@/data/bracket'
import BRACKET_STATIC from '@/data/bracket-static.json'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const ROUND_ORDER = ['r32', 'r16', 'qf', 'sf', '3rd', 'final']

const grouped = ROUND_ORDER.reduce<Record<string, BracketMatch[]>>((acc, round) => {
  acc[round] = (BRACKET_STATIC as BracketMatch[])
    .filter(m => m.round === round)
    .sort((a, b) => a.slot - b.slot)
  return acc
}, {})

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET() {
  return NextResponse.json(
    { bracket: grouped, updatedAt: '2026-07-19T22:00:00.000Z' },
    { status: 200, headers: { ...CORS, 'Cache-Control': 'public, max-age=86400' } }
  )
}
