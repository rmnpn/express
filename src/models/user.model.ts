import { model, Schema } from "mongoose";

import { IUser } from "../types/user.type";

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    age: {
      type: Number,
      min: 1,
      max: 1020,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("user", userSchema);
