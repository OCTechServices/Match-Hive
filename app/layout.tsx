import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'MatchHive — FIFA World Cup 2026 Watch Parties',
  description:
    'Find the best World Cup 2026 watch party venues near you. Browse listings, download your team schedule with reminders, and track the live knockout bracket.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#080f0b] text-white font-sans">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080f0b]/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-base text-green-400 tracking-tight">
              ⚽ MatchHive
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/schedule" className="text-white/60 hover:text-white transition-colors hidden sm:block">
                Schedule
              </Link>
              <Link href="/bracket" className="text-white/60 hover:text-white transition-colors hidden sm:block">
                Bracket
              </Link>
              <Link
                href="/submit"
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-full font-medium transition-colors"
              >
                List Venue
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-white/10 py-8 text-center text-white/30 text-xs">
          <p>MatchHive · FIFA World Cup 2026 · June 11 – July 19, 2026</p>
          <p className="mt-1">
            <Link href="/schedule" className="hover:text-white/60 transition-colors mx-2">Schedule</Link>
            <Link href="/bracket" className="hover:text-white/60 transition-colors mx-2">Bracket</Link>
            <Link href="/submit" className="hover:text-white/60 transition-colors mx-2">List Venue</Link>
          </p>
        </footer>
      </body>
    </html>
  )
}
