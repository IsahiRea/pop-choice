-- Add policy to allow inserts for authenticated users or service role
-- This is needed if you're using the anon key for seeding
-- For production, you should use the service role key for backend operations

-- Option A: Allow inserts from authenticated users only
create policy "Allow authenticated insert access"
  on movies
  for insert
  to authenticated
  with check (true);

-- Option B: Allow inserts from anyone (including anon role)
-- WARNING: Only use this temporarily for seeding, then drop it
-- create policy "Allow public insert access"
--   on movies
--   for insert
--   to anon
--   with check (true);
