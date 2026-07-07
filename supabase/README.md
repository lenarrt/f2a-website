# Supabase setup

1. **Run the schema.** In your Supabase project, open SQL Editor > New query, paste the
   contents of `schema.sql`, and run it. This creates the `settings`, `categories`, and
   `products` tables (with RLS policies) plus the `logos` and `products` storage buckets.

2. **Create the admin user.** Go to Authentication > Users > Add user, and create the
   single admin account with an email/password. This is the only account that can log
   in to `/admin` — there is no self-service signup.

3. **Copy your API keys.** Go to Project Settings > API and copy the Project URL and
   `anon` `public` key into `.env.local` (see `.env.local.example` in the repo root).
   Never commit `.env.local`.

That's it — no other configuration is required. Everything else (company info,
categories, products, images) is managed from the `/admin` panel after deploy.
