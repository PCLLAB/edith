import type {
  CounterbalanceJson,
  DirectoryJson,
} from "../../../../lib/common/types/models";
import { MissingArgsError } from "../../../../lib/server/errors";
import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../lib/server/initHandler";
import Counterbalance from "../../../../models/Counterbalance";

export const ENDPOINT = "/api/v2/counterbalances";

export type CounterbalancesPostSignature = {
  url: typeof ENDPOINT;
  method: "POST";
  body: {
    experiment: string;
  };
  data: CounterbalanceJson;
};

const post: TypedApiHandlerWithAuth<CounterbalancesPostSignature> = async (
  req,
  res
) => {
  const { experiment } = req.body;

  if (experiment == null) {
    throw new MissingArgsError(["experiment"]);
  }

  const cb = new Counterbalance({
    experiment,
  });

  await cb.save();

  res.json(cb);
};

export default initHandler({
  POST: post,
});
