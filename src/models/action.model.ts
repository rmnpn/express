import { model, Schema, Types } from "mongoose";

import { IActionToken } from "../types/token.type";
import { User } from "./user.model";

const actionTokenSchema = new Schema({
  actionToken: {
    type: String,
    required: true,
  },
  tokenType: {
    type: String,
    required: true,
  },
  _userId: {
    type: Types.ObjectId, //зберігання айдішника користувача, якому видали токен
    required: true,
    ref: User, //зєднав з таблицею юзерів
  },
});

export const ActionToken = model<IActionToken>(
  "actionToken",
  actionTokenSchema,
);
