import { Router } from "express";
import userController from "../controllers/user-controller";
import sanitizeRoute from "../middleware/sanitizeRoute";

const userRouter = Router();

userRouter.post("/register", sanitizeRoute, userController.register);
userRouter.post("/login", sanitizeRoute, userController.login);

export default userRouter;
