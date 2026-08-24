import { GameCardLocation, GameCardProps } from "../components/GameCard";

// Utility functions
import _ from "lodash";

export class GameState {
  // All cards
  private cards: GameCardProps[] = [];
  
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

  // Game draw state
  private hasDrawn = false;
  private drawIndex = 0;
  private drawnCard: GameCardProps | undefined = undefined;
  
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
    
    this.shuffleCards();
    this.resetStacks();
    this.resetDrawPile();
  };
  
  private shuffleCards = () => {
    // Internal utility function to generate a suit of cards
    const generateCards = (suit: GameCardProps["suit"]): GameCardProps[] => {
      const cards: GameCardProps[] = [];
      for (let i = 1; i < 14; i++) {
        cards.push({
          suit: suit,
          value: i,
          isFaceUp: false,
          isSelected: false,
          handleSelection: () => {},
        });
      }
      
      return cards;
    };
    
    this.cards = _.shuffle([
      ...generateCards("spades"),
      ...generateCards("clubs"),
      ...generateCards("diamonds"),
      ...generateCards("hearts"),
    ]);
  };
  
  private resetStacks = () => {
    this.stacks.forEach((stack, index) => {
      for (let i = 0; i <= index; i++) {
        const card = this.cards.pop();
        if (card) {
          if (i === index) card.isFaceUp = true;
          stack.push(card);
        }
      }
    });
  };
  
  private resetDrawPile = () => {
    let card = this.cards.pop();
    while (card) {
      this.pile.push(card);
      card = this.cards.pop();
    }
  };
  
  public getStacks = (): GameCardProps[][] => {
    return this.stacks;
  };
  
  public getPile = (): GameCardProps[] => {
    return this.pile;
  };
  
  public getHasDrawn = (): boolean => {
    return this.hasDrawn;
  };
  
  public getDrawn = (): GameCardProps | undefined => {
    return this.drawnCard;
  };
  
  public drawOne = (): void => {
    this.hasDrawn = true;

    this.drawnCard = this.pile[this.drawIndex];
    this.drawIndex++;
    if (this.drawIndex === this.pile.length) {
      this.drawIndex = 0;
    }

    console.info("Drawing:", this.drawnCard.suit, this.drawnCard.value, "Draw Index:", this.drawIndex);
    this.drawnCard.isFaceUp = true;
  };
  
  private isOppositeSuit = (suitA: GameCardProps["suit"], suitB: GameCardProps["suit"]): boolean => {
    if (suitA === "clubs" && ["diamonds", "hearts"].includes(suitB)) {
      return true;
    } else if (suitA === "spades" && ["diamonds", "hearts"].includes(suitB)) {
      return true;
    } else if (suitA === "diamonds" && ["clubs", "spades"].includes(suitB)) {
      return true;
    } else if (suitA === "hearts" && ["clubs", "spades"].includes(suitB)) {
      return true;
    }
    return false;
  };
  
  public canMove = (source: GameCardProps, destination: GameCardProps, isBase: boolean) => {
    if (isBase && source.suit === destination.suit) {
      return true;
    } else {
      return source.value === destination.value - 1 && this.isOppositeSuit(source.suit, destination.suit);
    }
  };
  
  public performMove = (source: GameCardProps, destination: GameCardProps) => {
    const sourceLocation = this.findSelectedCard(source);
    const destinationLocation = this.findSelectedCard(destination);
    
    if (destinationLocation.stackIndex >= 0) {
      // Destination is a current stack
      if (sourceLocation.isDrawn) {
        // Case 1: Card is the currently drawn card
        if (this.drawIndex > 0 && this.drawIndex < this.pile.length - 1) {
          // Within the draw pile
          const pileStackA = this.pile.slice(0, this.drawIndex);
          const pileStackB = this.pile.slice(this.drawIndex + 1);
          
          // Splice the new pile together
          this.pile = [...pileStackA, ...pileStackB];
        } else if (this.drawIndex === this.pile.length - 1) {
          // Last card in the draw pile
          this.pile = [...this.pile.slice(0, this.pile.length - 1)];
        } else if (this.drawIndex === 0) {
          // First card in the draw pile
          this.pile = [...this.pile.slice(1)];
        }
        
        // Move the card to the top of the stack
        this.stacks[destinationLocation.stackIndex].push(source);
        
        // Reset the drawn card state
        this.drawnCard = undefined;
        this.hasDrawn = false;
      } else if (sourceLocation.stackIndex >= 0) {
        //  Case 2: Card is part of a stack
        const cardStack = this.stacks[sourceLocation.stackIndex].slice(sourceLocation.stackPosition);
        const remainingStack = this.stacks[sourceLocation.stackIndex].slice(0, sourceLocation.stackPosition);
        
        // Re-assign the remaining stack and the moved stack
        this.stacks[sourceLocation.stackIndex] = remainingStack;
        this.stacks[destinationLocation.stackIndex].push(...cardStack);
        
        // Ensure card on the source location is turned over
        if (remainingStack.length > 0) {
          this.stacks[sourceLocation.stackIndex][remainingStack.length - 1].isFaceUp = true;
        }
      }
    }
  };
  
  public findSelectedCard = (card: GameCardProps): GameCardLocation => {
    const topBaseCard = this.bases[card.suit][this.bases[card.suit].length - 1];
    if (topBaseCard && topBaseCard.value === card.value) {
      return {
        stackIndex: -1,
        stackPosition: -1,
        isBase: true,
        isDrawn: false,
      };
    }

    // Check each of the stacks
    for (let s = 0; s < this.stacks.length; s++) {
      for (let sp = 0; sp < this.stacks[s].length; sp++) {
        const stackCard = this.stacks[s][sp];
        if (stackCard.suit === card.suit && stackCard.value === card.value) {
          return {
            stackIndex: s,
            stackPosition: sp,
            isBase: false,
            isDrawn: false,
          };
        }
      }
    }
    
    // Check if the drawn card
    if (this.drawnCard && this.drawnCard.suit === card.suit && this.drawnCard.value === card.value) {
      return {
        stackIndex: -1,
        stackPosition: -1,
        isBase: false,
        isDrawn: true,
      };
    }
    
    // Invalid case
    console.warn("Unable to locate:", card.suit, card.value);
    return {
      stackIndex: -1,
      stackPosition: -1,
      isBase: false,
      isDrawn: false,
    };
  };
};

export default GameState;
