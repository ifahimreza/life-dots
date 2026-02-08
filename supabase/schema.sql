-- DotSpan Supabase schema
-- Creates profiles table used by auth/profile/billing flows.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  profile jsonb not null default '{}'::jsonb,
  has_access boolean not null default false,

  customer_id text,
  price_id text,
  freemius_user_id text,
  freemius_license_id text,
  freemius_subscription_id text,
  freemius_pricing_id text,
  freemius_plan_id text,
  freemius_last_event_type text,
  freemius_last_event_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles(email);

create unique index if not exists profiles_freemius_user_id_uidx
  on public.profiles(freemius_user_id)
  where freemius_user_id is not null;

create unique index if not exists profiles_customer_id_uidx
  on public.profiles(customer_id)
  where customer_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);
