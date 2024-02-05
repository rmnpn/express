import { Types } from "mongoose";

import { IRegister } from "../controllers/auth.controller";
import { EEMailAction } from "../enums/email-action.enum";
import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { ILogin } from "../types/auth.type";
import { IUser } from "../types/user.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { ITokenPair, ITokenPayload, tokenService } from "./token.service";

class AuthService {
  public async signUp(dto: IRegister): Promise<IUser> {
    const userFromDb = await userRepository.getOneByParams({
      email: dto.email,
    });
    if (userFromDb) {
      throw new ApiError("User pes ibe oves", 400);
    }
    const hashedPassword = await passwordService.hash(dto.password);
    await emailService.sendMail(
      "romanpincak74@gmail.com",
      EEMailAction.WELCOME,
      { name: dto.name },
    );
    return await userRepository.create({ ...dto, password: hashedPassword }); //повертаємо dto(все що приходить від користувача),але замість звичайного пароля захешований
  }

  public async signIn(dto: ILogin): Promise<ITokenPair> {
    const user = await userRepository.getOneByParams({ email: dto.email });
    if (!user) throw new ApiError("Not valid ID or Passhui", 401);

    const isMatch = await passwordService.compare(dto.password, user.password);
    if (!isMatch) throw new ApiError("Not valid ID or Passhui", 401);

    const jwtTokens = tokenService.generateTokenPair({ userId: user._id });
    await tokenRepository.create({ ...jwtTokens, _userId: user._id });
    return jwtTokens;
  }

  public async refresh(
    jwtPayload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokenPair> {
    await tokenRepository.deleteOneByParams({ refreshToken });

    const jwtTokens = tokenService.generateTokenPair({
      userId: jwtPayload.userId,
    });
    await tokenRepository.create({
      ...jwtTokens,
      _userId: new Types.ObjectId(jwtPayload.userId),
    });
    return jwtTokens;
  }
}
export const authService = new AuthService();
