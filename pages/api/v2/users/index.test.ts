jest.mock("../../../../lib/dbConnect");

import dbConnect from "../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
} from "../../../../lib/testUtils";
import { UserDoc } from "../../../../models/User";
import handler, { ENDPOINT } from "./index";

let user: UserDoc;
let token: string;

let superUser: UserDoc;
let superToken: string;

let connection: any;

beforeAll(async () => {
  connection = await dbConnect();
  ({ user, token } = await getCreatedUserAndToken());
  ({ user: superUser, token: superToken } = await getCreatedUserAndToken(true));
});

afterAll(async () => {
  await connection.disconnect();
});

describe(`GET ${ENDPOINT}`, () => {
  it("returns 200 and two users", async () => {
    const mockReqRes = getReqResMocker("GET", ENDPOINT, token);
    const { req, res } = mockReqRes();

    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual([
      JSON.parse(JSON.stringify(user)),
      JSON.parse(JSON.stringify(superUser)),
    ]);
  });
});

describe(`POST ${ENDPOINT}`, () => {
  const mockReqRes = getReqResMocker("POST", ENDPOINT);

  it("returns 403 for non superuser", async () => {
    const { req, res } = mockReqRes({ token });

    await handler(req, res);
    expect(res.statusCode).toBe(403);
  });

  it("returns 400 for if missing email or email or password", async () => {
    const { req, res } = mockReqRes({ token: superToken });

    await handler(req, res);
    expect(res.statusCode).toBe(400);

    req.body = {
      name: "bendover",
      email: "bendover@hotmail.com",
    };
    await handler(req, res);
    expect(res.statusCode).toBe(400);

    req.body = {
      email: "bendover@hotmail.com",
      password: "bendoveriscool",
    };
    await handler(req, res);
    expect(res.statusCode).toBe(400);

    req.body = {
      name: "bendover",
      password: "bendoveriscool",
    };
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("returns 200 and created user", async () => {
    const email = "bendover@hotmail.com";
    const name = "bendover";

    const { req, res } = mockReqRes({
      body: {
        name,
        email,
        password: "bendoveriscool",
      },
      token: superToken,
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({ name, email });
    expect(res._getJSONData().password).toBeUndefined();
  });
});
