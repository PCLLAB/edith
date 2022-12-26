import { DateTime } from "luxon";

import initHandler, {
  TypedApiHandlerWithAuth,
} from "../../../../../../lib/server/initHandler";
import { modelForCollection } from "../../../../../../models/DataEntry";
import Experiment from "../../../../../../models/Experiment";
import MongoDBData, {
  MongoDBDataJson,
} from "../../../../../../models/MongoDBData";

export const ENDPOINT = "/api/v2/experiments/[id]/meta";

export type ExperimentsIdMetaGetSignature = {
  url: typeof ENDPOINT;
  method: "GET";
  query: {
    id: string;
  };
  data: {
    mongoDBData: MongoDBDataJson;
    activityLog: {
      [date: string]: number;
    };
  };
};

const get: TypedApiHandlerWithAuth<ExperimentsIdMetaGetSignature> = async (
  req,
  res
) => {
  const id = req.query.id;

  const expObj = await Experiment.findById(id).lean();
  const mongoDBData = await MongoDBData.findById(expObj.mongoDBData).lean();

  const DataModel = modelForCollection(mongoDBData.dataCollection);
  const dates = await DataModel.find().select("createdAt").lean();

  // TODO maybe don't hardcode this
  const userTimezone = "America/New_York";

  const activityLog: Record<string, number> = {};

  dates.forEach((doc) => {
    const localDate = DateTime.fromJSDate(doc.createdAt, {})
      .setZone(userTimezone)
      .endOf("day")
      .toISO();

    const count = activityLog[localDate] ?? 0;
    activityLog[localDate] = count + 1;
  });

  res.json({
    mongoDBData,
    activityLog,
  });
};

export default initHandler({
  GET: get,
});
