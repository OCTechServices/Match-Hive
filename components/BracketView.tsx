'use client'

import { useState } from 'react'
import { TEAMS } from '@/data/wc2026'
import { R32_SEEDING } from '@/lib/bracket-seeding'
import type { SeedRef } from '@/lib/bracket-seeding'
import type { BracketMatch } from '@/data/bracket'

const flagMap = Object.fromEntries(TEAMS.map(t => [t.name, t.flag]))

// ── Layout constants (px) ────────────────────────────────────────────────
const CARD_W     = 210
const CARD_H     = 116
const HEADER_H   = 14
const TEAM_ROW   = 30
const META_H     = CARD_H - HEADER_H - TEAM_ROW * 2   // 42
const SLOT_GAP   = 12
const CONN_W     = 44
const SLOT_H     = CARD_H + SLOT_GAP                   // 128
const LABEL_H    = 32

const FINAL_W    = 250
const FINAL_H    = 134
const FINAL_TEAM = 34
const FINAL_HDR  = 16
const FINAL_META = FINAL_H - FINAL_HDR - FINAL_TEAM * 2  // 50

// ── Round tab definitions ────────────────────────────────────────────────
const ROUND_TABS = [
  { key: 'r32',   label: 'R32',   title: 'Round of 32'   },
  { key: 'r16',   label: 'R16',   title: 'Round of 16'   },
  { key: 'qf',    label: 'QF',    title: 'Quarterfinals' },
  { key: 'sf',    label: 'SF',    title: 'Semifinals'    },
  { key: 'final', label: 'Final', title: 'Final'         },
]

type PathState = 'confirmed' | 'projected' | 'tbd'

// ── Helpers ──────────────────────────────────────────────────────────────
function matchPathState(m: BracketMatch): PathState {
  if (m.winner || (m.home_team && m.away_team)) return 'confirmed'
  if (m.projected_home || m.projected_away)     return 'projected'
  return 'tbd'
}

function pathColor(s: PathState): string {
  if (s === 'confirmed') return '#4ade80'
  if (s === 'projected') return '#fb923c'
  return 'rgba(255,255,255,0.07)'
}

function formatMeta(utc: string): string {
  return new Date(utc).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  })
}

function seedLabel(s: SeedRef): string {
  if (s.kind === 'group') return `${s.place === 1 ? '1st' : '2nd'} Group ${s.group}`
  return `Best 3rd ${s.groups.join('/')}`
}

function getTbdLabel(match: BracketMatch, side: 'home' | 'away'): string {
  if (match.round === 'r32') {
    const s = R32_SEEDING[match.id]?.[side]
    if (s) return seedLabel(s)
  }
  return 'TBD'
}

// ── TeamRow ──────────────────────────────────────────────────────────────
function TeamRow({ name, confirmed, projected, tbd, winner, loser, score, rowH }: {
  name: string
  confirmed: boolean
  projected: boolean
  tbd: boolean
  winner: boolean
  loser: boolean
  score: number | null
  rowH: number
}) {
  return (
    <div
      style={{
        height: rowH, display: 'flex', alignItems: 'center',
        gap: 8, paddingLeft: 10, paddingRight: 10,
        position: 'relative', opacity: loser ? 0.25 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {winner && (
        <div style={{
          position: 'absolute', left: 0, top: 5, bottom: 5,
          width: 2, background: '#4ade80', borderRadius: 1,
        }} />
      )}

      <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0, opacity: tbd ? 0.12 : 1 }}>
        {tbd ? '🏳' : (flagMap[name] ?? '🏳')}
      </span>

      <span style={{
        flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontSize: tbd ? 10 : 12,
        fontWeight: confirmed && winner ? 700 : confirmed || projected ? 600 : 400,
        fontStyle: tbd ? 'italic' : 'normal',
        color: tbd
          ? 'rgba(255,255,255,0.22)'
          : confirmed
            ? winner ? '#ffffff' : 'rgba(255,255,255,0.85)'
            : projected
              ? 'rgba(255,255,255,0.75)'
              : 'rgba(255,255,255,0.18)',
      }}>
        {name}
      </span>

      {score !== null && (
        <span style={{
          fontSize: 13, fontWeight: 700, flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
          color: winner ? '#4ade80' : 'rgba(255,255,255,0.40)',
        }}>
          {score}
        </span>
      )}
    </div>
  )
}

// ── MatchNode ────────────────────────────────────────────────────────────
function MatchNode({ match, isFinal = false, fullWidth = false }: {
  match: BracketMatch
  isFinal?: boolean
  fullWidth?: boolean
}) {
  const hC = !!match.home_team, aC = !!match.away_team
  const hP = !hC && !!match.projected_home, aP = !aC && !!match.projected_away
  const hTbd = !hC && !hP, aTbd = !aC && !aP

  const hName = match.home_team ?? match.projected_home ?? getTbdLabel(match, 'home')
  const aName = match.away_team ?? match.projected_away ?? getTbdLabel(match, 'away')

  const isLive   = match.status === 'live'
  const hasScore = match.home_score !== null && match.away_score !== null
  const bothConf = hC && aC
  const hasProj  = hP || aP
  const anyKnown = hC || hP || aC || aP
  const isChamp  = isFinal && !!match.winner

  const cardW   = fullWidth ? '100%' : (isFinal ? FINAL_W   : CARD_W)
  const cardH   = isFinal ? FINAL_H   : CARD_H
  const teamH   = isFinal ? FINAL_TEAM : TEAM_ROW
  const headerH = isFinal ? FINAL_HDR  : HEADER_H
  const metaH   = cardH - headerH - teamH * 2

  const border = isLive
    ? '1.5px solid #4ade80'
    : isChamp
      ? '1.5px solid rgba(212,175,55,0.75)'
      : isFinal && anyKnown
        ? '1px solid rgba(212,175,55,0.45)'
        : bothConf
          ? '1px solid rgba(74,222,128,0.30)'
          : hasProj
            ? 'none'
            : '1px solid rgba(255,255,255,0.05)'

  const bg = isLive
    ? 'rgba(74,222,128,0.08)'
    : isChamp
      ? 'rgba(212,175,55,0.10)'
      : isFinal && anyKnown
        ? 'rgba(212,175,55,0.05)'
        : bothConf
          ? 'rgba(74,222,128,0.05)'
          : hasProj
            ? 'rgba(251,146,60,0.06)'
            : 'rgba(255,255,255,0.015)'

  const shadow = isLive
    ? '0 0 24px rgba(74,222,128,0.35), 0 0 8px rgba(74,222,128,0.20)'
    : isChamp
      ? '0 0 36px rgba(212,175,55,0.30), 0 0 12px rgba(212,175,55,0.20)'
      : isFinal && anyKnown
        ? '0 0 20px rgba(212,175,55,0.15)'
        : bothConf
          ? '0 0 12px rgba(74,222,128,0.12)'
          : hasProj
            ? '0 0 16px rgba(251,146,60,0.20)'
            : 'none'

  return (
    <div style={{
      width: cardW, height: cardH,
      border, background: bg, borderRadius: 12,
      overflow: 'hidden', position: 'relative', flexShrink: 0,
      boxShadow: shadow,
    }}>
      {/* Pulsating projected border overlay */}
      {hasProj && !isLive && (
        <>
          <div className="animate-pulse" style={{
            position: 'absolute', inset: 0, borderRadius: 12,
            border: '1.5px dashed rgba(251,146,60,0.85)',
            boxShadow: '0 0 20px rgba(251,146,60,0.20), inset 0 0 40px rgba(251,146,60,0.04)',
            pointerEvents: 'none', zIndex: 1,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.70), transparent)',
            pointerEvents: 'none', zIndex: 2,
          }} />
        </>
      )}

      {/* Final gold top accent line */}
      {isFinal && anyKnown && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.75), transparent)',
          zIndex: 1,
        }} />
      )}

      {/* Header strip — match slot + status badge */}
      <div style={{
        height: headerH, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 10px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{
          fontSize: 8, fontWeight: 700, letterSpacing: '0.07em',
          color: 'rgba(255,255,255,0.18)',
        }}>
          {match.id}
        </span>
        {isLive ? (
          <span className="animate-pulse" style={{
            fontSize: 8, fontWeight: 700, color: '#4ade80', letterSpacing: '0.07em',
          }}>
            LIVE
          </span>
        ) : hasScore ? (
          <span style={{
            fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.07em',
          }}>
            FT
          </span>
        ) : isFinal ? (
          <span style={{ fontSize: 11 }}>🏆</span>
        ) : null}
      </div>

      {/* Home team */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <TeamRow
          name={hName} confirmed={hC} projected={hP} tbd={hTbd}
          winner={!!match.winner && match.winner === match.home_team}
          loser={!!match.winner && !!match.home_team && match.winner !== match.home_team}
          score={hasScore ? match.home_score : null}
          rowH={teamH}
        />
      </div>

      {/* Away team */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <TeamRow
          name={aName} confirmed={aC} projected={aP} tbd={aTbd}
          winner={!!match.winner && match.winner === match.away_team}
          loser={!!match.winner && !!match.away_team && match.winner !== match.away_team}
          score={hasScore ? match.away_score : null}
          rowH={teamH}
        />
      </div>

      {/* Meta — date / venue / city + calendar download */}
      <div style={{
        height: metaH, display: 'flex', alignItems: 'center',
        padding: '0 10px', gap: 6,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
          {match.date_utc && (
            <span style={{
              fontSize: 9, fontWeight: 500, color: 'rgba(255,255,255,0.65)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {formatMeta(match.date_utc)}
            </span>
          )}
          {(match.venue || match.city) && (
            <span style={{
              fontSize: 9, color: 'rgba(255,255,255,0.50)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {[match.venue, match.city].filter(Boolean).join(' · ')}
            </span>
          )}
        </div>
        {match.date_utc && (
          <a
            href={`/api/bracket-ics?match=${match.id}`}
            title="Add to calendar"
            className="opacity-30 hover:opacity-70 transition-opacity"
            style={{ flexShrink: 0, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

// ── ConnectorColumn ──────────────────────────────────────────────────────
function ConnectorColumn({ count, unitH, inputSlotH, states }: {
  count: number
  unitH: number
  inputSlotH: number
  states: PathState[]
}) {
  return (
    <div style={{ width: CONN_W, flexShrink: 0 }}>
      <div style={{ height: LABEL_H }} />
      {Array.from({ length: count }, (_, i) => {
        const state = states[i] ?? 'tbd'
        const color = pathColor(state)
        const glow  = state === 'confirmed'
          ? `0 0 8px ${color}, 0 0 16px rgba(74,222,128,0.15)`
          : state === 'projected'
            ? '0 0 6px rgba(251,146,60,0.45)'
            : 'none'
        const arm   = CONN_W / 2
        const topY  = inputSlotH / 2 - 0.5
        const botY  = unitH - inputSlotH / 2 - 0.5
        const midY  = unitH / 2 - 0.5

        return (
          <div
            key={i}
            className={state === 'projected' ? 'animate-pulse' : ''}
            style={{ position: 'relative', height: unitH, width: CONN_W }}
          >
            <div style={{ position: 'absolute', top: topY, left: 0,       width: arm,           height: 1, background: color, boxShadow: glow }} />
            <div style={{ position: 'absolute', top: botY, left: 0,       width: arm,           height: 1, background: color, boxShadow: glow }} />
            <div style={{ position: 'absolute', top: topY, left: arm-0.5, width: 1, height: botY - topY + 1, background: color, boxShadow: glow }} />
            <div style={{ position: 'absolute', top: midY, left: arm,     width: arm,           height: 1, background: color, boxShadow: glow }} />
          </div>
        )
      })}
    </div>
  )
}

// ── RoundColumn (desktop) ────────────────────────────────────────────────
function RoundColumn({ label, matches, slotH, isFinal = false }: {
  label: string
  matches: BracketMatch[]
  slotH: number
  isFinal?: boolean
}) {
  return (
    <div style={{ width: isFinal ? FINAL_W : CARD_W, flexShrink: 0 }}>
      <p style={{
        height: LABEL_H, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em',
        color: isFinal ? 'rgba(212,175,55,0.80)' : 'rgba(74,222,128,0.55)',
        margin: 0,
      }}>
        {label}
      </p>
      <div>
        {matches.map(m => (
          <div key={m.id} style={{ height: slotH, display: 'flex', alignItems: 'center' }}>
            <MatchNode match={m} isFinal={isFinal} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── BracketView ──────────────────────────────────────────────────────────
export default function BracketView({ matches }: { matches: BracketMatch[] }) {
  const [activeTab, setActiveTab] = useState<string>('r32')

  const bySlot = (round: string) =>
    matches.filter(m => m.round === round).sort((a, b) => a.slot - b.slot)

  const r32   = bySlot('r32')
  const r16   = bySlot('r16')
  const qf    = bySlot('qf')
  const sf    = bySlot('sf')
  const final = bySlot('final')
  const third = bySlot('3rd')

  const sR32   = SLOT_H
  const sR16   = SLOT_H * 2
  const sQF    = SLOT_H * 4
  const sSF    = SLOT_H * 8
  const sFinal = SLOT_H * 16

  function pairStates(feeders: BracketMatch[], n: number): PathState[] {
    return Array.from({ length: n }, (_, i) => {
      const sA = feeders[i * 2]     ? matchPathState(feeders[i * 2])     : 'tbd'
      const sB = feeders[i * 2 + 1] ? matchPathState(feeders[i * 2 + 1]) : 'tbd'
      if (sA === 'confirmed' && sB === 'confirmed') return 'confirmed'
      if (sA === 'tbd'       && sB === 'tbd')       return 'tbd'
      return 'projected'
    })
  }

  const hasProjections = matches.some(m => m.projected_home || m.projected_away)

  const mobileRound = {
    r32: r32, r16: r16, qf: qf, sf: sf, final: final,
  } as Record<string, BracketMatch[]>

  const activeMatches = mobileRound[activeTab] ?? []
  const isFinalTab    = activeTab === 'final'
  const isWideTab     = activeTab === 'r32' || activeTab === 'r16'

  return (
    <div className="px-4 py-10">

      {/* Header */}
      <div className="mb-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-3 font-display uppercase tracking-wide">
          Knockout Bracket
        </h1>
        <div style={{
          width: 56, height: 2, marginBottom: 12,
          background: 'linear-gradient(90deg, #4ade80, rgba(74,222,128,0.15))',
          boxShadow: '0 0 10px rgba(74,222,128,0.40)',
          borderRadius: 1,
        }} />
        <p className="text-white/40 text-sm">Starts June 28 · 32 teams, one trophy</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 8,
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.28)',
          boxShadow: '0 0 10px rgba(74,222,128,0.10)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: 'rgba(74,222,128,0.80)' }}>Confirmed</span>
        </div>
        <div className="animate-pulse" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 8,
          background: 'rgba(251,146,60,0.06)',
          border: '1.5px dashed rgba(251,146,60,0.70)',
          boxShadow: '0 0 10px rgba(251,146,60,0.15)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fb923c' }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: 'rgba(251,146,60,0.80)' }}>Projected</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 8,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.25)' }}>TBD</span>
        </div>
      </div>

      {!hasProjections && (
        <div style={{
          padding: '10px 14px', borderRadius: 10, marginBottom: 24,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          fontSize: 13, color: 'rgba(255,255,255,0.32)',
        }}>
          Projections load from live standings — check back once group matches are underway.
        </div>
      )}

      {/* ── Mobile: Round tabs ─────────────────────────────────────────── */}
      <div className="md:hidden">
        {/* Tab bar */}
        <div
          className="flex gap-1 mb-6 p-1 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {ROUND_TABS.map(tab => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 py-2 rounded-lg transition-all"
                style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                  background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                  color: isActive
                    ? tab.key === 'final' ? 'rgba(212,175,55,0.9)' : '#4ade80'
                    : 'rgba(255,255,255,0.35)',
                  boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.35)' : 'none',
                  border: 'none', cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Round title */}
        <p style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em',
          color: isFinalTab ? 'rgba(212,175,55,0.75)' : 'rgba(74,222,128,0.55)',
          marginBottom: 16,
        }}>
          {ROUND_TABS.find(t => t.key === activeTab)?.title}
        </p>

        {/* Match grid */}
        <div
          className={`grid gap-3 ${isWideTab ? 'grid-cols-2' : 'grid-cols-1'}`}
          style={{ maxWidth: isWideTab ? undefined : 400 }}
        >
          {activeMatches.map(m => (
            <MatchNode key={m.id} match={m} isFinal={isFinalTab} fullWidth />
          ))}
        </div>

        {/* Third place — shown inside Final tab */}
        {isFinalTab && third.length > 0 && (
          <div className="mt-8" style={{ maxWidth: 400 }}>
            <p style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em',
              color: 'rgba(255,255,255,0.28)', marginBottom: 12,
            }}>
              Third Place
            </p>
            <MatchNode match={third[0]} fullWidth />
          </div>
        )}
      </div>

      {/* ── Desktop: Horizontal bracket tree ───────────────────────────── */}
      <div className="hidden md:block overflow-x-auto pb-6">
        <div className="inline-flex items-start">

          {r32.length > 0 && (
            <RoundColumn label="Round of 32" matches={r32} slotH={sR32} />
          )}
          {r32.length > 0 && r16.length > 0 && (
            <ConnectorColumn count={8} unitH={sR16} inputSlotH={sR32} states={pairStates(r32, 8)} />
          )}

          {r16.length > 0 && (
            <RoundColumn label="Round of 16" matches={r16} slotH={sR16} />
          )}
          {r16.length > 0 && qf.length > 0 && (
            <ConnectorColumn count={4} unitH={sQF} inputSlotH={sR16} states={pairStates(r16, 4)} />
          )}

          {qf.length > 0 && (
            <RoundColumn label="Quarterfinals" matches={qf} slotH={sQF} />
          )}
          {qf.length > 0 && sf.length > 0 && (
            <ConnectorColumn count={2} unitH={sSF} inputSlotH={sQF} states={pairStates(qf, 2)} />
          )}

          {sf.length > 0 && (
            <RoundColumn label="Semifinals" matches={sf} slotH={sSF} />
          )}
          {sf.length > 0 && final.length > 0 && (
            <ConnectorColumn count={1} unitH={sFinal} inputSlotH={sSF} states={pairStates(sf, 1)} />
          )}

          {final.length > 0 && (
            <RoundColumn label="Final" matches={final} slotH={sFinal} isFinal />
          )}

        </div>
      </div>

      {/* Third place — desktop (below the tree) */}
      {third.length > 0 && (
        <div className="hidden md:block mt-10" style={{ maxWidth: CARD_W }}>
          <p style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em',
            color: 'rgba(255,255,255,0.28)', marginBottom: 12,
          }}>
            Third Place
          </p>
          <MatchNode match={third[0]} />
        </div>
      )}

    </div>
  )
}
