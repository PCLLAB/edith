jest.mock("../../../../lib/dbConnect");

import dbConnect from "../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  ReqResMocker,
} from "../../../../lib/testUtils";
import Directory from "../../../../models/Directory";
import { UserDoc } from "../../../../models/User";
import handler from "./index";

const ENDPOINT = "/api/v2/directories";

let user: UserDoc;
let token: string;

let connection: any;

let mockGetReqRes: ReqResMocker;
let mockPostReqRes: ReqResMocker;

beforeAll(async () => {
  connection = await dbConnect();
  ({ user, token } = await getCreatedUserAndToken());
  mockGetReqRes = getReqResMocker("GET", ENDPOINT, token);
  mockPostReqRes = getReqResMocker("POST", ENDPOINT, token);
});

afterAll(async () => {
  await connection.disconnect();
});

describe(`GET ${ENDPOINT}`, () => {
  it("returns 200 and empty list", async () => {
    const { req, res } = mockGetReqRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual([]);
  });

  it("returns 200 and all directories", async () => {
    const { req, res } = mockGetReqRes();

    const dir1 = {
      name: "exp1",
      ownerIds: [user._id.toString()],
    };
    const dir2 = {
      name: "exp2",
      ownerIds: [user._id.toString()],
    };

    await Directory.create([dir1, dir2]);

    await handler(req, res);

    expect(res.statusCode).toBe(200);

    expect(res._getJSONData().length).toEqual(2);
    expect(res._getJSONData()).toEqual(
      expect.arrayContaining([
        expect.objectContaining(dir1),
        expect.objectContaining(dir2),
      ])
    );
  });
});

describe(`POST ${ENDPOINT}`, () => {
  const name = "created dir";

  it("returns 400 if missing name", async () => {
    const { req, res } = mockPostReqRes();

    req.body = {};

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 200 if name provided", async () => {
    const { req, res } = mockPostReqRes();

    req.body = {
      name,
    };

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        name,
        prefixPath: "r",
        namedPrefixPath: "Root",
        ownerIds: expect.arrayContaining([user._id.toString()]),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it("accepts prefixPath", async () => {
    const dir1 = {
      name: "exp1",
      ownerIds: [user._id.toString()],
    };

    const parent = new Directory(dir1);
    await parent.save();

    const { req, res } = mockPostReqRes({
      body: {
        name,
        prefixPath: `r,${parent._id.toString()}`,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        name,
        prefixPath: `r,${parent._id.toString()}`,
        namedPrefixPath: `Root,${parent.name}`,
        ownerIds: expect.arrayContaining([user._id.toString()]),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });
});
