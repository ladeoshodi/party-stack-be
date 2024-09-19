import { NextFunction, Request, Response } from "express";
import { User } from "../models/user-model";

const userController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.password !== req.body.passwordConfirmation) {
        throw new Error(
          "Password mismatched, please check password and try again"
        );
      }
      const newUser = await User.create(req.body);
      res.status(201).json({
        message: `Registration successful - Username: ${newUser.username}`,
      });
    } catch (e) {
      if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },
};

export default userController;
