-- Caps the logos/products storage buckets at 8MB per file, images only.
-- Matches the client-side check added to the admin image upload form, and
-- protects the free-tier 1GB storage cap from a single oversized upload.
-- Run this once in the Supabase SQL editor against your existing project.

update storage.buckets
set file_size_limit = 8388608, -- 8MB
    allowed_mime_types = array['image/*']
where id in ('logos', 'products');
