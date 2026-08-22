import { GameCardProps } from "../components/GameCard";

class GameState {
  // Draw pile
  private pile: GameCardProps[] = [];
  
  // Bases
  private bases: Record<GameCardProps["suit"], GameCardProps[]> = {
    "spades": [],
    "clubs": [],
    "diamonds": [],
    "hearts": [],
  };
  
  // Play stacks
  private stacks: GameCardProps[][] = [[], [], [], [], [], [], []];
  
  // Game tracking
  private time = 0.0;
  private turns = 0;
  private undos = 0;
  
  // Game behavior
  private drawMultiple = false;
  
  constructor() {
    // Create a new game
    this.resetGameArea();
  }
  
  private resetGameArea = () => {
    this.stacks = [[], [], [], [], [], [], []];
    
    // Reset game state
    this.time = 0.0;
    this.turns = 0;
    this.undos = 0;
    
    this.resetDrawPile();
  };
  
  private resetDrawPile = () => {
    
  };
}
