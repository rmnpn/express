import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

class AuthService {
  public async signUp(body: Partial<IUser>): Promise<IUser> {
    return await userRepository.create(body);
  }
}

export const authService = new AuthService();
