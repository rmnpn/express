import { configs } from "../configs/config";
import { IUser } from "../types/user.type";

export class UserPresenter {
  public static userToResponse(user: IUser) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
      isActivate: user.isActivate,
      phone: user.phone,
      createdAt: user.createdAt,
      avatar: user?.avatar ? `${configs.AWS_S3_URL}${user?.avatar}` : null,
    };
  }
}
