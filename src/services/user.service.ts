import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";
import { ITokenPayload } from "./token.service";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async getById(id: number): Promise<IUser> {
    return await userRepository.getById(id);
  }

  public async getMe(jwtPayload: ITokenPayload): Promise<IUser> {
    return await userRepository.getMe(jwtPayload);
  }

  public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.getMe(jwtPayload);
    if (!user) {
      throw new ApiError("already sibavsi", 422);
    }
    await userRepository.deleteMe(jwtPayload);
  }

  public async editMe(
    jwtPayload: ITokenPayload,
    id: number,
    body: Partial<IUser>,
  ): Promise<IUser> {
    const user = await userRepository.getMe(jwtPayload);
    if (!user) {
      throw new ApiError("already sibavsi", 422);
    }
    if (jwtPayload.userId === user.id.toString()) {
      throw new ApiError("Ne tviy acc, pider!", 403);
    }
    return await userRepository.editMe(jwtPayload, body);
  }
}

export const userService = new UserService();
