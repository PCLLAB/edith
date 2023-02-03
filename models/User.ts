import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { RawUnsafeUserDoc } from "../lib/common/types/models";
import { ModelNotFoundError } from "../lib/server/errors";

const UserSchema = new mongoose.Schema<RawUnsafeUserDoc>(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      // required: true,
      // exclude password from results by default
      // must specify to include e.g.
      // Users.findOne().select("+password")
      select: false,
    },
    name: {
      type: String,
      trim: true,
    },
    superuser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function () {
  const user = this;

  if (!user.isModified("password")) return;
  const salt = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
});

UserSchema.post(
  ["findOne", "findOneAndUpdate", "findOneAndDelete", "findOneAndRemove"],
  (doc) => {
    if (!doc) throw new ModelNotFoundError("User");
  }
);

// this causes test to fail for some reason, so explicitly duplicated above
// UserSchema.plugin(throwIfNull("User"));

export default mongoose.models.User || mongoose.model("User", UserSchema);
