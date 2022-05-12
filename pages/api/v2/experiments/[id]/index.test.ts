jest.mock("../../../../../lib/dbConnect");

import dbConnect from "../../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  getValidObjectId,
  getValidPrefixPath,
} from "../../../../../lib/testUtils";
import Experiment from "../../../../../models/Experiment";
import { UserDoc } from "../../../../../models/User";
import indexHandler from "./index";

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
    req.query.id = "abds" 

    await indexHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 if bad valid id", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = getValidObjectId();

    await indexHandler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("returns 200 and updates name, enabled, user, prefixpath", async () => {
    const { req, res } = mockReqRes(token);

    const expInfo = { name: "exp1", user: user._id.toString() };
    const exp = await Experiment.create(expInfo);

    const updates = {
      name: "newname",
      enabled: true,
      user: getValidObjectId(),
      prefixPath: getValidPrefixPath(),
    };

    req.query.id = exp._id;
    req.body = updates;

    await indexHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject(updates);
  });
});

describe(`DELETE ${ENDPOINT}`, () => {
  const mockReqRes = getReqResMocker("DELETE", ENDPOINT);

  it("returns 400 if invalid id", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = "abds" 

    await indexHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 if bad valid id", async () => {
    const { req, res } = mockReqRes(token);
    req.query.id = getValidObjectId();

    await indexHandler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("returns 200 if experiment exists", async () => {
    const { req, res } = mockReqRes(token);

    const expInfo = { name: "tobedeleted", user: user._id.toString() };
    const exp = await Experiment.create(expInfo);

    req.query.id = exp._id;

    await indexHandler(req, res);

    expect(res.statusCode).toBe(200);
  });
});
