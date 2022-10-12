import { Box, Center, Container } from "@chakra-ui/react";
import { ReactNode } from "react";

import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <Container
        maxW="100%"
        size="xl"
        p={{
          base: 0,
          xl: "1.5% 10% 0% 10%",
          md: 0,
          sm: 0,
        }} /* TOP, RIGHT, BOTTOM, LEFT */
      >
        {children}
      </Container>
    </>
  );
};

export default Layout;
