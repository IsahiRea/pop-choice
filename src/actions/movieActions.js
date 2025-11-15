/**
 * Action handler for movie recommendations
 * Processes form data from Questions page and fetches AI-powered recommendations
 * from vector database
 */
export async function loadMovieRecommendations({ request }) {
  const formData = await request.formData();

  // Parse the JSON string containing all people's answers
  const allAnswersJson = formData.get('allAnswers');
  const allAnswers = allAnswersJson ? JSON.parse(allAnswersJson) : [];

  // Collect all user preferences
  const preferences = {
    numberOfPeople: formData.get('numberOfPeople'),
    duration: formData.get('duration'),
    allAnswers: allAnswers, // Array of all people's responses
  };

  try {
    // TODO: Use AI/Vector DB to get movie recommendations based on preferences
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }

    const recommendations = await response.json();

    return {
      recommendations,
      preferences,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error loading movie recommendations:', error);

    // Return error data that can be displayed to user
    return {
      error: error.message,
      preferences,
    };
  }
}
