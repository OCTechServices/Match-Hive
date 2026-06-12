import type { Metadata } from 'next'
import { TEAMS, MATCHES } from '@/data/wc2026'
import type { Match, Team } from '@/types'
import TeamPicker from '@/components/TeamPicker'

export const metadata: Metadata = {
  title: 'Match-Hive — FIFA World Cup 2026 Schedule & Team Calendars',
  description:
    'View the full FIFA World Cup 2026 group stage schedule. Pick your team and download their matches directly to your calendar with 15-min kickoff reminders.',
  openGraph: {
    title: 'World Cup 2026 Schedule — Match-Hive',
    description:
      'All 72 group stage matches. Pick your team and download the schedule to your calendar.',
  },
}

const FEATURED_NAMES = [
  'Mexico', 'USA', 'Brazil', 'Argentina',
  'France', 'England', 'Germany', 'Spain',
  'Portugal', 'Colombia', 'South Korea', 'Japan',
]

// ── Helpers ────────────────────────────────────────────────────────────
const teamMap = Object.fromEntries(TEAMS.map((t) => [t.name, t]))

function formatDayHeader(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
  })
}

function formatMatchTime(utc: string): string {
  return new Date(utc).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit',
    timeZone: 'America/New_York', timeZoneName: 'short',
  })
}

// ── Match card — flag-first, balanced layout ────────────────────────────
function MatchCard({ match }: { match: Match }) {
  const home = teamMap[match.homeTeam]
  const away = teamMap[match.awayTeam]

  return (
    <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-2xl px-5 py-4 transition-colors">
      {/* Teams row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-3">

        {/* Home */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-4xl sm:text-5xl leading-none">{home?.flag ?? '🏳'}</span>
          <span className="text-xs sm:text-sm font-semibold leading-tight">{match.homeTeam}</span>
        </div>

        {/* Middle */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/25">vs</span>
          <span className="text-[10px] bg-white/8 border border-white/10 text-white/40 font-medium px-2.5 py-0.5 rounded-full">
            Group {match.group}
          </span>
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-4xl sm:text-5xl leading-none">{away?.flag ?? '🏳'}</span>
          <span className="text-xs sm:text-sm font-semibold leading-tight">{match.awayTeam}</span>
        </div>

      </div>

      {/* Meta row */}
      <div className="flex items-center justify-center gap-3 text-[11px] text-white/35 border-t border-white/8 pt-3">
        <span className="font-medium">{formatMatchTime(match.dateUtc)}</span>
        <span>·</span>
        <span>{match.venue}</span>
        <span>·</span>
        <span>{match.city}</span>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const featured = FEATURED_NAMES.map((n) => teamMap[n]).filter(Boolean) as Team[]
  const others = TEAMS
    .filter((t) => !FEATURED_NAMES.includes(t.name))
    .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))

  const matchesByTeam: Record<string, Match[]> = {}
  for (const team of TEAMS) {
    matchesByTeam[team.name] = MATCHES
      .filter((m) => m.homeTeam === team.name || m.awayTeam === team.name)
      .sort((a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime())
  }

  // Group all matches by calendar date (UTC)
  const sorted = [...MATCHES].sort(
    (a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime()
  )
  const byDate: Record<string, Match[]> = {}
  for (const m of sorted) {
    const day = new Date(m.dateUtc).toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
    if (!byDate[day]) byDate[day] = []
    byDate[day].push(m)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* ── Touch-native team picker ── */}
      <TeamPicker featured={featured} others={others} matchesByTeam={matchesByTeam} />

      {/* ── Full schedule — date-grouped match cards ── */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs font-semibold uppercase tracking-widest text-white/30 px-2">
            Group Stage · June 11 – 28
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="space-y-10">
          {Object.entries(byDate).map(([day, matches]) => (
            <div key={day}>
              {/* Date header */}
              <h3 className="text-lg font-bold text-white/70 mb-4 flex items-center gap-3 font-display uppercase tracking-wide">
                {formatDayHeader(day)}
                <span className="text-xs font-normal text-white/25">
                  {matches.length} match{matches.length > 1 ? 'es' : ''}
                </span>
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {matches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
