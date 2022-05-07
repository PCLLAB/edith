jest.mock("../../../../lib/dbConnect");

import { NextApiRequest, NextApiResponse } from "next";
import {
  createRequest,
  createResponse,
  RequestMethod,
} from "node-mocks-http";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

import authHandler from "./auth";

describe("/api/v2/users/auth ENDPOINT", () => {
  const name = "Benjamin Dover";
  const email = "benjamindover@hotmail.com";
  const password = "benjamindoveriscool";

  let connection: any;
  beforeAll(async () => {
    connection = await dbConnect();

    const testUser = new User({
      name,
      email,
      password,
    });

    await testUser.save();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  const mockReqRes = (method: RequestMethod = "POST") => {
    const req = createRequest<NextApiRequest>({
      method,
      url: "/api/v2/users/auth",
    });
    const res = createResponse<NextApiResponse>();
    return { req, res };
  };

  it("returns 405 for invalid methods", async () => {
    const { req, res } = mockReqRes();

    req.method = "GET";
    await authHandler(req, res);
    expect(res.statusCode).toBe(405);
    res.statusCode = 69;

    req.method = "PUT";
    await authHandler(req, res);
    expect(res.statusCode).toBe(405);
    res.statusCode = 69;

    req.method = "DELETE";
    await authHandler(req, res);
    expect(res.statusCode).toBe(405);
    res.statusCode = 69;

    req.method = "randomsaea123";
    await authHandler(req, res);
    expect(res.statusCode).toBe(405);
  });

  it("returns 400 if missing email and/or password", async () => {
    const { req, res } = mockReqRes();

    await authHandler(req, res);
    expect(res.statusCode).toBe(400);

    req.body = {
      email,
    };
    await authHandler(req, res);
    expect(res.statusCode).toBe(400);

    req.body = {
      password,
    };
    await authHandler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("returns 400 if user does not exist", async () => {
    const { req, res } = mockReqRes();

    const wrongEmail = "fakeuser@yahoo.com";

    req.body = {
      email: wrongEmail,
      password,
    };
    await authHandler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("returns 400 if password does not match", async () => {
    const { req, res } = mockReqRes();

    const wrongPassword = "iamcool";

    expect(password).not.toEqual(wrongPassword);

    req.body = {
      email,
      password: wrongPassword,
    };
    await authHandler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("returns 200 and token for valid email and password", async () => {
    const { req, res } = mockReqRes();

    req.body = {
      email,
      password,
    };
    await authHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        token: expect.any(String),
        user: expect.any(Object),
      })
    );
  });
});
