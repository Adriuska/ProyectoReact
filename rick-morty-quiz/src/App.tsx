import { useState, useEffect, useRef } from 'react';
import './App.css';
import GameHeader from './components/GameHeader/GameHeader';
import CharacterCard from './components/CharacterCard/CharacterCard';
import GameControls from './components/GameControls/GameControls';
import ScoreHistory from './components/ScoreHistory/ScoreHistory';
import { GameState, Character, AppTheme, GameStats } from './types/game';

/**
 * Componente principal de la aplicación Rick and Morty Quiz
 * Maneja toda la lógica del juego, estado, temporizador y comunicación con la API
 */
function App() {
  // Estado principal del juego: puntos, vidas, ronda actual, tiempo restante y dificultad
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    currentRound: 1,
    isGameOver: false,
    timeLeft: 30,
    difficulty: 'easy'
  });

  // Estado del tema visual (claro/oscuro)
  const [theme, setTheme] = useState<AppTheme>({ isDark: false });
  
  // Lista de personajes obtenidos de la API
  const [characters, setCharacters] = useState<Character[]>([]);
  
  // Personaje actual que se debe adivinar
  const [currentQuestion, setCurrentQuestion] = useState<Character | null>(null);
  
  // Opciones de respuesta para la pregunta actual (4 nombres)
  const [options, setOptions] = useState<string[]>([]);
  
  // Top 3 de mejores puntuaciones (actualmente hardcodeado)
  const [bestScores, setBestScores] = useState<number[]>([300, 235, 180]);
  
  // Estadísticas de la partida: rondas, aciertos, errores, racha y tiempo promedio
  const [gameStats, setGameStats] = useState<GameStats>({
    totalRounds: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    bestStreak: 0,
    averageTime: 0
  });

  // Referencia al tiempo de inicio de cada ronda para calcular el tiempo de respuesta
  const roundStartTime = useRef<number>(0);
  
  // Referencia a la racha actual de respuestas correctas consecutivas
  const currentStreak = useRef<number>(0);

  /**
   * Efecto que se ejecuta al montar el componente
   * Obtiene 12 personajes aleatorios de la API de Rick and Morty
   */
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        // Genera 12 IDs aleatorios entre 1 y 826 (total de personajes en la API)
        const randomIds = Array.from({ length: 12 }, () => 
          Math.floor(Math.random() * 826) + 1
        );
        
        // Consulta múltiples personajes en una sola petición
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${randomIds.join(',')}`
        );
        const data = await response.json();
        setCharacters(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    fetchCharacters();
  }, []);

  /**
   * Calcula el nivel de dificultad según el número de ronda
   * @param round - Número de la ronda actual
   * @returns 'easy' (1-5), 'medium' (6-10) o 'hard' (11+)
   */
  const calculateDifficulty = (round: number) => {
    if (round <= 5) return 'easy';
    if (round <= 10) return 'medium';
    return 'hard';
  };

  /**
   * Obtiene el tiempo disponible según la dificultad
   * @param difficulty - Nivel de dificultad actual
   * @returns Segundos disponibles (30, 25 o 20)
   */
  const getTimeByDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 30;
      case 'medium': return 25;
      case 'hard': return 20;
      default: return 30;
    }
  };

  /**
   * Efecto que maneja el temporizador del juego
   * Cuenta regresiva cada segundo y aplica penalización si se agota el tiempo
   */
  useEffect(() => {
    if (gameState.isGameOver || gameState.timeLeft <= 0) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          const newLives = prev.lives - 1;
          const newDifficulty = calculateDifficulty(prev.currentRound);
          
          setGameStats(prevStats => ({
            ...prevStats,
            incorrectAnswers: prevStats.incorrectAnswers + 1,
            totalRounds: prevStats.totalRounds + 1
          }));
          currentStreak.current = 0;
          
          return {
            ...prev,
            timeLeft: getTimeByDifficulty(newDifficulty),
            lives: newLives,
            isGameOver: newLives <= 0
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameOver, gameState.timeLeft]);

  /**
   * Efecto que detecta cuando se acaban las vidas y finaliza el juego
   */
  useEffect(() => {
    if (gameState.lives <= 0 && !gameState.isGameOver) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
  }, [gameState.lives, gameState.isGameOver]);

  /**
   * Efecto que genera una nueva pregunta cuando cambian los personajes o la ronda
   */
  useEffect(() => {
    if (characters.length > 0 && !gameState.isGameOver) {
      generateNewQuestion();
    }
  }, [characters, gameState.currentRound, gameState.isGameOver]);

  /**
   * Genera una nueva pregunta seleccionando un personaje aleatorio
   * y 3 opciones incorrectas adicionales
   */
  const generateNewQuestion = () => {
    if (characters.length < 4 || gameState.isGameOver) return;

    // Guarda el tiempo de inicio para calcular el tiempo de respuesta
    roundStartTime.current = Date.now();

    // Mezcla los personajes aleatoriamente
    const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);
    
    // El primer personaje será la respuesta correcta
    const correctCharacter = shuffledCharacters[0];
    setCurrentQuestion(correctCharacter);

    // Selecciona 3 personajes adicionales como opciones incorrectas
    const otherCharacters = shuffledCharacters
      .slice(1, 4)
      .sort(() => Math.random() - 0.5);

    // Mezcla todas las opciones (1 correcta + 3 incorrectas)
    const allOptions = [
      correctCharacter.name,
      ...otherCharacters.map(char => char.name)
    ].sort(() => Math.random() - 0.5);

    setOptions(allOptions);
  };

  /**
   * Maneja la respuesta del jugador, actualiza puntuación, vidas y estadísticas
   * @param isCorrect - Si la respuesta fue correcta o no
   */
  const handleAnswer = (isCorrect: boolean) => {
    if (gameState.isGameOver) return;

    // Calcula el tiempo que tardó en responder
    const responseTime = (Date.now() - roundStartTime.current) / 1000;
    const newAverageTime = (gameStats.averageTime * gameStats.totalRounds + responseTime) / (gameStats.totalRounds + 1);

    // Manejo de respuesta correcta
    if (isCorrect) {
      // Incrementa la racha de aciertos consecutivos
      currentStreak.current += 1;
      const newBestStreak = Math.max(currentStreak.current, gameStats.bestStreak);

      setGameStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        totalRounds: prev.totalRounds + 1,
        bestStreak: newBestStreak,
        averageTime: newAverageTime
      }));

      // Avanza a la siguiente ronda
      const newRound = gameState.currentRound + 1;
      const newDifficulty = calculateDifficulty(newRound);
      const newTime = getTimeByDifficulty(newDifficulty);
      
      // Si cambió la dificultad, restaura las vidas a 3
      const difficultyChanged = newDifficulty !== gameState.difficulty;
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + 10, // +10 puntos por respuesta correcta
        currentRound: newRound,
        difficulty: newDifficulty,
        timeLeft: newTime,
        lives: difficultyChanged ? 3 : prev.lives
      }));
      
      // Genera una nueva pregunta después de 1 segundo
      setTimeout(() => {
        generateNewQuestion();
      }, 1000);
    } else {
      // Manejo de respuesta incorrecta
      // Resetea la racha de aciertos consecutivos
      currentStreak.current = 0;
      
      setGameStats(prev => ({
        ...prev,
        incorrectAnswers: prev.incorrectAnswers + 1,
        totalRounds: prev.totalRounds + 1,
        averageTime: newAverageTime
      }));

      const newLives = gameState.lives - 1;
      const newDifficulty = calculateDifficulty(gameState.currentRound);
      const newTime = getTimeByDifficulty(newDifficulty);
      
      setGameState(prev => ({
        ...prev,
        lives: newLives, // -1 vida
        score: Math.max(0, prev.score - 5), // -5 puntos (mínimo 0)
        timeLeft: newTime,
        isGameOver: newLives <= 0
      }));

      // Si quedan vidas, genera una nueva pregunta después de 1 segundo
      if (newLives > 0) {
        setTimeout(() => {
          generateNewQuestion();
        }, 1000);
      }
    }
  };

  /**
   * Reinicia el juego a su estado inicial y obtiene nuevos personajes
   */
  const restartGame = () => {
    // Resetea el estado del juego
    setGameState({
      score: 0,
      lives: 3,
      currentRound: 1,
      isGameOver: false,
      timeLeft: 30,
      difficulty: 'easy'
    });

    // Resetea las estadísticas
    setGameStats({
      totalRounds: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      bestStreak: 0,
      averageTime: 0
    });

    // Resetea la racha actual
    currentStreak.current = 0;
    
    // Obtiene un nuevo conjunto de personajes para la nueva partida
    const fetchNewCharacters = async () => {
      const randomIds = Array.from({ length: 12 }, () => 
        Math.floor(Math.random() * 826) + 1
      );
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/${randomIds.join(',')}`
      );
      const data = await response.json();
      setCharacters(Array.isArray(data) ? data : [data]);
    };
    fetchNewCharacters();
  };

  /**
   * Alterna entre tema claro y oscuro
   */
  const toggleTheme = () => {
    setTheme(prev => ({ isDark: !prev.isDark }));
  };

  // Calcula el porcentaje de precisión del jugador
  const accuracy = gameStats.totalRounds > 0 
    ? Math.round((gameStats.correctAnswers / gameStats.totalRounds) * 100)
    : 0;

  return (
    <div className={`app ${theme.isDark ? 'dark' : ''}`}>
      <GameHeader 
        gameState={gameState} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      {gameState.isGameOver ? (
        <div className="game-over">
          <h2>¡Juego Terminado! 🎮</h2>
          <div className="final-stats">
            <div className="stat-row">
              <div className="stat">
                <span className="stat-value">{gameState.score}</span>
                <span className="stat-label">Puntuación Final</span>
              </div>
              <div className="stat">
                <span className="stat-value">{gameState.currentRound - 1}</span>
                <span className="stat-label">Rondas Jugadas</span>
              </div>
            </div>
            
            <div className="stat-row">
              <div className="stat">
                <span className="stat-value">{accuracy}%</span>
                <span className="stat-label">Precisión</span>
              </div>
              <div className="stat">
                <span className="stat-value">{gameStats.bestStreak}</span>
                <span className="stat-label">Mejor Racha</span>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat">
                <span className="stat-value">{Math.round(gameStats.averageTime)}s</span>
                <span className="stat-label">Tiempo Promedio</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {gameState.difficulty === 'easy' ? 'Fácil' : 
                   gameState.difficulty === 'medium' ? 'Media' : 'Difícil'}
                </span>
                <span className="stat-label">Dificultad Final</span>
              </div>
            </div>
          </div>

          <button className="restart-btn" onClick={restartGame}>
            🔄 Jugar de Nuevo
          </button>
        </div>
      ) : (
        <>
          <CharacterCard 
            currentQuestion={currentQuestion}
            options={options}
            onAnswer={handleAnswer}
            difficulty={gameState.difficulty}
          />
          <GameControls gameState={gameState} setGameState={setGameState} onRestart={restartGame} />
        </>
      )}
      
      <ScoreHistory scores={bestScores} />
    </div>
  );
}

export default App;