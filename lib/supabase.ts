import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client — safe to use in browser and server components for public reads
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client — server-side only (API routes, Server Actions)
// Never expose SUPABASE_SERVICE_ROLE_KEY to the client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
