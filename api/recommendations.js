import { openai, supabase } from './config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { numberOfPeople, duration, allAnswers } = req.body;

    // Build a prompt from all users' answers
    const preferenceSummary = allAnswers.map(answer =>
      `Person ${answer.person}: Favorite movie "${answer.favoriteMovie}", prefers ${answer.newOrClassic} films, mood: ${answer.mood}, island movie: "${answer.islandPerson}"`
    ).join('\n');

    const queryText = `Group of ${numberOfPeople} people with ${duration} minutes to watch. Preferences:\n${preferenceSummary}`;

    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: queryText
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Search for similar movies in Supabase
    const { data: movies, error: searchError } = await supabase.rpc('match_movies', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 10
    });

    if (searchError) {
      throw new Error(`Supabase search error: ${searchError.message}`);
    }

    // Use OpenAI to pick the best recommendation and explain why
    const movieList = movies.map(m =>
      `- ${m.title} (${m.year}, ${m.rating}, ${m.duration}): ${m.description}`
    ).join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a movie recommendation assistant. Given user preferences and a list of candidate movies, recommend the best match and explain why it suits the group.'
        },
        {
          role: 'user',
          content: `User preferences:\n${preferenceSummary}\n\nTime available: ${duration} minutes\n\nCandidate movies:\n${movieList}\n\nRecommend the best movie for this group and explain why in 2-3 sentences.`
        }
      ]
    });

    const recommendation = completion.choices[0].message.content;
    const topMovie = movies[0];

    return res.status(200).json({
      recommendations: [{
        title: topMovie?.title,
        description: topMovie?.description,
        rating: topMovie?.rating,
        year: topMovie?.year,
        duration: topMovie?.duration,
        score: topMovie?.score
      }],
      explanation: recommendation,
      allMatches: movies
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
