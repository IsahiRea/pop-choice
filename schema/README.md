# Database Schema

This directory contains SQL migration files for the PopChoice movie recommendation database.

## Files Overview

The migration files should be executed in order:

1. **01_enable_vector_extension.sql** - Enables the pgvector extension for vector similarity search
2. **02_create_movies_table.sql** - Creates the movies table with vector embeddings support
3. **03_create_vector_index.sql** - Creates HNSW index for fast similarity search
4. **04_create_match_movies_function.sql** - Creates the `match_movies` function for semantic search

## Setup Instructions

### Option 1: Run Individually in Supabase SQL Editor

1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each file's contents in order (01 → 04)
4. Execute each query

### Option 2: Run All at Once

Copy and paste all files in order into a single SQL Editor query, or concatenate them:

```bash
cat schema/*.sql | pbcopy  # macOS
cat schema/*.sql | xclip   # Linux
```

Then paste into Supabase SQL Editor and execute.

## Database Schema

### Movies Table

| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| title | text | Movie title |
| year | int | Release year |
| rating | text | Content rating (PG, PG-13, R, etc.) |
| duration | text | Runtime (e.g., "2 hr 30 min") |
| score | float | IMDB rating |
| description | text | Movie description/plot |
| embedding | vector(1536) | OpenAI embedding for semantic search |
| created_at | timestamp | Creation timestamp |

## Semantic Search Function

### match_movies()

```sql
match_movies(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
)
```

**Parameters:**
- `query_embedding`: Vector representation of user preferences (from OpenAI)
- `match_threshold`: Similarity threshold (0.0-1.0, default 0.7)
  - Higher = stricter matching, fewer results
  - Lower = more lenient matching, more results
- `match_count`: Maximum results to return (default 5, max 20)

**Returns:** Movies ordered by similarity (closest matches first)

**Usage in JavaScript:**
```javascript
const { data } = await supabase.rpc('match_movies', {
  query_embedding: userPreferenceEmbedding,
  match_threshold: 0.5,
  match_count: 10
});
```

## After Running Migrations

1. Verify the movies table exists:
   ```sql
   select * from movies limit 1;
   ```

2. Test the match_movies function (after seeding data):
   ```sql
   select title, year, rating
   from match_movies(
     (select embedding from movies limit 1),
     0.7,
     5
   );
   ```

3. Run the seed script to populate movies:
   ```bash
   node --env-file=.env api/seed-movies.js
   ```

## Notes

- **Vector Dimensions**: OpenAI's `text-embedding-ada-002` uses 1536 dimensions
- **Index Type**: HNSW provides fast approximate nearest neighbor search
- **Similarity Metric**: Cosine similarity (`<=>` operator)
- **RLS**: Row Level Security is enabled on the movies table
- **Permissions**: Read access is granted to all users (public)

## Troubleshooting

### Extension Error
If you get an error about the vector extension:
- Ensure you're using Supabase (pgvector is pre-installed)
- Run `create extension if not exists vector;` manually

### Index Build Time
- HNSW index may take time to build on large datasets
- Consider using IVFFlat for faster builds (see 03_create_vector_index.sql comments)

### Permission Errors
- Ensure RLS policies match your authentication setup
- Modify policies in `02_create_movies_table.sql` as needed
