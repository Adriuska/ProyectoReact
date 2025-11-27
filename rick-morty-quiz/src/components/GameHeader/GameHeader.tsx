import { GameState, AppTheme } from '../../interfaces/interfaces';
import './GameHeader.css';

type GameHeaderProps = {
  gameState: GameState;
  theme: AppTheme;
  onToggleTheme: () => void;
}

const GameHeader = ({ gameState, theme, onToggleTheme }: GameHeaderProps) => {
  return (
    <header className="game-header">
      <div className="score">Puntos: {gameState.score}</div>
      <div className="lives">Vidas: {gameState.lives} ❤️</div>
      <div className="round">Ronda: {gameState.currentRound}</div>
      <div className="difficulty">
        Dificultad: {gameState.difficulty === 'easy' ? 'Fácil' :
          gameState.difficulty === 'medium' ? 'Media' : 'Difícil'}
      </div>
      <div className={`timer ${gameState.timeLeft <= 10 ? 'warning' : ''}`}>
        Tiempo: {gameState.timeLeft}s
      </div>
      <button className="theme-toggle" onClick={onToggleTheme} title="Cambiar tema">
        {theme.isDark ? '☀️' : '🌙'}
      </button>
    </header>
  );
};

export default GameHeader;