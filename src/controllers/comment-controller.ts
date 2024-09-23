import { NextFunction, Request, Response } from "express";
import { Comment } from "../models/comment-model";

const commentController = {
  async getAllComments(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Comment"]
      #swagger.description = "Get all comments"
    */
    try {
      const { game } = req.query;
      const searchQuery = game ? { game } : {};

      const comments = await Comment.find(searchQuery)
        .sort("-createdAt")
        .populate(["author", "game"]);
      res.json(comments);
    } catch (e) {
      next(e);
    }
  },
  async getSingleComment(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Comment"]
      #swagger.description = "Get a single comment"
    */
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId).populate([
        "author",
        "game",
      ]);

      if (!comment) {
        throw { status: 404, message: "Comment not found" };
      }
      res.json(comment);
    } catch (e) {
      if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },
  async createNewComment(req: Request, res: Response, next: NextFunction) {},
  async updateComment(req: Request, res: Response, next: NextFunction) {},
  async deleteComment(req: Request, res: Response, next: NextFunction) {},
};

export default commentController;
