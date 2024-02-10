import { FilterQuery } from "mongoose";

import { ActionToken } from "../models/action.model";
import { IActionToken } from "../types/token.type";

class ActionTokenRepository {
  public async createActionToken(
    data: Partial<IActionToken>,
  ): Promise<IActionToken> {
    return await ActionToken.create(data);
  }
  public async getActionTokenByParams(
    params: FilterQuery<IActionToken>,
  ): Promise<IActionToken> {
    return await ActionToken.findOne(params);
  }
  public async deleteActionTokenByParams(
    params: FilterQuery<IActionToken>,
  ): Promise<void> {
    await ActionToken.deleteOne(params);
  }
}

export const actionTokenRepository = new ActionTokenRepository();
