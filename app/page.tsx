import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-900/30 to-transparent px-4 py-20 text-center">
      <div className="absolute inset-0 pointer-events-none select-none opacity-5 text-[18rem] font-black leading-none flex items-center justify-center">⚽</div>
      <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">
        FIFA World Cup 2026 · June 11 – July 19
      </p>
      <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight tracking-tight font-display uppercase">
        FIFA World Cup 2026
      </h1>
      <p className="text-white/50 text-lg max-w-md mx-auto mb-10">
        Download your team&apos;s schedule with 15-min reminders.
        Track the live knockout bracket.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto px-4 sm:px-0">
        <Link
          href="/schedule"
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 sm:py-3 rounded-full font-semibold transition-colors text-center"
        >
          📅 Team Schedules
        </Link>
        <Link
          href="/bracket"
          className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-6 py-3.5 sm:py-3 rounded-full font-semibold transition-colors text-center"
        >
          🏆 Live Bracket
        </Link>
      </div>
    </section>
  )
}
