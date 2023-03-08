import { Box, Image } from "@chakra-ui/react";
import * as blockies from "blockies-ts";
import * as React from "react";

interface IBlockieStyleProps {
  size?: number;
  border?: boolean;
  children?: React.ReactNode;
}

interface IBlockieProps extends IBlockieStyleProps {
  address: string;
}

const BlockBorder = ({size, children}: IBlockieStyleProps) => (
  <Box
    boxSize={size}
    rounded="lg"
    w="40px"
    h="100%"
    background="whiteAlpha.300"
    justifyContent="center"
    display="flex"
    ml="10px"
  >
    {children}
  </Box>
);

const BlockImage = ({address, size}: IBlockieProps) => {
  const seed = address.toLowerCase() || "";
  const imgUrl = blockies
    .create({
      seed,
    })
    .toDataURL();
  return (
    <Image
      src={imgUrl}
      alt={address}
      rounded="md"
      width={`${size}px`}
      height={`${size}px`}
      margin="auto"
    />
  );
};

const Blockie = (props: IBlockieProps) => {
  return props.border === true ? (
    <BlockBorder {...props}>
      <BlockImage {...props} />
    </BlockBorder>
  ) : (
    <BlockImage {...props} />
  );
};

Blockie.defaultProps = {
  address: "0x0000000000000000000000000000000000000000",
  size: 24,
  border: true,
};

export default Blockie;
