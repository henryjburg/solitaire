import React, { useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Flex w={"100%"} h={"100vh"} bg={"green.200"} align={"center"} justify={"center"}>
      <Heading>Playing Area</Heading>
    </Flex>
  );
};

export default App;
