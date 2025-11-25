-- Create movies table with vector embeddings for semantic search
-- Uses OpenAI's text-embedding-ada-002 model which outputs 1536-dimensional vectors
create table movies (
  id serial primary key,
  title text not null,
  year int,
  rating text,
  duration text,
  score float,
  description text not null,
  embedding extensions.vector(1536),  -- OpenAI ada-002 uses 1536 dimensions
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table movies enable row level security;

-- Create a policy to allow read access to all users
-- Adjust this based on your authentication requirements
create policy "Allow public read access"
  on movies
  for select
  using (true);
