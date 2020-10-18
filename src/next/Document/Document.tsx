import Document, { Head, Html, Main, NextScript } from "next/document";

export default class NextDocument extends Document {
  render() {
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
}
