import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import initHandler, {
  MissingArgsError,
  NextApiRequestWithAuth,
  NotAllowedMethodError,
  UserPermissionError,
} from "../../../../lib/initHandler";
import User from "../../../../models/User";

const handler = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  const id = req.query.id as string;
  switch (req.method) {
    case "GET":
      const user = await User.findById(id);
      return res.status(200).json(user);
    case "PUT":
      if (req.auth._id !== id && !req.auth.superuser) {
        throw new UserPermissionError();
      }

      const { email, password } = req.body;

      if (!email || !password) {
        throw new MissingArgsError(
          [email && "email", password && "password"].filter(Boolean)
        );
      }

    case "POST":
      if (!req.auth.superuser) {
        throw new UserPermissionError();
      }
    case "DELETE":
      if (!req.auth.superuser) {
        throw new UserPermissionError();
      }
    default:
      throw new NotAllowedMethodError(req.method, [
        "GET",
        "PUT",
        "POST",
        "DELETE",
      ]);
  }
};
export default initHandler(handler);
