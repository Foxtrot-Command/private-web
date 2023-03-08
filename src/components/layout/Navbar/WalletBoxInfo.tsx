import {
  Center,
  VStack,
  Box,
  HStack,
  IconButton,
  Divider,
  Flex,
  Link as ChakraLink,
  Tooltip,
} from "@chakra-ui/react";
import { FaClipboard, FaExternalLinkAlt } from "react-icons/fa";

import { Networks } from "../../../../connectors";
import Blockie from "components/Blockie";
import { ellipseAddress } from "helpers/utilities";

const WalletBoxInfo = ({
  account,
  chainId,
}: {
  account: string;
  chainId: string | undefined;
}) => {
  const networkName = Object.keys(Networks).find(
    (key) => Networks[key].chainId === String(chainId)
  ) as string;

  return (
    <>
      <Center>
        <VStack spacing={4} align="stretch">
          <Box>
            <Blockie border={false} size={45} address={account} />
          </Box>
          <Box>
            <Box backgroundColor="brand.bg.200" px={2} py={1} borderRadius={3}>
              <HStack spacing="3px">
                <Box>{ellipseAddress(account)}</Box>
                <Box>
                  <Tooltip label="Copy to clipboard" hasArrow>
                    <IconButton
                      size="sm"
                      icon={<FaClipboard />}
                      variant="ghost"
                      aria-label="Copy Address to Clipboard"
                      onClick={() => {
                        navigator.clipboard.writeText(account);
                      }}
                    />
                  </Tooltip>
                </Box>
                <Box>
                  <ChakraLink
                    href={`${Networks[networkName]?.explorer}/address/${account}`}
                    isExternal
                  >
                    <Tooltip label="See on bscscan.com" hasArrow>
                      <IconButton
                        size="sm"
                        icon={<FaExternalLinkAlt />}
                        variant="ghost"
                        aria-label="Show Address in Explorer"
                      />
                    </Tooltip>
                  </ChakraLink>
                </Box>
              </HStack>
            </Box>
          </Box>
        </VStack>
      </Center>
      <Divider />
      <Flex justifyContent="space-between">
        <Box>Wallet:</Box>
        <Box>Metamask</Box>
      </Flex>
      <Flex justifyContent="space-between">
        <Box>Network Connected:</Box>
        <Box>{networkName}</Box>
      </Flex>
      <Divider />
    </>
  );
};

export default WalletBoxInfo;
