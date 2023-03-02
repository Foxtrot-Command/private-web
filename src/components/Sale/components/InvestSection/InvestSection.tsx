import {
  Box,
  VStack,
  Badge,
  Text,
  Center,
  Image,
  ChakraProps,
} from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import React, { useEffect } from "react";

import { defaultChain } from "../../../../../connectors";
import BuyInputs from "../BuyInputs";
import FXDButton from "components/FXDButton";
import { CONTRACTS } from "constants/contracts";
import { getTokenRate } from "helpers/utilities";
import { callAllowanceOf, callWhitelistedAmountOf } from "helpers/web3";
import useNumberField from "hooks/useNumberField";

import { HandleInvest } from "./HandleInvest";

async function getPrivatesaleStatus(): Promise<boolean> {
  const provider = ethers.getDefaultProvider(defaultChain.rpc);
  return new Promise(async (resolve, reject) => {
    const contract = new Contract(
      CONTRACTS.private.address,
      CONTRACTS.private.abi,
      provider
    );

    await contract
      .showPrivateSaleStatus()
      .then((data: boolean, err: any) => {
        if (data) resolve(data);

        reject(err);
      })
      .catch((err: unknown) => {
        reject(err);
      });
  });
}

export default function InvestSection(props: ChakraProps) {
  const { library, chainId, account } = useWeb3React<Web3Provider>();

  const [whitelistedAmount, setWhitelistedAmount] = React.useState<number>(0);
  const [allowance, setUserAllowance] = React.useState<number | undefined>();
  const [message, setMessage] = React.useState<string>();
  const [isPrivateSaleOpen, setPrivateSaleStatus] =
    React.useState<boolean>(true);

  React.useEffect(() => {
    if (library && account && String(chainId) === defaultChain.chainId) {
      callAllowanceOf(account, "busd", library).then(
        ({ _hex: allowance }: any) => {
          return setUserAllowance(formatEther(allowance) as unknown as number);
        }
      );

      callWhitelistedAmountOf(account, library).then((data: any) =>
        setWhitelistedAmount(Number(formatEther(data)))
      );
    }

    (async () => {
      const status: boolean = await getPrivatesaleStatus();
      setPrivateSaleStatus(status);
    })();
  }, [account, chainId, library]);

  useEffect(() => {
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const minAmountOfBusd = Number(process.env.NEXT_PUBLIC_BUSD_MIN_AMOUNT);
  const inputBusd = useNumberField({
    type: "number",
    defValue: minAmountOfBusd,
  });

  return (
    <VStack w="full" h="full" spacing={10} alignItems="flex-start" {...props}>
      <Box
        id="element"
        w={{ base: "100%" }}
        mb={{ base: 12, md: 0 }}
        rounded="lg"
        p={{ base: 5, sm: 12, md: 12 }}
        pb={{ base: 10, md: 12 }}
        backgroundColor="brand.bg.200"
        shadow="brand.shadow.md"
        position="relative"
      >
        <VStack
          w={{ base: "100%", md: "100%", sm: "100%" }}
          align="center"
          spacing={5}
        >
          <Box mx="2%">
            <Image
              src="/images/Foxtrot_white.svg"
              height="110px"
              width="500px"
            />
          </Box>
          {/* THIS WAS COMMENTED BECAUSE WE HAVE PROBLEM WITH INVESTMENTS */}
          {/* <Percentage /> */}

          <Badge
            pt={3}
            fontSize="sm"
            bg="brand.bg.300"
            padding="10px"
            verticalAlign={["center", "center", "left", "center"]}
            rounded="md"
            fontWeight="semibold"
          >
            1 BUSD = {getTokenRate(1).toFixed(0)} FXD
          </Badge>

          {isPrivateSaleOpen && (
            <>
              <BuyInputs
                handleChange={inputBusd.onChange}
                value={inputBusd.value}
              />
              <FXDButton
                text={
                  !!(library && account) && allowance && allowance >= 1000000
                    ? "Invest"
                    : "Approve BUSD"
                }
                type="large"
                disabled={
                  !(library !== undefined && inputBusd.value >= minAmountOfBusd)
                }
                onClick={() =>
                  HandleInvest({
                    value: inputBusd.value,
                    library,
                    account,
                    allowance,
                    setUserAllowance,
                  })
                }
              />
              {!!(library && account) && whitelistedAmount ? (
                <Center fontSize={10} paddingTop="10px" color="brand.bg.400">
                  <Text>
                    Your wallet is limited to {whitelistedAmount} BUSD
                  </Text>
                </Center>
              ) : (
                ""
              )}
            </>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
