import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";
import Button from "./components/button";
import fonts from "./fonts";

const customTheme = extendTheme({
  shadows: {
    outline: "0 !important",
    brand: {
      shadow: {
        md: "4px 5px 24px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "brand.bg.100",
        color: "white",
      },
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
    cssVarPrefix: "fxd",
  },
  fonts,
  colors,
  components: {
    Button,
  },
});

export default customTheme;
