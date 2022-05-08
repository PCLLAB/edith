import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import initHandler, {
  MissingArgsError,
  NextApiRequestWithAuth,
  NotAllowedMethodError,
  UserPermissionError,
} from "../../../../lib/initHandler";
import User, { RawUnsafeUserDoc } from "../../../../models/User";

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

    case "POST":
      if (!req.auth.superuser) {
        throw new UserPermissionError();
      }
      const { email, password, name, superuser } = req.body;

      if (!email || !password) {
        throw new MissingArgsError(
          [email && "email", password && "password"].filter(Boolean)
        );
      }

      const NEW_RAW_USER_WITH_PASSWORD = new User({
        email,
        password,
        name,
        superuser: !!superuser,
      });

      await NEW_RAW_USER_WITH_PASSWORD.save();

      const cleanUser = NEW_RAW_USER_WITH_PASSWORD.toObject();
      console.log(cleanUser);

      return res.status(200).json(cleanUser);

    case "DELETE":
      if (!req.auth.superuser) {
        throw new UserPermissionError();
      }

      const deleteResult = await User.deleteOne({ _id: id });

      if (deleteResult.deletedCount) {
        return res.status(200).json({ message: "Deleted successfully" });
      }
      throw `Delete failed. No user with id: ${id}`;

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
