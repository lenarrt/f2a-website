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
  show_offers boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint settings_single_row check (id = 1)
);

insert into settings (id, company_name, tagline)
values (1, 'F2A', 'Materiale ndertimi dhe suvatim')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- partners (distributor brands, e.g. Renova, Putzplas, Knauf)
-- ---------------------------------------------------------------------------
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- partner_products (simple product names a partner supplies, e.g.
-- Knauf -> "Rigips", "Plaster", "Adhesive" — no image/price/description)
-- ---------------------------------------------------------------------------
create table if not exists partner_products (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists partner_products_partner_id_idx
  on partner_products(partner_id);

-- ---------------------------------------------------------------------------
-- offers (shown on the home page when settings.show_offers is true)
-- ---------------------------------------------------------------------------
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  -- Linked offer: pulls the name from this partner product at render
  -- time. Standalone offer: partner_product_id is null, uses the
  -- title/image_url below instead.
  partner_product_id uuid references partner_products(id) on delete cascade,
  title text,
  description text,
  image_url text,
  offer_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists offers_partner_product_id_idx
  on offers(partner_product_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public (anon) visitors can read everything. Only authenticated users
-- (the single admin account, created manually in Supabase Auth) can write.
-- ---------------------------------------------------------------------------
alter table settings enable row level security;
alter table partners enable row level security;
alter table partner_products enable row level security;
alter table offers enable row level security;

create policy "public read settings" on settings
  for select using (true);
create policy "admin write settings" on settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read partners" on partners
  for select using (true);
create policy "admin write partners" on partners
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read partner_products" on partner_products
  for select using (true);
create policy "admin write partner_products" on partner_products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read offers" on offers
  for select using (true);
create policy "admin write offers" on offers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage buckets: "logos" (company logo) and "products" (partner logos
-- and standalone offer images), both public-read. Only authenticated users
-- may upload/update/delete. Capped at 8MB per file and images only,
-- matching the client-side check in the admin upload form.
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
