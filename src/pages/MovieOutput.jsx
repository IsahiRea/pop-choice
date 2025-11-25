import { useActionData, useNavigation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/MovieOutput.css';

function MovieOutput() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  // Show loading state while AI/Vector DB is processing
  if (navigation.state === 'loading') {
    return (
      <div className="movie-output-container loading">
        <h1 className="loading-title">PopChoice</h1>
        <div className="loading-content">
          <p>🎬 Finding the perfect movies for you...</p>
          <p>Analyzing your preferences with AI...</p>
        </div>
      </div>
    );
  }

  // Handle case where no data is available
  if (!actionData) {
    return (
      <div className="movie-output-container error">
        <h1 className="error-title">PopChoice</h1>
        <p className="error-message">No recommendations available. Please start from the beginning.</p>
        <button
          className="submit-button restart-button"
          onClick={() => navigate('/')}
        >
          Start Over
        </button>
      </div>
    );
  }

  // Handle error state
  if (actionData.error) {
    return (
      <div className="movie-output-container error">
        <h1 className="error-title">PopChoice</h1>
        <div className="error-content">
          <h2>Oops! Something went wrong</h2>
          <p className="error-message">{actionData.error}</p>
          <p>Please try again.</p>
          <button
            className="submit-button restart-button"
            onClick={() => navigate('/')}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // The API response is nested in actionData.recommendations
  const apiResponse = actionData.recommendations || {};
  const { recommendations = [], allMatches = [] } = apiResponse;
  const movies = allMatches.length > 0 ? allMatches : recommendations;

  // Get current movie
  const currentMovie = movies[currentMovieIndex];

  // Handle next movie
  const handleNextMovie = () => {
    if (currentMovieIndex < movies.length - 1) {
      setCurrentMovieIndex(currentMovieIndex + 1);
    } else {
      // Loop back to first movie or go back to start
      setCurrentMovieIndex(0);
    }
  };

  if (!currentMovie) {
    return (
      <div className="movie-output-container error">
        <h1 className="error-title">PopChoice</h1>
        <p className="error-message">No movies found matching your preferences.</p>
        <button
          className="submit-button restart-button"
          onClick={() => navigate('/')}
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="movie-output-container">
      <div className="movie-info">
        <h1 className="movie-title">
          {currentMovie.title} ({currentMovie.year})
        </h1>

        <div className="movie-poster">
          {/* Placeholder for movie poster - will need to add poster URLs to database */}
          <div className="poster-placeholder">
            <p className="poster-text">{currentMovie.title}</p>
          </div>
        </div>

        <p className="movie-description">
          {currentMovie.description}
        </p>
      </div>

      <button
        className="submit-button next-movie-button"
        onClick={handleNextMovie}
      >
        Next Movie
      </button>

      <div className="movie-counter">
        {currentMovieIndex + 1} of {movies.length}
      </div>
    </div>
  );
}

export default MovieOutput;
