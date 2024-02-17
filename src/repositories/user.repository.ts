import { FilterQuery } from "mongoose";

import { Token } from "../models/token.model";
import { User } from "../models/user.model";
import { ITokenPayload } from "../types/token.type";
import { IUser } from "../types/user.type";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    const data = await User.find({});
    return data;
  }

  public async getById(id: string): Promise<IUser> {
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
  public async findWithoutActivityAfter(date: Date): Promise<IUser[]> {
    return await User.aggregate([
      {
        $lookup: {
          from: Token.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_userId", "$$userId"] } } },
            { $match: { createdAt: { $gt: date } } },
          ],
          as: "tokens",
        },
      },
      {
        $match: {
          tokens: { $size: 0 },
        },
      },
    ]);
  }
  public async updateById(id: string, body: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(id, body, { returnDocument: "after" });
  }
}

export const userRepository = new UserRepository();
