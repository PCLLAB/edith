jest.mock("../../../../lib/server/dbConnect");

import { UserDoc } from "../../../../lib/common/types/models";
import dbConnect from "../../../../lib/server/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  getValidObjectId,
  ReqResMocker,
} from "../../../../lib/testUtils";
import Counterbalance from "../../../../models/Counterbalance";
import handler from "./[expId]";

const ENDPOINT = "/api/v2/counterbalances/[id]";

let user: UserDoc;
let token: string;

let connection: any;

let mockGetReqRes: ReqResMocker;
let mockPutReqRes: ReqResMocker;

beforeAll(async () => {
  connection = await dbConnect();
  ({ user, token } = await getCreatedUserAndToken());
  mockGetReqRes = getReqResMocker("GET", ENDPOINT, token);
  mockPutReqRes = getReqResMocker("PUT", ENDPOINT, token);
});

afterAll(async () => {
  await connection.disconnect();
});

describe(`GET ${ENDPOINT}`, () => {
  it("returns 404 if experiment missing", async () => {
    const { req, res } = mockGetReqRes({
      query: {
        id: getValidObjectId(),
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("returns 200 and counterbalance", async () => {
    const cbInfo = {
      experiment: getValidObjectId(),
    };
    const cb = await Counterbalance.create(cbInfo);

    const { req, res } = mockGetReqRes({
      query: {
        id: cbInfo.experiment,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({ ...cbInfo, _id: cb._id.toString() })
    );
  });
});

describe.skip(`PUT ${ENDPOINT}`, () => {
  it("returns 200 and updates counterbalance", async () => {
    const cbInfo = {
      experiment: getValidObjectId(),
    };
    await Counterbalance.create(cbInfo);

    const updates = {
      shuffleStack: true,
      url: "https://learninglab.psych.purdue.edu",
      paramOptions: {
        first: ["1", "2", "3"],
        second: ["ABC", "CDE", "EFG"],
      },
      quotas: [
        { params: { first: "1" }, amount: 1 },
        { params: { second: "CDE" }, amount: 2 },
        { params: { first: "1", second: "ABC" }, amount: 3 },
        { params: { first: "2", second: "EFG" }, amount: 4 },
      ],
    };

    const { req, res } = mockPutReqRes({
      query: {
        id: cbInfo.experiment,
      },
      body: updates,
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(expect.objectContaining(updates));
  });
});
