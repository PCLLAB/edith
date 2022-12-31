import { DistributiveOmit } from "../common/tsUtils";
import { ApiSignature } from "../common/types/api";

export type Fetcher<T extends ApiSignature> = (
  s: DistributiveOmit<T, "data">
) => Promise<T["data"]>;

type DupeRequestHandler = {
  resolve: (T: any) => void;
  reject: (T: any) => void;
};

const inFlightRequests = new Map<string, DupeRequestHandler[]>();

/**
 * This takes an object defining the desired request and builds the actual URL,
 * query parameters, and request body if specified
 *
 * @param signature ApiSignature used as a unique key by useSWR
 * @returns Result of fetch()
 */
export const fetcher = async <T extends ApiSignature>(
  signature: DistributiveOmit<T, "data">
) => {
  const requestKey = JSON.stringify(signature);

  const isDupe = inFlightRequests.has(requestKey);

  if (!isDupe) {
    inFlightRequests.set(requestKey, []);
  }

  const duplicates = inFlightRequests.get(requestKey);

  if (isDupe) {
    return new Promise<T["data"]>((resolve, reject) => {
      duplicates!.push({ resolve, reject });
    });
  }

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
    body = JSON.stringify(signature.body);
  }

  const res = await fetch(finalUrl, {
    method: signature.method,
    headers,
    body,
  });

  inFlightRequests.delete(requestKey);

  if (!res.ok) {
    const rejection = {
      method: signature.method,
      url: finalUrl,
      status: res.status,
    };
    duplicates!.forEach((handler) => {
      handler.reject(rejection);
    });

    return Promise.reject(rejection);
  }

  const data = (await res.json()) as T["data"];
  duplicates!.forEach((handler) => {
    handler.resolve(data);
  });

  return data;
};
