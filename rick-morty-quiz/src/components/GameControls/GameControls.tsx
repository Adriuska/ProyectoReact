import { GameState } from '../../types/game';
import './GameControls.css';

interface GameControlsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onRestart: () => void;
}

/**
 * Componente que muestra los controles del juego
 * Actualmente solo incluye el botón de reinicio
 */
const GameControls = ({ gameState, onRestart }: GameControlsProps) => {
  return (
    <div className="game-controls">
      <button className="restart-btn" onClick={onRestart}>
        🔄 Reiniciar Juego
      </button>
    </div>
  );
};

export default GameControls;