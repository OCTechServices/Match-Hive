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

// ── Team download card ──────────────────────────────────────────────────
function TeamDownloadCard({ team }: { team: Team }) {
  return (
    <a
      href={`/api/ics?team=${encodeURIComponent(team.name)}`}
      download
      className="group flex items-center gap-3 bg-white/[0.05] hover:bg-green-900/50 border border-white/10 hover:border-green-500/60 rounded-xl px-4 py-4 sm:py-3 transition-all active:scale-[0.98]"
    >
      <span className="text-3xl sm:text-2xl leading-none">{team.flag}</span>
      <div className="flex-1 min-w-0">
        <p className="text-base sm:text-sm font-semibold truncate">{team.name}</p>
        <p className="text-xs text-white/40">Group {team.group}</p>
      </div>
      <span className="shrink-0 bg-green-700/60 group-hover:bg-green-600 text-green-100 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors">
        ⬇ Save
      </span>
    </a>
  )
}

// ── Group schedule card ─────────────────────────────────────────────────
function GroupCard({ group, teams, matches }: { group: string; teams: Team[]; matches: Match[] }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
      <div className="bg-green-900/30 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-green-300">
          Group {group}
        </h3>
        <div className="flex items-center gap-1.5">
          {teams.map((t) => (
            <span key={t.name} className="text-base" title={t.name}>
              {t.flag}
            </span>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/5">
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
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const allTeamsSorted = GROUPS.flatMap((g) => TEAMS.filter((t) => t.group === g))

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* ── Hero ── */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
          Download Your Team&apos;s Schedule
        </h1>
        <p className="text-white/50 text-base max-w-md mx-auto">
          Pick your team below — adds all 3 group stage matches to your calendar
          with a <span className="text-green-400 font-medium">15-minute kickoff reminder</span>.
        </p>
      </div>

      {/* ── Team picker ── */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-green-400">
            📅 Pick Your Team — Tap to Download
          </h2>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allTeamsSorted.map((team) => (
            <TeamDownloadCard key={team.name} team={team} />
          ))}
        </div>
        <p className="text-xs text-white/30 text-center mt-4">
          Works with Apple Calendar, Google Calendar, Outlook, and any app that supports .ics files
        </p>
      </section>

      {/* ── Full schedule by group ── */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-green-400">
            🗓 Full Group Stage Schedule
          </h2>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <p className="text-white/40 text-xs mb-6">
          June 11 – 28 · All times shown in Pacific Time (PT)
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
