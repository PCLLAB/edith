import { moveDirectory } from "../../../../../lib/apiUtils";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../../lib/initHandler";
import Directory from "../../../../../models/Directory";

type QueryProps = {
  id: string;
};

const get: TypedApiHandlerWithAuth<{ query: QueryProps }> = async (
  req,
  res
) => {
  const id = req.query.id;

  const dir = await Directory.findById(id).lean();

  res.json(dir);
};

type PutBody = {
  name: string;
  ownerIds: string[];
  prefixPath: string;
};

const put: TypedApiHandlerWithAuth<{
  query: QueryProps;
  body: PutBody;
}> = async (req, res) => {
  const id = req.query.id;

  const dir = await Directory.findById(id);

  const { name, ownerIds, prefixPath } = req.body;

  if (ownerIds) {
    dir.ownerIds = ownerIds;
    await dir.save();
  }

  if (prefixPath || name) {
    await moveDirectory(dir, {
      name: name ?? dir.name,
      prefixPath: prefixPath ?? dir.prefixPath,
    });
  }

  res.json(dir);
};

const del: TypedApiHandlerWithAuth = async (req, res) => {
  const id = req.query.id;
};

export default initHandler({
  GET: get,
  PUT: put,
  DELETE: del,
});
