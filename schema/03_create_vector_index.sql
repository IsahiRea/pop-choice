-- Create HNSW index for fast approximate nearest neighbor search
-- HNSW (Hierarchical Navigable Small World) provides efficient similarity search
-- Uses cosine similarity operator (<=>)
create index movies_embedding_idx on movies
using hnsw (embedding vector_cosine_ops);

-- Alternative: You can also create an IVFFlat index (commented out)
-- IVFFlat is faster to build but may be less accurate for some queries
-- create index movies_embedding_idx on movies
-- using ivfflat (embedding vector_cosine_ops)
-- with (lists = 100);
