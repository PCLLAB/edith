jest.mock("../../../../lib/dbConnect");

import dbConnect from "../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  getValidPrefixPath,
} from "../../../../lib/testUtils";
import Experiment from "../../../../models/Experiment";
import { UserDoc } from "../../../../models/User";
import handler from "./index";

const ENDPOINT = "/api/v2/experiments";

let user: UserDoc;
let token: string;

let connection: any;

let mockGetReqRes: ReturnType<typeof getReqResMocker>;
let mockPostReqRes: ReturnType<typeof getReqResMocker>;

// Check out jest execution order if don't know why stuff is in beforeAll
// https://gist.github.com/tamlyn/dd6d54cdbe6eccd51a4bc61f5844bec4
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
    const { req, res } = mockGetReqRes({ token });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual([]);
  });

  it("returns 200 and all experiments", async () => {
    const { req, res } = mockGetReqRes();

    const exp1 = {
      name: "exp1",
      user: user._id.toString(),
      dataCollection: "placeholder",
    };
    const exp2 = {
      name: "exp2",
      user: user._id.toString(),
      dataCollection: "placeholder",
    };

    await Experiment.create([exp1, exp2]);

    await handler(req, res);

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
  const name = "created exp";
  const prefixPath = getValidPrefixPath();
  const enabled = true;

  it("returns 400 if missing name", async () => {
    const { req, res } = mockPostReqRes({
      body: {
        prefixPath,
        enabled,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns 200 if name provided", async () => {
    const { req, res } = mockPostReqRes({
      body: {
        name,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        name,
        enabled: false,
        prefixPath: "r",
        user: user._id.toString(),
        dataCollection: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it("accepts prefixPath and enabled ", async () => {
    const { req, res } = mockPostReqRes({
      body: {
        name,
        prefixPath,
        enabled,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        name,
        enabled,
        prefixPath,
        user: user._id.toString(),
        dataCollection: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });
});
