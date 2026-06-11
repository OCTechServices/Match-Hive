// POST /api/submit
// Accepts business opt-in form submissions.
// Writes to the submissions table (status: pending).
// File upload (EIN doc) handled separately via Supabase Storage from Lovable.
// Called by Lovable frontend — CORS open to all origins.

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400, headers: CORS }
    )
  }

  const required = [
    'business_name', 'contact_name', 'email',
    'phone', 'address', 'city', 'state', 'zip',
    'ein', 'agreed_to_terms',
  ]

  const missing = required.filter(field => !body[field])
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}` },
      { status: 422, headers: CORS }
    )
  }

  if (!body.agreed_to_terms) {
    return NextResponse.json(
      { error: 'Must agree to terms of service' },
      { status: 422, headers: CORS }
    )
  }

  const { error } = await supabaseAdmin.from('submissions').insert({
    business_name: body.business_name,
    contact_name: body.contact_name,
    email: body.email,
    phone: body.phone,
    address: body.address,
    city: body.city,
    state: body.state,
    zip: body.zip,
    ein: body.ein,
    doc_url: body.doc_url ?? null,
    agreed_to_terms: true,
    status: 'pending',
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500, headers: CORS }
    )
  }

  return NextResponse.json(
    { success: true, message: 'Application received. You will be contacted within 24 hours.' },
    { status: 201, headers: CORS }
  )
}
