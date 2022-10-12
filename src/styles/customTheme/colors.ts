import { DeepPartial, Theme } from "@chakra-ui/react";

/** extend additional color here */
const extendedColors: DeepPartial<Record<string, any>> = {
  brand: {
    primary: {
      50: "#FCE8EA",
      100: "#F8BFC3",
      200: "#F3969D",
      300: "#EE6D76",
      400: "#E9444F",
      500: "#E51A29",
      600: "#BE1622",
      700: "#891019",
      800: "#5B0B10",
      900: "#2E0508",
    },
    bg: {
      100: "#1B1B1E",
      200: "#232328",
      300: "#2C2C32",
      400: "#91919D",
    },
    percent: {
      200: "#E51A29",
    },
  },
};

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {};

const colors = {
  ...overridenChakraColors,
  ...extendedColors,
};

export default colors;
