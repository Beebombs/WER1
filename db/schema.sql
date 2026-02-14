create extension if not exists pgcrypto;

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  pet_type text not null check (pet_type in ('dog', 'cat')),
  email text not null,
  video_url text not null,
  video_key text not null,
  video_mime text not null,
  video_size integer not null,
  original_filename text not null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create index if not exists submissions_payment_status_idx on submissions (payment_status);
