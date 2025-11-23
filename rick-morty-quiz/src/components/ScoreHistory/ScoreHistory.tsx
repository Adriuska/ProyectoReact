import './ScoreHistory.css';

interface ScoreHistoryProps {
  scores: number[];
}

const ScoreHistory = ({ scores }: ScoreHistoryProps) => {
  if (scores.length === 0) return null;

  return (
    <div className="score-history">
      <h3>🏆 Top 3 Puntuaciones</h3>
      <div className="scores-list">
        {scores.slice(0, 3).map((score, index) => (
          <div key={index} className="score-item">
            <span className="rank">#{index + 1}</span>
            <span className="points">{score} puntos</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreHistory;