import type { Metadata } from 'next'
import type { BracketMatch } from '@/data/bracket'
import BRACKET_STATIC from '@/data/bracket-static.json'
import BracketView from '@/components/BracketView'

export const metadata: Metadata = {
  title: 'Match-Hive — FIFA World Cup 2026 Knockout Bracket',
  description: 'Final FIFA World Cup 2026 knockout bracket. Spain won the 2026 World Cup, defeating Argentina 1-0 in extra time.',
}

export default function BracketPage() {
  return <BracketView matches={BRACKET_STATIC as BracketMatch[]} />
}
