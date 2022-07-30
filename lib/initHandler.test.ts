jest.mock("./dbConnect");

import dbConnect from "./dbConnect";
import { getCreatedUserAndToken, getReqResMocker } from "./testUtils";
import initHandler from "./initHandler";
import { NextApiRequest, NextApiResponse } from "next";

const PRIVATE_ENDPOINT = "/api/v2";
const PUBLIC_ENDPOINT = "/api/v2/users/auth";

let token: string;

let connection: any;

beforeAll(async () => {
  connection = await dbConnect();
  ({ token } = await getCreatedUserAndToken());
});

afterAll(async () => {
  await connection.disconnect();
});

describe(`JWT TOKEN AUTH initHandler`, () => {
  const mockReqRes = getReqResMocker("GET", PRIVATE_ENDPOINT);

  const mockPublicReqRes = getReqResMocker("GET", PUBLIC_ENDPOINT);

  const handler = initHandler({
    GET: (req: NextApiRequest, res: NextApiResponse) => {
      res.end();
    },
  });

  it("returns 200 if lacking token on path without auth required", async () => {
    const { req, res } = mockPublicReqRes();

    await handler(req, res);
    expect(res.statusCode).toBe(200);
  });

  it("returns 200 if has token on path without auth required", async () => {
    const { req, res } = mockPublicReqRes({ token });

    await handler(req, res);
    expect(res.statusCode).toBe(200);
  });

  it("returns 401 if lacking token on authorized path", async () => {
    const { req, res } = mockReqRes();

    await handler(req, res);
    expect(res.statusCode).toBe(401);
  });

  it("returns 200 if token on authorized path", async () => {
    const { req, res } = mockReqRes({ token });

    await handler(req, res);
    expect(res.statusCode).toBe(200);
  });
});

describe(`MATCH ACTION initHandler`, () => {
  const mockReqRes = getReqResMocker("GET", PRIVATE_ENDPOINT);

  const matcher = {
    GET: (req: NextApiRequest, res: NextApiResponse) => {
      res.status(200).end();
    },
    PUT: (req: NextApiRequest, res: NextApiResponse) => {
      res.status(200).end();
    },
  };

  it("returns 405 for invalid methods", async () => {
    const { req, res } = mockReqRes({ token });
    const handler = initHandler({});

    req.method = "GET";
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    res.statusCode = 69;

    req.method = "PUT";
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    res.statusCode = 69;

    req.method = "POST";
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    res.statusCode = 69;

    req.method = "DELETE";
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    res.statusCode = 69;

    req.method = "randomsaea123";
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });

  it("returns 200 for valid methods", async () => {
    const { req, res } = mockReqRes({ token });
    const handler = initHandler(matcher);

    req.method = "GET";
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    res.statusCode = 69;

    req.method = "PUT";
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    res.statusCode = 69;

    req.method = "POST";
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    res.statusCode = 69;

    req.method = "DELETE";
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    res.statusCode = 69;

    req.method = "randomsaea123";
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });
});
