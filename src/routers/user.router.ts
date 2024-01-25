import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/commonMiddleware";

const router = Router();
export const userRouter = router;

router.get("", userController.getAll);
router.get("/:id", commonMiddleware.isIdValid, userController.getByID);

router.put("/:id", commonMiddleware.editByIdIsValid, userController.editById);

router.delete(
  "/:id",
  commonMiddleware.deleteByIdIsValid,
  userController.deleteById,
);
