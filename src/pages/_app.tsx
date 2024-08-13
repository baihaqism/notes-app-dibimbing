import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { DM_Sans, Space_Mono } from "next/font/google";
import { Global } from "@emotion/react";
import client from "../api/graphql";
import theme from "../theme/theme";

const fontHeading = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-body",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Global
          styles={{
            ":root": {
              "--font-heading": fontHeading.style.fontFamily,
              "--font-body": fontBody.style.fontFamily,
            },
          }}
        />
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
