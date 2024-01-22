import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }
  public async getByID(id: number): Promise<IUser> {
    return await userRepository.getByID(id);
  }
  public async postUser(
    email: string,
    name: string,
    age: number,
  ): Promise<IUser> {
    return await userRepository.postUser(email, name, age);
  }
  public async deleteById(id: number): Promise<IUser> {
    return await userRepository.deleteById(id);
  }
  public async editById(id: number, user: IUser) {
    return await userRepository.editById(id, user);
  }
}

export const userService = new UserService();
