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

type Props = {
  value: number;
  handleChange: any;
};

const BuyInputs = ({ value, handleChange }: Props) => {
  const maxRaised = Number(process.env.NEXT_PUBLIC_TOTAL_RAISE);
  const inputValue = value >= maxRaised ? maxRaised : value;
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
        onChange={handleChange}
        value={inputValue}
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
          value={getTokenRate(inputValue).toFixed(0)}
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
