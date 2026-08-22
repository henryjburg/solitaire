import React, { useState } from "react";
import { Flex, Text, useStatStyles } from "@chakra-ui/react";

export type GameCardProps = {
  suit: "spades" | "clubs" | "diamonds" | "hearts";
  value: number;
  isSelected: boolean;
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
  
  const handleClick = () => {
    setCardActive(!cardActive);
    console.info("Clicked Card:", props.suit, value);
  };
  
  return (
    <Flex rounded={"lg"} minH={"150px"} minW={"100px"} p={"1"} bg={cardActive ? "yellow.200" : "white"} align={"center"} justify={"center"} cursor={"pointer"} key={`${props.suit}_${props.value}`} border={"0.5px solid"} borderColor={color} onClick={handleClick}>
      <Flex rounded={"md"} h={"100%"} w={"100%"} border={"3px solid"} borderColor={color} direction={"column"} gap={"2"} align={"center"} justify={"center"} p={"2"} userSelect={"none"}>
        {/* Top Section */}
        <Flex w={"100%"} h={"20%"} justify={"start"}>
          <Text fontSize={"lg"}>{symbol}</Text>
        </Flex>
        
        {/* Middle Section */}
        <Flex w={"100%"} h={"60%"} align={"center"} justify={"center"}>
          <Text fontWeight={"bold"} fontSize={"4xl"} color={color}>{value}</Text>
        </Flex>

        {/* Bottom Section */}
        <Flex w={"100%"} h={"20%"} justify={"end"}>
          <Text fontSize={"lg"}>{symbol}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GameCard;
