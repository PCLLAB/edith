jest.mock("../../../../../lib/dbConnect");

import dbConnect from "../../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  getValidObjectId,
  ReqResMocker,
} from "../../../../../lib/testUtils";
import { CachedDataEntry } from "../../../../../models/DataEntry";
import handler, { ENDPOINT } from "./cache";

let token: string;

let connection: any;

let mockGetReqRes: ReqResMocker;
let mockDelReqRes: ReqResMocker;

beforeAll(async () => {
  connection = await dbConnect();
  ({ token } = await getCreatedUserAndToken());
  mockGetReqRes = getReqResMocker("GET", ENDPOINT, token);
  mockDelReqRes = getReqResMocker("DELETE", ENDPOINT, token);
});

afterAll(async () => {
  await connection.disconnect();
});

describe(`GET ${ENDPOINT}`, () => {
  it("returns 400 if invalid id", async () => {
    const { req, res } = mockGetReqRes();
    req.query.id = "abds";

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("returns empty list if bad valid id", async () => {
    const { req, res } = mockGetReqRes();
    req.query.id = getValidObjectId();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(expect.arrayContaining([]));
  });

  it("returns 200 and list containing matches", async () => {
    const { req, res } = mockGetReqRes();

    const matchEntry = {
      data: [
        {
          key: "value",
        },
      ],
      experiment: getValidObjectId(),
    };

    const missEntry = {
      data: [
        {
          key: "different value",
        },
      ],
      experiment: getValidObjectId(),
    };

    await CachedDataEntry.create([matchEntry, matchEntry, missEntry]);

    req.query.id = matchEntry.experiment;

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.arrayContaining([expect.objectContaining(matchEntry)])
    );
    expect(res._getJSONData().length).toEqual(2);
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

  it("returns 200 and deletes all matching cache entries", async () => {
    const { req, res } = mockDelReqRes();

    const matchEntry = {
      data: [
        {
          key: "value",
        },
      ],
      experiment: getValidObjectId(),
    };
    await CachedDataEntry.create([matchEntry, matchEntry]);
    req.query.id = matchEntry.experiment;

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({ deleted: 2 });
  });
});
