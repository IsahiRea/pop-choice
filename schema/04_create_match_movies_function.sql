-- Function for semantic similarity search
-- Searches for movies similar to a query embedding using cosine similarity
--
-- Parameters:
--   query_embedding: The embedding vector to search for (1536 dimensions)
--   match_threshold: Similarity threshold (0.0 to 1.0, default 0.7)
--                    Higher values = stricter matching, lower values = more results
--   match_count: Maximum number of results to return (default 5, max 20)
--
-- Returns: Set of movies ordered by similarity (most similar first)
create or replace function match_movies (
  query_embedding extensions.vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
)
returns setof movies
language sql
stable
as $$
  select *
  from movies
  where movies.embedding <=> query_embedding < 1 - match_threshold
  order by movies.embedding <=> query_embedding asc
  limit least(match_count, 20);
$$;

-- Grant execute permission to authenticated users
-- Adjust this based on your authentication requirements
grant execute on function match_movies to anon, authenticated;
