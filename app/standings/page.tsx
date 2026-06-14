import type { Metadata } from 'next'
import { TEAMS } from '@/data/wc2026'

export const metadata: Metadata = {
  title: 'Match-Hive — FIFA World Cup 2026 Group Standings',
  description:
    'Live group stage standings for all 12 groups — FIFA World Cup 2026. Track points, goal difference, and which teams advance.',
}

// Map football-data.org team names → our TEAMS names where they differ
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
}

const teamByName = Object.fromEntries(TEAMS.map((t) => [t.name, t]))

function resolveTeam(fdName: string): { flag: string; name: string } {
  const ourName = FD_NAME_MAP[fdName] ?? fdName
  const team = teamByName[ourName]
  return { flag: team?.flag ?? '🏳', name: team?.name ?? fdName }
}

interface FdRow {
  team: { name: string }
  playedGames: number
  won: number
  draw: number
  lost: number
  goalDifference: number
  points: number
}

interface FdGroup {
  type: string
  group: string // "GROUP_A"
  table: FdRow[]
}

async function fetchStandings(): Promise<FdGroup[]> {
  const key = process.env.FOOTBALL_DATA_API_KEY
  if (!key) throw new Error('FOOTBALL_DATA_API_KEY not configured')

  const res = await fetch(
    'https://api.football-data.org/v4/competitions/WC/standings',
    {
      headers: { 'X-Auth-Token': key },
      next: { revalidate: 300 },
    }
  )
  if (!res.ok) throw new Error(`football-data.org returned ${res.status}`)

  const data = await res.json()
  return (data.standings as FdGroup[])
    .filter((g) => g.type === 'TOTAL')
    .sort((a, b) => a.group.localeCompare(b.group))
}

function GroupTable({ group, table }: { group: string; table: FdRow[] }) {
  const label = group.replace('GROUP_', '')

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/8">
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
          Group {label}
        </span>
      </div>

      <div className="px-4 pt-2.5 pb-1 grid grid-cols-[1.25rem_1fr_1.75rem_1.75rem_1.75rem_1.75rem_2rem_2.25rem] gap-x-1.5 text-[9px] uppercase tracking-wider text-white/25">
        <span />
        <span>Team</span>
        <span className="text-center">MP</span>
        <span className="text-center">W</span>
        <span className="text-center">D</span>
        <span className="text-center">L</span>
        <span className="text-center">GD</span>
        <span className="text-center font-bold">Pts</span>
      </div>

      <div className="px-4 pb-3">
        {table.map((row, i) => {
          const { flag, name } = resolveTeam(row.team.name)
          return (
            <div key={row.team.name}>
              {i === 2 && (
                <div className="border-t border-dashed border-white/10 my-1" />
              )}
              <div
                className={`grid grid-cols-[1.25rem_1fr_1.75rem_1.75rem_1.75rem_1.75rem_2rem_2.25rem] gap-x-1.5 items-center py-1.5 ${
                  i < 2 ? 'text-white/90' : 'text-white/40'
                }`}
              >
                <span className="text-[10px] text-white/25 text-right">{i + 1}</span>
                <span className="flex items-center gap-1 min-w-0">
                  <span className="text-sm leading-none">{flag}</span>
                  <span className="font-medium truncate text-[11px]">{name}</span>
                </span>
                <span className="text-center text-xs text-white/50">{row.playedGames}</span>
                <span className="text-center text-xs">{row.won}</span>
                <span className="text-center text-xs">{row.draw}</span>
                <span className="text-center text-xs">{row.lost}</span>
                <span className="text-center text-[11px] text-white/50">
                  {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                </span>
                <span className="text-center text-xs font-bold">{row.points}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default async function StandingsPage() {
  let groups: FdGroup[] = []
  let error: string | null = null

  try {
    groups = await fetchStandings()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load standings'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs font-semibold uppercase tracking-widest text-white/30 px-2">
          Group Standings · June 11 – 28
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {error ? (
        <p className="text-center text-white/30 text-sm py-20">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((g) => (
              <GroupTable key={g.group} group={g.group} table={g.table} />
            ))}
          </div>
          <p className="mt-8 text-center text-[11px] text-white/20">
            Top 2 from each group advance automatically · 8 best third-place teams also qualify · Updates every 5 min
          </p>
        </>
      )}

    </div>
  )
}
