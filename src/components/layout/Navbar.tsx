import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link as ChakraLink,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  PopoverContent,
  PopoverTrigger,
  Popover,
  Image,
} from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
import { BigNumberish, ethers } from "ethers";
import Link from "next/link";
import React from "react";
import { FaChevronDown, FaBars, FaWindowClose } from "react-icons/fa";

import {
  injected,
  walletconnect,
  walletlink,
  network,
  defaultChain,
} from "../../../connectors";
import Blockie from "components/Blockie";
import WalletBoxInfo from "components/layout/Navbar/WalletBoxInfo";
import { CONTRACTS } from "constants/contracts";
import { addWeb3Asset, ellipseAddress, switchNetwork } from "helpers/utilities";
import { callBalanceOf } from "helpers/web3";
import { useEagerConnect, useInactiveListener } from "hooks";

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "brand.bg.100")}
        color={useColorModeValue("gray.600", "white")}
        boxShadow="lg"
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 8 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align="center"
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? (
                <FaWindowClose fontSize="20px" />
              ) : (
                <FaBars fontSize="20px" />
              )
            }
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily="heading"
            color={useColorModeValue("gray.800", "white")}
            display={{ base: "none", md: "inline" }}
          >
            <Link href="/">
              <a>
                <Image
                  src="/images/foxtrot_responsive_logo.svg"
                  alt="Foxtrot Logo"
                  width="75px"
                  height="50px"
                />
              </a>
            </Link>
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10} />
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          direction="row"
          spacing={6}
        >
          <DesktopNav />
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "brand.bg.300");

  const { onToggle } = useDisclosure();

  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = useWeb3React<Web3Provider>();

  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  const [userBalance, setUserBalance] = React.useState<
    BigNumberish | undefined
  >();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);

      if (library && account && chainId === Number(defaultChain.chainId)) {
        (async () => {
          const balanceFXD = await callBalanceOf(account, library);
          setUserBalance(
            Number(ethers.utils.formatEther(String(balanceFXD))).toFixed(2)
          );
        })();
      }
    }
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);

  const addFXD = async () => {
    addWeb3Asset({
      account: account !== undefined ? account : "",
      provider: library,
      token: {
        symbol: "FXD",
        address: CONTRACTS.fxd.address,
      },
    });
  };

  const WalletSectionMenu = ({ navItem }: { navItem: NavItem }) => {
    return (
      <PopoverContent
        border={0}
        boxShadow="xl"
        bg={popoverContentBgColor}
        p={4}
        rounded={6}
        minW="xs"
      >
        <Stack>
          {navItem.children &&
            navItem.children.map((child: any, index: number) => {
              const currentConnector = child.connector;
              const activating = currentConnector === activatingConnector;
              const connected = currentConnector === connector;
              const disabled =
                !triedEager || !!activatingConnector || connected || !!error;
              return (
                <DesktopSubNav
                  key={index}
                  label={child.label}
                  sublabel={child.sublabel}
                  image={child.image}
                  disabled={disabled}
                  onClick={() => {
                    if (chainId !== Number(defaultChain.chainId)) {
                      // if different, show warning
                      switchNetwork();
                      setActivatingConnector(currentConnector);
                      activate(currentConnector);
                    } else {
                      activate(currentConnector);
                    }
                  }}
                />
              );
            })}
        </Stack>
      </PopoverContent>
    );
  };

  const WalletConnected = ({
    account,
    chainId,
  }: {
    account: string;
    chainId: number | undefined;
  }) => {
    return (
      <>
        <PopoverContent
          border={0}
          boxShadow="xl"
          bg={popoverContentBgColor}
          p={4}
          rounded={6}
          minW="xs"
        >
          <Stack>
            {WalletBoxInfo({ account, chainId: chainId?.toString() })}
            <Button
              background="brand.primary.600"
              borderRadius={3}
              onClick={() => {
                deactivate();
                onToggle();
              }}
            >
              Disconnect
            </Button>
            {connector === connectorsByName[ConnectorNames.WalletConnect] && (
              <button
                style={{
                  height: "3rem",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (connector) {
                    connector.deactivate();
                  }
                }}
              >
                Kill WalletConnect Session
              </button>
            )}
            {connector === connectorsByName[ConnectorNames.WalletLink] && (
              <button
                style={{
                  height: "3rem",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (connector) {
                    connector.deactivate();
                  }
                }}
              >
                Kill WalletLink Session
              </button>
            )}
          </Stack>
        </PopoverContent>
      </>
    );
  };

  return (
    <Stack direction="row" spacing={4}>
      <Box
        color={linkColor}
        _hover={{ color: linkHoverColor }}
        _focus={{ outline: "none" }}
        fontSize="md"
        fontWeight="semibold"
        height="100%"
        display={{ base: "none", md: "flex" }}
        alignItems="center"
      >
        <Link href="/claim" passHref>
          <a>Claim</a>
        </Link>
        {/* <Button onClick={addFXD}>
                    Add token
                </Button> */}
      </Box>
      {PROVIDER_ITEMS.map((navItem, index) => {
        return (
          <Box key={index}>
            <Popover trigger="click" placement="bottom-start" id="popover">
              <PopoverTrigger>
                <ChakraLink
                  p={2}
                  href={navItem.href ?? "#"}
                  fontSize="sm"
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: "none",
                    color: linkHoverColor,
                  }}
                >
                  {library && account ? (
                    <Button pr="0" rounded="lg">
                      {ellipseAddress(account)}
                      <Blockie address={account} />
                    </Button>
                  ) : (
                    <Button rounded={6}>{navItem.label}</Button>
                  )}
                </ChakraLink>
              </PopoverTrigger>
              {library && account ? (
                <WalletConnected chainId={chainId} account={account} />
              ) : (
                navItem.children && <WalletSectionMenu navItem={navItem} />
              )}
            </Popover>
          </Box>
        );
      })}
    </Stack>
  );
};

const DesktopSubNav = (props: any) => {
  const { label, sublabel, onClick, image } = props;
  return (
    <ChakraLink
      {...props}
      variant="unstyled"
      onClick={onClick}
      role="group"
      display="block"
      p={2}
      rounded="md"
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction="row" align="center" spacing={6}>
        <Image src={image} width="32px" height="32px" />
        <Box>
          <Text
            transition="all .3s ease"
            _groupHover={{ color: "brand.primary.300" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize="sm">{sublabel}</Text>
        </Box>
        <Flex
          transition="all .3s ease"
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          {/* <Icon color={'pink.400'} w={5} h={5} as={FaWindowClose} /> */}
        </Flex>
      </Stack>
    </ChakraLink>
  );
};

const MobileNav = () => {
  const PROVIDER_NEW_ITEMS = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Claim",
      href: "/claim",
    },
    ...PROVIDER_ITEMS,
  ];
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {PROVIDER_NEW_ITEMS.map((navItem, index) => (
        <MobileNavItem key={index} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={ChakraLink}
        href={href ?? "#"}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        {href !== undefined ? (
          <Link passHref href={href}>
            <a>
              <Text
                fontWeight={600}
                color={useColorModeValue("gray.600", "gray.200")}
              >
                {label}
              </Text>
              {children && (
                <Icon
                  as={FaChevronDown}
                  transition="all .25s ease-in-out"
                  transform={isOpen ? "rotate(180deg)" : ""}
                  w={6}
                  h={6}
                />
              )}
            </a>
          </Link>
        ) : (
          <>
            <Text
              fontWeight={600}
              color={useColorModeValue("gray.600", "gray.200")}
            >
              {label}
            </Text>
            {children && (
              <Icon
                as={FaChevronDown}
                transition="all .25s ease-in-out"
                transform={isOpen ? "rotate(180deg)" : ""}
                w={6}
                h={6}
              />
            )}
          </>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align="start"
        >
          {children &&
            children.map((child, index) => (
              <>
                {child.href !== undefined ? (
                  <Link key={index} passHref href={child.href}>
                    <a>{child.label}</a>
                  </Link>
                ) : (
                  <ChakraLink key={child.label} py={2} href={child.href}>
                    <a>{child.label}</a>
                  </ChakraLink>
                )}
              </>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  sublabel?: string;
  children?: Array<NavItem>;
  href?: string;
  connector?: any;
  image?: any;
}

enum ConnectorNames {
  Injected = "Injected",
  WalletConnect = "WalletConnect",
  WalletLink = "WalletLink",
  Network = "Network",
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Network]: network,
};

const PROVIDER_ITEMS: Array<NavItem> = [
  {
    label: "Connect Wallet",
    children: [
      {
        label: "Metamask",
        sublabel: "Injected browser extension",
        connector: connectorsByName[ConnectorNames.Injected],
        image: "/images/ui/chains/metamask.svg",
      },
      {
        label: "WalletConnect",
        sublabel: "Wallet api",
        connector: connectorsByName[ConnectorNames.WalletConnect],
        image: "/images/ui/chains/walletconnect.svg",
      },
    ],
  },
];
