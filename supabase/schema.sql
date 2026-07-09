-- F2A website schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

-- ---------------------------------------------------------------------------
-- settings (single row)
-- ---------------------------------------------------------------------------
create table if not exists settings (
  id integer primary key default 1,
  company_name text not null default 'F2A',
  tagline text,
  description text,
  logo_url text,
  phone text,
  email text,
  address text,
  lat double precision,
  lng double precision,
  working_hours jsonb not null default '{
    "mon": {"closed": false, "open": "09:00", "close": "17:00"},
    "tue": {"closed": false, "open": "09:00", "close": "17:00"},
    "wed": {"closed": false, "open": "09:00", "close": "17:00"},
    "thu": {"closed": false, "open": "09:00", "close": "17:00"},
    "fri": {"closed": true,  "open": null,    "close": null},
    "sat": {"closed": false, "open": "09:00", "close": "17:00"},
    "sun": {"closed": true,  "open": null,    "close": null}
  }'::jsonb,
  whatsapp_number text,
  facebook_url text,
  instagram_url text,
  updated_at timestamptz not null default now(),
  constraint settings_single_row check (id = 1)
);

insert into settings (id, company_name, tagline)
values (1, 'F2A', 'Materiale ndertimi dhe suvatim')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  price numeric(10, 2),
  image_url text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products(category_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public (anon) visitors can read everything. Only authenticated users
-- (the single admin account, created manually in Supabase Auth) can write.
-- ---------------------------------------------------------------------------
alter table settings enable row level security;
alter table categories enable row level security;
alter table products enable row level security;

create policy "public read settings" on settings
  for select using (true);
create policy "admin write settings" on settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read categories" on categories
  for select using (true);
create policy "admin write categories" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read products" on products
  for select using (true);
create policy "admin write products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage buckets: "logos" and "products", both public-read.
-- Only authenticated users may upload/update/delete. Capped at 8MB per file
-- and images only, matching the client-side check in the admin upload form.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logos', 'logos', true, 8388608, array['image/*'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 8388608, array['image/*'])
on conflict (id) do nothing;

create policy "public read logos bucket" on storage.objects
  for select using (bucket_id = 'logos');
create policy "admin write logos bucket" on storage.objects
  for all using (bucket_id = 'logos' and auth.role() = 'authenticated')
  with check (bucket_id = 'logos' and auth.role() = 'authenticated');

create policy "public read products bucket" on storage.objects
  for select using (bucket_id = 'products');
create policy "admin write products bucket" on storage.objects
  for all using (bucket_id = 'products' and auth.role() = 'authenticated')
  with check (bucket_id = 'products' and auth.role() = 'authenticated');
