import { Router } from "express";
import commentController from "../controllers/comment-controller";
import sanitizeRoute from "../middleware/sanitizeRoute";
import secureRoute from "../middleware/secureRoute";

const commentRouter = Router();

commentRouter.get("/", secureRoute, commentController.getAllComments);
commentRouter.get(
  "/:commentId",
  secureRoute,
  commentController.getSingleComment
);

export default commentRouter;
