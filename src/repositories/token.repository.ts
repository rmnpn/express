import { FilterQuery } from "mongoose";

import { Token } from "../models/token.model";
import { IToken } from "../types/token.type";

class TokenRepository {
  public async create(data: Partial<IToken>): Promise<IToken> {
    return await Token.create(data);
  }

  public async getOneBy(params: Partial<IToken>): Promise<IToken> {
    return await Token.findOne(params);
  }

  public async deleteOneByParams(params: FilterQuery<IToken>): Promise<void> {
    await Token.deleteOne(params);
  }
  public async deleteManyByParams(params: FilterQuery<IToken>): Promise<void> {
    await Token.deleteMany(params);
  }
}
export const tokenRepository = new TokenRepository();
