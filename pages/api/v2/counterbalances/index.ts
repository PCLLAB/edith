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
    url: string;
  };
  data: CounterbalanceJson;
};

const post: TypedApiHandlerWithAuth<CounterbalancesPostSignature> = async (
  req,
  res
) => {
  const { experiment, url } = req.body;

  if (experiment == null || url == null) {
    throw new MissingArgsError(
      // @ts-ignore filter falsy
      [!experiment && "experiment", !url && "url"].filter(Boolean)
    );
  }

  const cb = new Counterbalance({
    experiment,
    url,
  });

  await cb.save();

  res.json(cb);
};

export default initHandler({
  POST: post,
});
