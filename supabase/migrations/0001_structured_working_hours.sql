-- Replaces settings.working_hours (free text) with structured per-day hours.
-- Run this once in the Supabase SQL editor against your existing project.
--
-- NOTE: this drops the old free-text working_hours column, so any text
-- you already entered there will be lost. Re-enter it via /admin > Settings
-- afterwards using the new per-day editor.

alter table settings drop column if exists working_hours;

alter table settings add column working_hours jsonb not null default '{
  "mon": {"closed": false, "open": "09:00", "close": "17:00"},
  "tue": {"closed": false, "open": "09:00", "close": "17:00"},
  "wed": {"closed": false, "open": "09:00", "close": "17:00"},
  "thu": {"closed": false, "open": "09:00", "close": "17:00"},
  "fri": {"closed": true,  "open": null,    "close": null},
  "sat": {"closed": false, "open": "09:00", "close": "17:00"},
  "sun": {"closed": true,  "open": null,    "close": null}
}'::jsonb;
