// R32 bracket seeding — maps each FIFA match ID (M73–M88) to the group
// positions that fill the home and away slots.
// Source: Official FIFA 2026 World Cup knockout bracket draw.

export type SeedRef =
  | { kind: 'group';   group: string; place: 1 | 2 }   // e.g. '1st Group A'
  | { kind: 'best3rd'; groups: string[] }               // e.g. 'Best 3rd A/B/C/D/F'

export interface R32Seeding {
  home: SeedRef
  away: SeedRef
}

// Keys are FIFA match IDs M73–M88
export const R32_SEEDING: Record<string, R32Seeding> = {
  M73: { home: { kind: 'group',   group: 'A', place: 2 },                   away: { kind: 'group',   group: 'B', place: 2 } },
  M74: { home: { kind: 'group',   group: 'E', place: 1 },                   away: { kind: 'best3rd', groups: ['A','B','C','D','F'] } },
  M75: { home: { kind: 'group',   group: 'F', place: 1 },                   away: { kind: 'group',   group: 'C', place: 2 } },
  M76: { home: { kind: 'group',   group: 'C', place: 1 },                   away: { kind: 'group',   group: 'F', place: 2 } },
  M77: { home: { kind: 'group',   group: 'I', place: 1 },                   away: { kind: 'best3rd', groups: ['C','D','F','G','H'] } },
  M78: { home: { kind: 'group',   group: 'E', place: 2 },                   away: { kind: 'group',   group: 'I', place: 2 } },
  M79: { home: { kind: 'group',   group: 'A', place: 1 },                   away: { kind: 'best3rd', groups: ['C','E','F','H','I'] } },
  M80: { home: { kind: 'group',   group: 'L', place: 1 },                   away: { kind: 'best3rd', groups: ['E','H','I','J','K'] } },
  M81: { home: { kind: 'group',   group: 'D', place: 1 },                   away: { kind: 'best3rd', groups: ['B','E','F','I','J'] } },
  M82: { home: { kind: 'group',   group: 'G', place: 1 },                   away: { kind: 'best3rd', groups: ['A','E','H','I','J'] } },
  M83: { home: { kind: 'group',   group: 'K', place: 2 },                   away: { kind: 'group',   group: 'L', place: 2 } },
  M84: { home: { kind: 'group',   group: 'H', place: 1 },                   away: { kind: 'group',   group: 'J', place: 2 } },
  M85: { home: { kind: 'group',   group: 'B', place: 1 },                   away: { kind: 'best3rd', groups: ['E','F','G','I','J'] } },
  M86: { home: { kind: 'group',   group: 'J', place: 1 },                   away: { kind: 'group',   group: 'H', place: 2 } },
  M87: { home: { kind: 'group',   group: 'K', place: 1 },                   away: { kind: 'best3rd', groups: ['D','E','I','J','L'] } },
  M88: { home: { kind: 'group',   group: 'D', place: 2 },                   away: { kind: 'group',   group: 'G', place: 2 } },
}
