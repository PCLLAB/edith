jest.mock("../../../../lib/server/dbConnect");
import { UserDoc } from "../../../../lib/common/types/models";
import dbConnect from "../../../../lib/server/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  ReqResMocker,
} from "../../../../lib/testUtils";
import User from "../../../../models/User";
import handler, { ENDPOINT } from "./auth";

const name = "Benjamin Dover";
const email = "benjamindover@hotmail.com";
const password = "benjamindoveriscool";

let user: UserDoc;
let token: string;

let superToken: string;

let connection: any;

let mockGetReqRes: ReqResMocker;
let mockGetReqResNoToken: ReqResMocker;

beforeAll(async () => {
  connection = await dbConnect();

  ({ user, token } = await getCreatedUserAndToken());
  ({ token: superToken } = await getCreatedUserAndToken(true));

  mockGetReqRes = getReqResMocker("GET", ENDPOINT, token);
  mockGetReqResNoToken = getReqResMocker("GET", ENDPOINT);

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

describe(`GET ${ENDPOINT}`, () => {
  it("returns 200 and user if token provided", async () => {
    const { req, res } = mockGetReqRes();

    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining(JSON.parse(JSON.stringify(user)))
    );
  });

  it("returns 401 if no valid token provided", async () => {
    const { req, res } = mockGetReqResNoToken();

    await handler(req, res);
    expect(res.statusCode).toBe(401);
  });
});

describe(`POST ${ENDPOINT}`, () => {
  // This is unauthenticated, doesn't require a token, so it can be put in decribe block
  const mockReqRes = getReqResMocker("POST", ENDPOINT);

  it("returns 400 if missing email and/or password", async () => {
    const { req, res } = mockReqRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);

    const { req: req1, res: res1 } = mockReqRes({
      body: {
        email,
      },
    });
    await handler(req1, res1);
    expect(res1.statusCode).toBe(400);

    const { req: req2, res: res2 } = mockReqRes({
      body: {
        password,
      },
    });
    await handler(req2, res2);
    expect(res2.statusCode).toBe(400);
  });

  it("returns 404 if user does not exist", async () => {
    const wrongEmail = "fakeuser@yahoo.com";
    const { req, res } = mockReqRes({
      body: {
        email: wrongEmail,
        password,
      },
    });

    await handler(req, res);
    expect(res.statusCode).toBe(404);
  });

  it("returns 401 if password does not match", async () => {
    const wrongPassword = "iamcool";

    expect(password).not.toEqual(wrongPassword);

    const { req, res } = mockReqRes({
      body: {
        email,
        password: wrongPassword,
      },
    });

    await handler(req, res);
    expect(res.statusCode).toBe(401);
  });

  it("returns 200 and token for valid email and password", async () => {
    const { req, res } = mockReqRes({
      body: {
        email,
        password,
      },
    });

    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        user: expect.any(Object),
      })
    );

    expect(res._getJSONData().user.password).toBeUndefined();
  });
});
