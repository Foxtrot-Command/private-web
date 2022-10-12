import { Box, Divider, Heading, Text, Image } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import Explanation from "components/Sale/components/texts/explanation.md";
import Link from "next/link";

const TabSectionText = () => {
  return (
    <Box p={{ base: 5, md: 10 }} w="full">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ href, children }) => {
            return (
              <Link href={href as unknown as URL}>
                <Box as="a" textDecoration="ButtonFace">{children}</Box>
              </Link>
            )
          },
          h1: ({ children }) => {
            return (
              <Heading fontSize="3xl" mt={3}>
                {children}
              </Heading>
            );
          },
          h2: ({ children }) => {
            return (
              <Heading fontSize="2xl" mt={3}>
                {children}
              </Heading>
            );
          },
          h3: ({ children }) => {
            return (
              <Heading fontSize="xl" mt={4}>
                {children}
              </Heading>
            );
          },
          ul: ({ children }) => {
            return (
              <Text as="ul" paddingLeft="10">
                {children}
              </Text>
            );
          },
          hr: () => {
            return <Divider my={4} />;
          },
          p: ({ children }) => {
            return (
              <Text
                as="h1"
                marginTop="2"
                fontSize="md"
                color="brand.bg.400"
                whiteSpace="pre-line"
              >
                {children}
              </Text>
            );
          },
          img: ({ node, children }: any) => {
            return (
              <Box>
                <Image 
                src={node.properties.src} 
                objectFit="cover" 
                rounded="6" 
                userSelect="none" 
                pointerEvents="none" 
                />
              </Box>
            );
          },
        }}
      >
        {Explanation}
      </ReactMarkdown>
    </Box>
  );
};

export default TabSectionText;
