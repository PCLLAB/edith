import mongoose from "mongoose";

import { ModelNotFoundError, ModelType } from "./errors";

/**
 * This mongoose plugin ensures any non-error findOne operation returns a document,
 * and failures can be selectively handled with try-catch or default to error handler
 * in initHandler.ts
 * @param model
 */
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
