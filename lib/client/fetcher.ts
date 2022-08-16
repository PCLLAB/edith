import { DistributiveOmit } from "../common/tsUtils";
import { ApiSignature } from "../common/types";

export type Fetcher<T extends ApiSignature> = (
  s: DistributiveOmit<T, "data">
) => Promise<T["data"]>;

export const fetcher = async <T extends ApiSignature>(
  signature: DistributiveOmit<T, "data">
) => {
  let finalUrl: string = signature.url;
  let firstQuery = true;

  if ("query" in signature) {
    Object.entries(signature.query).forEach(([param, value]) => {
      const token = `[${param}]`;
      if (finalUrl.includes(token)) {
        finalUrl = finalUrl.replaceAll(token, value.toString());
      } else {
        const joiner = firstQuery ? "?" : "&";
        const expression = value ? `=${value}` : "";

        finalUrl = `${finalUrl}${joiner}${param}${expression}`;
        firstQuery = false;
      }
    });
  }

  let headers;
  let body;
  if ("body" in signature) {
    headers = {
      "Content-Type": "application/json",
    };
    body = JSON.stringify(body);
  }

  const res = await fetch(finalUrl, {
    method: signature.method,
    headers,
    body,
  });

  // if (!res.ok) return null;

  return res.json() as Promise<T["data"]>;
};
