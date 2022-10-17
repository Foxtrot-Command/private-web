import { Box } from "@chakra-ui/react";
import React from "react";

import TabSectionText from "components/Sale/components/TabSectionText";

const TabSection = () => {
  return (
    <Box
      rounded="lg"
      w={{ base: "100%", md: "60%" }}
      mb={{ base: 12, xl: "3%", md: 0, sm: "3%" }}
      backgroundColor="brand.bg.200"
      shadow="brand.shadow.md"
      minHeight="50%"
      overflowY="scroll"
      css={{
        "&::-webkit-scrollbar": {
          width: "1px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
          borderRadius: "100px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#2D323C",
          borderRadius: "100px",
          border: "9px solid transparent",
          backgroundClip: "padding-box",
        },
      }}
    >
      <TabSectionText />
    </Box>
  );
};

export default TabSection;
