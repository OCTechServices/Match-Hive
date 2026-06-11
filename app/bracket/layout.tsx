import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Match-Hive — FIFA World Cup 2026 Knockout Bracket',
  description:
    'Live FIFA World Cup 2026 knockout bracket. Track every result from the Round of 32 through the Final in Los Angeles.',
  openGraph: {
    title: 'World Cup 2026 Knockout Bracket — Match-Hive',
    description:
      'Live results and fixtures for every knockout round. Round of 32 through the Final.',
  },
}

export default function BracketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
