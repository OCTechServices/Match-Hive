import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import Link from 'next/link'
import Script from 'next/script'
import NavLogo from '@/components/NavLogo'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
})

export const metadata: Metadata = {
  title: 'Match-Hive — FIFA World Cup 2026 Watch Parties',
  description:
    'Your FIFA World Cup 2026 hub — download your team\'s match schedule with kickoff reminders and track the live knockout bracket.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#080f0b] text-white font-sans antialiased">

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
              <Link href="/standings" className="text-white/60 hover:text-white transition-colors">
                Standings
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 pb-20 sm:pb-0">{children}</main>

        {/* Desktop footer */}
        <footer className="hidden sm:block border-t border-white/10 py-8 text-center text-white/30 text-xs">
          <p>Match-Hive · FIFA World Cup 2026 · June 11 – July 19, 2026</p>
          <p className="mt-1">
            <Link href="/schedule" className="hover:text-white/60 transition-colors mx-2">Schedule</Link>
            <Link href="/bracket" className="hover:text-white/60 transition-colors mx-2">Bracket</Link>
            <Link href="/standings" className="hover:text-white/60 transition-colors mx-2">Standings</Link>
          </p>
        </footer>

        {/* Mobile bottom tab bar */}
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
          <Link href="/standings" className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-white/50 hover:text-white active:text-green-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="3" y1="15" x2="21" y2="15"/>
              <line x1="9" y1="9" x2="9" y2="21"/>
            </svg>
            <span className="text-[10px] font-medium">Standings</span>
          </Link>
        </nav>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
          (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','1538010084523329');
          fbq('track','PageView');
        `}</Script>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <noscript><img height="1" width="1" style={{display:'none'}} alt=""
          src="https://www.facebook.com/tr?id=1538010084523329&ev=PageView&noscript=1"
        /></noscript>

      </body>
    </html>
  )
}
