'use client'

import { useState, useEffect, useRef } from 'react'
import type { Team, Match } from '@/types'

interface Props {
  featured: Team[]
  others: Team[]
  matchesByTeam: Record<string, Match[]>
}

function fmt(utc: string, type: 'date' | 'time'): string {
  if (type === 'date') {
    return new Date(utc).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York',
    })
  }
  return new Date(utc).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit',
    timeZone: 'America/New_York', timeZoneName: 'short',
  })
}

export default function TeamPicker({ featured, others, matchesByTeam }: Props) {
  const [selected, setSelected] = useState<Team | null>(null)
  const [showAll, setShowAll] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const displayedTeams = showAll ? [...featured, ...others] : featured
  const matches = selected ? (matchesByTeam[selected.name] ?? []) : []

  function toggle(team: Team) {
    setSelected((prev) => (prev?.name === team.name ? null : team))
  }

  useEffect(() => {
    if (selected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selected])

  return (
    <section className="mb-14">

      {/* Prompt */}
      <div className="mb-7">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display uppercase">
          Who are you rooting for?
        </h2>
        <p className="text-white/40 text-sm mt-1">
          Tap your team — we&apos;ll save the schedule straight to your calendar.
        </p>
      </div>

      {/* Flag grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 mb-4">
        {displayedTeams.map((team) => {
          const isSelected = selected?.name === team.name
          return (
            <button
              key={team.name}
              onClick={() => toggle(team)}
              aria-label={team.name}
              aria-pressed={isSelected}
              className={`
                flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-150
                active:scale-90 focus:outline-none
                ${isSelected
                  ? 'border-green-400/80 bg-green-900/40 shadow-[0_0_16px_rgba(74,222,128,0.18)]'
                  : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                }
              `}
            >
              <span className="text-[2.2rem] leading-none">{team.flag}</span>
              <span className={`text-[10px] font-medium text-center leading-tight transition-colors ${isSelected ? 'text-green-300' : 'text-white/50'}`}>
                {team.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* See all teams */}
      {!showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-sm text-white/35 hover:text-white/60 transition-colors mb-6 block"
        >
          Not seeing your team? View all 48 →
        </button>
      )}

      {/* Selected team schedule */}
      {selected && (
        <div ref={cardRef} className="mt-6 scroll-mt-20 bg-white/[0.04] border border-green-500/25 rounded-2xl overflow-hidden">

          {/* Team header */}
          <div className="flex items-center gap-4 px-5 py-5 border-b border-white/10">
            <span className="text-5xl leading-none">{selected.flag}</span>
            <div>
              <h3 className="text-xl font-bold">{selected.name}</h3>
              <p className="text-white/40 text-sm mt-0.5">Group {selected.group} · 3 matches</p>
            </div>
          </div>

          {/* Matches */}
          <div className="divide-y divide-white/5">
            {matches.map((m, i) => {
              const opponent = m.homeTeam === selected.name ? m.awayTeam : m.homeTeam
              const isHome = m.homeTeam === selected.name
              return (
                <div key={m.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="text-xs font-bold text-white/25 w-5 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">
                      {isHome ? 'vs' : '@'}{' '}
                      <span className="text-white">{opponent}</span>
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {fmt(m.dateUtc, 'date')} · {fmt(m.dateUtc, 'time')}
                    </p>
                    <p className="text-xs text-white/25 mt-0.5">{m.city}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="px-5 py-5 border-t border-white/10">
            <a
              href={`/api/ics?team=${encodeURIComponent(selected.name)}`}
              download
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white font-bold text-base py-4 rounded-xl transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 17l4 4 4-4M12 12v9"/>
                <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"/>
              </svg>
              Save to My Calendar
            </a>
            <p className="text-[11px] text-white/30 text-center mt-2">
              Includes 15-min and 5-min reminders before each kickoff
            </p>
          </div>

        </div>
      )}

    </section>
  )
}
