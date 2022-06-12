jest.mock("../../../../../lib/dbConnect");

import dbConnect from "../../../../../lib/dbConnect";
import {
  getCreatedUserAndToken,
  getReqResMocker,
  getValidObjectId,
} from "../../../../../lib/testUtils";
import Directory from "../../../../../models/Directory";
import { UserDoc } from "../../../../../models/User";
import handler from "./index";

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


    req.query.id = dir._id.toString();
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
