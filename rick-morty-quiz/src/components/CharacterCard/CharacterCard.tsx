import { useState } from 'react';
import { Character } from '../../types/game';
import './CharacterCard.css';

interface CharacterCardProps {
  currentQuestion: Character | null;
  options: string[];
  onAnswer: (isCorrect: boolean) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Componente que muestra la tarjeta del personaje con la imagen difuminada
 * y las opciones de respuesta
 */
const CharacterCard = ({ currentQuestion, options, onAnswer, difficulty }: CharacterCardProps) => {
  // Estado para rastrear la respuesta seleccionada
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // Estado para mostrar el feedback visual (correcto/incorrecto)
  const [showFeedback, setShowFeedback] = useState(false);

  /**
   * Maneja la selección de una respuesta por parte del jugador
   * @param selectedName - Nombre del personaje seleccionado
   */
  const handleAnswer = (selectedName: string) => {
    // Evita respuestas múltiples
    if (!currentQuestion || selectedAnswer) return;
    
    setSelectedAnswer(selectedName);
    setShowFeedback(true);
    
    // Verifica si la respuesta es correcta
    const isCorrect = selectedName === currentQuestion.name;
    
    // Después de 1.5 segundos, notifica al componente padre y resetea el estado
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };

  /**
   * Retorna el estilo de blur según la dificultad
   * Fácil: blur ligero, Media: blur medio, Difícil: blur intenso
   */
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

  /**
   * Determina la clase CSS del botón según el estado de la respuesta
   * @param option - Nombre de la opción
   * @returns Clase CSS apropiada (correct, incorrect, disabled)
   */
  const getButtonClass = (option: string) => {
    // Si no hay respuesta seleccionada, todos los botones están activos
    if (!selectedAnswer) return "option-btn";
    
    // Marca en verde la respuesta correcta
    if (option === currentQuestion!.name) {
      return "option-btn correct";
    } else if (option === selectedAnswer && option !== currentQuestion!.name) {
      // Marca en rojo la respuesta incorrecta seleccionada
      return "option-btn incorrect";
    }
    // Desactiva el resto de opciones
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