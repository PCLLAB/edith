import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import { throwIfNull } from "../lib/throwIfNull";
import { ModelNotFoundError } from "../lib/initHandler";

export interface UserDoc<IdType = Types.ObjectId, DateType = Date> {
  _id: IdType;
  email: string;
  name: string;
  /** Admin priveleges */
  superuser: boolean;
  /** managed by mongoose using timestamp option */
  createdAt: DateType;
  /** managed by mongoose using timestamp option */
  updatedAt: DateType;
}

export interface UserJson extends UserDoc<string, string> {}

// This lets us type lean and full mongoose objects
// This is never JSONified, so DateType is always Date
export interface RawUnsafeUserDoc<T = Types.ObjectId> extends UserDoc<T> {
  password: string;
}

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
      required: true,
      // exclude password from results by default
      // must specify to include e.g.
      // Users.find().select("+password")
      select: false,
    },
    name: {
      type: String,
      required: true,
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

// User.prototype.cleanObject = function () {
//   const tempUser = this.toObject();
//   delete tempUser.password;
//   return tempUser;
// };
