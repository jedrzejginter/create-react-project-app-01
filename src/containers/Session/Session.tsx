import { createContext, useState, useContext, PropsWithChildren, useCallback } from "react";

import type { User } from "@/types/core";
import { noop } from "@/utils/misc";

type Value = {
  user: User | null;
  token: string | null;
  createSession: (token: string, user: User) => void;
  destroySession: () => void;
  updateUser: (user: User) => void;
};

const Context = createContext<Value>({
  user: null,
  token: null,
  createSession: noop,
  destroySession: noop,
  updateUser: noop,
});

function SessionProvider(
  props: PropsWithChildren<{
    token: string | null;
    user: User | null;
  }>,
) {
  const [user, setUser] = useState<User | null>(props.user);
  const [token, setToken] = useState<string | null>(props.token);

  const handleCreateSession = useCallback((newToken: string, newUser: User) => {
    setUser(newUser);
    setToken(newToken);
  }, []);

  const handleDestroySession = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const handleUserUpdate = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);

  return (
    <Context.Provider
      {...props}
      value={{
        user,
        token,
        createSession: handleCreateSession,
        destroySession: handleDestroySession,
        updateUser: handleUserUpdate,
      }}
    />
  );
}

export function useSession() {
  return useContext<Value>(Context);
}

export default SessionProvider;
