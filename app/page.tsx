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

        {/* Social links */}
        <div className="flex items-center justify-center gap-5 mt-8">
          <a
            href="https://www.instagram.com/match.hive/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Match-Hive on Instagram"
            className="text-white/30 hover:text-white/70 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61590853255594"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Match-Hive on Facebook"
            className="text-white/30 hover:text-white/70 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
