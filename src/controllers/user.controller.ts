import { NextFunction, Request, Response } from "express";

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
  public async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await userService.getByID(id);
      return res.json({ data: user });
    } catch (e) {
      next(e);
    }
  }
  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const deletedUser = await userService.deleteById(+id);
      return res.status(200).send({ data: deletedUser });
    } catch (e) {
      next(e);
    }
  }
  public async editById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const body = req.body as Partial<IUser>;
      const piderUser = await userService.editById(+id, body);
      res.status(200).send({ data: piderUser });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
