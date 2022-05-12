jest.mock("../../../../lib/dbConnect");

import dbConnect from "../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  getValidPrefixPath,
} from "../../../../lib/testUtils";
import Experiment from "../../../../models/Experiment";
import { UserDoc } from "../../../../models/User";
import indexHandler from "./index";

const ENDPOINT = "/api/v2/experiments";

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

    await indexHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual([]);
  });

  it("returns 200 and all experiments", async () => {
    const { req, res } = mockReqRes(token);

    const exp1 = { name: "exp1", user: user._id.toString() };
    const exp2 = { name: "exp2", user: user._id.toString() };

    await Experiment.create([exp1, exp2]);

    await indexHandler(req, res);

    expect(res.statusCode).toBe(200);

    expect(res._getJSONData().length).toEqual(2);
    expect(res._getJSONData()).toEqual(
      expect.arrayContaining([
        expect.objectContaining(exp1),
        expect.objectContaining(exp2),
      ])
    );
  });
});

describe(`POST ${ENDPOINT}`, () => {
  const mockReqRes = getReqResMocker("POST", ENDPOINT);

  const name = "created exp";
  const prefixPath = getValidPrefixPath();
  const enabled = true;

  it("returns 400 if missing name", async () => {
    const { req, res } = mockReqRes(token);

    req.body = {
      prefixPath,
      enabled,
    };

    await indexHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 200 if name provided", async () => {
    const { req, res } = mockReqRes(token);

    req.body = {
      name,
    };
    
    await indexHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(expect.objectContaining({
      name,
      enabled: false,
      prefixPath: "r",
      user: user._id.toString() ,
      dataCollection: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    }))
  });

  it("accepts prefixPath and enabled ", async () => {
    const { req, res } = mockReqRes(token);

    req.body = {
      name,
      prefixPath,
      enabled,
    };

    await indexHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(expect.objectContaining({
      name,
      enabled,
      prefixPath,
      user: user._id.toString() ,
      dataCollection: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    }))
  });
});
