jest.mock("../../../../lib/dbConnect");

import dbConnect from "../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
} from "../../../../lib/testUtils";
import Directory from "../../../../models/Directory";
import { UserDoc } from "../../../../models/User";
import handler from "./index";

const ENDPOINT = "/api/v2/directories";

let user: UserDoc;
let token: string;

let connection: any;

beforeAll(async () => {
  connection = await dbConnect();
  ({ user, token } = await getCreatedUserAndToken());
});

afterAll(async () => {
  await connection.disconnect();
});

describe(`GET ${ENDPOINT}`, () => {
  const mockReqRes = getReqResMocker("GET", ENDPOINT);

  it("returns 200 and empty list", async () => {
    const { req, res } = mockReqRes(token);

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual([]);
  });

  it("returns 200 and all directories", async () => {
    const { req, res } = mockReqRes(token);

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
  const mockReqRes = getReqResMocker("POST", ENDPOINT);

  const name = "created dir";

  it("returns 400 if missing name", async () => {
    const { req, res } = mockReqRes(token);

    req.body = {};

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 200 if name provided", async () => {
    const { req, res } = mockReqRes(token);

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

  it("accepts parent", async () => {
    const { req, res } = mockReqRes(token);

    const dir1 = {
      name: "exp1",
      ownerIds: [user._id.toString()],
    };

    const parent = new Directory(dir1);
    await parent.save();

    req.body = {
      name,
      parent: parent._id.toString(),
    };

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
