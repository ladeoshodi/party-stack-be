import { Router } from "express";
import userRouter from "./user-routes";
import gameRouter from "./game-routes";
import commentRouter from "./comment-routes";

const routes = Router();

routes.use("/user", userRouter);
routes.use("/games", gameRouter);
routes.use("/comments", commentRouter);

export { routes };
