import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserDoc {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  /** Admin priveleges */
  superuser: boolean;
  /** managed by mongoose using timestamp option */
  createdAt: Date;
  /** managed by mongoose using timestamp option */
  updatedAt: Date;
}

export interface UserObj
  extends Omit<UserDoc, "_id" | "createdAt" | "updatedAt"> {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface RawUnsafeUserDoc extends UserDoc {
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

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  next();
});

// UserSchema.methods.comparePassword = function (
//   candidatePassword: string,
//   callback
// ) {
//   bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
//     if (err) {
//       return callback(err);
//     }

//     callback(null, isMatch);
//   });
// };

export default mongoose.models.User || mongoose.model("User", UserSchema);

// User.prototype.cleanObject = function () {
//   const tempUser = this.toObject();
//   delete tempUser.password;
//   return tempUser;
// };
