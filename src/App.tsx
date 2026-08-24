import React, { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";

// Custom components
import GameCard, { GameCardLocation, GameCardProps, SYMBOLS } from "./components/GameCard";

// Custom classes
import GameState, { GameSelectionType } from "./lib/GameState";

// Utility functions
import _ from "lodash";

export const App = () => {
  // Game state
  const [game, setGame] = useState<GameState>(new GameState());
  const [currentDrawn, setCurrentDrawn] = useState<GameCardProps>();
  const [clubsBaseTop, setClubsBaseTop] = useState<GameCardProps | undefined>();
  const [spadesBaseTop, setSpadesBaseTop] = useState<GameCardProps | undefined>();
  const [diamondsBaseTop, setDiamondsBaseTop] = useState<GameCardProps | undefined>();
  const [heartsBaseTop, setHeartsBaseTop] = useState<GameCardProps | undefined>();
  
  // Score state
  const [score, setScore] = useState(game.getScore());
  
  // Move state
  const [sourceType, setSourceType] = useState<GameSelectionType>();
  const [destinationType, setDestinationType] = useState<GameSelectionType>();
  const [sourceCard, setSourceCard] = useState<GameCardLocation>();
  const [destinationCard, setDestinationCard] = useState<GameCardLocation>();
  
  const refreshGame = () => {
    // Refresh the card draw state
    setCurrentDrawn(game.getDrawn());
    setScore(game.getScore());
    
    // Refresh the bases
    if (game.getBases()["clubs"].length > 0) setClubsBaseTop(game.getBases()["clubs"][game.getBases()["clubs"].length - 1]);
    if (game.getBases()["spades"].length > 0) setSpadesBaseTop(game.getBases()["spades"][game.getBases()["spades"].length - 1]);
    if (game.getBases()["diamonds"].length > 0) setDiamondsBaseTop(game.getBases()["diamonds"][game.getBases()["diamonds"].length - 1]);
    if (game.getBases()["hearts"].length > 0)setHeartsBaseTop(game.getBases()["hearts"][game.getBases()["hearts"].length - 1]);
    
    // Check win state
    if (game.checkWin()) {
      alert(`You win! Score: ${game.getScore()} points`);
    }
  };
  
  const handleDraw = () => {
    game.drawOne();
    setCurrentDrawn(game.getDrawn());
  };
  
  const handleSelection = (selectionType: GameSelectionType, suit?: GameCardProps["suit"], value?: number, stackIndex?: number) => {
    if (_.isUndefined(sourceType)) {
      console.info("Source:", selectionType, suit, value);
      // Source is undefined, meaning this is the first card clicked
      if (selectionType === "draw" && !_.isUndefined(suit) && !_.isUndefined(value)) {
        setSourceType("draw");
        setSourceCard(game.findSelectedCard(suit, value));
      } else if (selectionType === "stack" && !_.isUndefined(suit) && !_.isUndefined(value)) {
        setSourceType("stack");
        setSourceCard(game.findSelectedCard(suit, value));
      } else if (selectionType === "base" && !_.isUndefined(suit) && !_.isUndefined(value)) {
        setSourceType("base");
        setSourceCard(game.findSelectedCard(suit, value));
      } else {
        console.warn("Invalid Source:", selectionType, suit, value);
      }
    } else if (_.isUndefined(destinationType)) {
      console.info("Destination:", selectionType, suit, value);
      // Destination is undefined, meaning this is the second card clicked
      if (selectionType === "base" && !_.isUndefined(suit) && !_.isUndefined(value)) {
        setDestinationType("base");
        setDestinationCard(game.findSelectedCard(suit, value));
      } else if (selectionType === "stack" && !_.isUndefined(suit) && !_.isUndefined(value)) {
        setDestinationType("stack");
        setDestinationCard(game.findSelectedCard(suit, value));
      } else if (selectionType === "emptyStack" && !_.isUndefined(stackIndex)) {
        setDestinationType("emptyStack");
        setDestinationCard({
          stackIndex: stackIndex,
          stackPosition: 0,
          isDrawn: false,
          isBase: false,
          card: undefined,
        });
      } else {
        console.warn("Invalid Destination:", selectionType, suit, value);
      }
    }
  };
  
  useEffect(() => {
    if (!_.isUndefined(sourceType) && !_.isUndefined(destinationType)) {
      const validMove = game.performMove(sourceType, destinationType, sourceCard, destinationCard);
      if (!validMove) {
        console.warn("Invalid Move!");
      } else {
        game.applyScore(sourceType, destinationType);
      }
      
      setSourceType(undefined);
      setDestinationType(undefined);
      setSourceCard(undefined);
      setDestinationCard(undefined);
    }
    
    refreshGame();
  }, [sourceType, destinationType]);

  return (
    <Flex w={"100%"} h={"100vh"} bg={"green.200"} align={"center"} justify={"center"} direction={"column"} gap={"2"} p={"4"}>
      {/* Bases and Draw Pile */}
      <Flex w={"100%"} h={"30%"} rounded={"lg"} bg={"green.700"} direction={"row"} justify={"space-between"} align={"center"} p={"4"}>
        {/* Bases */}
        <Flex direction={"row"} gap={"2"}>
          {/* Base: Clubs */}
          <Flex
            rounded={"md"}
            h={"180px"}
            minW={"120px"}
            p={"1"}
            border={"2px solid"}
            borderColor={"gray.300"}
            bg={"green.600"}
            justify={"center"}
            align={"center"}
            userSelect={"none"}
            cursor={"pointer"}
            onClick={() => {
              if (_.isUndefined(clubsBaseTop)) {
                handleSelection("base", "clubs", 0);
              }
            }}
          >
            {!_.isUndefined(clubsBaseTop) ? (
              <GameCard
                suit={clubsBaseTop.suit}
                value={clubsBaseTop.value}
                isSelected={clubsBaseTop.isSelected}
                isFaceUp={true}
                handleSelection={() => handleSelection("base", "clubs", clubsBaseTop.value)}
              />
            ) : (
              <Text fontSize={"3xl"}>{SYMBOLS["clubs"]}</Text>
            )}
          </Flex>

          {/* Base: Spades */}
          <Flex
            rounded={"md"}
            h={"180px"}
            minW={"120px"}
            p={"1"}
            border={"2px solid"}
            borderColor={"gray.300"}
            bg={"green.600"}
            justify={"center"}
            align={"center"}
            userSelect={"none"}
            cursor={"pointer"}
            onClick={() => {
              if (_.isUndefined(spadesBaseTop)) {
                handleSelection("base", "spades", 0);
              }
            }}
          >
            {!_.isUndefined(spadesBaseTop) ? (
              <GameCard
                suit={spadesBaseTop.suit}
                value={spadesBaseTop.value}
                isSelected={spadesBaseTop.isSelected}
                isFaceUp={true}
                handleSelection={() => handleSelection("base", "spades", spadesBaseTop.value)}
              />
            ) : (
              <Text fontSize={"3xl"}>{SYMBOLS["spades"]}</Text>
            )}
          </Flex>

          {/* Base: Diamonds */}
          <Flex
            rounded={"md"}
            h={"180px"}
            minW={"120px"}
            p={"1"}
            border={"2px solid"}
            borderColor={"gray.300"}
            bg={"green.600"}
            justify={"center"}
            align={"center"}
            userSelect={"none"}
            cursor={"pointer"}
            onClick={() => {
              if (_.isUndefined(diamondsBaseTop)) {
                handleSelection("base", "diamonds", 0);
              }
            }}
          >
            {!_.isUndefined(diamondsBaseTop) ? (
              <GameCard
                suit={diamondsBaseTop.suit}
                value={diamondsBaseTop.value}
                isSelected={diamondsBaseTop.isSelected}
                isFaceUp={true}
                handleSelection={() => handleSelection("base", "diamonds", diamondsBaseTop.value)}
              />
            ) : (
              <Text fontSize={"3xl"}>{SYMBOLS["diamonds"]}</Text>
            )}
          </Flex>

          {/* Base: Hearts */}
          <Flex
            rounded={"md"}
            h={"180px"}
            minW={"120px"}
            p={"1"}
            border={"2px solid"}
            borderColor={"gray.300"}
            bg={"green.600"}
            justify={"center"}
            align={"center"}
            userSelect={"none"}
            cursor={"pointer"}
            onClick={() => {
              if (_.isUndefined(heartsBaseTop)) {
                handleSelection("base", "hearts", 0);
              }
            }}
          >
            {!_.isUndefined(heartsBaseTop) ? (
              <GameCard
                suit={heartsBaseTop.suit}
                value={heartsBaseTop.value}
                isSelected={heartsBaseTop.isSelected}
                isFaceUp={true}
                handleSelection={() => handleSelection("base", "hearts", heartsBaseTop.value)}
              />
            ) : (
              <Text fontSize={"3xl"}>{SYMBOLS["hearts"]}</Text>
            )}
          </Flex>
          
          {/* Score */}
          <Flex direction={"column"} h={"100%"}>
            <Text color={"white"} fontSize={"lg"} fontWeight={"semibold"}>Score: {score}</Text>
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
              handleSelection={() => handleSelection("draw", currentDrawn.suit, currentDrawn.value)}
            />
          )}
          
          {/* Draw Pile */}
          <Flex rounded={"md"} h={"180px"} minW={"120px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"} cursor={"pointer"}>
            {game.getPile().length > 0 && (
              <Flex onClick={handleDraw}>
                <GameCard
                  suit={game.getPile()[0].suit}
                  value={game.getPile()[0].value}
                  isSelected={game.getPile()[0].isSelected}
                  isFaceUp={false}
                />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
      
      {/* Play Area */}
      <Flex direction={"column"} w={"100%"} h={"70%"} overflow={"hidden"}>
        <Flex direction={"row"} gap={"2"} w={"100%"} justify={"space-around"}>
          {game.getStacks().map((stack, stackIndex) => {
            if (stack.length > 0) {
              return (
                <Flex direction={"column"} gap={"1"} align={"center"}>
                  {stack.map((card, index) => {
                    return (
                      <Flex translate={`0px ${index > 0 ? (-100 - (stack.length * 2)) * index : 0}px`}>
                        <GameCard
                          suit={card.suit}
                          value={card.value}
                          isSelected={card.isSelected}
                          isFaceUp={card.isFaceUp}
                          handleSelection={() => handleSelection("stack", card.suit, card.value)}
                        />
                      </Flex>
                    );
                  })}
                </Flex>
              );
            } else {
              return (
                <Flex
                  rounded={"lg"}
                  h={"150px"}
                  minW={"100px"}
                  p={"1"}
                  align={"center"}
                  justify={"center"}
                  cursor={"pointer"}
                  border={"2px solid"}
                  borderColor={"gray.400"}
                >
                  <Flex
                    rounded={"md"}
                    h={"100%"}
                    w={"100%"}
                    direction={"column"}
                    gap={"2"}
                    align={"center"}
                    justify={"center"}
                    p={"2"}
                    userSelect={"none"}
                    onClick={() => handleSelection("emptyStack", undefined, 0, stackIndex)}
                  >
                  </Flex>
                </Flex>
              )
            }
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default App;
