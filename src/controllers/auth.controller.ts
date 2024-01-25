import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { IUser } from "../types/user.type";

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Partial<IUser>;
      const user = await authService.signUp(body);
      return res.json({ data: user });
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
