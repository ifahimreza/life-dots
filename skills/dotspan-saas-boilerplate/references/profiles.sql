-- DotSpan SaaS boilerplate profile schema (Supabase)
-- Run in Supabase SQL Editor and adapt columns to your billing model.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Product access flag used by private UI and feature gates.
  has_access boolean not null default false,

  -- Freemius linkage
  freemius_user_id text,
  freemius_customer_id text,
  freemius_subscription_id text,
  freemius_plan_id text,
  freemius_billing_cycle text,
  freemius_next_charge_at timestamptz,

  -- App payload
  profile jsonb not null default '{}'::jsonb
);

create index if not exists idx_profiles_has_access on public.profiles (has_access);
create index if not exists idx_profiles_freemius_customer_id on public.profiles (freemius_customer_id);
create index if not exists idx_profiles_freemius_subscription_id on public.profiles (freemius_subscription_id);

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
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Users can read their own profile row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Users can update only their own row.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Users can insert only their own row.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- Optional: create row on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
