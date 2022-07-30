jest.mock("../../../../../lib/dbConnect");
jest.unmock("../../../../../lib/throwIfNull");
import { throwIfNull } from "../../../../../lib/throwIfNull";
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
import directoryHandler from "../index";
import experimentHandler from "../../experiments/index";
import Experiment from "../../../../../models/Experiment";

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

  it("moves nested directories and experiments", async () => {
    const mockPostReqRes = getReqResMocker("POST", "/api/v2/directories");
    const { req: postReq1, res: postRes1 } = mockPostReqRes(token);

    postReq1.body = {
      name: "grandparent directory",
    };
    await directoryHandler(postReq1, postRes1);
    const grandparent = postRes1._getJSONData();
    const uncle = new Experiment({
      name: "uncle experiment",
      user: user._id.toString(),
      prefixPath: getPath(grandparent),
      dataCollection: "a",
    });
    await uncle.save();

    const { req: postReq2, res: postRes2 } = mockPostReqRes(token);
    postReq2.body = {
      name: "parent directory",
      parent: grandparent._id,
    };
    await directoryHandler(postReq2, postRes2);
    const parent = postRes2._getJSONData();
    const sibling = new Experiment({
      name: "sibling experiment",
      user: user._id.toString(),
      prefixPath: getPath(parent),
      dataCollection: "a",
    });
    await sibling.save();

    const { req: postReq3, res: postRes3 } = mockPostReqRes(token);
    postReq3.body = {
      name: "main directory",
      parent: parent._id,
    };
    await directoryHandler(postReq3, postRes3);
    const main = postRes3._getJSONData();
    const otherchild = new Experiment({
      name: "other child experiment",
      user: user._id.toString(),
      prefixPath: getPath(main),
      dataCollection: "a",
    });
    await otherchild.save();

    const { req: postReq4, res: postRes4 } = mockPostReqRes(token);
    postReq4.body = {
      name: "child directory",
      parent: main._id,
    };
    await directoryHandler(postReq4, postRes4);
    const child = postRes4._getJSONData();
    const grandchild = new Experiment({
      name: "grandchild experiment",
      user: user._id.toString(),
      prefixPath: getPath(child),
      dataCollection: "a",
    });
    await grandchild.save();

    // Actual tested request
    const { req, res } = mockReqRes(token);
    req.query.id = parent._id;
    req.body = {
      name: "updated parent directory",
      prefixPath: getPath(ROOT_DIRECTORY),
    };
    await handler(req, res);

    const mockGetDirReqRes = getReqResMocker("GET", "/api/v2/directories");
    const { req: getDirReq, res: getDirRes } = mockGetDirReqRes(token);

    await directoryHandler(getDirReq, getDirRes);

    const allDirs = getDirRes._getJSONData();

    expect(allDirs).toEqual(
      expect.arrayContaining([
        expect.objectContaining(grandparent),
        expect.objectContaining({
          ...parent,
          updatedAt: expect.not.stringMatching(parent.updatedAt),
          prefixPath: getPath(ROOT_DIRECTORY),
          namedPrefixPath: `${getNamedPath(ROOT_DIRECTORY)}`,
          name: "updated parent directory",
        }),
        expect.objectContaining({
          ...main,
          updatedAt: expect.not.stringMatching(main.updatedAt),
          prefixPath: `${getPath(ROOT_DIRECTORY)},${parent._id}`,
          namedPrefixPath: `${getNamedPath(
            ROOT_DIRECTORY
          )},updated parent directory`,
        }),
        expect.objectContaining({
          ...child,
          updatedAt: expect.not.stringMatching(child.updatedAt),
          prefixPath: `${getPath(ROOT_DIRECTORY)},${parent._id},${main._id}`,
          namedPrefixPath: `${getNamedPath(
            ROOT_DIRECTORY
          )},updated parent directory,${main.name}`,
        }),
      ])
    );

    const mockGetExpReqRes = getReqResMocker("GET", "/api/v2/experiments");
    const { req: getExpReq, res: getExpRes } = mockGetExpReqRes(token);

    await experimentHandler(getExpReq, getExpRes);

    const allExps = getExpRes._getJSONData();

    expect(allExps).toEqual(
      expect.arrayContaining([
        expect.objectContaining(uncle),
        expect.objectContaining(sibling),
        expect.objectContaining({
          ...otherchild,
          updatedAt: expect.not.stringMatching(otherchild.updatedAt),
          prefixPath: `${getPath(ROOT_DIRECTORY)},${parent._id},${main._id}`,
        }),
        expect.objectContaining({
          ...grandchild,
          updatedAt: expect.not.stringMatching(grandchild.updatedAt),
          prefixPath: `${getPath(ROOT_DIRECTORY)},${parent._id},${main._id}${
            child._id
          }`,
        }),
      ])
    );
  });
});
