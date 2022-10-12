import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  Link as ChakraLink,
  useColorMode,
} from "@chakra-ui/react";
import Link from "next/link";

const Page404 = () => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Box width={["100%", "70%", "60%", "60%"]} margin="0 auto">
        <Image
          src="/404 Error-pana.svg"
          alt="Error 404 not found Illustration"
        />
      </Box>

      <Box marginY={4}>
        <Heading textAlign="center">Page not Found.</Heading>

        <Box textAlign="center" marginTop={4}>
          <Link href="/" passHref>
            <a>
              <Button backgroundColor="brand.primary.700" rounded="2xl">
                Back
              </Button>
            </a>
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default Page404;
