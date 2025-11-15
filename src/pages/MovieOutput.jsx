import { useActionData, useNavigation } from 'react-router-dom';

function MovieOutput() {
  const actionData = useActionData();
  const navigation = useNavigation();

  // Show loading state while AI/Vector DB is processing
  if (navigation.state === 'loading') {
    return (
      <div>
        <h1>PopChoice</h1>
        <div>
          <p>🎬 Finding the perfect movies for you...</p>
          <p>Analyzing your preferences with AI...</p>
        </div>
      </div>
    );
  }

  // Handle case where no data is available
  if (!actionData) {
    return (
      <div>
        <h1>PopChoice</h1>
        <p>No recommendations available. Please start from the beginning.</p>
      </div>
    );
  }

  // Handle error state
  if (actionData.error) {
    return (
      <div>
        <h1>PopChoice</h1>
        <div>
          <h2>Oops! Something went wrong</h2>
          <p>{actionData.error}</p>
          <p>Please try again.</p>
        </div>
      </div>
    );
  }

  // const { recommendations, preferences } = actionData;

  // return (
  //   <div>
  //     <h1>PopChoice</h1>
  //     <h2>Your Personalized Movie Recommendations</h2>

  //     {/* Display user preferences */}
  //     <div>
  //       <h3>Based on your preferences:</h3>
  //       <ul>
  //         <li>For {preferences.numberOfPeople} people</li>
  //         <li>Duration: {preferences.duration} minutes</li>
  //         <li>Favorite Movie: {preferences.favoriteMovie}</li>
  //         <li>Mood: {preferences.mood}</li>
  //         <li>Style: {preferences.newOrClassic}</li>
  //       </ul>
  //     </div>

  //     {/* Display recommendations */}
  //     <div>
  //       <h3>We recommend:</h3>
  //       {recommendations && recommendations.length > 0 ? (
  //         <ul>
  //           {recommendations.map((movie, index) => (
  //             <li key={index}>
  //               <h4>{movie.title}</h4>
  //               <p>{movie.description}</p>
  //               <p>Rating: {movie.rating}</p>
  //               <p>Genre: {movie.genre}</p>
  //             </li>
  //           ))}
  //         </ul>
  //       ) : (
  //         <p>No recommendations found. Try adjusting your preferences.</p>
  //       )}
  //     </div>
  //   </div>
  // );
}

export default MovieOutput;
