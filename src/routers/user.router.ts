import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { ERole } from "../enums/role.enum";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { fileMiddleware } from "../middlewares/file.middleware";
import { UserValidator } from "../validators/user.validators";

const router = Router();
export const userRouter = router;
router.get("", userController.getAllPaginated);
router.get(
  "/me",
  authMiddleware.checkAccessToken(ERole.USER),
  userController.getMe,
);
router.put(
  "/me",
  commonMiddleware.isBodyValid(UserValidator.update),
  authMiddleware.checkAccessToken(ERole.USER),
  userController.editMe,
);
router.delete(
  "/me",
  authMiddleware.checkAccessToken(ERole.USER),
  userController.deleteMe,
);
router.post(
  "/me/avatar",
  authMiddleware.checkAccessToken(ERole.USER),
  fileMiddleware.isAvatarValid,
  userController.uploadAvatar,
);

router.delete(
  "/me/avatar",
  authMiddleware.checkAccessToken(ERole.USER),
  userController.deleteAvatar,
);

router.get("/:id", commonMiddleware.isIdValid, userController.getById);
