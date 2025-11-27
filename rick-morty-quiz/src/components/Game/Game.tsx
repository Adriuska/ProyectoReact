import { useState, useEffect, useRef } from 'react';
import { GameState, Character, AppTheme, GameStats } from '../../interfaces/interfaces';
import GameHeader from '../GameHeader/GameHeader';
import CharacterCard from '../CharacterCard/CharacterCard';
import ScoreHistory from '../ScoreHistory/ScoreHistory';

const Game = () => {
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        lives: 3,
        currentRound: 1,
        isGameOver: false,
        timeLeft: 30,
        difficulty: 'easy'
    });

    const [theme, setTheme] = useState<AppTheme>({ isDark: false });

    const [characters, setCharacters] = useState<Character[]>([]);

    const [currentQuestion, setCurrentQuestion] = useState<Character | null>(null);

    const [options, setOptions] = useState<string[]>([]);

    const [topScores, setTopScores] = useState<number[]>(() => {
        const saved = localStorage.getItem('rickMortyTopScores');
        return saved ? JSON.parse(saved) : [];
    });

    const [gameStats, setGameStats] = useState<GameStats>({
        totalRounds: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        bestStreak: 0,
        averageTime: 0
    });

    const roundStartTime = useRef<number>(0);

    const currentStreak = useRef<number>(0);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const randomIds = Array.from({ length: 12 }, () =>
                    Math.floor(Math.random() * 826) + 1
                );

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

    const calculateDifficulty = (round: number) => {
        if (round <= 5) return 'easy';
        if (round <= 10) return 'medium';
        return 'hard';
    };

    const getTimeByDifficulty = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 30;
            case 'medium': return 25;
            case 'hard': return 20;
            default: return 30;
        }
    };

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

    useEffect(() => {
        if (gameState.isGameOver && gameState.score > 0) {
            saveScore(gameState.score);
        }
    }, [gameState.isGameOver]);

    useEffect(() => {
        if (characters.length > 0 && !gameState.isGameOver) {
            generateNewQuestion();
        }
    }, [characters, gameState.currentRound, gameState.isGameOver]);

    const generateNewQuestion = () => {
        if (characters.length < 4 || gameState.isGameOver) return;

        roundStartTime.current = Date.now();

        const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);

        const correctCharacter = shuffledCharacters[0];
        setCurrentQuestion(correctCharacter);

        const otherCharacters = shuffledCharacters
            .slice(1, 4)
            .sort(() => Math.random() - 0.5);

        const allOptions = [
            correctCharacter.name,
            ...otherCharacters.map(char => char.name)
        ].sort(() => Math.random() - 0.5);

        setOptions(allOptions);
    };

    const handleAnswer = (isCorrect: boolean) => {
        if (gameState.isGameOver) return;

        const responseTime = (Date.now() - roundStartTime.current) / 1000;
        const newAverageTime = (gameStats.averageTime * gameStats.totalRounds + responseTime) / (gameStats.totalRounds + 1);

        if (isCorrect) {
            currentStreak.current += 1;
            const newBestStreak = Math.max(currentStreak.current, gameStats.bestStreak);

            setGameStats(prev => ({
                ...prev,
                correctAnswers: prev.correctAnswers + 1,
                totalRounds: prev.totalRounds + 1,
                bestStreak: newBestStreak,
                averageTime: newAverageTime
            }));

            const newRound = gameState.currentRound + 1;
            const newDifficulty = calculateDifficulty(newRound);
            const newTime = getTimeByDifficulty(newDifficulty);

            const difficultyChanged = newDifficulty !== gameState.difficulty;

            setGameState(prev => ({
                ...prev,
                score: prev.score + 10,
                currentRound: newRound,
                difficulty: newDifficulty,
                timeLeft: newTime,
                lives: difficultyChanged ? 3 : prev.lives
            }));

            setTimeout(() => {
                generateNewQuestion();
            }, 1000);
        } else {
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
                lives: newLives,
                score: Math.max(0, prev.score - 5),
                timeLeft: newTime,
                isGameOver: newLives <= 0
            }));

            if (newLives > 0) {
                setTimeout(() => {
                    generateNewQuestion();
                }, 1000);
            }
        }
    };

    const restartGame = () => {
        setGameState({
            score: 0,
            lives: 3,
            currentRound: 1,
            isGameOver: false,
            timeLeft: 30,
            difficulty: 'easy'
        });

        setGameStats({
            totalRounds: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            bestStreak: 0,
            averageTime: 0
        });

        currentStreak.current = 0;

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

    const saveScore = (finalScore: number) => {
        if (finalScore === 0) return;

        const newScores = [...topScores, finalScore]
            .sort((a, b) => b - a)
            .slice(0, 5);

        setTopScores(newScores);
        localStorage.setItem('rickMortyTopScores', JSON.stringify(newScores));
    };

    const toggleTheme = () => {
        setTheme(prev => ({ isDark: !prev.isDark }));
    };

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
                <CharacterCard
                    currentQuestion={currentQuestion}
                    options={options}
                    onAnswer={handleAnswer}
                    difficulty={gameState.difficulty}
                />
            )}

            <ScoreHistory scores={topScores} />
        </div>
    );
};

export default Game;
