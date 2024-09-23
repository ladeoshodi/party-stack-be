import { NextFunction, Request, Response } from "express";
import { Comment } from "../models/comment-model";

const commentController = {
  async getAllComments(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Comments"]
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
      #swagger.tags = ["Comments"]
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
  async createNewComment(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Comments"]
      #swagger.description = "Create a new comment"
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/commentSchema"
            },
            example: {
              text: "This is a comment for a game",
              game: "Ref to a game"
            }
          }
        }
      }
    */
    try {
      req.body.author = req.currentUser._id;
      const newComment = await Comment.create(req.body);
      res.status(201).json(newComment);
    } catch (e) {
      if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },
  async updateComment(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Comments"]
      #swagger.description = "Update a comment"
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/commentSchema"
            }
          }
        }
      }
    */
    try {
      const { commentId } = req.params;

      // check if the comment exists
      const commentToUpdate = await Comment.findById(commentId);
      if (!commentToUpdate) {
        throw { status: 404, message: "Comment not found" };
      }

      // check if current user owns the comment
      if (!req.currentUser._id.equals(commentToUpdate.author)) {
        throw {
          status: 401,
          message: "User not unauthorized to update this resource",
        };
      }

      // check if author or game field is in request
      if (
        Object.keys(req.body).includes("author") ||
        Object.keys(req.body).includes("game")
      ) {
        throw {
          status: 400,
          message: "Not allowed to update the author or game of a comment",
        };
      }
      // update the comment
      commentToUpdate.set(req.body);
      const updatedComment = await commentToUpdate.save();
      res.json(updatedComment);
    } catch (e) {
      if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },
  async deleteComment(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Comments"]
      #swagger.description = "Delete a comment"
    */
    try {
      const { commentId } = req.params;

      // check if the comment exists
      const commentToDelete = await Comment.findById(commentId);
      if (!commentToDelete) {
        throw { status: 404, message: "Comment not found" };
      }

      // check if current user owns the comment
      if (!req.currentUser._id.equals(commentToDelete.author)) {
        throw {
          status: 401,
          message: "User not unauthorized to delete this resource",
        };
      }

      // delete the comment
      await commentToDelete.deleteOne();
      res.status(204).end();
    } catch (e) {
      if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },
};

export default commentController;
