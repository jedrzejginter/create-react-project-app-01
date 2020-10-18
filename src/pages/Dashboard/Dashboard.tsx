import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { useSession } from "@/containers/Session";
import { logOut, removeAuthToken } from "@/services/auth";

function Dashboard() {
  const { user } = useSession();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      removeAuthToken();
      await logOut();
      router.push("/login");
    } catch {
      // Ignore errors, because the only thing we actually care about here
      // is clearing the auth token cookie.
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h1>You're logged in!</h1>
      <div>({user?.email})</div>
      <button onClick={handleLogout} type="button">
        Log out
      </button>
    </>
  );
}

export default Dashboard;
