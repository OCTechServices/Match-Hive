import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import NavLogo from '@/components/NavLogo'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Match-Hive — FIFA World Cup 2026 Watch Parties',
  description:
    'Find the best World Cup 2026 watch party venues near you. Browse listings, download your team schedule with reminders, and track the live knockout bracket.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#080f0b] text-white font-sans">

        {/* ── Top nav ── */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080f0b]/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" aria-label="Match-Hive home">
              <NavLogo />
            </Link>
            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-5 text-sm">
              <Link href="/schedule" className="text-white/60 hover:text-white transition-colors">
                Schedule
              </Link>
              <Link href="/bracket" className="text-white/60 hover:text-white transition-colors">
                Bracket
              </Link>
              <Link
                href="/submit"
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-full font-medium transition-colors"
              >
                List Venue
              </Link>
            </nav>
            {/* Mobile — show List Venue button only (bottom nav handles the rest) */}
            <Link
              href="/submit"
              className="sm:hidden bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            >
              + List Venue
            </Link>
          </div>
        </header>

        {/* ── Page content (extra bottom padding on mobile for bottom nav) ── */}
        <main className="flex-1 pb-20 sm:pb-0">{children}</main>

        {/* ── Desktop footer ── */}
        <footer className="hidden sm:block border-t border-white/10 py-8 text-center text-white/30 text-xs">
          <p>Match-Hive · FIFA World Cup 2026 · June 11 – July 19, 2026</p>
          <p className="mt-1">
            <Link href="/schedule" className="hover:text-white/60 transition-colors mx-2">Schedule</Link>
            <Link href="/bracket" className="hover:text-white/60 transition-colors mx-2">Bracket</Link>
            <Link href="/submit" className="hover:text-white/60 transition-colors mx-2">List Venue</Link>
          </p>
        </footer>

        {/* ── Mobile bottom tab bar ── */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080f0b]/95 backdrop-blur border-t border-white/10 flex">
          <Link href="/" className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-white/50 hover:text-white active:text-green-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              <path d="M9 21V12h6v9"/>
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="/schedule" className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-white/50 hover:text-white active:text-green-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-[10px] font-medium">Schedule</span>
          </Link>
          <Link href="/bracket" className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-white/50 hover:text-white active:text-green-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
            </svg>
            <span className="text-[10px] font-medium">Bracket</span>
          </Link>
          <Link href="/submit" className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-white/50 hover:text-white active:text-green-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-[10px] font-medium">Venues</span>
          </Link>
        </nav>

      </body>
    </html>
  )
}
