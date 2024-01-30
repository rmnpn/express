import { FilterQuery } from "mongoose";

import { User } from "../models/user.model";
import { ITokenPayload } from "../services/token.service";
import { IUser } from "../types/user.type";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    const data = await User.find({});
    return data;
  }

  public async getById(id: number): Promise<IUser> {
    const user = await User.findOne({ _id: id });
    if (!user) {
      //*якщо немає співпадінь, тоді в методі findIndex -1
      throw new Error("user sibavsi");
    }
    return user;
  }
  public async getMe(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await User.findOne({ _id: jwtPayload.userId });
    if (!user) {
      //*якщо немає співпадінь, тоді в методі findIndex -1
      throw new Error("user sibavsi");
    }
    return user;
  }
  public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
    await User.deleteOne({ _id: jwtPayload.userId });
  }
  public async editMe(
    jwtPayload: ITokenPayload,
    body: Partial<IUser>,
  ): Promise<IUser> {
    return await User.findByIdAndUpdate(jwtPayload, body, {
      returnDocument: "after",
    });
  }
  public async create(body: Partial<IUser>): Promise<IUser> {
    return await User.create(body);
  }
  public async getOneByParams(params: FilterQuery<IUser>): Promise<IUser> {
    return await User.findOne(params as never);
  }
}

export const userRepository = new UserRepository();
