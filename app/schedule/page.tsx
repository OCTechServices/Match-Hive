import { TEAMS, MATCHES } from '@/data/wc2026'
import type { Match, Team } from '@/types'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

function formatMatchDate(utc: string): string {
  return new Date(utc).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function formatMatchTime(utc: string): string {
  return new Date(utc).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short',
  })
}

function GroupCard({ group, teams, matches }: { group: string; teams: Team[]; matches: Match[] }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
      {/* Group header */}
      <div className="bg-green-900/40 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-green-300">
          Group {group}
        </h2>
        <div className="flex items-center gap-2">
          {teams.map((t) => (
            <a
              key={t.name}
              href={`/api/ics?team=${encodeURIComponent(t.name)}`}
              download
              title={`Download ${t.name} schedule (.ics)`}
              className="text-xl hover:scale-125 transition-transform"
            >
              {t.flag}
            </a>
          ))}
        </div>
      </div>

      {/* Team list */}
      <div className="px-4 pt-3 pb-1 flex flex-wrap gap-x-3 gap-y-1">
        {teams.map((t) => (
          <span key={t.name} className="text-xs text-white/50">
            {t.flag} {t.name}
          </span>
        ))}
      </div>

      {/* Matches */}
      <div className="divide-y divide-white/5 mt-2">
        {matches.map((m) => (
          <div key={m.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium leading-snug">
                {m.homeTeam} <span className="text-white/30 text-xs">vs</span> {m.awayTeam}
              </span>
              <span className="text-xs text-white/30 shrink-0">MD{m.matchday}</span>
            </div>
            <p className="text-xs text-white/40 mt-0.5">
              {formatMatchDate(m.dateUtc)} · {formatMatchTime(m.dateUtc)}
            </p>
            <p className="text-xs text-white/25 mt-0.5">
              {m.venue}, {m.city}
            </p>
          </div>
        ))}
      </div>

      {/* ICS hint */}
      <div className="px-4 py-2 border-t border-white/5">
        <p className="text-[11px] text-white/25">
          Tap a flag above to download your team&apos;s .ics schedule
        </p>
      </div>
    </div>
  )
}

export default function SchedulePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Group Stage Schedule</h1>
        <p className="text-white/50 text-sm">
          June 11 – 28 · All times shown in PT · Tap any flag 🏴󠁧󠁢󠁥󠁮󠁧󠁿 to download a calendar file with 15-min reminders
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((group) => {
          const teams = TEAMS.filter((t) => t.group === group)
          const matches = MATCHES.filter((m) => m.group === group).sort(
            (a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime()
          )
          return (
            <GroupCard key={group} group={group} teams={teams} matches={matches} />
          )
        })}
      </div>
    </div>
  )
}
