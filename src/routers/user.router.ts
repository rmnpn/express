import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { ERole } from "../enums/role.enum";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { UserValidator } from "../validators/user.validators";

const router = Router();
export const userRouter = router;
router.get("", userController.getAll);
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

router.get("/:id", commonMiddleware.isIdValid, userController.getById);
