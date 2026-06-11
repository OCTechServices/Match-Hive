-- =====================================================================
-- WATCH PARTY SPHERE — Supabase Schema
-- Run this in Supabase SQL Editor: supabase.com/dashboard/project/_/sql
-- =====================================================================

-- ── BUSINESSES ────────────────────────────────────────────────────────
-- Verified listings shown publicly on the Lovable frontend

create table if not exists public.businesses (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  address      text not null,
  city         text not null,
  state        text not null,
  zip          text not null,
  phone        text,
  instagram    text,
  twitter      text,
  website      text,
  promo_text   text,
  busyness     int  default 3 check (busyness between 1 and 5),
  verified     boolean default false,
  created_at   timestamptz default now()
);

-- Public read access for verified listings
alter table public.businesses enable row level security;

create policy "Public can read verified businesses"
  on public.businesses for select
  using (verified = true);

-- ── SUBMISSIONS ───────────────────────────────────────────────────────
-- Business opt-in form submissions (pending admin review)

create table if not exists public.submissions (
  id              uuid default gen_random_uuid() primary key,
  business_name   text not null,
  contact_name    text not null,
  email           text not null,
  phone           text not null,
  address         text not null,
  city            text not null,
  state           text not null,
  zip             text not null,
  ein             text not null,
  doc_url         text,
  agreed_to_terms boolean not null default false,
  status          text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected')),
  created_at      timestamptz default now()
);

-- No public reads — admin only via service role key
alter table public.submissions enable row level security;

-- ── BRACKET MATCHES ───────────────────────────────────────────────────
-- Live knockout bracket. Update home_team/away_team/scores/winner
-- via the Supabase dashboard as matches are played.

create table if not exists public.bracket_matches (
  id           text primary key,   -- "R32-1", "QF-2", "FINAL", etc.
  round        text not null check (round in ('r32','r16','qf','sf','3rd','final')),
  slot         int  not null,
  home_team    text,               -- null = TBD until group stage completes
  away_team    text,               -- null = TBD
  home_score   int,
  away_score   int,
  winner       text,
  date_utc     timestamptz,
  venue        text,
  city         text,
  status       text not null default 'upcoming'
               check (status in ('upcoming','live','completed')),
  created_at   timestamptz default now()
);

-- Public read for bracket display
alter table public.bracket_matches enable row level security;

create policy "Public can read bracket"
  on public.bracket_matches for select
  using (true);

-- ── STORAGE BUCKET ────────────────────────────────────────────────────
-- For EIN / business license document uploads from the opt-in form

insert into storage.buckets (id, name, public)
values ('submissions-docs', 'submissions-docs', false)
on conflict (id) do nothing;

-- ── SEED: BRACKET SLOTS ───────────────────────────────────────────────
-- Run after table creation. Populates all 31 knockout match slots.
-- Update home_team/away_team after group stage completes (June 26).

insert into public.bracket_matches (id, round, slot, date_utc, venue, city, status) values
-- Round of 32
('R32-1',  'r32', 1,  '2026-06-29T16:00:00Z', 'MetLife Stadium',           'East Rutherford', 'upcoming'),
('R32-2',  'r32', 2,  '2026-06-29T19:00:00Z', 'Hard Rock Stadium',         'Miami Gardens',   'upcoming'),
('R32-3',  'r32', 3,  '2026-06-29T22:00:00Z', 'Rose Bowl',                 'Pasadena',        'upcoming'),
('R32-4',  'r32', 4,  '2026-06-30T01:00:00Z', 'AT&T Stadium',              'Arlington',       'upcoming'),
('R32-5',  'r32', 5,  '2026-06-30T16:00:00Z', 'BMO Field',                 'Toronto',         'upcoming'),
('R32-6',  'r32', 6,  '2026-06-30T19:00:00Z', 'Gillette Stadium',          'Foxborough',      'upcoming'),
('R32-7',  'r32', 7,  '2026-06-30T22:00:00Z', 'SoFi Stadium',              'Inglewood',       'upcoming'),
('R32-8',  'r32', 8,  '2026-07-01T01:00:00Z', 'Lumen Field',               'Seattle',         'upcoming'),
('R32-9',  'r32', 9,  '2026-07-01T16:00:00Z', 'BC Place',                  'Vancouver',       'upcoming'),
('R32-10', 'r32', 10, '2026-07-01T19:00:00Z', 'Arrowhead Stadium',         'Kansas City',     'upcoming'),
('R32-11', 'r32', 11, '2026-07-01T22:00:00Z', 'Allegiant Stadium',         'Las Vegas',       'upcoming'),
('R32-12', 'r32', 12, '2026-07-02T01:00:00Z', 'Levi''s Stadium',           'Santa Clara',     'upcoming'),
('R32-13', 'r32', 13, '2026-07-02T16:00:00Z', 'Lincoln Financial Field',   'Philadelphia',    'upcoming'),
('R32-14', 'r32', 14, '2026-07-02T19:00:00Z', 'Estadio Azteca',            'Mexico City',     'upcoming'),
('R32-15', 'r32', 15, '2026-07-02T22:00:00Z', 'Estadio Akron',             'Guadalajara',     'upcoming'),
('R32-16', 'r32', 16, '2026-07-03T01:00:00Z', 'Estadio BBVA',              'Monterrey',       'upcoming'),
-- Round of 16
('R16-1',  'r16', 1,  '2026-07-04T18:00:00Z', 'MetLife Stadium',           'East Rutherford', 'upcoming'),
('R16-2',  'r16', 2,  '2026-07-04T22:00:00Z', 'Hard Rock Stadium',         'Miami Gardens',   'upcoming'),
('R16-3',  'r16', 3,  '2026-07-05T18:00:00Z', 'Rose Bowl',                 'Pasadena',        'upcoming'),
('R16-4',  'r16', 4,  '2026-07-05T22:00:00Z', 'AT&T Stadium',              'Arlington',       'upcoming'),
('R16-5',  'r16', 5,  '2026-07-06T18:00:00Z', 'SoFi Stadium',              'Inglewood',       'upcoming'),
('R16-6',  'r16', 6,  '2026-07-06T22:00:00Z', 'Arrowhead Stadium',         'Kansas City',     'upcoming'),
('R16-7',  'r16', 7,  '2026-07-07T18:00:00Z', 'MetLife Stadium',           'East Rutherford', 'upcoming'),
('R16-8',  'r16', 8,  '2026-07-07T22:00:00Z', 'Hard Rock Stadium',         'Miami Gardens',   'upcoming'),
-- Quarter-Finals
('QF-1',   'qf',  1,  '2026-07-10T18:00:00Z', 'MetLife Stadium',           'East Rutherford', 'upcoming'),
('QF-2',   'qf',  2,  '2026-07-10T22:00:00Z', 'Rose Bowl',                 'Pasadena',        'upcoming'),
('QF-3',   'qf',  3,  '2026-07-11T18:00:00Z', 'AT&T Stadium',              'Arlington',       'upcoming'),
('QF-4',   'qf',  4,  '2026-07-11T22:00:00Z', 'SoFi Stadium',              'Inglewood',       'upcoming'),
-- Semi-Finals
('SF-1',   'sf',  1,  '2026-07-14T22:00:00Z', 'MetLife Stadium',           'East Rutherford', 'upcoming'),
('SF-2',   'sf',  2,  '2026-07-15T22:00:00Z', 'Rose Bowl',                 'Pasadena',        'upcoming'),
-- Third Place
('3RD',    '3rd', 1,  '2026-07-18T22:00:00Z', 'AT&T Stadium',              'Arlington',       'upcoming'),
-- Final
('FINAL',  'final', 1,'2026-07-19T22:00:00Z', 'MetLife Stadium',           'East Rutherford', 'upcoming')
on conflict (id) do nothing;
