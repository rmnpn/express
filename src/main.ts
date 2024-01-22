import express, { NextFunction, Request, Response } from "express";

import { userRouter } from "./routers/user.router";
import {configs} from "@typescript-eslint/eslint-plugin";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = configs.PORT;
app.listen(PORT, () => {
  console.log("SERVER EBASHE");
});

app.use("/users", userRouter);
app.use("*", (err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: err.message });
});
