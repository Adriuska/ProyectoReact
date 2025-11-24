import './ScoreHistory.css';

interface ScoreHistoryProps {
  scores: number[];
}

const ScoreHistory = ({ scores }: ScoreHistoryProps) => {
  return (
    <div className="score-history">
      <h3>🏆 Top 3 Puntuaciones</h3>
      {scores.length === 0 ? (
        <div className="no-scores">
          <p>🎯 Aún no hay puntuaciones</p>
          <p className="hint">¡Juega para aparecer aquí!</p>
        </div>
      ) : (
        <div className="scores-list">
          {scores.slice(0, 3).map((score, index) => (
            <div key={index} className="score-item">
              <span className="position">#{index + 1}</span>
              <span className="score">{score} puntos</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoreHistory;