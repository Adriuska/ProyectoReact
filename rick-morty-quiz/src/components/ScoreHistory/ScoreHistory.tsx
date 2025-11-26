import './ScoreHistory.css';

interface ScoreHistoryProps {
  scores: number[];
}

/**
 * Componente que muestra el historial de las mejores puntuaciones
 * Muestra el top 3 de puntuaciones más altas
 */
const ScoreHistory = ({ scores }: ScoreHistoryProps) => {
  if (scores.length === 0) {
    return null;
  }

  return (
    <div className="score-history">
      <h3>🏆 Top 3 Puntuaciones</h3>
      <div className="scores-list">
        {scores.slice(0, 3).map((score, index) => (
          <div key={index} className="score-item">
            <span className="position">#{index + 1}</span>
            <span className="score">{score} puntos</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreHistory;