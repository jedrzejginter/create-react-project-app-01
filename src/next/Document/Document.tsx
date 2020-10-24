import hoistNonReactStatics from "hoist-non-react-statics";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";

function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href={process.env.API_URL} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default hoistNonReactStatics(Document, NextDocument);
