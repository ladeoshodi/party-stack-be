import { Router } from "express";
import userRouter from "./user-routes";
import gameRouter from "./game-routes";
import commentRouter from "./comment-routes";
import favouriteRouter from "./favourite-routes";

const routes = Router();

routes.use("/user", userRouter);
routes.use("/games", gameRouter);
routes.use("/comments", commentRouter);
routes.use("/favourites", favouriteRouter);

export { routes };
