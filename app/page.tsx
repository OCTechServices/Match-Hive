import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="relative overflow-hidden px-4 py-12 sm:py-20 text-center">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-green-600/[0.07] rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/40 via-transparent to-transparent pointer-events-none" />

      <div className="relative">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-6 h-px bg-green-500/40" />
          <p className="text-green-400 text-[11px] font-semibold uppercase tracking-[0.18em]">
            FIFA World Cup 2026 · June 11 – July 19
          </p>
          <span className="w-6 h-px bg-green-500/40" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight tracking-tight font-display uppercase">
          FIFA World Cup 2026
        </h1>

        {/* Subtitle */}
        <p className="text-white/40 text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed">
          Download your team&apos;s schedule with 15-min reminders.
          Track the live knockout bracket.
        </p>

        {/* CTAs — primary full width on mobile, secondary side-by-side */}
        <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center sm:w-auto px-4 sm:px-0">
          <Link
            href="/schedule"
            className="bg-green-600 hover:bg-green-500 active:scale-[0.97] text-white px-7 py-3.5 sm:py-3 rounded-full font-semibold transition-all text-center"
          >
            Team Schedules
          </Link>
          <div className="flex gap-3 sm:contents">
            <Link
              href="/bracket"
              className="flex-1 sm:flex-none border border-white/15 hover:border-white/30 hover:bg-white/[0.05] active:scale-[0.97] text-white/70 hover:text-white px-7 py-3.5 sm:py-3 rounded-full font-semibold transition-all text-center"
            >
              Live Bracket
            </Link>
            <Link
              href="/standings"
              className="flex-1 sm:flex-none border border-white/15 hover:border-white/30 hover:bg-white/[0.05] active:scale-[0.97] text-white/70 hover:text-white px-7 py-3.5 sm:py-3 rounded-full font-semibold transition-all text-center"
            >
              Standings
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
