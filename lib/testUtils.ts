import { NextApiRequest, NextApiResponse } from "next/types";
import { createRequest, createResponse, RequestMethod } from "node-mocks-http";
import jwt from "jsonwebtoken";
import User, { UserJson } from "../models/User";
import config from "./config";

export const getReqResMocker =
  (method: RequestMethod, url: string) => (token?: string) => {
    const req = createRequest<NextApiRequest>({
      method,
      url,
      headers: token
        ? {
            authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    const res = createResponse<NextApiResponse>();
    return { req, res };
  };

//https:stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const get5ishChars = () => (Math.random() + 1).toString(36).slice(2, 5);

const getRegisterInfo = () => {
  const seed = get5ishChars();
  return {
    email: `${seed}@hotmail.com`,
    name: `Benjamin ${seed} Dover`,
    password: `myseedis_${seed}`,
    superuser: false,
  };
};

export const getCreatedUserAndToken = async (superuser = false) => {
  const RAW_USER_WITH_PASSWORD = new User({ ...getRegisterInfo(), superuser });
  await RAW_USER_WITH_PASSWORD.save();

  const { password, ...user } = RAW_USER_WITH_PASSWORD.toObject();

  const token = jwt.sign(user, config.JWT_SECRET, {
    expiresIn: "2d",
  });

  return { user, token };
};
