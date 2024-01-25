import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }
  public async getByID(id: number): Promise<IUser> {
    return await userRepository.getByID(id);
  }

  public async deleteById(id: number): Promise<void> {
    const user = await userRepository.getByID(id);
    if (!user) {
      throw new ApiError("already sibavsi", 422);
    }
    await userRepository.deleteById(id);
  }
  public async editById(id: number, body: Partial<IUser>): Promise<IUser> {
    const user = await userRepository.getByID(id);
    if (!user) {
      throw new ApiError("already sibavsi", 422);
    }
    return await userRepository.editById(id, body);
  }
}

export const userService = new UserService();
