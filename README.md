# F2A Website

A commercial website for **F2A**, a plastering / construction materials company, built by
[Kurtishi Solutions](https://kurtishisolutions.com).

A public, bilingual (Albanian/English) marketing site with a browsable product catalog,
paired with a protected `/admin` panel so the client can manage their company info,
categories, and products without touching code.

## Tech stack

- **Next.js** (App Router) + React
- **Tailwind CSS**
- **Supabase** — Postgres database, Auth (single admin login), and Storage (logo/product
  images)
- Deployed on **Vercel** (free tier)

Everything runs on free tiers: Vercel's free hosting/`*.vercel.app` subdomain and
Supabase's free Postgres/Auth/Storage tier.

## Features

- Public site: home page (company info from the DB), products page (category filter +
  search, optional pricing, placeholder images), contact/location footer (click-to-call,
  click-to-WhatsApp, embedded map linking to Google Maps, social links)
- Admin panel (`/admin`): Supabase Auth email/password login, and tabs to manage
  settings (company info, logo, contact details), categories, and products — all
  changes reflect on the public site immediately, no rebuild needed
- Albanian (default) / English toggle via a `useLanguage()` hook + `translations.js`
- Basic SEO: metadata, Open Graph tags, `schema.org` `LocalBusiness` structured data
- Mobile-first responsive layout, graceful empty/loading states

## Project structure

```
src/
  app/            Routes (App Router)
    admin/        Protected admin panel
    products/     Public products page
  components/     Shared React components
  context/        LanguageContext (i18n)
  hooks/          useLanguage()
  lib/            Supabase clients, data access, translations, constants
supabase/
  schema.sql      Database schema, RLS policies, storage buckets
  README.md       Supabase setup instructions
```

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project, then follow `supabase/README.md` to run the schema and
   create the admin user.

3. Copy `.env.local.example` to `.env.local` and fill in your Supabase project URL and
   anon key.

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) for the public site and
   [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Deployment

Deploy to [Vercel](https://vercel.com) (free tier) by connecting this repository and
adding the two environment variables from `.env.local` in the project settings. The
site is served on the free `*.vercel.app` subdomain by default; a custom domain can be
attached later without any code changes.

---

Built by [Kurtishi Solutions](https://kurtishisolutions.com).
