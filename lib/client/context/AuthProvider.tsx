import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

import { UsersAuthGetSignature } from "../../../pages/api/v2/users/auth";
import { fetcher } from "../fetcher";

interface AuthInfo {
  userId: string | null;
}

export const AuthContext = createContext<AuthInfo>({
  userId: null,
});

type Props = {
  children: ReactNode;
};
export const AuthContextProvider = ({ children }: Props) => {
  const [userId, setUserId] = useState<AuthInfo["userId"]>(null);

  const router = useRouter();

  useEffect(() => {
    fetcher<UsersAuthGetSignature>({
      url: "/api/v2/users/auth",
      method: "GET",
    })
      .then((user) => setUserId(user._id))
      .catch((e) => {
        if (e.status === 401) router.push("/login");
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userId,
      }}
    >
      {userId && children}
    </AuthContext.Provider>
  );
};
