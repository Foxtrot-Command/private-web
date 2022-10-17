import { Box, Button, Text, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState } from "react";

type Props = {
  text: string;
  type?: string;
  buttonClass?: string;
  width?: string;
  height?: string;
  disabled?: boolean;
}

const FXDButton = (props: Props) => {
  const [isHover, setHover] = useState(false);

  const { text, type, width, height, disabled } = props;

  return (
    <Box
      justifyContent="center"
      textAlign="center"
      justifyItems="center"
      width="full"
      height="full"
    >
      <Button
        {...props}
        variant="unstyled"
        filter={disabled ? "grayscale(100%)" : "grayscale(0%)"}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        opacity={isHover ? 0.8 : 1}
        transition="all 0.2s ease-in-out"
        type="button"
      >
        <Box
          boxShadow={isHover ? "lg" : "md"}
          position="relative"
          width="full"
          height="full"
        >
          {type === "normal" ? (
            <Image
              src="/images/ui/buttons/normal_button.svg"
              width={width ?? "212px"}
              height={height ?? "70px"}
              objectFit="contain"
            />
          ) : type === "large" ? (
            <Image
              src="/images/ui/buttons/large_button.svg"
              width={width ?? "260px"}
              height={height ?? "68px"}
              objectFit="contain"
            />
          ) : (
            type === "variant" && (
              <Image
                src="/images/ui/buttons/variant_button.svg"
                width={width ?? "260px"}
                height={height ?? "75px"}
                objectFit="contain"
              />
            )
          )}

          <Text
            as="div"
            top="50%"
            left={0}
            right={0}
            bottom={0}
            width="full"
            height="full"
            position="absolute"
            transform="-50%, -50%"
            margin={0}
            zIndex={10}
            fontWeight="semi-bold"
            whiteSpace="nowrap"
            textTransform="uppercase"
            textAlign="center"
          >
            {text}
          </Text>
        </Box>
      </Button>
    </Box>
  );
};

FXDButton.propTypes = {
  buttonClass: PropTypes.string,
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["normal", "large", "variant"]),
  width: PropTypes.string,
  height: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

FXDButton.defaultProps = {
  text: "Example",
  type: "normal",
  disabled: false,
};

export default FXDButton;
