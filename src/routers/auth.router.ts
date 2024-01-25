import { Router } from "express";

import { authController } from "../controllers/auth.controller";
const router = Router();
export const authRouter = router;

router.post("/sign-up", authController.signUp);
