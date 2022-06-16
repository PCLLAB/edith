jest.mock("../../../../../lib/dbConnect");

import { getNamedPath, getPath } from "../../../../../lib/apiUtils";
import dbConnect from "../../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  getValidObjectId,
} from "../../../../../lib/testUtils";
import Directory, { ROOT_DIRECTORY } from "../../../../../models/Directory";
import { UserDoc } from "../../../../../models/User";
import handler from "./index";

const ENDPOINT = "/api/v2/directories/[id]";

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

  it("returns 200 and directory", async () => {
    const { req, res } = mockReqRes(token);

    const dir = new Directory({
      name: "exp1",
      ownerIds: [user._id.toString()],
    });
    await dir.save();

    req.query.id = dir.id;
    await handler(req, res);

    expect(res.statusCode).toBe(200);
  });

  it("returns 404 if bad valid objectid", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = getValidObjectId();

    await handler(req, res);
    expect(res.statusCode).toBe(404);
  });
});

describe(`PUT ${ENDPOINT}`, () => {
  const mockReqRes = getReqResMocker("PUT", ENDPOINT);

  it("returns 404 if bad valid objectid", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = getValidObjectId();

    await handler(req, res);
    expect(res.statusCode).toBe(404);
  });

  it("returns 200 and updates ownerIds", async () => {
    const { req, res } = mockReqRes(token);

    const dir = new Directory({
      name: "exp1",
      ownerIds: [user._id.toString()],
    });
    await dir.save();

    req.query.id = dir.id;
    const newOwners = [getValidObjectId()];
    req.body = {
      ownerIds: newOwners,
    };
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({ ownerIds: newOwners });
  });

  it("returns 200 and updates name", async () => {
    const { req, res } = mockReqRes(token);

    const dir = new Directory({
      name: "exp1",
      ownerIds: [user._id.toString()],
    });
    await dir.save();

    req.query.id = dir.id;
    const newName = "better name";
    req.body = {
      name: newName,
    };
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({ name: newName });
  });

  it("returns 200 and updates prefixPath and namedPrefixPath", async () => {
    const { req, res } = mockReqRes(token);

    const dir1 = new Directory({
      name: "exp1",
      ownerIds: [user._id.toString()],
    });
    await dir1.save();

    const dir2 = new Directory({
      name: "exp1",
      ownerIds: [user._id.toString()],
      prefixPath: getPath(dir1),
    });
    await dir2.save();

    // TODO expose util endpoints to add instead of manually creating
    expect(dir2.prefixPath).toEqual(getPath(dir1));
    expect(dir2.namedPrefixPath).toEqual(getNamedPath(dir1));

    req.query.id = dir1.id;
    const newPrefixPath = getPath(ROOT_DIRECTORY);

    req.body = {
      prefixPath: newPrefixPath,
    };

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      prefixPath: newPrefixPath,
      namedPrefixPath: `${getNamedPath(ROOT_DIRECTORY)},${dir2.name}`,
    });
  });

  //TODO multilevel prefixPath renaming
});
