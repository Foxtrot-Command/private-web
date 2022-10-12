import {
  Box,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Center,
} from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { Confirm, Loading, Notify } from "notiflix";
import React, { useReducer, useState } from "react";

import FXDButton from "components/FXDButton";
import { callClaimStartAt, callTotals, claim } from "helpers/web3";

const HandleClaimWithConfirmation = (confirmation: Function) => {
  Confirm.show(
    "Foxtrot Private Sale",
    "Are you sure you want to claim your tokens? Your balance to claim is less than 5 tokens",
    "Yes",
    "No",
    () => {
      confirmation();
    },
    () => {
      Notify.failure("Claim rejected");
      Loading.remove();
    },
    {
      messageColor: "#fff",
      titleColor: "#fff",
      backgroundColor: "#2c2c32",
      cancelButtonBackground: "#ff5549",
      okButtonBackground: "#91919D",
      borderRadius: "4px",
    }
  );
};
const HandleClaim = ({ library, account, balance }: any) => {
  const delay = 1200;

  if (library && account) {
    Loading.standard("Processing tokens...", {
      svgColor: "#E51A29",
    });
    const normalClaim = () => {
      claim(library)
        .then(async (data: any) => {
          library.once(data.hash, (transaction: any) => {
            if (transaction && transaction.blockNumber) {
              Notify.success("You have successfully claimed your tokens", {
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
            : Notify.failure("Claim rejected");
        });
    };

    return balance <= 5
      ? HandleClaimWithConfirmation(normalClaim)
      : normalClaim();
  }
};

const TableOfAssets = () => {
  const { library, account } = useWeb3React<Web3Provider>();
  const isWeb3Active = !!(library && account);
  const [claimDate, setClaimDate] = useState(0);

  const [values, setValues] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      totalOf: 0,
      claimedOf: 0,
      lockedOf: 0,
      claimableTokens: 0,
    }
  );

  React.useEffect(() => {
    if (library && account) {
      callTotals("investorAccounting", account, library).then(
        (accounting: any) => {
          setValues({
            totalOf: formatEther(accounting.total),
            claimedOf: formatEther(accounting.claimed),
            lockedOf: formatEther(accounting.locked),
            claimableTokens: formatEther(accounting.available),
          });
        }
      );

      callClaimStartAt(library).then((date: any) => {
        setClaimDate(Number(BigNumber.from(date)));
      });

      const updateAccounting = () => {
        callTotals("investorAccounting", account, library).then(
          (accounting: any) => {
            const lastTotalOf: any = "";
            if (accounting.total !== lastTotalOf) {
              setValues({
                totalOf: formatEther(accounting.total),
              });
            }

            const lastClaimedOf: any = "";
            if (accounting.claimed !== lastClaimedOf) {
              setValues({
                claimedOf: formatEther(accounting.claimed),
              });
            }

            const lastLockedOf: any = "";
            if (accounting.locked !== lastLockedOf) {
              setValues({
                lockedOf: formatEther(accounting.locked),
              });
            }

            const lastAvailable: any = "";
            if (accounting.available !== lastAvailable) {
              setValues({
                claimableTokens: formatEther(accounting.available),
              });
            }
          }
        );
      };

      library.on("block", updateAccounting);

      return () => {
        library.removeListener("block", updateAccounting);
        setValues({
          totalOf: 0,
          claimedOf: 0,
          lockedOf: 0,
          claimableTokens: 0,
        });
      };
    }
  }, [account, library]);

  return (
    <Box textAlign="center" marginTop={4} overflow="hidden">
      <Table variant="simple" w="full">
        <Thead>
          <Tr>
            <Th opacity={0} />
            <Th isNumeric>Assets</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Total</Td>
            <Td isNumeric>
              {isWeb3Active && Number(values.totalOf).toFixed(2)}
            </Td>
          </Tr>
          <Tr>
            <Td>Blocked</Td>
            <Td isNumeric>
              {isWeb3Active && Number(values.lockedOf).toFixed(2)}
            </Td>
          </Tr>
          <Tr>
            <Td>Claimed</Td>
            <Td isNumeric>
              {isWeb3Active && Number(values.claimedOf).toFixed(2)}
            </Td>
          </Tr>
          <Tr>
            <Td>Available</Td>
            <Td isNumeric>
              {isWeb3Active && Number(values.claimableTokens).toFixed(2)}
            </Td>
          </Tr>
        </Tbody>
        <TableCaption mb="20px">
          <FXDButton
            text="Claim"
            disabled={!(isWeb3Active && claimDate > 0)}
            type="large"
            onClick={() =>
              HandleClaim({
                library,
                account,
                balance: Number(values.claimableTokens),
              })
            }
          />
        </TableCaption>
      </Table>
    </Box>
  );
};

const Claim = () => {
  return (
    <>
      <Center>
        <Box
          maxW="1000px"
          justifyContent="center"
          rounded="lg"
          w={{ base: "90%", md: "60%" }}
          mb={{ base: 12, md: 0 }}
          backgroundColor="brand.bg.200"
          shadow="brand.shadow.md"
          mt="40px"
          p="5"
        >
          <Heading textAlign="center">Private Sale Claim</Heading>
          <TableOfAssets />
        </Box>
      </Center>
    </>
  );
};

export default Claim;
