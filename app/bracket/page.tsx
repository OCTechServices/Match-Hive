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

// ── Layout constants (px) ───────────────────────────────────────────────
const CARD_H   = 64
const CARD_W   = 172
const SLOT_GAP = 10
const CONN_W   = 44
const SLOT_H   = CARD_H + SLOT_GAP   // 74 — base slot unit for R32
const LABEL_H  = 28                   // height reserved for round label

type PathState = 'confirmed' | 'projected' | 'tbd'

function matchPathState(m: BracketMatch): PathState {
  if (m.winner || (m.home_team && m.away_team)) return 'confirmed'
  if (m.projected_home || m.projected_away) return 'projected'
  return 'tbd'
}

function pathColor(s: PathState): string {
  if (s === 'confirmed') return '#4ade80'
  if (s === 'projected') return '#fbbf24'
  return 'rgba(255,255,255,0.07)'
}

// ── TeamRow ─────────────────────────────────────────────────────────────
function TeamRow({ name, isConfirmed, isProjected, isWinner, isLoser, score }: {
  name: string | null
  isConfirmed: boolean
  isProjected: boolean
  isWinner: boolean
  isLoser: boolean
  score: number | null
}) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2 transition-opacity ${isLoser ? 'opacity-25' : ''}`}
      style={{ height: CARD_H / 2 }}
    >
      <span className={`text-base leading-none shrink-0 ${!name ? 'opacity-[0.12]' : ''}`}>
        {name ? (flagMap[name] ?? '🏳') : '🏳'}
      </span>
      <span className={`flex-1 text-[11px] font-semibold truncate ${
        isConfirmed
          ? isWinner ? 'text-white' : 'text-white/65'
          : isProjected
            ? 'text-amber-300/65'
            : 'text-white/[0.18]'
      }`}>
        {name ?? 'TBD'}
      </span>
      {score !== null && (
        <span className={`text-[11px] font-bold tabular-nums shrink-0 ${
          isWinner ? 'text-green-400' : 'text-white/35'
        }`}>
          {score}
        </span>
      )}
    </div>
  )
}

// ── MatchNode ────────────────────────────────────────────────────────────
function MatchNode({ match }: { match: BracketMatch }) {
  const hC = !!match.home_team, aC = !!match.away_team
  const hP = !hC && !!match.projected_home, aP = !aC && !!match.projected_away
  const hD = match.home_team ?? match.projected_home ?? null
  const aD = match.away_team ?? match.projected_away ?? null
  const isLive    = match.status === 'live'
  const hasScore  = match.home_score !== null && match.away_score !== null
  const bothConf  = hC && aC
  const hasProj   = hP || aP

  const border = isLive
    ? '1px solid #4ade80'
    : bothConf
      ? '1px solid rgba(255,255,255,0.13)'
      : hasProj
        ? '1px dashed rgba(251,191,36,0.28)'
        : '1px solid rgba(255,255,255,0.05)'

  const bg = isLive
    ? 'rgba(74,222,128,0.05)'
    : bothConf
      ? 'rgba(255,255,255,0.05)'
      : hasProj
        ? 'rgba(251,191,36,0.03)'
        : 'rgba(255,255,255,0.015)'

  return (
    <div style={{
      width: CARD_W, height: CARD_H,
      border, background: bg,
      borderRadius: 12, overflow: 'hidden', position: 'relative', flexShrink: 0,
      boxShadow: isLive ? '0 0 14px rgba(74,222,128,0.22)' : 'none',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <TeamRow
            name={hD} isConfirmed={hC} isProjected={hP}
            isWinner={!!match.winner && match.winner === match.home_team}
            isLoser={!!match.winner && !!match.home_team && match.winner !== match.home_team}
            score={hasScore ? match.home_score : null}
          />
        </div>
        <div style={{ flex: 1 }}>
          <TeamRow
            name={aD} isConfirmed={aC} isProjected={aP}
            isWinner={!!match.winner && match.winner === match.away_team}
            isLoser={!!match.winner && !!match.away_team && match.winner !== match.away_team}
            score={hasScore ? match.away_score : null}
          />
        </div>
      </div>
      {isLive && (
        <span className="animate-pulse" style={{
          position: 'absolute', top: 3, right: 5,
          fontSize: 8, fontWeight: 700, color: '#4ade80', letterSpacing: '0.06em',
        }}>LIVE</span>
      )}
    </div>
  )
}

// ── ConnectorColumn ──────────────────────────────────────────────────────
// Draws the branching lines between two adjacent rounds.
// Each unit covers 2 input slots → 1 output slot.
function ConnectorColumn({ count, unitH, inputSlotH, states }: {
  count: number
  unitH: number
  inputSlotH: number
  states: PathState[]
}) {
  return (
    <div style={{ width: CONN_W, flexShrink: 0 }}>
      {/* Spacer matching the round label height */}
      <div style={{ height: LABEL_H }} />

      {Array.from({ length: count }, (_, i) => {
        const state = states[i] ?? 'tbd'
        const color = pathColor(state)
        const glow  = state === 'confirmed' ? `0 0 6px ${color}` : 'none'
        const arm   = CONN_W / 2
        // Y positions of the two input card centers within this unit
        const topY  = inputSlotH / 2 - 0.5
        const botY  = unitH - inputSlotH / 2 - 0.5
        const midY  = unitH / 2 - 0.5

        return (
          <div
            key={i}
            className={state === 'projected' ? 'animate-pulse' : ''}
            style={{ position: 'relative', height: unitH, width: CONN_W }}
          >
            {/* Top arm — horizontal from left edge to center */}
            <div style={{
              position: 'absolute', top: topY, left: 0,
              width: arm, height: 1, background: color, boxShadow: glow,
            }} />
            {/* Bottom arm */}
            <div style={{
              position: 'absolute', top: botY, left: 0,
              width: arm, height: 1, background: color, boxShadow: glow,
            }} />
            {/* Vertical bar connecting the two arms */}
            <div style={{
              position: 'absolute', top: topY, left: arm - 0.5,
              width: 1, height: botY - topY + 1, background: color, boxShadow: glow,
            }} />
            {/* Output arm — horizontal from center to right edge */}
            <div style={{
              position: 'absolute', top: midY, left: arm,
              width: arm, height: 1, background: color, boxShadow: glow,
            }} />
          </div>
        )
      })}
    </div>
  )
}

// ── RoundColumn ──────────────────────────────────────────────────────────
function RoundColumn({ label, matches, slotH, isFinal = false }: {
  label: string
  matches: BracketMatch[]
  slotH: number
  isFinal?: boolean
}) {
  return (
    <div style={{ width: CARD_W, flexShrink: 0 }}>
      <p className={`text-[9px] font-bold uppercase tracking-widest text-center ${
        isFinal ? 'text-amber-400' : 'text-green-400/60'
      }`} style={{ height: LABEL_H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {label}
      </p>
      <div>
        {matches.map(m => (
          <div key={m.id} style={{ height: slotH, display: 'flex', alignItems: 'center' }}>
            <MatchNode match={m} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function BracketPage() {
  const [data, setData]   = useState<BracketData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/bracket')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setData)
      .catch(() => setError(true))
  }, [])

  if (error) return (
    <div className="flex items-center justify-center min-h-64 text-white/40 text-sm">
      Failed to load bracket data. Please refresh.
    </div>
  )
  if (!data) return (
    <div className="flex items-center justify-center min-h-64 text-white/40 text-sm animate-pulse">
      Loading bracket...
    </div>
  )

  const rounds = data.bracket
  const bySlot = (arr: BracketMatch[]) => [...arr].sort((x, y) => x.slot - y.slot)
  const r32    = bySlot(rounds['r32']   ?? [])
  const r16    = bySlot(rounds['r16']   ?? [])
  const qf     = bySlot(rounds['qf']    ?? [])
  const sf     = bySlot(rounds['sf']    ?? [])
  const final  = bySlot(rounds['final'] ?? [])
  const third  = bySlot(rounds['3rd']   ?? [])

  // Slot heights — each round slot is 2× the previous
  const sR32   = SLOT_H          //  74px
  const sR16   = SLOT_H * 2     // 148px
  const sQF    = SLOT_H * 4     // 296px
  const sSF    = SLOT_H * 8     // 592px
  const sFinal = SLOT_H * 16    // 1184px

  // Determine connector path state from each pair of feeder matches
  function pairStates(feeders: BracketMatch[], n: number): PathState[] {
    return Array.from({ length: n }, (_, i) => {
      const sA = feeders[i * 2]     ? matchPathState(feeders[i * 2])     : 'tbd'
      const sB = feeders[i * 2 + 1] ? matchPathState(feeders[i * 2 + 1]) : 'tbd'
      if (sA === 'confirmed' && sB === 'confirmed') return 'confirmed'
      if (sA === 'tbd'       && sB === 'tbd')       return 'tbd'
      return 'projected'
    })
  }

  const hasProjections = [...r32, ...r16, ...qf, ...sf, ...final].some(
    m => m.projected_home || m.projected_away
  )

  return (
    <div className="px-4 py-10">

      {/* Header */}
      <div className="mb-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2 font-display uppercase tracking-wide">Knockout Bracket</h1>
        <p className="text-white/40 text-sm">Starts June 29 · 32 teams, one trophy</p>
      </div>

      {/* Legend */}
      {hasProjections && (
        <div className="flex items-center gap-6 mb-8 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-px" style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
            <span className="text-white/40">Clear path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-amber-400 animate-pulse" />
            <span className="text-amber-400/50">Maybe path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-white/20">TBD</span>
          </div>
        </div>
      )}

      {/* Bracket tree — horizontal scroll */}
      <div className="overflow-x-auto pb-6">
        <div className="inline-flex items-start">

          {r32.length > 0 && (
            <RoundColumn label="Round of 32" matches={r32} slotH={sR32} />
          )}

          {r32.length > 0 && r16.length > 0 && (
            <ConnectorColumn
              count={8} unitH={sR16} inputSlotH={sR32}
              states={pairStates(r32, 8)}
            />
          )}

          {r16.length > 0 && (
            <RoundColumn label="Round of 16" matches={r16} slotH={sR16} />
          )}

          {r16.length > 0 && qf.length > 0 && (
            <ConnectorColumn
              count={4} unitH={sQF} inputSlotH={sR16}
              states={pairStates(r16, 4)}
            />
          )}

          {qf.length > 0 && (
            <RoundColumn label="Quarterfinals" matches={qf} slotH={sQF} />
          )}

          {qf.length > 0 && sf.length > 0 && (
            <ConnectorColumn
              count={2} unitH={sSF} inputSlotH={sQF}
              states={pairStates(qf, 2)}
            />
          )}

          {sf.length > 0 && (
            <RoundColumn label="Semifinals" matches={sf} slotH={sSF} />
          )}

          {sf.length > 0 && final.length > 0 && (
            <ConnectorColumn
              count={1} unitH={sFinal} inputSlotH={sSF}
              states={pairStates(sf, 1)}
            />
          )}

          {final.length > 0 && (
            <RoundColumn label="Final" matches={final} slotH={sFinal} isFinal />
          )}

        </div>
      </div>

      {/* Third Place — separate section */}
      {third.length > 0 && (
        <div className="mt-10" style={{ maxWidth: CARD_W }}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-3">
            Third Place
          </p>
          <MatchNode match={third[0]} />
        </div>
      )}

      <p className="text-[11px] text-white/[0.12] mt-10">
        Updated {new Date(data.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
      </p>

    </div>
  )
}
