jest.mock("../../../../lib/server/dbConnect");

import { UserDoc } from "../../../../lib/common/types/models";
import dbConnect from "../../../../lib/server/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
} from "../../../../lib/testUtils";
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

  it("returns 400 if missing email or superuser", async () => {
    const email = "bendover@hotmail.com";
    const { req, res } = mockReqRes({ token: superToken });

    req.body = {
      email,
    };
    await handler(req, res);
    expect(res.statusCode).toBe(400);

    req.body = {
      superuser: true,
    };
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("returns 200 and created user", async () => {
    const email = "bendover@hotmail.com";

    const { req, res } = mockReqRes({
      body: {
        email,
        superuser: true,
      },
      token: superToken,
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({ email });
    expect(res._getJSONData().password).toBeUndefined();
  });
});
