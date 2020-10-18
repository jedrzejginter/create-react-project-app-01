import emailValidator from "email-validator";
import { FormikErrors, useFormik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import FormError from "@/components/FormError";
import Spinner from "@/components/Spinner";
import { useSession } from "@/containers/Session";
import { getErrorMessage } from "@/services/api";
import { logIn, saveAuthToken } from "@/services/auth";

import type { FormValues } from "./types";

function validate(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {};

  if (!emailValidator.validate(values.email)) {
    errors.email = "Invalid e-mail address.";
  }

  if (values.password.trim().length === 0) {
    errors.password = "Password is required.";
  }

  return errors;
}

export default function Login() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { createSession } = useSession();
  const isComponentMount = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isComponentMount.current = false;
    };
  }, []);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setError(null);
      setLoading(true);

      try {
        const { user, token } = await logIn(values);

        saveAuthToken(token);
        createSession(token, user);
        router.push("/dashboard");

        // We can exit immediately, because the redirect will happen,
        // so we don't care about UI updates.
        return;
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Something went wrong!");

        if (isComponentMount.current) {
          setError(errorMessage);
        }
      }

      if (isComponentMount.current) {
        setLoading(false);
      }
    },
    [router, createSession],
  );

  const { errors, handleBlur, handleChange, handleSubmit, touched, values } = useFormik<FormValues>(
    {
      onSubmit,
      validate,
      initialValues: {
        email: process.env.DEFAULT_USER_EMAIL ?? "",
        password: process.env.DEFAULT_USER_PASSWORD ?? "",
      },
    },
  );

  return (
    <>
      <Head>
        <title>Welcome!</title>
      </Head>
      <Link href="/" passHref>
        <a>&larr; Back to home page</a>
      </Link>
      <h1>Log in</h1>
      {error && <FormError>{error}</FormError>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail address</label>
          <input
            type="text"
            id="email"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.email}
          />
          {touched.email && errors.email && <FormError>{errors.email}</FormError>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
          />
          {touched.password && errors.password && <FormError>{errors.password}</FormError>}
        </div>
        {isLoading && <Spinner size={16} />}
        <button disabled={isLoading} type="submit">
          Log in
        </button>
      </form>
      <Link href="/forgot-password" passHref>
        <a>Forgot password?</a>
      </Link>
    </>
  );
}
