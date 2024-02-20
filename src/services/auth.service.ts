import { Types } from "mongoose";

import { IChangePassword, IRegister } from "../controllers/auth.controller";
import { EEMailAction } from "../enums/email-action.enum";
import { ERole } from "../enums/role.enum";
import { EActionTokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.error";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { ILogin } from "../types/auth.type";
import { ITokenPair, ITokenPayload } from "../types/token.type";
import { IUser } from "../types/user.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUpAdmin(dto: IRegister): Promise<IUser> {
    const userFromDb = await userRepository.getOneByParams({
      email: dto.email,
    });
    if (userFromDb) {
      throw new ApiError("User pes ibe oves", 400);
    }
    const hashedPassword = await passwordService.hash(dto.password);
    await emailService.sendMail(dto.email, EEMailAction.WELCOME, {
      name: dto.name,
    });
    return await userRepository.create({
      ...dto,
      password: hashedPassword,
      role: ERole.ADMIN,
    }); //повертаємо dto(все що приходить від користувача),але замість звичайного пароля захешований
  }
  public async signInAdmin(dto: ILogin): Promise<ITokenPair> {
    const user = await userRepository.getOneByParams({
      email: dto.email,
      role: ERole.ADMIN,
    });
    if (!user) throw new ApiError("Not valid ID or Passhui", 401);

    const isMatch = await passwordService.compare(dto.password, user.password);
    if (!isMatch) throw new ApiError("Not valid ID or Passhui", 401);

    const jwtTokens = tokenService.generateTokenPair(
      {
        userId: user._id,
        role: ERole.ADMIN,
      },
      ERole.ADMIN,
    );
    await tokenRepository.create({ ...jwtTokens, _userId: user._id });
    return jwtTokens;
  }

  public async signUp(dto: IRegister): Promise<IUser> {
    const userFromDb = await userRepository.getOneByParams({
      email: dto.email,
    });
    if (userFromDb) {
      throw new ApiError("User pes ibe oves", 400);
    }
    const hashedPassword = await passwordService.hash(dto.password);
    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    }); //повертаємо dto(все що приходить від користувача),але замість звичайного пароля захешований

    const { actionToken } = await this.createActivateToken(user);
    await emailService.sendMail(dto.email, EEMailAction.WELCOME, {
      name: dto.name,
      actionToken,
    });
    return user;
  }

  public async signIn(dto: ILogin): Promise<ITokenPair> {
    const user = await userRepository.getOneByParamsWithPassword({
      email: dto.email,
    });
    if (!user) throw new ApiError("Not valid ID or Passhui", 401);

    const isMatch = await passwordService.compare(dto.password, user.password);
    if (!isMatch) throw new ApiError("Not valid ID or Passhui", 401);

    const jwtTokens = tokenService.generateTokenPair(
      {
        userId: user._id,
        role: ERole.USER,
      },
      ERole.USER,
    );
    await tokenRepository.create({ ...jwtTokens, _userId: user._id });
    return jwtTokens;
  }

  public async refresh(
    jwtPayload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokenPair> {
    const user = await userRepository.getById(jwtPayload.userId);
    await tokenRepository.deleteOneByParams({ refreshToken });

    const jwtTokens = tokenService.generateTokenPair(
      {
        userId: jwtPayload.userId,
        role: user.role,
      },
      user.role,
    );
    await tokenRepository.create({
      ...jwtTokens,
      _userId: new Types.ObjectId(jwtPayload.userId),
    });
    return jwtTokens;
  }
  public async activateUser(actionToken: string) {
    const payload = tokenService.checkActionToken(
      actionToken,
      EActionTokenType.ACTIVATE,
    );
    const entity = await actionTokenRepository.getActionTokenByParams({
      actionToken,
    });
    if (!entity) {
      throw new ApiError("Not valid token", 400);
    }
    await Promise.all([
      userRepository.updateById(payload.userId, {
        isActivate: true,
      }),
      actionTokenRepository.deleteActionTokenByParams({ actionToken }),
    ]);
  }
  public async createActivateToken(user: IUser) {
    const actionToken = tokenService.createActionToken(
      { userId: user._id, role: ERole.USER },
      EActionTokenType.ACTIVATE,
    );
    return await actionTokenRepository.createActionToken({
      actionToken,
      _userId: user._id,
      tokenType: EActionTokenType.ACTIVATE,
    });
  }
  public async forgotPassword(user: IUser) {
    const actionToken = tokenService.createActionToken(
      { userId: user._id, role: ERole.USER },
      EActionTokenType.FORGOT,
    );
    await Promise.all([
      actionTokenRepository.createActionToken({
        actionToken,
        _userId: user._id,
        tokenType: EActionTokenType.FORGOT,
      }),
      emailService.sendMail(user.email, EEMailAction.FORGOT_PASSWORD, {
        actionToken,
      }),
    ]);
  }
  public async setForgotPassword(password: string, actionToken: string) {
    const payload = tokenService.checkActionToken(
      actionToken,
      EActionTokenType.FORGOT,
    );
    const entity = await actionTokenRepository.getActionTokenByParams({
      actionToken,
    });
    if (!entity) {
      throw new ApiError("Not valid token", 400);
    }
    const newHashedPassword = await passwordService.hash(password);
    await Promise.all([
      userRepository.updateById(payload.userId, {
        password: newHashedPassword,
      }),
      actionTokenRepository.deleteActionTokenByParams({ actionToken }),
    ]);
  }
  public async changePassword(dto: IChangePassword, jwtPaload: ITokenPayload) {
    const user = await userRepository.getById(jwtPaload.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    const isMatch = await passwordService.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new ApiError("Old password is invalid", 400);
    }
    const hashNewPassword = await passwordService.hash(dto.newPassword);
    await userRepository.updateById(user._id, { password: hashNewPassword });
  }
}
export const authService = new AuthService();
