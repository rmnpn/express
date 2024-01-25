import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api.error";

class CommonMiddleware {
  public isIdValid(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!isObjectIdOrHexString(id)) {
        throw new ApiError("Hueve ID", 14);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  public isNewUserValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, age } = req.body; //* замість user дестр. для перевікри на валідність
      if (!age || !Number.isInteger(age) || age < 0 || age > 100) {
        throw new Error("oi, ne pyzdy");
      }
      if (!email || !email.includes("@")) {
        throw new Error("oi, ne nayobui");
      }
      if (!name || name.length < 3) {
        throw new Error("oi, sibes");
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  public deleteByIdIsValid(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!Number.isInteger(+id)) {
        throw new Error("Hueve ID");
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  public editByIdIsValid(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!Number.isInteger(+id)) {
        throw new Error("Hueve ID");
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
