import emailValidator from "email-validator";
import { FormikErrors, FormikHelpers, useFormik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import FormError from "@/components/FormError";
import Spinner from "@/components/Spinner";
import { getErrorMessage } from "@/services/api";
import { createAccount } from "@/services/auth";

import type { FormValues } from "./types";

function validate(values: FormValues): FormikErrors<FormValues> {
  const errors: FormikErrors<FormValues> = {};

  if (!emailValidator.validate(values.email)) {
    errors.email = "Invalid e-mail address.";
  }

  if (values.password.trim().length < 6) {
    errors.password = "Password is too short.";
  }

  if (values.passwordRepeat.trim().length < 6) {
    errors.passwordRepeat = "Password is too short.";
  } else if (values.password !== values.passwordRepeat) {
    errors.passwordRepeat = "Passwords don't match.";
  }

  if (values.termsAndConditions !== true) {
    errors.termsAndConditions = "You have to accept our Terms and Conditions.";
  }

  return errors;
}

export default function CreateAccount() {
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
        await createAccount({
          email: values.email,
          password: values.password,
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
        email: process.env.DEFAULT_USER_EMAIL ?? "",
        password: process.env.DEFAULT_USER_PASSWORD ?? "",
        passwordRepeat: "",
        termsAndConditions: false,
      },
    },
  );

  return (
    <>
      <Head>
        <title>Register an account</title>
      </Head>
      <Link href="/" passHref>
        <a>&larr; Back to home page</a>
      </Link>
      <h1>Register</h1>
      {error && <FormError>{error}</FormError>}
      {hasSuccess && (
        <p style={{ color: "green" }}>
          Your account has been created. Check your e-mail for required account activation steps.
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
        <div>
          <label htmlFor="passwordRepeat">Repeat password</label>
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
        <div>
          <label htmlFor="termsAndConditions">
            <input
              type="checkbox"
              id="termsAndConditions"
              name="termsAndConditions"
              onBlur={handleBlur}
              onChange={handleChange}
            />
            I accept Terms and Conditions
          </label>
          {touched.termsAndConditions && errors.termsAndConditions && (
            <FormError>{errors.termsAndConditions}</FormError>
          )}
        </div>
        {isLoading && <Spinner size={16} />}
        <button disabled={isLoading} type="submit">
          Send
        </button>
      </form>
    </>
  );
}
