import {
  PostReqBody as LoginReqBody,
  PostResBody as LoginResData,
} from "../../pages/api/v2/users/auth";
import { API_BASE } from "../common";

export const login = async (
  data: LoginReqBody
): Promise<LoginResData | null> => {
  const url = `${API_BASE}/users/auth`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) return null;

  return res.json();
};
