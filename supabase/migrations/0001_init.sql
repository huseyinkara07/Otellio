-- Otellio SaaS panel semasi: hotels + reservations, RLS ile kullaniciya
-- (auth.uid()) sahiplik uzerinden izole edilir. anon/authenticated rolleri
-- Supabase'de her yeni tabloya varsayilan olarak tam CRUD grant'i alir
-- (bkz. pg_default_acl); bu yuzden RLS, ayni transaction icinde,
-- CREATE TABLE ile birlikte devreye alinir.

drop table if exists oteller;

create table hotels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null,
  room_count int not null check (room_count > 0),
  base_price numeric not null default 0 check (base_price >= 0),
  created_at timestamptz not null default now()
);

alter table hotels enable row level security;

create policy "hotels_owner_all"
  on hotels
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table reservations (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels (id) on delete cascade,
  stay_date date not null,
  rooms_sold int not null check (rooms_sold >= 0),
  revenue numeric check (revenue >= 0),
  created_at timestamptz not null default now(),
  unique (hotel_id, stay_date)
);

alter table reservations enable row level security;

create policy "reservations_owner_all"
  on reservations
  for all
  to authenticated
  using (hotel_id in (select id from hotels where user_id = auth.uid()))
  with check (hotel_id in (select id from hotels where user_id = auth.uid()));
