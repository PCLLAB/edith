jest.mock("../../../../../lib/server/dbConnect");

import { getPath } from "../../../../../lib/common/models/utils";
import dbConnect from "../../../../../lib/server/dbConnect";
import {
  ApiCallMocker,
  getApiCallMocker,
  getCreatedUserAndToken,
  getReqResMocker,
  getValidObjectId,
  ReqResMocker,
} from "../../../../../lib/testUtils";
import expHandler, { ENDPOINT as EXP_ENDPOINT } from "../../experiments/index";
import dirHandler, { ENDPOINT as DIR_ENDPOINT } from "../index";
import handler, { ENDPOINT } from "./index";

let token: string;

let connection: any;

let mockGetReqRes: ReqResMocker;
let mockPutReqRes: ReqResMocker;
let mockPostDirectory: ApiCallMocker;
beforeAll(async () => {
  connection = await dbConnect();
  ({ token } = await getCreatedUserAndToken());
  mockGetReqRes = getReqResMocker("GET", ENDPOINT, token);
  mockPutReqRes = getReqResMocker("PUT", ENDPOINT, token);
  mockPostDirectory = getApiCallMocker("POST", DIR_ENDPOINT, dirHandler, token);
});

afterAll(async () => {
  await connection.disconnect();
});

describe(`GET ${ENDPOINT}`, () => {
  it("returns 200 and directory", async () => {
    const dir = await mockPostDirectory({
      body: {
        name: "dir1",
        prefixPath: "",
      },
    });

    const { req, res } = mockGetReqRes({
      query: {
        id: dir._id,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
  });

  it("returns 404 if bad valid objectid", async () => {
    const { req, res } = mockGetReqRes({
      query: {
        id: getValidObjectId(),
      },
    });

    await handler(req, res);
    expect(res.statusCode).toBe(404);
  });
});

describe(`PUT ${ENDPOINT}`, () => {
  it("returns 404 if bad valid objectid", async () => {
    const { req, res } = mockPutReqRes({
      query: {
        id: getValidObjectId(),
      },
    });

    await handler(req, res);
    expect(res.statusCode).toBe(404);
  });

  it("returns 200 and updates ownerIds", async () => {
    const dir = await mockPostDirectory({
      body: {
        name: "dir1",
        prefixPath: "",
      },
    });

    const newOwners = [getValidObjectId()];
    const { req, res } = mockPutReqRes({
      query: {
        id: dir._id,
      },
      body: {
        ownerIds: newOwners,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({ ownerIds: newOwners });
  });

  it("returns 200 and updates name", async () => {
    const dir = await mockPostDirectory({
      body: {
        name: "dir1",
        prefixPath: "",
      },
    });

    const newName = "better name";
    const { req, res } = mockPutReqRes({
      query: {
        id: dir._id,
      },
      body: {
        name: newName,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({ name: newName });
  });

  it("returns 200 and updates prefixPath", async () => {
    const root = await mockPostDirectory({
      body: {
        name: "Root",
        prefixPath: "",
      },
    });

    const dir1 = await mockPostDirectory({
      body: {
        name: "dir1",
        prefixPath: getPath(root),
      },
    });

    const dir2 = await mockPostDirectory({
      body: {
        name: "dir2",
        prefixPath: getPath(dir1),
      },
    });

    expect(dir2.prefixPath).toEqual(getPath(dir1));

    const { req, res } = mockPutReqRes({
      query: { id: dir2._id },
      body: {
        prefixPath: getPath(root),
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      prefixPath: getPath(root),
    });
  });

  //TODO multilevel prefixPath renaming

  it("moves nested directories and experiments", async () => {
    const mockPostDirectory = getApiCallMocker(
      "POST",
      DIR_ENDPOINT,
      dirHandler,
      token
    );
    const mockPostExperiment = getApiCallMocker(
      "POST",
      EXP_ENDPOINT,
      expHandler,
      token
    );

    const root = await mockPostDirectory({
      body: {
        name: "Root",
        prefixPath: "",
      },
    });

    const grandparent = await mockPostDirectory({
      body: { name: "grandparent directory", prefixPath: getPath(root) },
    });

    const uncle = await mockPostExperiment({
      body: {
        name: "uncle experiment",
        directory: grandparent._id,
      },
    });

    const parent = await mockPostDirectory({
      body: {
        name: "parent directory",
        prefixPath: getPath(grandparent),
      },
    });

    const sibling = await mockPostExperiment({
      body: {
        name: "sibling experiment",
        directory: parent._id,
      },
    });

    const you = await mockPostDirectory({
      body: {
        name: "main directory",
        prefixPath: getPath(parent),
      },
    });

    const otherchild = await mockPostExperiment({
      body: {
        name: "other child experiment",
        directory: you._id,
      },
    });

    const child = await mockPostDirectory({
      body: {
        name: "child directory",
        prefixPath: getPath(you),
      },
    });

    const grandchild = await mockPostExperiment({
      body: {
        name: "grandchild experiment",
        directory: child._id,
      },
    });

    // Actual tested request
    const { req, res } = mockPutReqRes({
      query: {
        id: parent._id,
      },
      body: {
        name: "updated parent directory",
        prefixPath: getPath(root),
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);

    const mockGetDirectories = getApiCallMocker(
      "GET",
      DIR_ENDPOINT,
      dirHandler,
      token
    );
    const allDirs = await mockGetDirectories();

    expect(allDirs).toEqual(
      expect.arrayContaining([
        expect.objectContaining(grandparent),
        expect.objectContaining({
          ...parent,
          updatedAt: expect.not.stringMatching(parent.updatedAt),
          prefixPath: getPath(root),
          name: "updated parent directory",
        }),
        expect.objectContaining({
          ...you,
          updatedAt: expect.not.stringMatching(you.updatedAt),
          prefixPath: `${getPath(root)},${parent._id}`,
        }),
        expect.objectContaining({
          ...child,
          updatedAt: expect.not.stringMatching(child.updatedAt),
          prefixPath: `${getPath(root)},${parent._id},${you._id}`,
        }),
      ])
    );

    const mockGetExperiments = getApiCallMocker(
      "GET",
      EXP_ENDPOINT,
      expHandler,
      token
    );
    const allExps = await mockGetExperiments();

    expect(allExps).toEqual(
      expect.arrayContaining([
        expect.objectContaining(uncle),
        expect.objectContaining(sibling),
        expect.objectContaining(otherchild),
        expect.objectContaining(grandchild),
      ])
    );
  });
});
