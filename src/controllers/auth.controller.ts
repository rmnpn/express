import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { ILogin } from "../types/auth.type";
import { ITokenPayload } from "../types/token.type";
import { IUser } from "../types/user.type";

export interface IRegister {
  email: string;
  name: string;
  password: string;
  age: number;
}
class AuthController {
  public async signUpAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as IRegister;
      const createdUser = await authService.signUpAdmin(body);
      return res.json({ data: createdUser });
    } catch (e) {
      next(e);
    }
  }
  public async signInAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ILogin;
      const jwtTokens = await authService.signInAdmin(body);
      return res.json({ data: jwtTokens });
    } catch (e) {
      next(e);
    }
  }

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
  public async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.activateUser(req.params.token);
      return res.json("ok");
    } catch (e) {
      next(e);
    }
  }
  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.res.locals as IUser;
      await authService.forgotPassword(user);
      return res.json("OK");
    } catch (e) {
      next(e);
    }
  }
  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = req.params.token;
      const newPassword = req.body.newPassword;
      await authService.setForgotPassword(newPassword, token);
      return res.json("ok");
    } catch (e) {
      next(e);
    }
  }
}
export const authController = new AuthController();
