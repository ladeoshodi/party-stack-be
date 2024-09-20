import { Router } from "express";
import userController from "../controllers/user-controller";
import sanitizeRoute from "../middleware/sanitizeRoute";
import secureRoute from "../middleware/secureRoute";

const userRouter = Router();

userRouter.post("/register", sanitizeRoute, userController.register);
userRouter.post("/login", sanitizeRoute, userController.login);
userRouter.get("/", secureRoute, userController.getCurrentUser);
userRouter.put("/", secureRoute, userController.updateCurrentUser);

export default userRouter;
