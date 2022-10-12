import { Heading, Progress, Skeleton } from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import React from "react";

import { defaultChain, Networks } from "../../../../connectors";
import { CONTRACTS } from "constants/contracts";

const formatBalance = (balance: string) => {
  const value = parseInt(formatEther(balance));
  const formatted = value
    .toFixed(1)
    .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    .split(".")[0];
  return {
    value,
    formatted,
  };
};

const PercentComplete = (props: any) => {
  const { actual, totalvalue } = props;
  return (
    <Progress
      variant="primary"
      colorScheme="brand.percent"
      transition="ease-in-out 0.6s"
      value={
        Number(actual) === 0
          ? 0
          : 100 - ((totalvalue - actual) / totalvalue) * 100
      }
      {...props}
    />
  );
};

function Percentage() {
  const provider = ethers.getDefaultProvider(defaultChain.rpc);
  const [balance, setBalance] = React.useState();

  async function busdInvested() {
    return new Promise(async (resolve, reject) => {
      const contract = new Contract(
        CONTRACTS.private1.address,
        CONTRACTS.private1.abi,
        provider
      );

      await contract
        .totalBusdInvested()
        .then((data: any, err: any) => {
          if (data) resolve(data);

          reject(err);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  React.useEffect((): any => {
    if (provider) {
      let stale = false;

      busdInvested()
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(undefined);
          }
        });

      const updatePercentageBalance = () => {
        busdInvested().then((bal: any) => {
          let lastBalance: any = "";
          if (bal !== lastBalance) {
            lastBalance = bal;
            setBalance(bal);
          }
        });
      };

      provider.on("block", updatePercentageBalance);

      return () => {
        stale = true;
        provider.removeListener("block", updatePercentageBalance);
        setBalance(undefined);
      };
    }
  }, []); // ensures refresh if referential identity of library doesn't change across chainIds

  const totalRaised = Number(process.env.NEXT_PUBLIC_TOTAL_RAISE);
  return (
    <>
      <Heading
        pt={2}
        as="h1"
        size="sm"
        fontWeight="bold"
        color="brand.bg.400"
        textAlign={["center", "center", "left", "center"]}
      >
        {!balance ? (
          <Skeleton height="19px" />
        ) : (
          <>
            {`${
              balance === null
                ? "Error"
                : balance
                ? formatBalance(balance).formatted
                : "0"
            } BUSD de ${totalRaised?.toFixed(3)} BUSD`}
          </>
        )}
      </Heading>
      <PercentComplete
        totalvalue={totalRaised}
        actual={
          balance === null
            ? "Error"
            : balance
            ? formatBalance(balance).value
            : "0"
        }
        size="sm"
        w="100%"
        rounded="md"
        isIndeterminate={!balance}
        isAnimated
      />
    </>
  );
}

export default Percentage;
