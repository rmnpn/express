import { model, Schema, Types } from "mongoose";

import { IUser } from "../types/user.type";
import { User } from "./user.model";

const tokenSchema = new Schema({
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  _userId: {
    type: Types.ObjectId, //зберігання айдішника користувача, якому видали токен
    required: true,
    ref: User, //зєднав з таблицею юзерів
  },
});

export const Token = model<IUser>("", tokenSchema);
