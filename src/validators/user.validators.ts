import joi from "joi";

import { regexConstant } from "../constants/regex.constant";

export class UserValidator {
  private static password = joi.string().regex(regexConstant.PASSWORD).trim();
  private static phone = joi.string().regex(regexConstant.PHONE).trim();
  private static email = joi
    .string()
    .lowercase()
    .regex(regexConstant.EMAIL)
    .trim();
  private static username = joi
    .string()
    .min(3)
    .max(50)
    .trim()
    .messages({ "string.empty": "name can not be empty" });
  private static age = joi.number().min(18).max(100).integer();

  public static create = joi.object({
    email: this.email.required(),
    password: this.password.required(),
    name: this.username.required(),
    age: this.age.required(),
    phone: this.phone.required(),
  });
  public static update = joi.object({
    name: this.username,
    age: this.age,
  });
  public static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });
  public static forgotPassword = joi.object({
    email: this.email.required(),
  });
  public static setForgotPassword = joi.object({
    newPassword: this.password.required(),
  });
  public static changePassword = joi.object({
    oldPassword: this.password.required(),
    newPassword: this.password.required(),
  });
}
