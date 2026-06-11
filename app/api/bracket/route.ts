// GET /api/bracket
// Returns the live knockout bracket state from Supabase.
// Ordered by round and slot for predictable rendering.
// Called by Lovable frontend — CORS open to all origins.
//
// To update scores/winners: edit rows in the Supabase dashboard
// (bracket_matches table) as matches complete.

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { BracketMatch } from '@/data/bracket'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const ROUND_ORDER = ['r32', 'r16', 'qf', 'sf', '3rd', 'final']

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET() {
  const { data, error } = await supabase
    .from('bracket_matches')
    .select('*')
    .order('slot', { ascending: true })

  if (error) {
    console.error('Supabase bracket fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bracket data' },
      { status: 500, headers: CORS }
    )
  }

  // Group by round, preserve round order
  const grouped = ROUND_ORDER.reduce<Record<string, BracketMatch[]>>((acc, round) => {
    acc[round] = (data as BracketMatch[]).filter(m => m.round === round)
    return acc
  }, {})

  return NextResponse.json(
    { bracket: grouped, updatedAt: new Date().toISOString() },
    { status: 200, headers: { ...CORS, 'Cache-Control': 'public, max-age=60' } }
  )
}
