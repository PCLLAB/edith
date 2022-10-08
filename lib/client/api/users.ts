import { UsersGetSignature } from "../../../../pages/api/v2/users";
import { UsersIdGetSignature } from "../../../../pages/api/v2/users/[id]";
import { fetcher } from "../../fetcher";

export const getUsers = () =>
  fetcher<UsersGetSignature>({
    url: "/api/v2/users" as const,
    method: "GET" as const,
  });

export const useUserById = (id: string) =>
  fetcher<UsersIdGetSignature>({
    url: "/api/v2/users/[id]" as const,
    method: "GET" as const,
    query: { id },
  });
