import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

import { UserJson } from "../../common/types/models";
import { useBoundStore } from "../hooks/stores/useBoundStore";

interface AuthInfo {
  me: UserJson | null;
}

export const AuthContext = createContext<AuthInfo>({
  me: null,
});

type Props = {
  children: ReactNode;
};

const NO_AUTH_ROUTES = ["/login", "/setup"];

export const AuthContextProvider = ({ children }: Props) => {
  const [id, setId] = useState<string | null>(null);

  // Storing id and then getting user from store causes an extra rerender
  // however, this keeps the value of me up to date if changes are made
  const me = useBoundStore((state) => (id ? state.userMap[id] : null));

  const getMe = useBoundStore((state) => state.getMe);

  const router = useRouter();

  const noAuth = NO_AUTH_ROUTES.includes(router.pathname);

  useEffect(() => {
    if (noAuth) return;
    console.log("useEffect");
    getMe()
      .then((me) => setId(me._id))
      .catch((e) => {
        if (e.status === 401) router.push("/login");
      });
  }, [noAuth]);

  return (
    <AuthContext.Provider value={{ me }}>
      {(me || noAuth) && children}
    </AuthContext.Provider>
  );
};
