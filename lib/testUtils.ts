import { NextApiRequest, NextApiResponse } from "next/types";
import { createRequest, createResponse, RequestMethod } from "node-mocks-http";
import jwt from "jsonwebtoken";
import User from "../models/User";
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

/**
 *  ObjectIds are 12 bytes, but string representation is 24 hexadecimal chars
 *  @returns pseudorandom string containing 24 hexademical chars
 */
export const getValidObjectId = () => {
  const charBank = "0123456789abcdef";
  let res = "";
  for (let i = 0; i < 24; i++) {
    res += charBank[Math.floor(Math.random() * charBank.length)];
  }
  return res;
};

export const getValidPrefixPath = (parents = 0) => {
  let res = "r";
  for (let i = 0; i < parents; i++) {
    res += `,${getValidObjectId()}`;
  }
  return res;
};
