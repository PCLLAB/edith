import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../../lib/initHandler";

type QueryProps = {
  id: string;
  depth: string;
  experiments?: any;
  directories?: boolean;
};

const get: TypedApiHandlerWithAuth = async (req, res) => {
  const { id, depth = "1", experiments = true, directories = true } = req.query;
};

export default initHandler({
  GET: get,
});
