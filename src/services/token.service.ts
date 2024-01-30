import * as jwt from "jsonwebtoken";

import { configs } from "../configs/config";
import { ApiError } from "../errors/api.error";
export interface ITokenPayload {
  userId: string;
}
export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokenPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: "4h",
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }
  public checkToken(token: string, type: "refresh" | "access"): ITokenPayload {
    try {
      let secret: string;
      switch (type) {
        case "access":
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case "refresh":
          secret = configs.JWT_REFRESH_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid", 401);
    }
  }
}

export const tokenService = new TokenService();
