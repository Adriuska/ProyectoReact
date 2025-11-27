import './ScoreHistory.css';

type ScoreHistoryProps = {
  scores: number[];
}

const ScoreHistory = ({ scores }: ScoreHistoryProps) => {
  if (scores.length === 0) {
    return (
      <div className="score-history">
        <h3>🏆 Top 5 Puntuaciones</h3>
        <div className="no-scores">
          <p>¡Aún no hay puntuaciones!</p>
          <p className="hint">Juega para establecer tu primer récord</p>
        </div>
      </div>
    );
  }

  return (
    <div className="score-history">
      <h3>🏆 Top 5 Puntuaciones</h3>
      <div className="scores-list">
        {scores.map((score, index) => (
          <div key={index} className="score-item">
            <span className="position">
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && `#${index + 1}`}
            </span>
            <span className="score">{score} puntos</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreHistory;
