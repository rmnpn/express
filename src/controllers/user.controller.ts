import { NextFunction, Request, Response } from "express";

import { ITokenPayload } from "../services/token.service";
import { userService } from "../services/user.service";
import { IUser } from "../types/user.type";

class UserController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.getAll();
      res.status(200).send(data);
    } catch (e) {
      next(e);
    }
  }
  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await userService.getById(id);
      return res.json({ data: user });
    } catch (e) {
      next(e);
    }
  }
  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const user = await userService.getMe(jwtPayload);
      return res.json({ data: user });
    } catch (e) {
      next(e);
    }
  }
  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const deletedUser = await userService.deleteMe(jwtPayload);
      return res.status(200).send({ data: deletedUser });
    } catch (e) {
      next(e);
    }
  }
  public async editMe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;

      const body = req.body as Partial<IUser>;
      const piderUser = await userService.editMe(jwtPayload, +id, body);
      res.status(200).send({ data: piderUser });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
