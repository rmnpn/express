import { Document, Types } from "mongoose";

import { ERole } from "../enums/role.enum";
import { EActionTokenType } from "../enums/token-type.enum";

export interface ITokenPayload {
  userId: string;
  role: ERole;
}
export interface ITokenPair {
  accessExpiresIn: string;
  refreshExpiresIn: string;
  accessToken: string;
  refreshToken: string;
}
export interface IToken extends ITokenPair {
  _userId: Types.ObjectId;
}

export interface IActionToken extends Document {
  actionToken: string;
  tokenType: EActionTokenType;
  _userId: Types.ObjectId;
}
