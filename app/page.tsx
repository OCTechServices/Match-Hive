import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import type { Business } from '@/types'

export const revalidate = 120 // refresh venue listings every 2 minutes

async function getBusinesses(): Promise<Business[]> {
  const { data } = await supabase
    .from('businesses')
    .select('*')
    .eq('verified', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

const BUSYNESS_LABEL = ['', 'Usually quiet', 'Light crowd', 'Moderate', 'Busy', 'Packed!']
const BUSYNESS_COLOR = ['', 'text-emerald-400', 'text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400']

export default async function HomePage() {
  const businesses = await getBusinesses()

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-900/30 to-transparent px-4 py-20 text-center">
        <div className="absolute inset-0 pointer-events-none select-none opacity-5 text-[18rem] font-black leading-none flex items-center justify-center">⚽</div>
        <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">
          FIFA World Cup 2026 · June 11 – July 19
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
          Find Your Watch Party
        </h1>
        <p className="text-white/50 text-lg max-w-md mx-auto mb-10">
          Bars, restaurants, and venues showing every match.
          Download your team&apos;s schedule with 15-min reminders.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto px-4 sm:px-0">
          <Link
            href="/schedule"
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 sm:py-3 rounded-full font-semibold transition-colors text-center"
          >
            📅 Team Schedules
          </Link>
          <Link
            href="/bracket"
            className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-6 py-3.5 sm:py-3 rounded-full font-semibold transition-colors text-center"
          >
            🏆 Live Bracket
          </Link>
        </div>
      </section>

      {/* ── Venues ── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Watch Party Venues</h2>
          <Link href="/submit" className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
            + List yours →
          </Link>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-24 border border-white/10 rounded-2xl bg-white/[0.03]">
            <p className="text-5xl mb-5">⚽</p>
            <h3 className="text-xl font-bold mb-2">No venues listed yet</h3>
            <p className="text-white/40 mb-8 max-w-xs mx-auto">
              Be the first to list your bar or restaurant as a watch party destination.
            </p>
            <Link
              href="/submit"
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full font-semibold transition-colors"
            >
              List Your Venue — It&apos;s Free
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b) => (
              <div
                key={b.id}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 hover:border-green-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base leading-tight">{b.name}</h3>
                  {b.busyness > 0 && (
                    <span className={`text-xs font-medium shrink-0 ${BUSYNESS_COLOR[b.busyness]}`}>
                      {BUSYNESS_LABEL[b.busyness]}
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-sm mb-3">
                  {b.address}, {b.city}, {b.state}
                </p>
                {b.promo_text && (
                  <p className="text-green-300 text-sm bg-green-900/30 border border-green-800/40 px-3 py-2 rounded-lg mb-3">
                    🎉 {b.promo_text}
                  </p>
                )}
                <div className="flex gap-4 text-xs text-white/30">
                  {b.instagram && (
                    <a
                      href={`https://instagram.com/${b.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-pink-400 transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {b.twitter && (
                    <a
                      href={`https://twitter.com/${b.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-400 transition-colors"
                    >
                      Twitter/X
                    </a>
                  )}
                  {b.website && (
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
