import Head from "next/head";
import Link from "next/link";

function Err404() {
  return (
    <>
      <Head>
        <title>Not found</title>
      </Head>
      <h1>Page doesn't exist</h1>
      <Link href="/" passHref>
        <a>&larr; Go to home page</a>
      </Link>
    </>
  );
}

export default Err404;
