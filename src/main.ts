import express, { NextFunction, Request, Response } from "express";
import fileupload from "express-fileupload";
import * as http from "http";
import * as mongoose from "mongoose";
import { Server } from "socket.io";
import * as swaggerUi from "swagger-ui-express";

import { configs } from "./configs/config";
// import { runAllCronJobs } from "./crons";
import { ApiError } from "./errors/api.error";
import { adminRouter } from "./routers/admin.router";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";
import * as swaggerDocument from "./untils/swagger.json";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  socket.on("click", () => {
    console.log("hoba");

    // socket.emit("peu peu");
    // io.emit("all", "pdish");
    // socket.broadcast.emit("allExceptMe", "VSI PDISH");
  });
  socket.on("room:join", ({ roomID }) => {
    socket.join(roomID);

    socket.to(roomID).emit("room:newUserJoined", socket.id);
  });
  socket.on("message:create", ({ data }) => {
    io.emit("all", data);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());

const PORT = configs.PORT;
server.listen(PORT, async () => {
  await mongoose.connect(configs.DB_URL);
  console.log("SERVER EBASHE");
});

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err?.status || 500).json({
      message: err?.message,
      status: err?.status,
    });
  },
);
// runAllCronJobs();
