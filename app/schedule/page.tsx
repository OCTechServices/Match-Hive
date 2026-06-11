import { TEAMS, MATCHES } from '@/data/wc2026'
import type { Match, Team } from '@/types'
import TeamPicker from '@/components/TeamPicker'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

const FEATURED_NAMES = [
  'USA', 'Mexico', 'Brazil', 'Argentina',
  'France', 'England', 'Germany', 'Spain',
  'Portugal', 'Colombia', 'South Korea', 'Japan',
]

function formatMatchDate(utc: string): string {
  return new Date(utc).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC',
  })
}

function formatMatchTime(utc: string): string {
  return new Date(utc).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit',
    timeZone: 'America/Los_Angeles', timeZoneName: 'short',
  })
}

function GroupCard({ group, teams, matches }: { group: string; teams: Team[]; matches: Match[] }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
      <div className="bg-green-900/30 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-green-300">
          Group {group}
        </h3>
        <div className="flex items-center gap-1.5">
          {teams.map((t) => (
            <a
              key={t.name}
              href={`/api/ics?team=${encodeURIComponent(t.name)}`}
              download
              title={`Download ${t.name} schedule`}
              className="text-base hover:scale-125 transition-transform"
            >
              {t.flag}
            </a>
          ))}
        </div>
      </div>

      <div className="px-4 pt-2.5 pb-1 flex flex-wrap gap-x-3 gap-y-1">
        {teams.map((t) => (
          <span key={t.name} className="text-xs text-white/45">
            {t.flag} {t.name}
          </span>
        ))}
      </div>

      <div className="divide-y divide-white/5 mt-1">
        {matches.map((m) => (
          <div key={m.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-sm font-medium leading-snug">
                {m.homeTeam} <span className="text-white/30 text-xs font-normal">vs</span> {m.awayTeam}
              </span>
              <span className="text-xs text-white/25 shrink-0">MD{m.matchday}</span>
            </div>
            <p className="text-xs text-white/40">
              {formatMatchDate(m.dateUtc)} · {formatMatchTime(m.dateUtc)}
            </p>
            <p className="text-xs text-white/25 mt-0.5">{m.venue}, {m.city}</p>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 border-t border-white/5">
        <p className="text-[11px] text-white/25">Tap a flag to download that team&apos;s schedule</p>
      </div>
    </div>
  )
}

export default function SchedulePage() {
  const featured = FEATURED_NAMES.map((n) => TEAMS.find((t) => t.name === n)).filter(Boolean) as Team[]
  const others = TEAMS
    .filter((t) => !FEATURED_NAMES.includes(t.name))
    .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))

  // Pre-compute matches per team to pass to client component
  const matchesByTeam: Record<string, Match[]> = {}
  for (const team of TEAMS) {
    matchesByTeam[team.name] = MATCHES
      .filter((m) => m.homeTeam === team.name || m.awayTeam === team.name)
      .sort((a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime())
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Interactive team picker (client component) */}
      <TeamPicker
        featured={featured}
        others={others}
        matchesByTeam={matchesByTeam}
      />

      {/* Full group schedule — source of truth */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/30">
            Full Group Stage Schedule
          </h2>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <p className="text-white/30 text-xs mb-6">
          June 11 – 28 · Times in Pacific (PT)
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((group) => {
            const teams = TEAMS.filter((t) => t.group === group)
            const matches = MATCHES.filter((m) => m.group === group).sort(
              (a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime()
            )
            return <GroupCard key={group} group={group} teams={teams} matches={matches} />
          })}
        </div>
      </section>

    </div>
  )
}
