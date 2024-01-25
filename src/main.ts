import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/config";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = configs.PORT;
app.listen(PORT, async () => {
  await mongoose.connect(configs.DB_URL);
  console.log("SERVER EBASHE");
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("*", (err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: err.message });
});
