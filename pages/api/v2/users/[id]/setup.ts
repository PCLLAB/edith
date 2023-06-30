import { InvalidArgsError } from "../../../../../lib/server/errors";
import initHandler, {
  TypedApiHandler,
} from "../../../../../lib/server/initHandler";
import User from "../../../../../models/User";

export const ENDPOINT = "/api/v2/users/[id]/setup";

export type PostUsersIdSetup = {
  url: typeof ENDPOINT;
  method: "POST";
  query: {
    id: string;
  };
  body: {
    name: string;
    password: string;
  };
  data: void;
};

const POST: TypedApiHandler<PostUsersIdSetup> = async (req, res) => {
  // USER MUST EXIST (created by admin via invite)
  const user = await User.findById(req.query.id);

  // USER MUST NOT BE SETUP ALREADY
  // IF THIS CHECK FAILS, BAD THINGS HAPPEN B/C THIS PATH IS NOT AUTHENTICATED
  if (user.name != null || user.password != null) {
    throw new InvalidArgsError(["id"]);
  }

  const { name, password } = req.body;

  user.name = name;
  user.password = password; // Password hashing is done via mongoose hook in User model

  await user.save();

  res.status(204).send();
};

export default initHandler({
  POST,
});
