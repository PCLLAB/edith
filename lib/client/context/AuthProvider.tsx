import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

import { UsersAuthGetSignature } from "../../../pages/api/v2/users/auth";
import { UserJson } from "../../common/types/models";
import { fetcher } from "../fetcher";

interface AuthInfo {
  user: UserJson | null;
}

export const AuthContext = createContext<AuthInfo>({
  user: null,
});

type Props = {
  children: ReactNode;
};

const NO_AUTH_ROUTES = ["/login", "/setup"];

export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthInfo["user"]>(null);

  const router = useRouter();

  const noAuth = NO_AUTH_ROUTES.includes(router.pathname);

  useEffect(() => {
    if (noAuth) return;

    fetcher<UsersAuthGetSignature>({
      url: "/api/v2/users/auth",
      method: "GET",
    })
      .then((user) => {
        setUser(user);
      })
      .catch((e) => {
        if (e.status === 401) router.push("/login");
      });
  }, [noAuth]);

  return (
    <AuthContext.Provider value={{ user }}>
      {(user || noAuth) && children}
    </AuthContext.Provider>
  );
};
