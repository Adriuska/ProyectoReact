import './ScoreHistory.css';

interface ScoreHistoryProps {
  scores: number[];
}

const ScoreHistory = ({ scores }: ScoreHistoryProps) => {
  // Siempre mostrar 3 posiciones, rellenar con 0 si no hay scores
  const displayScores = [...scores];
  while (displayScores.length < 3) {
    displayScores.push(0);
  }

  return (
    <div className="score-history">
      <h3>🏆 Top 3 Puntuaciones</h3>
      <div className="scores-list">
        {displayScores.slice(0, 3).map((score, index) => (
          <div key={index} className={`score-item ${score === 0 ? 'empty' : ''}`}>
            <span className="position">#{index + 1}</span>
            <span className="score">
              {score === 0 ? 'Sin puntuación' : `${score} puntos`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreHistory;