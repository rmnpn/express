import { Router } from "express";

import { adminController } from "../controllers/admin.controller";
import { ERole } from "../enums/role.enum";
import { authMiddleware } from "../middlewares/authMiddleware";
import { userMiddleware } from "../middlewares/user.Middleware";

const router = Router();
export const userRouter = router;
router.get(
  "/list",
  authMiddleware.checkAccessToken(ERole.ADMIN),
  userMiddleware.haveAccessByRole(ERole.ADMIN),
  adminController.getAdmins,
);

export const adminRouter = router;
