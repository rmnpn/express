import { IUser } from "../types/user.type";

export class UserPresenter {
  public static userToResponse(user: IUser) {
    return {
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
      isActivate: user.isActivate,
      createdAt: user.createdAt,
    };
  }
}
