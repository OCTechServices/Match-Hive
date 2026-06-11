export interface Team {
  name: string
  nameEs: string
  flag: string
  group: string
  confederation: string
}

export interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  dateUtc: string       // ISO 8601 e.g. "2026-06-12T18:00:00Z"
  endDateUtc: string    // dateUtc + 2 hours
  venue: string
  city: string
  country: string
  round: 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'final'
  group?: string        // "A" – "L"
  matchday?: number     // 1 | 2 | 3
}

export interface Business {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone?: string
  instagram?: string
  twitter?: string
  website?: string
  promo_text?: string
  busyness: number      // 1–5
  verified: boolean
  created_at: string
}

export interface Submission {
  id: string
  business_name: string
  contact_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  ein: string
  doc_url?: string
  agreed_to_terms: boolean
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
