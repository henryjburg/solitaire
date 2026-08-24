import { GameCardIdentity, GameCardLocation, GameCardProps } from "../components/GameCard";

// Utility functions
import _ from "lodash";

export type GameSelectionType = "draw" | "emptyStack" | "stack" | "emptyBase" | "base";

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
  
  public getBases = (): Record<GameCardProps["suit"], GameCardProps[]> => {
    return this.bases;
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
    if (this.drawIndex >= this.pile.length) {
      this.drawIndex = 0;
    }

    this.drawnCard = this.pile[this.drawIndex];
    this.drawnCard.isFaceUp = true;
    console.info("Draw Index:", this.drawIndex, "Card:", this.drawnCard.suit, this.drawnCard.value);

    this.hasDrawn = true;
    this.drawIndex++;
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
  
  private canMove = (source: GameCardLocation, destination: GameCardLocation, isBase: boolean) => {
    if (isBase && source.card.suit === destination.card.suit && source.card.value === destination.card.value + 1) {
      console.info("Checking Move:", source.card.suit, source.card.value, "->", destination.card.suit, "base");
      return true;
    } else if (source.card.value === destination.card.value - 1 && this.isOppositeSuit(source.card.suit, destination.card.suit)) {
      console.info("Checking Move:", source.card.suit, source.card.value, "->", destination.card.suit, destination.card.value);
      return true;
    }
    return false;
  };
  
  public performMove = (sourceType: GameSelectionType, destinationType: GameSelectionType, sourceCard?: GameCardLocation, destinationCard?: GameCardLocation): boolean => {
    console.info("Performing Move:", sourceType, sourceCard?.card?.suit, sourceCard?.card?.value, "->", destinationType);
    
    if (sourceType === "draw" && destinationType === "stack") {
      // Validation: cards must be defined and move must be valid
      if (_.isUndefined(sourceCard) || _.isUndefined(destinationCard)) {
        return false;
      }
      
      if (this.canMove(sourceCard, destinationCard, false)) {
        console.info("Pile Size (Before):", this.pile.length);
        _.remove(this.pile, sourceCard.card);
        console.info("Pile Size (After):", this.pile.length);
        
        // Move the card to the top of the stack
        this.stacks[destinationCard.stackIndex].push(sourceCard.card);
        
        // Reset the drawn card state
        this.drawnCard = undefined;
        this.hasDrawn = false;

        return true;
      }
      
      return false;
    } else if (sourceType === "draw" && destinationType === "emptyStack") {
      // Validation: cards must be defined and move must be valid
      if (_.isUndefined(sourceCard) || _.isUndefined(destinationCard)) {
        return false;
      }

      if (sourceCard.card.value !== 13) {
        return false;
      } else {
        console.info("Pile Size (Before):", this.pile.length);
        _.remove(this.pile, sourceCard.card);
        console.info("Pile Size (After):", this.pile.length);
        
        // Move the card to the top of the stack
        this.stacks[destinationCard.stackIndex].push(sourceCard.card);
        
        // Reset the drawn card state
        this.drawnCard = undefined;
        this.hasDrawn = false;

        return true;
      }
    } else if (sourceType === "draw" && destinationType === "base") {
      // Validation: cards must be defined and move must be valid
      if (_.isUndefined(sourceCard) || _.isUndefined(destinationCard)) {
        return false;
      }
      
      if (this.canMove(sourceCard, destinationCard, true)) {
        console.info("Pile Size (Before):", this.pile.length);
        _.remove(this.pile, sourceCard.card);
        console.info("Pile Size (After):", this.pile.length);
        
        // Move the card to the base
        this.bases[sourceCard.card.suit].push(sourceCard.card);
        
        // Reset the drawn card state
        this.drawnCard = undefined;
        this.hasDrawn = false;

        return true;
      }
    } else if (sourceType === "stack" && destinationType === "stack") {
      // Validation: cards must be defined and move must be valid
      if (_.isUndefined(sourceCard) || _.isUndefined(destinationCard)) {
        return false;
      }
      
      if (this.canMove(sourceCard, destinationCard, false)) {
        const cardStack = this.stacks[sourceCard.stackIndex].slice(sourceCard.stackPosition);
        const remainingStack = this.stacks[sourceCard.stackIndex].slice(0, sourceCard.stackPosition);

        // Re-assign the remaining stack and the moved stack
        this.stacks[sourceCard.stackIndex] = remainingStack;
        this.stacks[destinationCard.stackIndex].push(...cardStack);

        // Ensure card on the source location is turned over
        if (remainingStack.length > 0) {
          this.stacks[sourceCard.stackIndex][remainingStack.length - 1].isFaceUp = true;
        }

        return true;
      }
      
      return false;
    } else if (sourceType === "stack" && destinationType === "emptyStack") {
      // Validation: cards must be defined and move must be valid
      if (_.isUndefined(sourceCard) || _.isUndefined(destinationCard)) {
        return false;
      }
      
      if (sourceCard.card.value !== 13) {
        return false;
      } else {
        const cardStack = this.stacks[sourceCard.stackIndex].slice(sourceCard.stackPosition);
        const remainingStack = this.stacks[sourceCard.stackIndex].slice(0, sourceCard.stackPosition);

        // Re-assign the remaining stack and the moved stack
        this.stacks[sourceCard.stackIndex] = remainingStack;
        this.stacks[destinationCard.stackIndex].push(...cardStack);

        // Ensure card on the source location is turned over
        if (remainingStack.length > 0) {
          this.stacks[sourceCard.stackIndex][remainingStack.length - 1].isFaceUp = true;
        }

        return true;
      }
    } else if (sourceType === "stack" && destinationType === "base") {
      // Validation: cards must be defined and move must be valid
      if (_.isUndefined(sourceCard) || _.isUndefined(destinationCard)) {
        return false;
      }
      
      if (this.canMove(sourceCard, destinationCard, true)) {
        // Check the stack position of the source card
        if (sourceCard.stackPosition !== this.stacks[sourceCard.stackIndex].length - 1) {
          console.warn("Cannot move from within the stack!");
          return false;
        }
        
        // Re-assign the remaining stack
        const remainingStack = this.stacks[sourceCard.stackIndex].slice(0, sourceCard.stackPosition);
        this.stacks[sourceCard.stackIndex] = remainingStack;

        // Ensure card on the source location is turned over
        if (remainingStack.length > 0) {
          this.stacks[sourceCard.stackIndex][remainingStack.length - 1].isFaceUp = true;
        }
        
        // Move the card to the base
        this.bases[sourceCard.card.suit].push(sourceCard.card);

        return true;
      }
    } else if (sourceType === "base" && destinationType === "stack") {
      // Validation: cards must be defined and move must be valid
      if (_.isUndefined(sourceCard) || _.isUndefined(destinationCard)) {
        return false;
      }
      
      if (this.canMove(sourceCard, destinationCard, true)) {
        const baseCard = this.bases[sourceCard.card.suit].pop();
        if (_.isUndefined(baseCard)) {
          return false;
        }
        
        // Move the card to the base
        this.stacks[destinationCard.stackIndex].push(baseCard);

        // Ensure card on the destination location is turned over
        this.stacks[destinationCard.stackIndex][this.stacks[destinationCard.stackIndex].length - 1].isFaceUp = true;

        return true;
      }
    }

    return false;
  };
  
  public findSelectedCard = (suit: GameCardProps["suit"], value: number): GameCardLocation => {
    // Check if this is an empty base (value will be 0)
    if (value === 0) {
      return {
        stackIndex: -1,
        stackPosition: -1,
        isBase: true,
        isDrawn: false,
        card: {
          suit: suit,
          value: value,
          isFaceUp: false,
          isSelected: false,
        },
      };
    }
    
    const topBaseCard = this.bases[suit][this.bases[suit].length - 1];
    if (topBaseCard && topBaseCard.value === value) {
      return {
        stackIndex: -1,
        stackPosition: -1,
        isBase: true,
        isDrawn: false,
        card: topBaseCard,
      };
    }

    // Check each of the stacks
    for (let s = 0; s < this.stacks.length; s++) {
      for (let sp = 0; sp < this.stacks[s].length; sp++) {
        const stackCard = this.stacks[s][sp];
        if (stackCard.suit === suit && stackCard.value === value) {
          return {
            stackIndex: s,
            stackPosition: sp,
            isBase: false,
            isDrawn: false,
            card: stackCard,
          };
        }
      }
    }
    
    // Check if the drawn card
    if (this.drawnCard && this.drawnCard.suit === suit && this.drawnCard.value === value) {
      return {
        stackIndex: -1,
        stackPosition: -1,
        isBase: false,
        isDrawn: true,
        card: this.drawnCard,
      };
    }
    
    // Invalid case
    console.warn("Unable to locate:", suit, value);
    return {
      stackIndex: -1,
      stackPosition: -1,
      isBase: false,
      isDrawn: false,
      card: undefined,
    };
  };
};

export default GameState;
