import { useState } from 'react';
import { Form, useLocation, useNavigation } from "react-router-dom";
import '../styles/Questions.css';

function FirstPersonQuestions() {
  const location = useLocation();
  const navigation = useNavigation();

  // Get data from Start page
  const { numberOfPeople, duration } = location.state || {};

  // Track current person (1-indexed)
  const [currentPerson, setCurrentPerson] = useState(1);

  // Store all people's answers
  const [allAnswers, setAllAnswers] = useState([]);

  // Current person's answers
  const [favoriteMovie, setFavoriteMovie] = useState('');
  const [newOrClassic, setNewOrClassic] = useState('');
  const [mood, setMood] = useState('');
  const [islandPerson, setIslandPerson] = useState('');

  const isSubmitting = navigation.state === 'submitting';
  const totalPeople = parseInt(numberOfPeople) || 1;
  const isLastPerson = currentPerson >= totalPeople;

  // Handle moving to next person
  const handleNextPerson = (e) => {
    // Save current person's answers
    const personAnswers = {
      person: currentPerson,
      favoriteMovie,
      newOrClassic,
      mood,
      islandPerson
    };

    const updatedAnswers = [...allAnswers, personAnswers];
    setAllAnswers(updatedAnswers);

    if (!isLastPerson) {
      // Not the last person - prevent submission and move to next
      e.preventDefault();

      // Move to next person and reset form
      setCurrentPerson(currentPerson + 1);
      setFavoriteMovie('');
      setNewOrClassic('');
      setMood('');
      setIslandPerson('');
    }
    // If isLastPerson is true, DON'T preventDefault()
    // Let the form submit naturally to trigger the action
  };

  return (
    <div className="questions-container">
      {/* Branding with person counter */}
      <div className="branding">
        <img className="popcorn-icon" src="/popchoice-logo.png" alt="PopChoice Icon" />
        <p className="person-counter">{currentPerson}</p>
      </div>

      <Form method="post" action="/results" onSubmit={handleNextPerson}>
        {/* Hidden fields - store all answers */}
        <input type="hidden" name="numberOfPeople" value={numberOfPeople || ''} />
        <input type="hidden" name="duration" value={duration || ''} />
        <input type="hidden" name="allAnswers" value={JSON.stringify([...allAnswers, {
          person: currentPerson,
          favoriteMovie,
          newOrClassic,
          mood,
          islandPerson
        }])} />

        {/* Question 1: Favorite movie and why */}
        <div className="question-group">
          <label>What's your favorite movie and why?</label>
          <textarea
            name="favoriteMovie"
            value={favoriteMovie}
            onChange={(e) => setFavoriteMovie(e.target.value)}
            required
          />
        </div>

        {/* Question 2: New or classic */}
        <div className="question-group">
          <label>Are you in the mood for something new or a classic?</label>
          <div className="button-group">
            <button
              type="button"
              className={`choice-button ${newOrClassic === 'new' ? 'selected' : ''}`}
              onClick={() => setNewOrClassic('new')}
            >
              New
            </button>
            <button
              type="button"
              className={`choice-button ${newOrClassic === 'classic' ? 'selected' : ''}`}
              onClick={() => setNewOrClassic('classic')}
            >
              Classic
            </button>
          </div>
        </div>

        {/* Question 3: Mood */}
        <div className="question-group">
          <label>What are you in the mood for?</label>
          <div className="button-group">
            <button
              type="button"
              className={`choice-button ${mood === 'fun' ? 'selected' : ''}`}
              onClick={() => setMood('fun')}
            >
              Fun
            </button>
            <button
              type="button"
              className={`choice-button ${mood === 'serious' ? 'selected' : ''}`}
              onClick={() => setMood('serious')}
            >
              Serious
            </button>
            <button
              type="button"
              className={`choice-button ${mood === 'inspiring' ? 'selected' : ''}`}
              onClick={() => setMood('inspiring')}
            >
              Inspiring
            </button>
            <button
              type="button"
              className={`choice-button ${mood === 'scary' ? 'selected' : ''}`}
              onClick={() => setMood('scary')}
            >
              Scary
            </button>
          </div>
        </div>

        {/* Question 4: Famous person */}
        <div className="question-group">
          <label>Which famous film person would you love to be stranded on an island with and why?</label>
          <textarea
            name="islandPerson"
            value={islandPerson}
            onChange={(e) => setIslandPerson(e.target.value)}
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !favoriteMovie || !newOrClassic || !mood || !islandPerson}
        >
          {isSubmitting
            ? 'Finding perfect movies...'
            : isLastPerson
              ? 'Get Movie'
              : 'Next Person'
          }
        </button>
      </Form>
    </div>
  );
}

export default FirstPersonQuestions;
