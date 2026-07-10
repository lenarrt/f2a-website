-- Adds an admin-toggleable "Offers" section on the home page.
-- Run this once in the Supabase SQL editor against your existing project.

alter table settings add column if not exists show_offers boolean not null default false;

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  -- Linked offer: pulls name/image from this product at render time.
  -- Standalone offer: product_id is null, uses title/image_url below instead.
  product_id uuid references products(id) on delete cascade,
  title text,
  description text,
  image_url text,
  offer_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists offers_product_id_idx on offers(product_id);

alter table offers enable row level security;

create policy "public read offers" on offers
  for select using (true);
create policy "admin write offers" on offers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Offer images reuse the existing "products" storage bucket — no new bucket needed.
