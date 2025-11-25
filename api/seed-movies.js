import { openai, supabase } from './config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse movies.txt
function parseMovies(content) {
  const blocks = content.split('\n\n').filter(Boolean);
  return blocks.map(block => {
    const lines = block.split('\n');
    const titleLine = lines[0];
    const description = lines.slice(1).join(' ').trim();

    // Parse: "Title: Year | Rating | Duration | Score rating"
    const match = titleLine.match(/^(.+?):\s*(\d{4})\s*\|\s*(\S+)\s*\|\s*(.+?)\s*\|\s*([\d.]+)\s*rating/);
    if (!match) {
      console.warn('Could not parse:', titleLine);
      return null;
    }

    return {
      title: match[1].trim(),
      year: parseInt(match[2]),
      rating: match[3],
      duration: match[4].trim(),
      score: parseFloat(match[5]),
      description: description
    };
  }).filter(Boolean);
}

// Generate embedding using OpenAI
async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text
  });
  return response.data[0].embedding;
}

// Main seed function
async function seedMovies() {
  const moviesPath = path.join(__dirname, 'movies.txt');
  const content = fs.readFileSync(moviesPath, 'utf-8');
  const movies = parseMovies(content);

  console.log(`Parsed ${movies.length} movies. Generating embeddings...`);

  for (const movie of movies) {
    // Create text for embedding (title + description)
    const embeddingText = `${movie.title}: ${movie.description}`;

    try {
      const embedding = await generateEmbedding(embeddingText);

      const { error } = await supabase.from('movies').insert({
        title: movie.title,
        year: movie.year,
        rating: movie.rating,
        duration: movie.duration,
        score: movie.score,
        description: movie.description,
        embedding: embedding
      });

      if (error) {
        console.error(`Error inserting ${movie.title}:`, error.message);
      } else {
        console.log(`Inserted: ${movie.title}`);
      }
    } catch (err) {
      console.error(`Error processing ${movie.title}:`, err.message);
    }
  }

  console.log('Seeding complete!');
}

seedMovies();
