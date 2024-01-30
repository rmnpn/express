import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();
export const authRouter = router;

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);
