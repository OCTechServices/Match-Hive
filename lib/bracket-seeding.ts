// R32 bracket seeding — maps each slot to the group positions that fill it.
// Approximate FIFA 2026 bracket draw: adjacent groups pair against each other.
// Slots 13–16 are reserved for the 8 best third-place teams — not projected.
// If the official draw differs, update the entries below.

export interface GroupPosition {
  group: string  // 'A' through 'L'
  place: 1 | 2
}

export const R32_SEEDING: Record<number, { home: GroupPosition; away: GroupPosition }> = {
  1:  { home: { group: 'A', place: 1 }, away: { group: 'B', place: 2 } },
  2:  { home: { group: 'B', place: 1 }, away: { group: 'A', place: 2 } },
  3:  { home: { group: 'C', place: 1 }, away: { group: 'D', place: 2 } },
  4:  { home: { group: 'D', place: 1 }, away: { group: 'C', place: 2 } },
  5:  { home: { group: 'E', place: 1 }, away: { group: 'F', place: 2 } },
  6:  { home: { group: 'F', place: 1 }, away: { group: 'E', place: 2 } },
  7:  { home: { group: 'G', place: 1 }, away: { group: 'H', place: 2 } },
  8:  { home: { group: 'H', place: 1 }, away: { group: 'G', place: 2 } },
  9:  { home: { group: 'I', place: 1 }, away: { group: 'J', place: 2 } },
  10: { home: { group: 'J', place: 1 }, away: { group: 'I', place: 2 } },
  11: { home: { group: 'K', place: 1 }, away: { group: 'L', place: 2 } },
  12: { home: { group: 'L', place: 1 }, away: { group: 'K', place: 2 } },
  // 13–16: third-place qualifier slots — projection skipped
}
