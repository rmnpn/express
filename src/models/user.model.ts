import { model, Schema } from "mongoose";

import { ERole } from "../enums/role.enum";
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
    role: {
      type: String,
      enum: ERole,
      default: ERole.USER,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: true,
    },
    isActivate: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("user", userSchema);
