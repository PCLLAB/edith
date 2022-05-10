jest.mock("../../../../lib/dbConnect");
import dbConnect from "../../../../lib/dbConnect";
import { getReqResMocker } from "../../../../lib/testUtils";
import User from "../../../../models/User";
import authHandler from "./auth";

const ENDPOINT = "/api/v2/users/auth";

describe(`POST ${ENDPOINT}`, () => {
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

  const mockReqRes = getReqResMocker("POST", ENDPOINT);

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

  it("returns 404 if user does not exist", async () => {
    const { req, res } = mockReqRes();

    const wrongEmail = "fakeuser@yahoo.com";

    req.body = {
      email: wrongEmail,
      password,
    };
    await authHandler(req, res);
    expect(res.statusCode).toBe(404);
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

    expect(res._getJSONData().user.password).toBeUndefined();
  });
});
