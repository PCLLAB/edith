jest.mock("../../../../lib/dbConnect");

import dbConnect from "../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker
} from "../../../../lib/testUtils";
import { UserDoc } from "../../../../models/User";
import indexHandler from "./index";

const ENDPOINT = "/api/v2/users";

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
  const mockReqRes = getReqResMocker("GET", ENDPOINT);

  it("returns 200 and two users", async () => {
    const { req, res } = mockReqRes(token);

    await indexHandler(req, res);
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
    const { req, res } = mockReqRes(token);

    await indexHandler(req, res);
    expect(res.statusCode).toBe(403);
  });

  it("returns 400 for if missing email or email or password", async () => {
    const { req, res } = mockReqRes(superToken);

    await indexHandler(req, res);
    expect(res.statusCode).toBe(400);

    req.body = {
      name: "bendover",
      email: "bendover@hotmail.com",
    };
    await indexHandler(req, res);
    expect(res.statusCode).toBe(400);

    req.body = {
      email: "bendover@hotmail.com",
      password: "bendoveriscool",
    };
    await indexHandler(req, res);
    expect(res.statusCode).toBe(400);

    req.body = {
      name: "bendover",
      password: "bendoveriscool",
    };
    await indexHandler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("returns 200 and created user", async () => {
    const { req, res } = mockReqRes(superToken);

    const email = "bendover@hotmail.com";
    const name = "bendover";

    req.body = {
      name,
      email,
      password: "bendoveriscool",
    };
    await indexHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({ name, email });
    expect(res._getJSONData().password).toBeUndefined();
  });
});
