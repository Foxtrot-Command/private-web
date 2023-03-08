import { Box, Flex, Center, HStack } from "@chakra-ui/react";

import BuyConditions from "components/Sale/components/BuyConditions";
import InvestSection from "components/Sale/components/InvestSection/InvestSection";
import TabSection from "components/Sale/components/TabSection";

const Home = () => {
  return (
    <Center>
      <Flex
        alignItems="center"
        direction={{ base: "column", md: "row" }}
        height={{ base: "auto", md: "100%" }}
        margin={{ base: 2, sm: 3 }}
        p={[5, 5, 5, 5, 0]}
        maxW="1280px"
      >
        <HStack
          spacing={{ base: 0, md: 8 }}
          align={{ base: "unset", md: "flex-start" }}
          flexDirection={["column", "column", "row"]}
          justifyContent="center"
        >
          <Box w={{ base: "100%", md: "40%" }}>
            <InvestSection mb={{ base: 0, md: "40px" }} />
            <BuyConditions />
          </Box>
          <TabSection />
        </HStack>
      </Flex>
    </Center>
  );
};

export default Home;
