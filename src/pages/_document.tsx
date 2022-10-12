/* eslint-disable react/jsx-props-no-spreading */
import Document, { Html, Head, Main, NextScript } from "next/document";
import * as React from "react";

const APP_NAME = "Private sale Foxtrot Command";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <meta name="application-name" content={APP_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          {/* <link
            rel="preload"
            href="/fonts/Montserrat.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          /> */}
          <meta name="apple-mobile-web-app-title" content={APP_NAME} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#FFFFFF" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
