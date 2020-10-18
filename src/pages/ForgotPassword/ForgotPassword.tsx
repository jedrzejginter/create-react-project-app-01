import emailValidator from "email-validator";
import { FormikErrors, FormikHelpers, useFormik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import FormError from "@/components/FormError";
import Spinner from "@/components/Spinner";
import { getErrorMessage } from "@/services/api";
import { forgotPassword } from "@/services/auth";

import type { FormValues } from "./types";

function validate(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {};

  if (!emailValidator.validate(values.email)) {
    errors.email = "Invalid e-mail address.";
  }

  return errors;
}

export default function ForgotPassword() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasSuccess, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isComponentMount = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isComponentMount.current = false;
    };
  }, []);

  const onSubmit = useCallback(
    async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
      setSuccess(false);
      setError(null);
      setLoading(true);

      try {
        await forgotPassword(values);
        setSuccess(true);
        resetForm();
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
    [],
  );

  const { errors, handleBlur, handleChange, handleSubmit, touched, values } = useFormik<FormValues>(
    {
      onSubmit,
      validate,
      initialValues: {
        email: process.env.DEFAULT_USER_EMAIL ?? "",
      },
    },
  );

  return (
    <>
      <Head>
        <title>Forgot password</title>
      </Head>
      <Link href="/login" passHref>
        <a>&larr; Back to login page</a>
      </Link>
      <h1>Forgot password?</h1>
      {error && <FormError>{error}</FormError>}
      {hasSuccess && (
        <p style={{ color: "green" }}>
          An e-mail has been sent to your address with password reset link.
        </p>
      )}
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
        {isLoading && <Spinner size={16} />}
        <button disabled={isLoading} type="submit">
          Reset password
        </button>
      </form>
    </>
  );
}
