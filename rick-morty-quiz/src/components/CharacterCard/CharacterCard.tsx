import { useState } from 'react';
import { Character } from '../../types/game';
import './CharacterCard.css';

interface CharacterCardProps {
  currentQuestion: Character | null;
  options: string[];
  onAnswer: (isCorrect: boolean) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const CharacterCard = ({ currentQuestion, options, onAnswer, difficulty }: CharacterCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (selectedName: string) => {
    if (!currentQuestion || selectedAnswer) return;
    
    setSelectedAnswer(selectedName);
    setShowFeedback(true);
    
    const isCorrect = selectedName === currentQuestion.name;
    
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };

  const getBlurStyle = () => {
    switch(difficulty) {
      case 'easy':
        return { filter: 'blur(5px) brightness(0.9)' };
      case 'medium':
        return { filter: 'blur(15px) brightness(0.7)' };
      case 'hard':
        return { filter: 'blur(25px) brightness(0.6)' };
      default:
        return { filter: 'blur(5px) brightness(0.9)' };
    }
  };

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) return "option-btn";
    
    if (option === currentQuestion!.name) {
      return "option-btn correct";
    } else if (option === selectedAnswer && option !== currentQuestion!.name) {
      return "option-btn incorrect";
    }
    return "option-btn disabled";
  };

  if (!currentQuestion) {
    return (
      <div className="character-card">
        <div className="loading">Cargando personajes...</div>
      </div>
    );
  }

  return (
    <div className="character-card">
      <div className="character-image">
        <img 
          src={currentQuestion.image} 
          alt="Personaje a adivinar"
          style={selectedAnswer ? {} : getBlurStyle()}
          className={selectedAnswer ? 'revealed' : ''}
        />
        <div className="question-text">¿Quién es este personaje?</div>
      </div>

      {showFeedback && selectedAnswer && (
        <div className={`feedback ${selectedAnswer === currentQuestion.name ? 'correct' : 'incorrect'}`}>
          {selectedAnswer === currentQuestion.name ? '✅ ¡Correcto! +10 puntos' : '❌ Incorrecto -5 puntos'}
        </div>
      )}

      <div className="difficulty-indicator">
        Dificultad: {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Media' : 'Difícil'}
        {difficulty === 'easy' && ' 🟢'}
        {difficulty === 'medium' && ' 🟡'}
        {difficulty === 'hard' && ' 🔴'}
      </div>

      <div className="options">
        {options.map((option, index) => (
          <button 
            key={index}
            className={getButtonClass(option)}
            onClick={() => handleAnswer(option)}
            disabled={!!selectedAnswer}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CharacterCard;