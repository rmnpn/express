import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { IQuery } from "../types/pagination.type";
import { ITokenPayload } from "../types/token.type";
import { IUser } from "../types/user.type";
import { EFileType, s3Service } from "./s3.service";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async getById(id: string): Promise<IUser> {
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
    body: Partial<IUser>,
  ): Promise<IUser> {
    const user = await userRepository.getMe(jwtPayload);
    if (!user) {
      throw new ApiError("already sibavsi", 422);
    }
    if (jwtPayload.userId === user.id.toString()) {
      throw new ApiError("Ne tviy acc, pider!", 403);
    }
    return await userRepository.editMe(jwtPayload.userId, body);
  }
  public async getMany(query: IQuery) {
    const queryString = JSON.stringify(query);
    const queryObject = JSON.parse(
      queryString.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`),
    );
    const usersPaginated = await userRepository.getMany(queryObject);
    return usersPaginated;
  }
  public async uploadAvatar(jwtPayload: ITokenPayload, avatar: UploadedFile) {
    const user = await userRepository.getMe(jwtPayload);
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    const filePath = await s3Service.uploadFile(
      avatar,
      EFileType.User,
      jwtPayload.userId,
    );
    await userRepository.editMe(jwtPayload.userId, { avatar: filePath });
  }
  public async deleteAvatar(jwtPayload: ITokenPayload) {
    const user = await userRepository.getMe(jwtPayload);
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    await userRepository.editMe(jwtPayload.userId, { avatar: null });
  }
}

export const userService = new UserService();
