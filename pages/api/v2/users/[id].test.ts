jest.mock("../../../../lib/server/dbConnect");

import { UserDoc } from "../../../../lib/common/types/models";
import dbConnect from "../../../../lib/server/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  ReqResMocker,
} from "../../../../lib/testUtils";

import handler, { ENDPOINT } from "./[id]";

let user: UserDoc;
let token: string;

let superToken: string;

let connection: any;

let mockGetReqRes: ReqResMocker;
let mockDelReqRes: ReqResMocker;

beforeAll(async () => {
  connection = await dbConnect();
  ({ user, token } = await getCreatedUserAndToken());
  ({ token: superToken } = await getCreatedUserAndToken(true));

  mockGetReqRes = getReqResMocker("GET", ENDPOINT, token);
  mockDelReqRes = getReqResMocker("DELETE", ENDPOINT);
});

afterAll(async () => {
  await connection.disconnect();
});

describe(`GET ${ENDPOINT}`, () => {
  it("returns 200 and user", async () => {
    const { req, res } = mockGetReqRes({
      query: {
        id: user._id.toString(),
      },
    });

    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(JSON.parse(JSON.stringify(user)));

    expect(res._getJSONData().password).toBeUndefined();
  });

  it("returns 404 if bad valid objectid", async () => {
    const { req, res } = mockGetReqRes({
      query: {
        id: "123456789012",
      },
    });

    await handler(req, res);
    expect(res.statusCode).toBe(404);
  });
});

describe(`PUT ${ENDPOINT}`, () => {
  let putUser: UserDoc;
  let putToken: string;

  let putSuperUser: UserDoc;
  let putSuperToken: string;

  const mockReqRes = getReqResMocker("PUT", ENDPOINT);

  beforeAll(async () => {
    ({ user: putUser, token: putToken } = await getCreatedUserAndToken());
    ({ user: putSuperUser, token: putSuperToken } =
      await getCreatedUserAndToken(true));
  });

  it("returns 403 if not own user and not superuser", async () => {
    const { req, res } = mockReqRes({
      query: { id: putSuperUser._id.toString() },
      token: putToken,
    });

    await handler(req, res);
    expect(res.statusCode).toBe(403);
  });

  it("returns 403 if change superuser without permission", async () => {
    const { req, res } = mockReqRes({
      query: { id: putUser._id.toString() },
      body: {
        superuser: true,
      },
      token: putToken,
    });

    await handler(req, res);
    expect(res.statusCode).toBe(403);
  });

  // Not actually possible, see implementation
  // jwt auth protects paths
  // it("returns 404 if user does not exist", async () => {
  //   const { req, res } = mockReqRes(token);
  //   req.query.id = "somerandomid";

  //   await idHandler(req, res);
  //   expect(res.statusCode).toBe(404);
  // });

  it("returns 200 if own user", async () => {
    const newName = "fred";
    const newEmail = "fred@fred.com";

    const { req, res } = mockReqRes({
      query: {
        id: putUser._id.toString(),
      },
      body: {
        name: newName,
        email: newEmail,
      },
      token: putToken,
    });

    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      name: newName,
      email: newEmail,
    });

    expect(res._getJSONData().password).toBeUndefined();
  });

  it("returns 200 if superuser", async () => {
    const newName = "bread";
    const newEmail = "bread@bread.com";
    const newSuperuser = true;

    const { req, res } = mockReqRes({
      query: {
        id: putUser._id.toString(),
      },
      body: {
        name: newName,
        email: newEmail,
        superuser: newSuperuser,
      },
      token: putSuperToken,
    });

    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      name: newName,
      email: newEmail,
      superuser: newSuperuser,
    });
    expect(res._getJSONData().password).toBeUndefined();
  });
});

describe(`DELETE ${ENDPOINT}`, () => {
  it("returns 403 if not superuser", async () => {
    const { req, res } = mockDelReqRes({
      query: {
        id: user._id.toString(),
      },
      token,
    });

    await handler(req, res);
    expect(res.statusCode).toBe(403);
  });

  it("returns 404 if bad valid objectid", async () => {
    const { req, res } = mockDelReqRes({
      query: {
        id: "123456789012",
      },
      token: superToken,
    });
    await handler(req, res);
    expect(res.statusCode).toBe(404);
  });

  it("returns 200 if superuser", async () => {
    const { req, res } = mockDelReqRes({
      query: {
        id: user._id.toString(),
      },
      token: superToken,
    });

    await handler(req, res);
    expect(res.statusCode).toBe(200);
  });
});
