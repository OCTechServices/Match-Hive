'use client'

import { useEffect, useState } from 'react'
import { TEAMS } from '@/data/wc2026'

const flagMap = Object.fromEntries(TEAMS.map(t => [t.name, t.flag]))

interface BracketMatch {
  id: string
  round: string
  slot: number
  home_team: string | null
  away_team: string | null
  home_score: number | null
  away_score: number | null
  winner: string | null
  date_utc: string | null
  venue: string | null
  city: string | null
  status: string
  projected_home?: string | null
  projected_away?: string | null
}

interface BracketData {
  bracket: Record<string, BracketMatch[]>
  updatedAt: string
}

const ROUND_CONFIG = [
  { key: 'r32',   label: 'Round of 32',   cols: 'grid-cols-1 sm:grid-cols-2' },
  { key: 'r16',   label: 'Round of 16',   cols: 'grid-cols-1 sm:grid-cols-2' },
  { key: 'qf',    label: 'Quarterfinals', cols: 'grid-cols-1 sm:grid-cols-2' },
  { key: 'sf',    label: 'Semifinals',    cols: 'grid-cols-1 sm:grid-cols-2' },
  { key: 'final', label: 'Final',         cols: 'grid-cols-1 max-w-lg mx-auto' },
  { key: '3rd',   label: 'Third Place',   cols: 'grid-cols-1 max-w-lg mx-auto' },
]

function formatDate(utc: string): string {
  return new Date(utc).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  })
}

function MatchCard({ match }: { match: BracketMatch }) {
  const homeConfirmed = !!match.home_team
  const awayConfirmed = !!match.away_team
  const homeDisplay  = match.home_team ?? match.projected_home ?? null
  const awayDisplay  = match.away_team ?? match.projected_away ?? null
  const homeIsProjected = !homeConfirmed && !!match.projected_home
  const awayIsProjected = !awayConfirmed && !!match.projected_away
  const isFullyConfirmed = homeConfirmed && awayConfirmed
  const hasAnyProjection = homeIsProjected || awayIsProjected

  const hasScore = match.home_score !== null && match.away_score !== null
  const isLive    = match.status === 'live'
  const homeIsLoser = hasScore && !!match.winner && match.winner !== match.home_team
  const awayIsLoser = hasScore && !!match.winner && match.winner !== match.away_team

  const cardStyles = isLive
    ? 'bg-green-500/[0.05] border border-green-400/40 shadow-[0_0_24px_rgba(74,222,128,0.08)]'
    : isFullyConfirmed
      ? 'bg-white/[0.06] border border-white/15 hover:bg-white/[0.08] hover:border-white/20'
      : hasAnyProjection
        ? 'bg-amber-500/[0.04] border border-dashed border-amber-400/25 hover:bg-amber-500/[0.06]'
        : 'bg-white/[0.02] border border-white/6 opacity-50'

  return (
    <div className={`rounded-2xl px-5 py-4 transition-colors ${cardStyles}`}>

      {/* Teams row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-3">

        {/* Home */}
        <div className={`flex flex-col items-center gap-1.5 text-center transition-opacity ${homeIsLoser ? 'opacity-35' : ''}`}>
          <span className={`text-4xl sm:text-5xl leading-none ${!homeDisplay ? 'opacity-[0.12]' : ''}`}>
            {homeDisplay ? (flagMap[homeDisplay] ?? '🏳') : '🏳'}
          </span>
          <span className={`text-xs sm:text-sm font-semibold leading-tight ${
            homeConfirmed   ? 'text-white' :
            homeIsProjected ? 'text-amber-300/70' :
                              'text-white/20'
          }`}>
            {homeDisplay ?? 'TBD'}
          </span>
          {homeIsProjected && (
            <span className="text-[9px] font-medium text-amber-400/50 uppercase tracking-wider leading-none">
              maybe
            </span>
          )}
        </div>

        {/* Center */}
        <div className="flex flex-col items-center gap-1.5 min-w-[52px]">
          {isLive ? (
            <>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-green-400">
                {match.home_score} – {match.away_score}
              </span>
              <span className="text-[9px] font-bold text-green-400 uppercase tracking-wide animate-pulse">LIVE</span>
            </>
          ) : hasScore ? (
            <>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                {match.home_score} – {match.away_score}
              </span>
              <span className="text-[9px] font-semibold text-white/25 uppercase tracking-wide">FT</span>
            </>
          ) : (
            <span className={`text-[11px] font-bold uppercase tracking-widest ${
              hasAnyProjection ? 'text-amber-500/30' : 'text-white/[0.12]'
            }`}>vs</span>
          )}
        </div>

        {/* Away */}
        <div className={`flex flex-col items-center gap-1.5 text-center transition-opacity ${awayIsLoser ? 'opacity-35' : ''}`}>
          <span className={`text-4xl sm:text-5xl leading-none ${!awayDisplay ? 'opacity-[0.12]' : ''}`}>
            {awayDisplay ? (flagMap[awayDisplay] ?? '🏳') : '🏳'}
          </span>
          <span className={`text-xs sm:text-sm font-semibold leading-tight ${
            awayConfirmed   ? 'text-white' :
            awayIsProjected ? 'text-amber-300/70' :
                              'text-white/20'
          }`}>
            {awayDisplay ?? 'TBD'}
          </span>
          {awayIsProjected && (
            <span className="text-[9px] font-medium text-amber-400/50 uppercase tracking-wider leading-none">
              maybe
            </span>
          )}
        </div>

      </div>

      {/* Meta row */}
      {match.date_utc && (
        <div className="flex items-center justify-center gap-2 text-[10px] text-white/25 border-t border-white/[0.06] pt-2.5">
          <span className="font-medium">{formatDate(match.date_utc)}</span>
          {match.city && (
            <>
              <span>·</span>
              <span>{match.city}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function BracketPage() {
  const [data, setData]   = useState<BracketData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/bracket')
      .then((r) => {
        if (!r.ok) throw new Error('Failed')
        return r.json()
      })
      .then(setData)
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64 text-white/40 text-sm">
        Failed to load bracket data. Please refresh.
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-64 text-white/40 text-sm animate-pulse">
        Loading bracket...
      </div>
    )
  }

  const hasProjections = Object.values(data.bracket).flat().some(
    m => m.projected_home || m.projected_away
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2 font-display uppercase tracking-wide">Knockout Bracket</h1>
        <p className="text-white/40 text-sm">
          Starts June 29 · 32 teams, one trophy
        </p>
      </div>

      {/* Legend */}
      {hasProjections && (
        <div className="flex items-center gap-6 mb-10 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-3 rounded border border-white/20 bg-white/[0.06]" />
            <span className="text-white/40">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-3 rounded border border-dashed border-amber-400/35 bg-amber-500/[0.04]" />
            <span className="text-amber-400/50">Projected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-3 rounded border border-white/8 bg-white/[0.02]" />
            <span className="text-white/20">TBD</span>
          </div>
        </div>
      )}

      {/* Rounds */}
      <div className="space-y-12">
        {ROUND_CONFIG.map(({ key, label, cols }) => {
          const matches = data.bracket[key]
          if (!matches || matches.length === 0) return null
          const isFinal = key === 'final'
          return (
            <section key={key}>
              <div className="flex items-center gap-3 mb-5">
                <h2 className={`text-xs font-bold uppercase tracking-widest ${isFinal ? 'text-amber-400' : 'text-green-400'}`}>
                  {label}
                </h2>
                <div className="flex-1 h-px bg-white/10" />
                {!isFinal && (
                  <span className="text-[10px] text-white/20">
                    {matches.length} match{matches.length !== 1 ? 'es' : ''}
                  </span>
                )}
              </div>
              <div className={`grid gap-3 ${cols}`}>
                {matches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <p className="text-center text-[11px] text-white/[0.15] mt-12">
        Updated {new Date(data.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
      </p>
    </div>
  )
}
