import type { NextPageContext, NextApiRequest } from "next";
import { destroyCookie, setCookie, parseCookies } from "nookies";

import { AUTH_TOKEN_COOKIE } from "./const";

export function saveAuthToken(token: string): void {
  setCookie({}, AUTH_TOKEN_COOKIE, token, {
    maxAge: 24 * 60 * 60,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function removeAuthToken(): void {
  destroyCookie({}, AUTH_TOKEN_COOKIE, {
    path: "/",
  });
}

export function getServerSideAuthCookie(ctx: {
  req?: NextPageContext["req"] | NextApiRequest;
}): string | null {
  const cookies = parseCookies(ctx);
  return cookies[AUTH_TOKEN_COOKIE] ?? null;
}
