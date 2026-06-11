import { TEAMS, MATCHES } from '@/data/wc2026'
import type { Match, Team } from '@/types'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

const FEATURED = [
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

// ── Featured team card ─────────────────────────────────────────────────
function FeaturedCard({ team }: { team: Team }) {
  return (
    <a
      href={`/api/ics?team=${encodeURIComponent(team.name)}`}
      download
      className="group flex flex-col items-center gap-2 bg-white/[0.05] hover:bg-green-900/50 border border-white/10 hover:border-green-500/60 rounded-2xl px-4 py-5 transition-all active:scale-[0.97] text-center"
    >
      <span className="text-4xl leading-none">{team.flag}</span>
      <span className="text-sm font-semibold leading-tight">{team.name}</span>
      <span className="bg-green-700/70 group-hover:bg-green-600 text-green-100 text-[11px] font-bold px-3 py-1 rounded-full transition-colors">
        ⬇ Save Schedule
      </span>
    </a>
  )
}

// ── Other team row (inside the expandable) ─────────────────────────────
function OtherTeamRow({ team }: { team: Team }) {
  return (
    <a
      href={`/api/ics?team=${encodeURIComponent(team.name)}`}
      download
      className="flex items-center gap-3 px-4 py-3 hover:bg-green-900/30 rounded-xl transition-colors active:scale-[0.98] group"
    >
      <span className="text-2xl leading-none">{team.flag}</span>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium">{team.name}</span>
        <span className="text-xs text-white/35 ml-2">Group {team.group}</span>
      </div>
      <span className="text-xs text-green-400/70 group-hover:text-green-400 font-medium transition-colors">
        ⬇ .ics
      </span>
    </a>
  )
}

// ── Group schedule card ─────────────────────────────────────────────────
function GroupCard({ group, teams, matches }: { group: string; teams: Team[]; matches: Match[] }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
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

      {/* Team names */}
      <div className="px-4 pt-2.5 pb-1 flex flex-wrap gap-x-3 gap-y-1">
        {teams.map((t) => (
          <span key={t.name} className="text-xs text-white/45">
            {t.flag} {t.name}
          </span>
        ))}
      </div>

      {/* Matches */}
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

      {/* Hint */}
      <div className="px-4 py-2 border-t border-white/5">
        <p className="text-[11px] text-white/25">Tap a flag above to download that team&apos;s schedule</p>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const featuredTeams = FEATURED.map((name) => TEAMS.find((t) => t.name === name)).filter(Boolean) as Team[]
  const otherTeams = TEAMS.filter((t) => !FEATURED.includes(t.name)).sort((a, b) =>
    a.group.localeCompare(b.group) || a.name.localeCompare(b.name)
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Team schedule picker ── */}
      <section className="mb-14">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">

          {/* Panel header */}
          <div className="px-5 py-5 border-b border-white/10">
            <h2 className="text-lg font-bold mb-1">📅 Download Your Team&apos;s Schedule</h2>
            <p className="text-white/50 text-sm">
              Tap your team — saves all 3 group stage matches to your calendar with a{' '}
              <span className="text-green-400 font-medium">15-minute kickoff reminder</span>.
              Works with Apple Calendar, Google Calendar, and Outlook.
            </p>
          </div>

          {/* Featured teams grid */}
          <div className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
              Popular teams
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {featuredTeams.map((team) => (
                <FeaturedCard key={team.name} team={team} />
              ))}
            </div>
          </div>

          {/* Don't see your team — expandable */}
          <details className="border-t border-white/10 group/details">
            <summary className="px-5 py-4 text-sm text-white/50 hover:text-white cursor-pointer transition-colors list-none flex items-center justify-between select-none">
              <span>
                🔍 Don&apos;t see your team?{' '}
                <span className="text-green-400 font-medium">View all 48 teams →</span>
              </span>
              <svg
                className="w-4 h-4 transition-transform group-open/details:rotate-180 shrink-0"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-4 grid sm:grid-cols-2 gap-1 border-t border-white/5 pt-2">
              {otherTeams.map((team) => (
                <OtherTeamRow key={team.name} team={team} />
              ))}
            </div>
          </details>

        </div>
      </section>

      {/* ── Full group stage schedule ── */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-green-400">
            🗓 Full Group Stage Schedule
          </h2>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <p className="text-white/40 text-xs mb-6">
          June 11 – 28 · Times shown in Pacific (PT) · Tap any flag to download that team&apos;s .ics
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
