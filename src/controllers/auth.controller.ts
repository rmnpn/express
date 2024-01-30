import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { ITokenPayload } from "../services/token.service";
import { ILogin } from "../types/auth.type";

export interface IRegister {
  email: string;
  name: string;
  password: string;
  age: number;
}
class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as IRegister;
      const createdUser = await authService.signUp(body);
      return res.json({ data: createdUser });
    } catch (e) {
      next(e);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ILogin;
      const jwtTokens = await authService.signIn(body);
      return res.json({ data: jwtTokens });
    } catch (e) {
      next(e);
    }
  }
  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const refreshToken = req.res.locals.refreshToken as ITokenPayload;
      return res.json({ jwtPayload, refreshToken });
    } catch (e) {
      next(e);
    }
  }
}
export const authController = new AuthController();
