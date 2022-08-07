import { UsersAuthPostSignature } from "../../pages/api/v2/users/auth";
import { ApiSignature, SignatureTree, Tree, tree2, Users } from "../common/api";

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

// export const fetcher = (
//   signature: DistributiveOmit<UsersAuthPostSignature, "data">
// ) => {
export const fetcher = async (
  // signature: DistributiveOmit<Users | UsersAuthPostSignature, "data">
  signature: Users | UsersAuthPostSignature
) => {
  // TODO replace [] with query field
  // Add remaining queries as actual query props
  if ("query" in signature) {
  }
  // header type if necessary
  const res = await fetch(signature);
  const t = `${signature.url} + ${signature.method}`;
  return res.json() as Promise<SignatureTree[typeof t]>;
};
