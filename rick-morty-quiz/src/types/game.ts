
export interface Character {
  id: number;
  name: string;
  image: string;
}


export interface GameState {
  score: number;              
  lives: number;              
  currentRound: number;       
  isGameOver: boolean;        
  timeLeft: number;          
  difficulty: 'easy' | 'medium' | 'hard'; 
}


export interface AppTheme {
  isDark: boolean; 
}

export interface GameStats {
  totalRounds: number;        
  correctAnswers: number;    
  incorrectAnswers: number;   
  bestStreak: number;        
  averageTime: number;       
}