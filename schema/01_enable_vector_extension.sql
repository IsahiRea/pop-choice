-- Enable the pgvector extension for vector similarity search
-- This extension provides support for storing and querying vector embeddings
create extension if not exists vector with schema extensions;
