import {
  Box,
  Center,
  Divider,
  Heading,
  ListItem,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import { numberWithCommas } from "helpers/utilities";

const BuyConditions = () => (
  <VStack>
    <Box
      justifyContent="center"
      rounded="lg"
      w={{ base: "100%" }}
      mb={{ base: 12, md: 0 }}
      backgroundColor="brand.bg.200"
      shadow="brand.shadow.md"
      p="5"
    >
      <Box
        color="primary.800"
        textAlign={["center", "center", "left", "center"]}
        lineHeight={1.5}
        p="6px"
      >
        <Heading size="sm" opacity="0.8" fontWeight="normal" as="h2">
          Conditions of purchase
        </Heading>
      </Box>

      <Center>
        <Divider w="90%" />
      </Center>

      <UnorderedList spacing={1} p="15px 10px 15px 10px">
        {[
          `Minimum investment ${process.env.NEXT_PUBLIC_BUSD_MIN_AMOUNT} $BUSD`,
          "Maximum investment: ~",
          `Unlocking ${process.env.NEXT_PUBLIC_TOKEN_UNBLOCK_ON_TGE}% on TGE`,
          "3 months of cliff",
          `${numberWithCommas(
            Number(process.env.NEXT_PUBLIC_TOKEN_PER_SECOND)
          )}% monthly released per second`,
        ].map((item, i) => (
          <ListItem key={i}>{item}</ListItem>
        ))}
      </UnorderedList>
    </Box>
  </VStack>
);

export default BuyConditions;
