import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import initHandler, {
  NextApiRequestWithAuth,
  NotAllowedMethodError,
  UserPermissionError,
} from "../../../../lib/initHandler";
import User from "../../../../models/User";

const handler = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  const { id } = req.query;
  switch (req.method) {
    case "GET":
      const user = await User.findById(id);
      return res.status(200).json(user);
    case "POST":
      if (!req.auth.superuser) {
        throw new UserPermissionError()
      }
    case "PUT":
      if (req.auth._id) 
      break;
    case "DELETE":
      break;
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
