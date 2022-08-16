import mongoose from "mongoose";

import { ModelNotFoundError, ModelType } from "./initHandler";

export const throwIfNull = (model: ModelType) => (schema: mongoose.Schema) => {
  // https://mongoosejs.com/docs/api.html#model_Model-findById
  // findById* triggers findOne* middleware
  schema.post(
    ["findOne", "findOneAndUpdate", "findOneAndDelete", "findOneAndRemove"],
    (doc) => {
      if (!doc) throw new ModelNotFoundError(model);
    }
  );
};
