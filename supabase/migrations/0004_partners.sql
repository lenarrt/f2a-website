-- Restructures the catalog: partners (distributor brands, e.g. Renova,
-- Putzplas, Knauf) each with a logo and a simple list of product names
-- they supply, replacing the old standalone products + categories model
-- entirely.
-- Run this once in the Supabase SQL editor against your existing project.

-- Offers linked to an old product lose that link once `products` is
-- dropped below — remove them rather than leave a broken reference.
-- Standalone offers (no product_id) are untouched.
delete from offers where product_id is not null;

alter table offers drop column if exists product_id;

drop table if exists products cascade;
drop table if exists categories cascade;

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists partner_products (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists partner_products_partner_id_idx
  on partner_products(partner_id);

alter table offers add column if not exists partner_product_id
  uuid references partner_products(id) on delete cascade;

create index if not exists offers_partner_product_id_idx
  on offers(partner_product_id);

alter table partners enable row level security;
alter table partner_products enable row level security;

create policy "public read partners" on partners
  for select using (true);
create policy "admin write partners" on partners
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read partner_products" on partner_products
  for select using (true);
create policy "admin write partner_products" on partner_products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Partner logos reuse the existing "products" storage bucket (kept under
-- that name for standalone offer images too) — no new bucket needed.
