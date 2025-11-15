import { useNavigate } from 'react-router-dom';
import '../styles/Start.css'

function StartView() {
  const navigate = useNavigate();

  function handleSubmit(formData) {
    const data = {
      numberOfPeople: formData.get('numberOfPeople'),
      duration: formData.get('duration')
    };
    navigate('/questions', { state: data, replace: true });
  }

  return (
    <div className="start-container">
      <div className='header'>
        <img className='popcorn-icon' src="/popchoice-logo.png" alt="Popcorn Icon of PopChoice" />
        <h1>PopChoice</h1>
      </div>

      <form className='start-form' action={handleSubmit}>
        <input type="text" name="numberOfPeople" placeholder='How many people?' required />
        <input type="text" name="duration" placeholder='How much time do you have?' required />
        <button type="submit" className="submit-button">Start</button>
      </form>
    </div>
  );
}

export default StartView;
