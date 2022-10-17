import { Box, VStack, Badge, Text, Center, Image, ChakraProps } from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { Block, Loading } from "notiflix";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import React, { useEffect } from "react";

import { defaultChain } from "../../../../connectors";
import FXDButton from "components/FXDButton";
import { CONTRACTS } from "constants/contracts";
import { getTokenRate } from "helpers/utilities";
import {
  ApproveAllowance,
  callAllowanceOf,
  Invest,
} from "helpers/web3";
import useNumberField from "hooks/useNumberField";

import BuyInputs from "./BuyInputs";

const HandleInvest = ({
  value,
  library,
  account,
  allowance,
  setUserAllowance,
}: any) => {
  const delay = 1200;

  if (!!(library && account) && allowance < 1000000) {
    Block.standard("#element", "Please wait...", {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      messageColor: "rgba(255, 255, 255, 0.8)",
    });
    ApproveAllowance("busd", library)
      .then(async (data: any) => {
        library.once(data.hash, (transaction: any) => {
          if (transaction && transaction.blockNumber) {
            Block.remove("#element");
            Notify.success("Approved contract");
            setUserAllowance(1000000);
          }
          library.removeListener(data.hash);
        });
      })
      .catch((error: any) => {
        Block.remove("#element", delay);
        return error?.message !== undefined && Notify.failure(error.message);
      });
  } else {
    Loading.standard("Processing investment...", {
      svgColor: "#E51A29",
    });
    Invest(value.toString(), library)
      .then(async (data: any) => {
        Notify.success(
          `Hash of the transaction: <a href="https://bscscan.com/tx/${data.hash}">${data.hash}</a>`,
          {
            timeout: delay + 1000,
            plainText: false,
            messageMaxLength: 200,
          }
        );

        Loading.change("Waiting for confirmation...");
        library.once(data.hash, (transaction: any) => {
          if (transaction && transaction.blockNumber) {
            Notify.success("Payment confirmed", {
              timeout: delay,
            });
            Loading.remove(delay);
          }
          library.removeListener(data.hash);
        });
      })
      .catch((error: any) => {
        Loading.remove();
        return error?.data?.message !== undefined
          ? Notify.failure(error.data.message)
          : String(error).includes("execution reverted")
          ? Notify.failure(error)
          : Notify.failure("Payment rejected");
      });
  }
};

async function getSaleEnd() {
  const provider = ethers.getDefaultProvider(defaultChain.rpc);
  return new Promise(async (resolve, reject) => {
    const contract = new Contract(
      CONTRACTS.private2.address,
      CONTRACTS.private2.abi,
      provider
    );

    await contract
      .getSaleEnd()
      .then((data: any, err: any) => {
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

  const [allowance, setUserAllowance] = React.useState<number | undefined>();
  const [message, setMessage] = React.useState<string>();
  const [isSaleEnd, setSaleEnd] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (library && account && chainId === defaultChain.chainId) {
      callAllowanceOf(account, "busd", library).then(({_hex: allowance}: any) => {
        return (
          setUserAllowance(formatEther(allowance) as unknown as number)
        )
      });
    }

    (async () => {
      const time = await getSaleEnd();
      setSaleEnd(
        Number(formatEther(time as string)) * 1e18 <
          Math.floor(Date.now() / 1000)
      );
    })();
  }, [account, chainId, library]);

  useEffect(() => {
    const timer = setTimeout(() => setMessage(''), 3000);
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

          {!isSaleEnd && (
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
            </>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
