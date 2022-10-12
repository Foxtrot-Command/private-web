import {
  Box,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { FaExchangeAlt } from "react-icons/fa";

import { getTokenRate } from "helpers/utilities";

const BuyInputs = (props: any) => {
  const maxRaised = Number(process.env.NEXT_PUBLIC_TOTAL_RAISE);
  const value = props.value >= maxRaised ? maxRaised : props.value;
  const { library } = useWeb3React<Web3Provider>();
  return (
    <Stack spacing={3} width="100%">
      <NumberInput
        step={1}
        defaultValue={process.env.NEXT_PUBLIC_BUSD_MIN_AMOUNT}
        min={1}
        max={maxRaised}
        size="lg"
        variant="filled"
        onChange={props.handleChange}
        value={value}
        isDisabled={library === undefined}
      >
        <NumberInputField />
        <Box color="brand.bg.400">
          <InputRightElement width="9rem">
            <Text>|</Text>
          </InputRightElement>
          <InputRightElement width="4.5rem">
            <Text>BUSD</Text>
          </InputRightElement>
        </Box>
      </NumberInput>

      <Center>
        <FaExchangeAlt
          style={{
            transform: "rotate(90deg)",
          }}
        />
      </Center>

      <InputGroup size="lg">
        <Input
          variant="filled"
          type="text"
          value={getTokenRate(value).toFixed(2)}
          disabled
        />
        <Box color="brand.bg.400">
          <InputRightElement width="9rem">
            <Text>|</Text>
          </InputRightElement>
          <InputRightElement width="4.5rem">
            <Text>FXD</Text>
          </InputRightElement>
        </Box>
      </InputGroup>
    </Stack>
  );
};

export default BuyInputs;
