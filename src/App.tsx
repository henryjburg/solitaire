import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";

// Custom components
import GameCard, { SYMBOLS } from "./components/GameCard";

export const App = () => {
  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  
  return (
    <Flex w={"100%"} h={"100vh"} bg={"green.200"} align={"center"} justify={"center"} direction={"column"} gap={"2"} p={"4"}>
      {/* Bases and Draw Pile */}
      <Flex w={"100%"} h={"25%"} rounded={"lg"} bg={"green.700"} direction={"row"} justify={"space-between"} align={"center"} p={"4"}>
        {/* Bases */}
        <Flex direction={"row"} gap={"2"}>
          {/* Base: Spades */}
          <Flex rounded={"md"} h={"160px"} minW={"110px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"}>
            <Text fontSize={"3xl"}>{SYMBOLS["spades"]}</Text>
          </Flex>

          {/* Base: Clubs */}
          <Flex rounded={"md"} h={"160px"} minW={"110px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"}>
            <Text fontSize={"3xl"}>{SYMBOLS["clubs"]}</Text>
          </Flex>

          {/* Base: Diamonds */}
          <Flex rounded={"md"} h={"160px"} minW={"110px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"}>
            <Text fontSize={"3xl"}>{SYMBOLS["diamonds"]}</Text>
          </Flex>

          {/* Base: Hearts */}
          <Flex rounded={"md"} h={"160px"} minW={"110px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"}>
            <Text fontSize={"3xl"}>{SYMBOLS["hearts"]}</Text>
          </Flex>
          
        </Flex>
        
        {/* Draw Pile */}
        <Flex rounded={"md"} h={"160px"} minW={"110px"} p={"1"} border={"2px solid"} borderColor={"gray.300"} bg={"green.600"} justify={"center"} align={"center"} userSelect={"none"} cursor={"pointer"}>
          <Text fontSize={"3xl"} fontWeight={"bold"}>Draw</Text>
        </Flex>
      </Flex>
      
      {/* Play Area */}
      <Flex direction={"column"} w={"100%"} h={"75%"}>
        <Flex direction={"row"} gap={"2"} w={"100%"} wrap={"wrap"}>
          {cards.map((card) => {
            return (
              <GameCard suit={"spades"} value={card} isSelected={false} />
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default App;
