/**
 * Interfaz que define la estructura de un personaje de Rick and Morty
 * obtenido de la API
 */
export interface Character {
  id: number;
  name: string;
  image: string;
  origin: {
    name: string;
  };
  species: string;
  status: string;
}

/**
 * Interfaz que define el estado principal del juego
 */
export interface GameState {
  score: number;              // Puntuación actual del jugador
  lives: number;              // Vidas restantes (inicia en 3)
  currentRound: number;       // Número de ronda actual
  isGameOver: boolean;        // Indica si el juego ha terminado
  timeLeft: number;           // Segundos restantes en la ronda actual
  difficulty: 'easy' | 'medium' | 'hard';  // Nivel de dificultad
}

/**
 * Interfaz que define el tema visual de la aplicación
 */
export interface AppTheme {
  isDark: boolean;  // true para tema oscuro, false para tema claro
}

/**
 * Interfaz que define las estadísticas acumuladas del juego
 */
export interface GameStats {
  totalRounds: number;        // Total de rondas jugadas
  correctAnswers: number;     // Número de respuestas correctas
  incorrectAnswers: number;   // Número de respuestas incorrectas
  bestStreak: number;         // Mejor racha de aciertos consecutivos
  averageTime: number;        // Tiempo promedio de respuesta en segundos
}