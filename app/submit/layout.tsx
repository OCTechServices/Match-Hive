import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Match-Hive — List Your Venue | FIFA World Cup 2026',
  description:
    'Free to list during World Cup 2026. Add your bar, restaurant, or venue and show up where fans are looking for watch parties.',
  openGraph: {
    title: 'List Your Watch Party Venue — Match-Hive',
    description:
      'Free venue listings for FIFA World Cup 2026. Get discovered by fans searching for the best watch parties near them.',
  },
}

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
