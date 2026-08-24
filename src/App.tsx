import React, { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";

// Custom components
import GameCard, { GameCardProps, SYMBOLS } from "./components/GameCard";

// Custom classes
import GameState from "./lib/GameState";

// Utility functions
import _ from "lodash";

export const App = () => {
  // Game state
  const [game, setGame] = useState<GameState>(new GameState());
  const [hasDrawn, setHasDrawn] = useState(false);
  const [currentDrawn, setCurrentDrawn] = useState<GameCardProps>();
  
  // Selection state
  const [source, setSource] = useState<GameCardProps>();
  const [destination, setDestination] = useState<GameCardProps>();
  
  const refreshGame = () => {
    setHasDrawn(game.getHasDrawn());
    setCurrentDrawn(game.getDrawn());
  };
  
  const handleDraw = () => {
    game.drawOne();
    setCurrentDrawn(game.getDrawn());
    setHasDrawn(game.getHasDrawn());
  };
  
  const handleSelection = (suit: GameCardProps["suit"], value: number, isFaceUp: boolean) => {
    if (_.isUndefined(source) && isFaceUp) {
      setSource({
        suit,
        value,
        isSelected: true,
        isFaceUp,
      });
    } else if (source && _.isUndefined(destination) && isFaceUp) {
      setDestination({
        suit,
        value,
        isSelected: true,
        isFaceUp,
      });
    }
    
    refreshGame();
  };
  
  useEffect(() => {
    if (source && destination) {
      console.info("Running Comparison:", source, destination);
      console.info("Can Move:", game.canMove(source, destination, false));
      if (game.canMove(source, destination, false)) {
        game.performMove(source, destination);
      }
      setSource(undefined);
      setDestination(undefined);
    }
    
    refreshGame();
  }, [source, destination]);

  return (
    <Flex w={"100%"} h={"100vh"} bg={"green.200"} align={"center"} justify={"center"} direction={"column"} gap={"2"} p={"4"}>
      {/* Bases and Draw Pile */}
      <Flex w={"100%"} h={"30%"} rounded={"lg"} bg={"green.700"} direction={"row"} justify={"space-between"} align={"center"} p={"4"}>
        {/* Bases */}
        <Flex direction={"row"} gap={"2"}>
          {/* Base: Spades */}
          <Flex rounded={"md"} h={"180px"} minW={"120px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"}>
            <Text fontSize={"3xl"}>{SYMBOLS["spades"]}</Text>
          </Flex>

          {/* Base: Clubs */}
          <Flex rounded={"md"} h={"180px"} minW={"120px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"}>
            <Text fontSize={"3xl"}>{SYMBOLS["clubs"]}</Text>
          </Flex>

          {/* Base: Diamonds */}
          <Flex rounded={"md"} h={"180px"} minW={"120px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"}>
            <Text fontSize={"3xl"}>{SYMBOLS["diamonds"]}</Text>
          </Flex>

          {/* Base: Hearts */}
          <Flex rounded={"md"} h={"180px"} minW={"120px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"}>
            <Text fontSize={"3xl"}>{SYMBOLS["hearts"]}</Text>
          </Flex>
        </Flex>
        
        <Flex direction={"row"} gap={"2"} align={"center"}>
          {/* Draw Card */}
          {currentDrawn && (
            <GameCard
              suit={currentDrawn.suit}
              value={currentDrawn.value}
              isSelected={currentDrawn.isSelected}
              isFaceUp={currentDrawn.isFaceUp}
              handleSelection={() => handleSelection(currentDrawn.suit, currentDrawn.value, currentDrawn.isFaceUp)}
            />
          )}
          
          {/* Draw Pile */}
          <Flex rounded={"md"} h={"180px"} minW={"120px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"} cursor={"pointer"}>
            <Flex onClick={handleDraw}>
              <GameCard
                suit={game.getPile()[0].suit}
                value={game.getPile()[0].value}
                isSelected={game.getPile()[0].isSelected}
                isFaceUp={false}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      
      {/* Play Area */}
      <Flex direction={"column"} w={"100%"} h={"70%"}>
        <Flex direction={"row"} gap={"2"} w={"100%"} justify={"space-around"}>
          {game.getStacks().map((stack) => {
            return (
              <Flex direction={"column"} gap={"1"} align={"center"}>
                {stack.map((card, index) => {
                  return (
                    <Flex translate={`0px ${index > 0 ? -120 * index : 0}px`}>
                      <GameCard
                        suit={card.suit}
                        value={card.value}
                        isSelected={card.isSelected}
                        isFaceUp={card.isFaceUp}
                        handleSelection={() => handleSelection(card.suit, card.value, card.isFaceUp)}
                      />
                    </Flex>
                  );
                })}
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default App;
