export type Character = {
  id: number;
  name: string;
  image: string;
}


export type GameState = {
  score: number;              
  lives: number;              
  currentRound: number;       
  isGameOver: boolean;        
  timeLeft: number;          
  difficulty: 'easy' | 'medium' | 'hard'; 
}


export type AppTheme = {
  isDark: boolean; 
}

export type GameStats = {
  totalRounds: number;        
  correctAnswers: number;    
  incorrectAnswers: number;   
  bestStreak: number;        
  averageTime: number;       
}