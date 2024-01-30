import { Types } from "mongoose";

import { ITokenPair } from "../services/token.service";

export interface IToken extends ITokenPair {
  _userId: Types.ObjectId;
}
