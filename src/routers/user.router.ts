import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commonMiddleware } from "../middlewares/commonMiddleware";

const router = Router();
export const userRouter = router;
router.get("", userController.getAll);
router.get("/me", authMiddleware.checkAccessToken, userController.getMe);
router.put("/me", authMiddleware.checkAccessToken, userController.editMe);
router.delete(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.deleteMeIsValid,
  userController.deleteMe,
);

router.get("/:id", commonMiddleware.isIdValid, userController.getById);
