import { Box, Image } from "@chakra-ui/react";
import * as blockies from "blockies-ts";
import * as React from "react";

interface IBlockieStyleProps {
  size?: number;
  border?: boolean;
}

interface IBlockieProps extends IBlockieStyleProps {
  address: string;
}

const BlockBorder = (props: any) => (
  <Box
    boxSize={props.size}
    rounded="lg"
    w="40px"
    h="100%"
    background="whiteAlpha.300"
    justifyContent="center"
    display="flex"
    ml="10px"
  >
    {props.children}
  </Box>
);

const BlockImage = (props: any) => {
  const seed = props.address.toLowerCase() || "";
  const imgUrl = blockies
    .create({
      seed,
    })
    .toDataURL();
  return (
    <Image
      src={imgUrl}
      alt={props.address}
      rounded="md"
      width={`${props.size}px`}
      height={`${props.size}px`}
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
