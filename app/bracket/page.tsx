import type { Metadata } from 'next'
import { TEAMS, MATCHES } from '@/data/wc2026'
import { supabase } from '@/lib/supabase'
import { R32_SEEDING } from '@/lib/bracket-seeding'
import { computeGroupStandings } from '@/lib/standings'
import type { BracketMatch } from '@/data/bracket'
import type { Match } from '@/types'

export const metadata: Metadata = {
  title: 'Match-Hive — FIFA World Cup 2026 Knockout Bracket',
  description: 'Live FIFA World Cup 2026 knockout bracket. Track the clear path and projected path to the Final.',
}

export const revalidate = 300

const flagMap = Object.fromEntries(TEAMS.map(t => [t.name, t.flag]))

// ── Standings enrichment ─────────────────────────────────────────────────
const FD_NAME_MAP: Record<string, string> = {
  'United States': 'USA',
  'Korea Republic': 'South Korea',
  "Côte d'Ivoire": 'Ivory Coast',
  'Türkiye': 'Turkiye',
  'Turkey': 'Turkiye',
  'Bosnia-Herzegovina': 'Bosnia and Herzegovina',
  'Bosnia & Herzegovina': 'Bosnia and Herzegovina',
  'Cape Verde Islands': 'Cape Verde',
  'Congo DR': 'DR Congo',
  'Czech Republic': 'Czechia',
}

// Compute group projections from the matches endpoint — same URL the schedule
// page uses, so both share the Next.js fetch cache (no extra API calls).
async function fetchProjections(): Promise<Record<string, string[]>> {
  const key = process.env.FOOTBALL_DATA_API_KEY
  if (!key) return {}
  try {
    const res = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches',
      { headers: { 'X-Auth-Token': key }, next: { revalidate: 300 } }
    )
    if (!res.ok) return {}
    const json = await res.json()

    // Build score map by normalised team-pair key (both orientations)
    const scoreMap: Record<string, { home: number; away: number }> = {}
    for (const m of json.matches ?? []) {
      if (m.status !== 'FINISHED') continue
      const h = m.score?.fullTime?.home
      const a = m.score?.fullTime?.away
      if (h == null || a == null) continue
      const hn = FD_NAME_MAP[m.homeTeam?.name] ?? m.homeTeam?.name ?? ''
      const an = FD_NAME_MAP[m.awayTeam?.name] ?? m.awayTeam?.name ?? ''
      if (hn && an) {
        scoreMap[`${hn}|${an}`] = { home: h, away: a }
        scoreMap[`${an}|${hn}`] = { home: a, away: h }
      }
    }

    // Merge API scores into our match data and compute standings per group
    const enrichedMatches: Match[] = MATCHES.map(m => {
      const score = scoreMap[`${m.homeTeam}|${m.awayTeam}`]
      return score ? { ...m, homeScore: score.home, awayScore: score.away } : m
    })

    const out: Record<string, string[]> = {}
    const groups = ['A','B','C','D','E','F','G','H','I','J','K','L']
    for (const g of groups) {
      const rows = computeGroupStandings(g, enrichedMatches, TEAMS)
      if (rows.length > 0) out[g] = rows.map(r => r.team.name)
    }
    return out
  } catch {
    return {}
  }
}

// ── Layout constants (px) ───────────────────────────────────────────────
const CARD_H    = 100              // total card height
const TEAM_ROW  = 32               // height per team row
const META_H    = CARD_H - TEAM_ROW * 2  // 36px — date / venue section
const CARD_W    = 190
const SLOT_GAP  = 10
const CONN_W    = 44
const SLOT_H    = CARD_H + SLOT_GAP   // 110 — base slot unit for R32
const LABEL_H   = 28

function formatMatchDate(utc: string): string {
  return new Date(utc).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  })
}

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
      className={`flex items-center gap-1.5 px-2.5 transition-opacity ${isLoser ? 'opacity-25' : ''}`}
      style={{ height: TEAM_ROW }}
    >
      <span className={`text-base leading-none shrink-0 ${!name ? 'opacity-[0.12]' : ''}`}>
        {name ? (flagMap[name] ?? '🏳') : '🏳'}
      </span>
      <span className={`flex-1 text-[11px] font-semibold truncate ${
        isConfirmed
          ? isWinner ? 'text-white' : 'text-white/65'
          : isProjected
            ? 'text-amber-300/70'
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
  const isLive   = match.status === 'live'
  const hasScore = match.home_score !== null && match.away_score !== null
  const bothConf = hC && aC
  const hasProj  = hP || aP

  const border = isLive
    ? '1px solid #4ade80'
    : bothConf
      ? '1px solid rgba(255,255,255,0.13)'
      : hasProj
        ? '1px dashed rgba(251,191,36,0.35)'
        : '1px solid rgba(255,255,255,0.05)'

  const bg = isLive
    ? 'rgba(74,222,128,0.05)'
    : bothConf
      ? 'rgba(255,255,255,0.05)'
      : hasProj
        ? 'rgba(251,191,36,0.04)'
        : 'rgba(255,255,255,0.015)'

  return (
    <div style={{
      width: CARD_W, height: CARD_H,
      border, background: bg,
      borderRadius: 12, overflow: 'hidden', position: 'relative', flexShrink: 0,
      boxShadow: isLive ? '0 0 14px rgba(74,222,128,0.22)' : 'none',
    }}>
      {/* Teams */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <TeamRow
          name={hD} isConfirmed={hC} isProjected={hP}
          isWinner={!!match.winner && match.winner === match.home_team}
          isLoser={!!match.winner && !!match.home_team && match.winner !== match.home_team}
          score={hasScore ? match.home_score : null}
        />
      </div>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <TeamRow
          name={aD} isConfirmed={aC} isProjected={aP}
          isWinner={!!match.winner && match.winner === match.away_team}
          isLoser={!!match.winner && !!match.away_team && match.winner !== match.away_team}
          score={hasScore ? match.away_score : null}
        />
      </div>

      {/* Meta — date / time / venue */}
      <div style={{
        height: META_H,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 10px', gap: 2,
      }}>
        {match.date_utc ? (
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {formatMatchDate(match.date_utc)}
          </span>
        ) : null}
        {(match.venue || match.city) ? (
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {[match.venue, match.city].filter(Boolean).join(' · ')}
          </span>
        ) : null}
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
        const glow  = state === 'confirmed' ? `0 0 6px ${color}` : 'none'
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
            <div style={{ position: 'absolute', top: topY, left: 0, width: arm, height: 1, background: color, boxShadow: glow }} />
            <div style={{ position: 'absolute', top: botY, left: 0, width: arm, height: 1, background: color, boxShadow: glow }} />
            <div style={{ position: 'absolute', top: topY, left: arm - 0.5, width: 1, height: botY - topY + 1, background: color, boxShadow: glow }} />
            <div style={{ position: 'absolute', top: midY, left: arm, width: arm, height: 1, background: color, boxShadow: glow }} />
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
      <p
        className={`text-[9px] font-bold uppercase tracking-widest text-center ${isFinal ? 'text-amber-400' : 'text-green-400/60'}`}
        style={{ height: LABEL_H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
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
export default async function BracketPage() {
  const [{ data, error }, projections] = await Promise.all([
    supabase.from('bracket_matches').select('*').order('slot', { ascending: true }),
    fetchProjections(),
  ])

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-64 text-white/40 text-sm">
        Failed to load bracket data. Please refresh.
      </div>
    )
  }

  // Enrich R32 slots with projections from live standings
  const enriched = (data as BracketMatch[]).map(match => {
    if (match.round !== 'r32') return match
    if (match.home_team && match.away_team) return match
    const seeding = R32_SEEDING[match.slot]
    if (!seeding) return match
    return {
      ...match,
      projected_home: !match.home_team
        ? (projections[seeding.home.group]?.[seeding.home.place - 1] ?? null)
        : null,
      projected_away: !match.away_team
        ? (projections[seeding.away.group]?.[seeding.away.place - 1] ?? null)
        : null,
    }
  })

  const bySlot = (round: string) =>
    enriched.filter(m => m.round === round).sort((a, b) => a.slot - b.slot)

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

  const hasProjections = enriched.some(m => m.projected_home || m.projected_away)

  return (
    <div className="px-4 py-10">

      <div className="mb-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2 font-display uppercase tracking-wide">Knockout Bracket</h1>
        <p className="text-white/40 text-sm">Starts June 29 · 32 teams, one trophy</p>
      </div>

      <div className="flex items-center gap-6 mb-8 text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-px" style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          <span className="text-white/40">Clear path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-px bg-amber-400 animate-pulse" />
          <span className="text-amber-400/60">Maybe path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <span className="text-white/20">TBD</span>
        </div>
      </div>

      {!hasProjections && (
        <p className="text-white/30 text-sm mb-8">
          Projections load from live standings — check back once group matches are underway.
        </p>
      )}

      {/* Bracket tree */}
      <div className="overflow-x-auto pb-6">
        <div className="inline-flex items-start">

          {r32.length > 0 && <RoundColumn label="Round of 32" matches={r32} slotH={sR32} />}

          {r32.length > 0 && r16.length > 0 && (
            <ConnectorColumn count={8} unitH={sR16} inputSlotH={sR32} states={pairStates(r32, 8)} />
          )}

          {r16.length > 0 && <RoundColumn label="Round of 16" matches={r16} slotH={sR16} />}

          {r16.length > 0 && qf.length > 0 && (
            <ConnectorColumn count={4} unitH={sQF} inputSlotH={sR16} states={pairStates(r16, 4)} />
          )}

          {qf.length > 0 && <RoundColumn label="Quarterfinals" matches={qf} slotH={sQF} />}

          {qf.length > 0 && sf.length > 0 && (
            <ConnectorColumn count={2} unitH={sSF} inputSlotH={sQF} states={pairStates(qf, 2)} />
          )}

          {sf.length > 0 && <RoundColumn label="Semifinals" matches={sf} slotH={sSF} />}

          {sf.length > 0 && final.length > 0 && (
            <ConnectorColumn count={1} unitH={sFinal} inputSlotH={sSF} states={pairStates(sf, 1)} />
          )}

          {final.length > 0 && <RoundColumn label="Final" matches={final} slotH={sFinal} isFinal />}

        </div>
      </div>

      {third.length > 0 && (
        <div className="mt-10" style={{ maxWidth: CARD_W }}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-3">Third Place</p>
          <MatchNode match={third[0]} />
        </div>
      )}

    </div>
  )
}
