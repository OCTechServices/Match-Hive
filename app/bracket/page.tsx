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
  date_utc: string
  venue: string
  city: string
  status: string
  projected_home?: string | null
  projected_away?: string | null
}

interface BracketData {
  bracket: Record<string, BracketMatch[]>
  updatedAt: string
}

const ROUND_CONFIG: { key: string; label: string; cols: string }[] = [
  { key: 'r32',   label: 'Round of 32',  cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
  { key: 'r16',   label: 'Round of 16',  cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
  { key: 'qf',    label: 'Quarterfinals',cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
  { key: 'sf',    label: 'Semifinals',   cols: 'grid-cols-1 sm:grid-cols-2' },
  { key: 'final', label: 'Final',        cols: 'grid-cols-1 max-w-sm' },
  { key: '3rd',   label: '3rd Place',    cols: 'grid-cols-1 max-w-sm' },
]

function formatDateTime(utc: string): string {
  return new Date(utc).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short',
  })
}

function MatchCard({ match }: { match: BracketMatch }) {
  const homeConfirmed = !!match.home_team
  const awayConfirmed = !!match.away_team
  const homeDisplay = match.home_team ?? match.projected_home ?? 'TBD'
  const awayDisplay = match.away_team ?? match.projected_away ?? 'TBD'
  const isHomeProjected = !homeConfirmed && !!match.projected_home
  const isAwayProjected = !awayConfirmed && !!match.projected_away
  const isProjected = !homeConfirmed && !awayConfirmed && (isHomeProjected || isAwayProjected)
  const hasScore = match.home_score !== null && match.away_score !== null

  return (
    <div
      className={`rounded-xl border p-3 transition-colors ${
        homeConfirmed || awayConfirmed
          ? 'bg-white/[0.06] border-green-600/40'
          : isProjected
            ? 'bg-amber-500/[0.04] border-amber-500/30 border-dashed'
            : 'bg-white/[0.03] border-white/8 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`flex items-center gap-1.5 text-sm font-semibold leading-snug ${
          homeConfirmed ? '' : isHomeProjected ? 'text-amber-300/80' : 'text-white/40'
        }`}>
          {flagMap[homeDisplay] && <span className="text-base leading-none">{flagMap[homeDisplay]}</span>}
          {homeDisplay}
        </span>
        {hasScore && (
          <span className={`text-sm font-bold ${match.winner === match.home_team ? 'text-green-400' : 'text-white/40'}`}>
            {match.home_score}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`flex items-center gap-1.5 text-sm font-semibold leading-snug ${
          awayConfirmed ? '' : isAwayProjected ? 'text-amber-300/80' : 'text-white/40'
        }`}>
          {flagMap[awayDisplay] && <span className="text-base leading-none">{flagMap[awayDisplay]}</span>}
          {awayDisplay}
        </span>
        {hasScore && (
          <span className={`text-sm font-bold ${match.winner === match.away_team ? 'text-green-400' : 'text-white/40'}`}>
            {match.away_score}
          </span>
        )}
      </div>
      <p className="text-[11px] text-white/35 leading-snug">
        {formatDateTime(match.date_utc)}
      </p>
      <p className="text-[11px] text-white/25 leading-snug mt-0.5">
        {match.venue}, {match.city}
      </p>
      {isProjected && (
        <p className="text-[10px] text-amber-500/50 font-medium uppercase tracking-wide mt-1.5">
          Projected
        </p>
      )}
    </div>
  )
}

export default function BracketPage() {
  const [data, setData] = useState<BracketData | null>(null)
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

  const hasProjections = (data.bracket['r32'] ?? []).some(
    m => m.projected_home || m.projected_away
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2 font-display uppercase tracking-wide">Knockout Bracket</h1>
        <p className="text-white/50 text-sm">
          Starts June 29 · Teams revealed after group stage ends June 28 ·{' '}
          <span className="text-white/30">
            Updated {new Date(data.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </span>
        </p>
      </div>

      {hasProjections && (
        <div className="mb-8 rounded-lg bg-amber-500/[0.06] border border-amber-500/20 px-4 py-3 text-[12px] text-amber-400/70 leading-relaxed">
          <span className="font-semibold text-amber-400/90">Projected matchups</span> are based on current group standings and will update as matches are played.
          Third-place qualifier slots and later rounds shown once confirmed. Subject to change.
        </div>
      )}

      {ROUND_CONFIG.map(({ key, label, cols }) => {
        const matches = data.bracket[key]
        if (!matches || matches.length === 0) return null
        return (
          <section key={key} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-green-400">{label}</h2>
              <div className="flex-1 h-px bg-white/10" />
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
  )
}
