jest.mock("../../../../lib/dbConnect");

import dbConnect from "../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
} from "../../../../lib/testUtils";
import User, { UserDoc, UserJson } from "../../../../models/User";

import idHandler from "./[id]";

const ENDPOINT = "/api/v2/users/[id]";

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

  it("returns 200 and user", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = user._id.toString();

    await idHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(JSON.parse(JSON.stringify(user)));

    expect(res._getJSONData().password).toBeUndefined();
  });

  it("returns 404 if bad valid objectid", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = "123456789012"

    await idHandler(req, res);
    expect(res.statusCode).toBe(404);
  });
});

describe(`PUT ${ENDPOINT}`, () => {
  let putUser: UserDoc;
  let putToken: string;

  let putSuperUser: UserDoc;
  let putSuperToken: string;

  beforeAll(async () => {
    ({ user: putUser, token: putToken } = await getCreatedUserAndToken());
    ({ user: putSuperUser, token: putSuperToken } =
      await getCreatedUserAndToken(true));
  });

  const mockReqRes = getReqResMocker("PUT", ENDPOINT);

  it("returns 403 if not own user and not superuser", async () => {
    const { req, res } = mockReqRes(putToken);
    req.query.id = putSuperUser._id.toString();

    await idHandler(req, res);
    expect(res.statusCode).toBe(403);
  });

  it("returns 403 if change superuser without permission", async () => {
    const { req, res } = mockReqRes(putToken);
    req.query.id = putUser._id.toString();

    req.body = {
      superuser: true,
    };

    await idHandler(req, res);
    expect(res.statusCode).toBe(403);
  });

  // Not actually possible, see implementation
  // it("returns 404 if user does not exist", async () => {
  //   const { req, res } = mockReqRes(token);
  //   req.query.id = "somerandomid";

  //   await idHandler(req, res);
  //   expect(res.statusCode).toBe(404);
  // });

  it("returns 200 if own user", async () => {
    const { req, res } = mockReqRes(putToken);
    req.query.id = putUser._id.toString();

    const newName = "fred";
    const newEmail = "fred@fred.com";

    req.body = {
      name: newName,
      email: newEmail,
    };

    await idHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      name: newName,
      email: newEmail,
    });

    expect(res._getJSONData().password).toBeUndefined();
  });

  it("returns 200 if superuser", async () => {
    const { req, res } = mockReqRes(putSuperToken);
    req.query.id = putUser._id.toString();

    const newName = "bread";
    const newEmail = "bread@bread.com";
    const newSuperuser = true;

    req.body = {
      name: newName,
      email: newEmail,
      superuser: newSuperuser,
    };

    await idHandler(req, res);
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
  const mockReqRes = getReqResMocker("DELETE", ENDPOINT);

  it("returns 403 if not superuser", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = user._id.toString();

    await idHandler(req, res);
    expect(res.statusCode).toBe(403);
  });

  it("returns 404 if bad valid objectid", async () => {
    const { req, res } = mockReqRes(superToken);
    req.query.id = "123456789012"

    await idHandler(req, res);
    expect(res.statusCode).toBe(404);
  });
  
  it("returns 200 if superuser", async () => {
    const { req, res } = mockReqRes(superToken);
    req.query.id = user._id.toString();

    await idHandler(req, res);
    expect(res.statusCode).toBe(200);
  });
});
