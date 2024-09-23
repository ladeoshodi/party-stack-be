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
  async getSingleComment(req: Request, res: Response, next: NextFunction) {},
  async createNewComment(req: Request, res: Response, next: NextFunction) {},
  async updateComment(req: Request, res: Response, next: NextFunction) {},
  async deleteComment(req: Request, res: Response, next: NextFunction) {},
};

export default commentController;
