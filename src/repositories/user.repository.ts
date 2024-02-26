import { FilterQuery } from "mongoose";

import { Token } from "../models/token.model";
import { User } from "../models/user.model";
import { IPaginationResponse, IQuery } from "../types/pagination.type";
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
    console.log(jwtPayload);
    const user = await User.findOne({
      // _id: jwtPayload.userId,
    });
    if (!user) {
      //*якщо немає співпадінь, тоді в методі findIndex -1
      throw new Error("user sibavsi");
    }
    return user;
  }

  public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
    await User.deleteOne({ _id: jwtPayload.userId });
  }

  public async editMe(userId: string, body: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, body, {
      returnDocument: "after",
    });
  }

  public async create(body: Partial<IUser>): Promise<IUser> {
    return await User.create(body);
  }

  public async getOneByParams(params: FilterQuery<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }

  public async getOneByParamsWithPassword(
    params: FilterQuery<IUser>,
  ): Promise<IUser> {
    return await User.findOne(params).select("password");
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

  public async getMany(query: IQuery): Promise<IPaginationResponse<IUser>> {
    const {
      page = 1,
      limit = 10,
      sortedBy = "createdAt",
      ...searchObject
    } = query;
    const skip = +limit * (+page - 1);
    const users = await User.find(searchObject)
      .sort(sortedBy)
      .limit(limit)
      .skip(skip);
    const itemsFound = await User.countDocuments(searchObject);
    return { page: +page, limit: +limit, itemsFound, data: users };
  }
}

export const userRepository = new UserRepository();
