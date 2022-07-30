jest.mock("../../../../../lib/dbConnect");
// jest.unmock("../../../../../lib/throwIfNull");
// jest.unmock("../../../../../models/Experiment");
// jest.unmock("../../../../../models/User");
jest.unmock("../../../../../lib/throwIfNull");
import { getNamedPath, getPath } from "../../../../../lib/apiUtils";
import dbConnect from "../../../../../lib/dbConnect";
import {
  ApiCallMocker,
  getApiCallMocker,
  getCreatedUserAndToken,
  getReqResMocker,
  getValidObjectId,
  ReqResMocker,
} from "../../../../../lib/testUtils";
import Directory, { ROOT_DIRECTORY } from "../../../../../models/Directory";
import { UserDoc } from "../../../../../models/User";
import handler from "./index";
import dirHandler, { ENDPOINT as DIR_ENDPOINT } from "../index";
import expHandler, { ENDPOINT as EXP_ENDPOINT } from "../../experiments/index";
import Experiment from "../../../../../models/Experiment";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { MockRequest } from "node-mocks-http";

const ENDPOINT = "/api/v2/directories/[id]";

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
      },
    });
    console.log(dir);

    const newName = "better name";
    const { req, res } = mockPutReqRes({
      query: {
        id: dir._id,
      },
      body: {
        name: newName,
      },
    });

    console.log({
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

  it("returns 200 and updates prefixPath and namedPrefixPath", async () => {
    const dir1 = await mockPostDirectory({
      body: {
        name: "dir1",
      },
    });

    const dir2 = await mockPostDirectory({
      body: {
        name: "dir2",
        prefixPath: getPath(dir1),
      },
    });

    expect(dir2.prefixPath).toEqual(getPath(dir1));
    expect(dir2.namedPrefixPath).toEqual(getNamedPath(dir1));

    const newPrefixPath = getPath(ROOT_DIRECTORY);

    const { req, res } = mockPutReqRes({
      query: { id: dir1.id },
      body: {
        prefixPath: newPrefixPath,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      prefixPath: newPrefixPath,
      namedPrefixPath: `${getNamedPath(ROOT_DIRECTORY)},${dir2.name}`,
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

    const grandparent = await mockPostDirectory({
      body: { name: "grandparent directory" },
    });

    const uncle = await mockPostExperiment({
      body: {
        name: "uncle experiment",
        prefixPath: getPath(grandparent),
      },
    });

    const parent = await mockPostDirectory({
      body: {
        name: "parent directory",
        parent: grandparent._id,
      },
    });

    const sibling = await mockPostExperiment({
      body: {
        name: "sibling experiment",
        prefixPath: getPath(parent),
      },
    });

    const you = await mockPostDirectory({
      body: {
        name: "main directory",
        parent: parent._id,
      },
    });

    const otherchild = await mockPostExperiment({
      body: {
        name: "other child experiment",
        prefixPath: getPath(you),
      },
    });

    const child = await mockPostDirectory({
      body: {
        name: "child directory",
        parent: you._id,
      },
    });

    const grandchild = await mockPostExperiment({
      body: {
        name: "grandchild experiment",
        prefixPath: getPath(child),
      },
    });

    // Actual tested request
    const { req, res } = mockPutReqRes({
      query: {
        id: parent._id,
      },
      body: {
        name: "updated parent directory",
        prefixPath: getPath(ROOT_DIRECTORY),
      },
    });

    await handler(req, res);

    expect(res._getJSONData().statusCode).toBe(200);

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
          prefixPath: getPath(ROOT_DIRECTORY),
          namedPrefixPath: `${getNamedPath(ROOT_DIRECTORY)}`,
          name: "updated parent directory",
        }),
        expect.objectContaining({
          ...you,
          updatedAt: expect.not.stringMatching(you.updatedAt),
          prefixPath: `${getPath(ROOT_DIRECTORY)},${parent._id}`,
          namedPrefixPath: `${getNamedPath(
            ROOT_DIRECTORY
          )},updated parent directory`,
        }),
        expect.objectContaining({
          ...child,
          updatedAt: expect.not.stringMatching(child.updatedAt),
          prefixPath: `${getPath(ROOT_DIRECTORY)},${parent._id},${you._id}`,
          namedPrefixPath: `${getNamedPath(
            ROOT_DIRECTORY
          )},updated parent directory,${you.name}`,
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
        expect.objectContaining({
          ...otherchild,
          updatedAt: expect.not.stringMatching(otherchild.updatedAt),
          prefixPath: `${getPath(ROOT_DIRECTORY)},${parent._id},${you._id}`,
        }),
        expect.objectContaining({
          ...grandchild,
          updatedAt: expect.not.stringMatching(grandchild.updatedAt),
          prefixPath: `${getPath(ROOT_DIRECTORY)},${parent._id},${you._id}${
            child._id
          }`,
        }),
      ])
    );
  });
});
