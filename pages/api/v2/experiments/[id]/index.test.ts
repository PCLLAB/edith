jest.mock("../../../../../lib/dbConnect");

import dbConnect from "../../../../../lib/dbConnect";
import { ModelNotFoundError } from "../../../../../lib/initHandler";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  getValidObjectId,
  getValidPrefixPath,
} from "../../../../../lib/testUtils";
import Experiment, {
  ArchivedExperiment,
} from "../../../../../models/Experiment";
import { UserDoc } from "../../../../../models/User";
import handler from "./index";

const ENDPOINT = "/api/v2/experiments/[id]";

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

describe(`PUT ${ENDPOINT}`, () => {
  const mockReqRes = getReqResMocker("PUT", ENDPOINT);

  it("returns 400 if invalid id", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = "abds";

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 if bad valid id", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = getValidObjectId();

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("returns 200 and updates name, enabled, user, prefixpath", async () => {
    const { req, res } = mockReqRes(token);

    const expInfo = {
      name: "exp1",
      user: user._id.toString(),
      dataCollection: "placeholder",
    };
    const exp = await Experiment.create(expInfo);

    const updates = {
      name: "newname",
      enabled: true,
      user: getValidObjectId(),
      prefixPath: getValidPrefixPath(),
    };

    req.query.id = exp._id;
    req.body = updates;

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject(updates);
  });
});

describe(`DELETE ${ENDPOINT}`, () => {
  const mockReqRes = getReqResMocker("DELETE", ENDPOINT);

  it("returns 400 if invalid id", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = "abds";

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 if bad valid id", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = getValidObjectId();

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("returns 200 if experiment exists", async () => {
    const { req, res } = mockReqRes(token);

    const expInfo = {
      name: "tobedeleted",
      user: user._id.toString(),
      dataCollection: "placeholder",
    };
    const exp = await Experiment.create(expInfo);

    req.query.id = exp._id;

    await handler(req, res);

    expect(res.statusCode).toBe(200);
  });
});

describe(`POST ${ENDPOINT}`, () => {
  const mockReqRes = getReqResMocker("POST", ENDPOINT);

  it("returns 400 if invalid id", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = "abds";

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 if bad valid id", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = getValidObjectId();

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("returns 200 if archived experiment exists", async () => {
    const { req, res } = mockReqRes(token);

    const expInfo = {
      name: "tobearchived",
      user: user._id.toString(),

      dataCollection: "placeholder",
    };
    const exp = await ArchivedExperiment.create(expInfo);

    req.query.id = exp._id.toString();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
  });
});

describe(`ARCHIVE and RESTORE ${ENDPOINT}`, () => {
  const archiveReqRes = getReqResMocker("DELETE", ENDPOINT);
  const restoreReqRes = getReqResMocker("POST", ENDPOINT);

  it("archive and restore successfully", async () => {
    const expInfo = {
      name: "zombie experiment",
      user: user._id.toString(),
      dataCollection: "placeholder",
    };
    const experiment = await Experiment.create(expInfo);

    const { req: archiveReq, res: archiveRes } = archiveReqRes(token);
    archiveReq.query.id = experiment._id.toString();

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

    const { req: restoreReq, res: restoreRes } = restoreReqRes(token);
    restoreReq.query.id = experiment._id.toString();

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
