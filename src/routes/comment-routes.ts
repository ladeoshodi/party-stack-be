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
commentRouter.post(
  "/",
  sanitizeRoute,
  secureRoute,
  commentController.createNewComment
);

export default commentRouter;
