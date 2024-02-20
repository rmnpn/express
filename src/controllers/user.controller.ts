import { NextFunction, Request, Response } from "express";

import { UserPresenter } from "../presenters/user.presenter";
import { userService } from "../services/user.service";
import { IQuery } from "../types/pagination.type";
import { ITokenPayload } from "../types/token.type";
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

  public async getAllPaginated(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const usersPaginated = await userService.getMany(req.query as IQuery);
      const presentedUsers = usersPaginated.data.map((user) =>
        UserPresenter.userToResponse(user),
      );
      return res.json({ ...usersPaginated, data: presentedUsers });
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getById(req.params.id);
      return res.json({ data: user });
    } catch (e) {
      next(e);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const user = await userService.getMe(jwtPayload);
      return res.json({ data: UserPresenter.userToResponse(user) });
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
