import type { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";

import FormError from "@/components/FormError";
import { getErrorMessage } from "@/services/api";
import { activateAccount } from "@/services/auth";

type Props = {
  success: boolean;
  errorMessage?: string;
};

export default function ActivateAccount({ success, errorMessage }: Props) {
  return (
    <>
      <Head>
        <title>Activate account</title>
      </Head>
      <Link href="/login" passHref>
        <a>&larr; Go to login page</a>
      </Link>
      {success && (
        <p style={{ color: "green" }}>Your account has been activated. You can now log in!</p>
      )}
      {!success && errorMessage && <FormError>{errorMessage}</FormError>}
    </>
  );
}

ActivateAccount.getInitialProps = async ({ query }: NextPageContext): Promise<Props> => {
  const token: string = typeof query.token === "string" ? query.token : "";

  try {
    await activateAccount({ token });

    return {
      success: true,
    };
  } catch (err: unknown) {
    return {
      success: false,
      errorMessage: getErrorMessage(err, "Something went wrong!"),
    };
  }
};
