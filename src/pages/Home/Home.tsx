import Head from "next/head";
import Link from "next/link";

import HomeIcon from "@/assets/icons/home.svg";

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome!</title>
      </Head>
      <div>
        <HomeIcon style={{ height: "2rem", width: "2rem" }} />
      </div>
      <Link href="/login" passHref>
        <a>Log in</a>
      </Link>{" "}
      |{" "}
      <Link href="/create-account" passHref>
        <a>Create an account</a>
      </Link>
    </>
  );
}
