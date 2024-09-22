import { Router } from "express";
import userRouter from "./user-routes";
import gameRouter from "./game-routes";

const routes = Router();

routes.use("/user", userRouter);
routes.use("/games", gameRouter);

export { routes };
