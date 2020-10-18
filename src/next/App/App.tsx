import type { NextPageContext } from "next";
import NextApp, { AppContext, AppInitialProps, AppProps } from "next/app";
import Router from "next/router";

import SessionProvider from "@/containers/Session";
import api from "@/services/api";
import { getCurrentUser, getServerSideAuthCookie } from "@/services/auth";
import type { User } from "@/types/core";

import "@/services/mock-server";

type InitialProps = AppInitialProps & {
  appProps: {
    token: string | null;
    user: User | null;
  };
};

function redirectTo(ctx: NextPageContext, status: 301 | 302 | 404, location: string): void {
  if (ctx.res) {
    ctx.res.writeHead(status, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
}

function App({ Component, appProps, pageProps, ...props }: InitialProps & AppProps) {
  return (
    <SessionProvider token={appProps.token} user={appProps.user}>
      <Component {...props} {...pageProps} />
    </SessionProvider>
  );
}

App.getInitialProps = async (ctx: AppContext): Promise<InitialProps> => {
  const token: string | null = getServerSideAuthCookie(ctx.ctx);
  const { pathname } = ctx.ctx;

  // Returned after redirect.
  const fallbackProps: InitialProps = {
    appProps: {
      user: null,
      token: null,
    },
    pageProps: {},
  };

  // This single line is responsible for API request authentication.
  // IMPORTANT: Make sure it's before NextApp.getInitialProps call,
  // so auth token is already set in all Component.getInitialProps.
  // Also, we have to have header set for when calling 'getCurrentUser'.
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  let user: User | null = null;

  if (token) {
    try {
      ({ user } = await getCurrentUser());

      if (pathname === "/login") {
        redirectTo(ctx.ctx, 302, "/dashboard");
        return fallbackProps;
      }
    } catch {
      // We have nothing to do here.
    }
  }

  if (!token || !user) {
    delete api.defaults.headers.Authorization;

    if (pathname === "/dashboard") {
      redirectTo(ctx.ctx, 302, "/login");
      return fallbackProps;
    }
  }

  // Make sure we call "getInitialProps" after we check authorization status.
  // We can't fetch data before we know if user has permission to do so.
  // Also, it doesn't make sens to fetch data if we redirect to another page.
  const initialProps = await NextApp.getInitialProps(ctx);

  return {
    ...initialProps,
    appProps: {
      token,
      user,
    },
  };
};

export default App;
