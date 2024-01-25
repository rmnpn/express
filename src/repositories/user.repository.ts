import { User } from "../models/user.model";
import { IUser } from "../types/user.type";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    const data = await User.find({});
    return data;
  }

  public async getByID(id: number): Promise<IUser> {
    const user = await User.findOne({ _id: id });
    if (!user) {
      //*якщо немає співпадінь, тоді в методі findIndex -1
      throw new Error("user sibavsi");
    }
    return user;
  }
  public async deleteById(id: number): Promise<void> {
    await User.deleteOne({ _id: id });
  }
  public async editById(id: number, body: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(id, body, { returnDocument: "after" });
  }
  public async create(body: Partial<IUser>): Promise<IUser> {
    return await User.create(body);
  }
}

export const userRepository = new UserRepository();
