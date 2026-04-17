export type NodeType = 'number' | 'letter' | 'color' | 'shape';

export interface GameNode {
  id: string;
  label: string;
  type: NodeType;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  color?: string;
  shape?: 'circle' | 'square' | 'triangle';
}

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  message: string;
  nodes: GameNode[];
  sequence: string[]; // Array of node IDs in order
  theme: 'nature' | 'racing' | 'circus' | 'detective' | 'maze';
  timeLimit?: number; // in seconds
}

export interface GameState {
  currentLevelIndex: number;
  score: number;
  stars: number;
  isGameStarted: boolean;
  isLevelComplete: boolean;
  isGameOver: boolean;
}
