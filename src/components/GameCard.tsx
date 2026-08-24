import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import GameState from "../lib/GameState";

export type SUITS = "spades" | "clubs" | "diamonds" | "hearts";

export type GameCardIdentity = {
  suit: SUITS;
  value: number;
};

export type GameCardProps = GameCardIdentity & {
  isFaceUp: boolean;
  isSelected: boolean;
  handleSelection?: (suit: SUITS, value: number) => void;
};

export type GameCardLocation = {
  stackIndex: number; // Index of stack (0-6), -1 if not in stack
  stackPosition: number; // Index of stack position (0-n), -1 if not in stack
  isDrawn: boolean; // If the drawn card
  isBase: boolean; // If located in the card suit base
  card: GameCardProps; // GameCardProps instance
};

export const SYMBOLS: Record<GameCardProps["suit"], string> = {
  "spades": "♠️",
  "clubs": "♣️",
  "diamonds": "♦️",
  "hearts": "♥️"
};

const GameCard = (props: GameCardProps) => {
  const [cardActive, setCardActive] = useState(props.isSelected);
  
  const color = ["spades", "clubs"].includes(props.suit) ? "black.700" : "red.700";
  const symbol = SYMBOLS[props.suit];
  
  let value = "A";
  if (props.value > 1 && props.value < 11) {
    value = props.value.toString();
  } else if (props.value === 11) {
    value = "J";
  } else if (props.value === 12) {
    value = "Q";
  } else if (props.value === 13) {
    value = "K";
  }
  
  return (
    <Flex
      rounded={"lg"}
      minH={"150px"}
      minW={"100px"}
      p={"1"}
      bg={cardActive ? "yellow.200" : "white"}
      align={"center"}
      justify={"center"}
      cursor={"pointer"}
      key={`${props.suit}_${props.value}`}
      border={"2px solid"}
      borderColor={props.isFaceUp ? color : "black"}
      onClick={() => props.handleSelection?.(props.suit, props.value)}
    >
      <Flex
        rounded={"md"}
        h={"100%"}
        w={"100%"}
        bg={props.isFaceUp ? "white" : "blue.400"}
        border={"3px solid"}
        borderColor={props.isFaceUp ? color : "black"}
        direction={"column"}
        gap={"2"}
        align={"center"}
        justify={"center"}
        p={"2"}
        userSelect={"none"}
      >
          {/* Top Section */}
          <Flex w={"100%"} h={"20%"} justify={"start"}>
            <Text fontSize={"lg"} color={color} visibility={props.isFaceUp ? "visible" : "hidden"}>{symbol} {value}</Text>
          </Flex>
          
          {/* Middle Section */}
          <Flex w={"100%"} h={"60%"} align={"center"} justify={"center"}>
            <Text fontWeight={"bold"} fontSize={"4xl"} color={color} visibility={props.isFaceUp ? "visible" : "hidden"}>{value}</Text>
          </Flex>

          {/* Bottom Section */}
          <Flex w={"100%"} h={"20%"} justify={"end"}>
            <Text fontSize={"lg"} color={color} visibility={props.isFaceUp ? "visible" : "hidden"}>{value} {symbol}</Text>
          </Flex>
      </Flex>
    </Flex>
  );
};

export default GameCard;
