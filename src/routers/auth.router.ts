import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ERole } from "../enums/role.enum";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { userMiddleware } from "../middlewares/user.Middleware";
import { UserValidator } from "../validators/user.validators";

const router = Router();
export const authRouter = router;

router.post(
  "/admin/sign-up",
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.signUpAdmin,
);
router.post(
  "/admin/sign-in",
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.signInAdmin,
);
router.post(
  "/sign-up",
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.signUp,
);
router.post(
  "/sign-in",
  commonMiddleware.isBodyValid(UserValidator.login),
  userMiddleware.isUserActivated("email"),
  authController.signIn,
);
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken(ERole.USER),
  authController.refresh,
);

router.post(
  "/forgot-password",
  commonMiddleware.isBodyValid(UserValidator.forgotPassword),
  userMiddleware.isUserExist("email"),
  authController.forgotPassword,
);
router.put(
  "/forgot-password/:token",
  commonMiddleware.isBodyValid(UserValidator.setForgotPassword),
  authController.setForgotPassword,
);
router.put("/activate/:token", authController.activateUser);

router.post(
  "/change-password",
  commonMiddleware.isBodyValid(UserValidator.changePassword),
  authMiddleware.checkAccessToken(ERole.USER),
  authController.changePassword,
);
