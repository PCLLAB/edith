import { UserDoc } from "../../../../../lib/common/models/types";
import dbConnect from "../../../../../lib/server/dbConnect";
import { ModelNotFoundError } from "../../../../../lib/server/errors";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  getValidObjectId,
  getValidPrefixPath,
  ReqResMocker,
} from "../../../../../lib/testUtils";
import Experiment, {
  ArchivedExperiment,
} from "../../../../../models/Experiment";
import handler, { ENDPOINT } from "./index";

jest.mock("../../../../../lib/server/dbConnect");

let user: UserDoc;
let token: string;

let connection: any;

let mockPutReqRes: ReqResMocker;
let mockGetReqRes: ReqResMocker;
let mockDelReqRes: ReqResMocker;
let mockPostReqRes: ReqResMocker;

beforeAll(async () => {
  connection = await dbConnect();
  ({ user, token } = await getCreatedUserAndToken());
  mockPutReqRes = getReqResMocker("PUT", ENDPOINT, token);
  mockGetReqRes = getReqResMocker("GET", ENDPOINT, token);
  mockDelReqRes = getReqResMocker("DELETE", ENDPOINT, token);
  mockPostReqRes = getReqResMocker("POST", ENDPOINT, token);
});

afterAll(async () => {
  await connection.disconnect();
});

describe(`GET ${ENDPOINT}`, () => {
  it("returns 400 if invalid id", async () => {
    const { req, res } = mockGetReqRes({
      query: {
        id: "abds",
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 if bad valid id", async () => {
    const { req, res } = mockGetReqRes({
      query: {
        id: getValidObjectId(),
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("returns 200 and experiment", async () => {
    const expInfo = {
      name: "exp1",
      user: user._id.toString(),
      mongoDBData: getValidObjectId(),
      directory: getValidObjectId(),
    };
    const exp = await Experiment.create(expInfo);

    const { req, res } = mockGetReqRes({
      query: {
        id: exp._id,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject(expInfo);
  });
});

describe(`PUT ${ENDPOINT}`, () => {
  it("returns 400 if invalid id", async () => {
    const { req, res } = mockPutReqRes({
      query: {
        id: "abds",
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 if bad valid id", async () => {
    const { req, res } = mockPutReqRes({
      query: {
        id: getValidObjectId(),
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("returns 200 and updates name, enabled, user, directory", async () => {
    const expInfo = {
      name: "exp1",
      user: user._id.toString(),
      mongoDBData: getValidObjectId(),
      directory: getValidObjectId(),
    };
    const exp = await Experiment.create(expInfo);

    const updates = {
      name: "newname",
      enabled: true,
      user: getValidObjectId(),
      directory: getValidObjectId(),
    };

    const { req, res } = mockPutReqRes({
      body: updates,
      query: {
        id: exp._id,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject(updates);
  });
});

describe(`DELETE ${ENDPOINT}`, () => {
  it("returns 400 if invalid id", async () => {
    const { req, res } = mockDelReqRes();
    req.query.id = "abds";

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 if bad valid id", async () => {
    const { req, res } = mockDelReqRes();
    req.query.id = getValidObjectId();

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("returns 200 if experiment exists", async () => {
    const { req, res } = mockDelReqRes();

    const expInfo = {
      name: "tobedeleted",
      user: user._id.toString(),
      mongoDBData: getValidObjectId(),
      directory: getValidObjectId(),
    };
    const exp = await Experiment.create(expInfo);

    req.query.id = exp._id;

    await handler(req, res);

    expect(res.statusCode).toBe(200);
  });
});

describe(`POST ${ENDPOINT}`, () => {
  it("returns 400 if invalid id", async () => {
    const { req, res } = mockPostReqRes();
    req.query.id = "abds";

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 if bad valid id", async () => {
    const { req, res } = mockPostReqRes();
    req.query.id = getValidObjectId();

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("returns 200 if archived experiment exists", async () => {
    const { req, res } = mockPostReqRes();

    const expInfo = {
      name: "tobearchived",
      user: user._id.toString(),
      mongoDBData: getValidObjectId(),
      directory: getValidObjectId(),
    };
    const exp = await ArchivedExperiment.create(expInfo);

    req.query.id = exp._id.toString();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
  });
});

describe(`ARCHIVE and RESTORE ${ENDPOINT}`, () => {
  it("archive and restore successfully", async () => {
    const archiveReqRes = getReqResMocker("DELETE", ENDPOINT, token);
    const restoreReqRes = getReqResMocker("POST", ENDPOINT, token);
    const expInfo = {
      name: "zombie experiment",
      user: user._id.toString(),
      mongoDBData: getValidObjectId(),
      directory: getValidObjectId(),
    };
    const experiment = await Experiment.create(expInfo);

    const { req: archiveReq, res: archiveRes } = archiveReqRes({
      query: {
        id: experiment._id.toString(),
      },
    });

    await handler(archiveReq, archiveRes);

    expect(archiveRes.statusCode).toBe(200);
    const archived = await ArchivedExperiment.findById(experiment._id);
    expect(archived.toObject()).toEqual(
      expect.objectContaining({
        ...experiment.toObject(),
        updatedAt: expect.any(Date),
      })
    );

    expect(
      async () => await Experiment.findById(experiment._id)
    ).rejects.toThrow(new ModelNotFoundError("Experiment"));

    const { req: restoreReq, res: restoreRes } = restoreReqRes({
      query: {
        id: experiment._id.toString(),
      },
    });

    await handler(restoreReq, restoreRes);

    // This causes a non-failing error if placed at the end of the test
    // MongoClient seems to disconnect?
    expect(
      async () => await ArchivedExperiment.findById(experiment._id)
    ).rejects.toThrow(new ModelNotFoundError("Experiment"));

    expect(restoreRes.statusCode).toBe(200);
    const restored = await Experiment.findById(experiment._id);
    expect(restored.toObject()).toEqual(
      expect.objectContaining({
        ...experiment.toObject(),
        updatedAt: expect.any(Date),
      })
    );
  });
});
