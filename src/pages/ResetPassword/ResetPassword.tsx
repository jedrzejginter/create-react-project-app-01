import { FormikErrors, FormikHelpers, useFormik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import FormError from "@/components/FormError";
import Spinner from "@/components/Spinner";
import { getErrorMessage } from "@/services/api";
import { resetPassword } from "@/services/auth";

import type { FormValues } from "./types";

function validate(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {};

  if (values.password.trim().length < 6) {
    errors.password = "Password is too short.";
  }

  if (values.passwordRepeat.trim().length < 6) {
    errors.passwordRepeat = "Password is too short.";
  } else if (values.password !== values.passwordRepeat) {
    errors.passwordRepeat = "Passwords don't match.";
  }

  return errors;
}

export default function ResetPassword() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasSuccess, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isComponentMount = useRef<boolean>(true);
  const { query } = useRouter();

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
        await resetPassword({
          password: values.password,
          token: values.token,
        });

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
        token: typeof query.token === "string" ? query.token : "",
        password: "",
        passwordRepeat: "",
      },
    },
  );

  return (
    <>
      <Head>
        <title>Reset password</title>
      </Head>
      <Link href="/login" passHref>
        <a>&larr; Go to login page</a>
      </Link>
      <h1>Reset password</h1>
      {error && <FormError>{error}</FormError>}
      {hasSuccess && <p style={{ color: "green" }}>You can now log in with your new password.</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New password</label>
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
        <div>
          <label htmlFor="passwordRepeat">Repeat new password</label>
          <input
            type="password"
            id="passwordRepeat"
            name="passwordRepeat"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.passwordRepeat}
          />
          {touched.passwordRepeat && errors.passwordRepeat && (
            <FormError>{errors.passwordRepeat}</FormError>
          )}
        </div>
        {isLoading && <Spinner size={16} />}
        <button disabled={isLoading} type="submit">
          Save changes
        </button>
      </form>
    </>
  );
}
