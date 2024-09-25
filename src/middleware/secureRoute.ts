import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";
import { JWT_SECRET } from "../config/environment";

export default function secureRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const rawToken = req.get("Authorization");

  if (!rawToken) {
    throw { status: 401, message: "Unauthorized: No token provided" };
  }
  const token = rawToken.replace("Bearer ", "");

  if (!JWT_SECRET) {
    throw {
      status: 500,
      message: "JWT_SECRET is not defined in environment variables",
    };
  }

  // verify token
  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    try {
      if (err || !payload) {
        throw { status: 401, message: "Unauthorized! Invalid JWT" };
      }

      interface JWTPayload {
        userId: string;
      }

      const jwtPayload = payload as JWTPayload;
      const userId = jwtPayload.userId;

      const user = await User.findById(userId).populate({
        path: "favourites",
        populate: { path: "creator" },
      });
      if (!user) {
        throw {
          status: 401,
          message: "User not found. Invalid JWT!",
        };
      }

      // attach currentUser to all secure routes
      req.currentUser = user;

      next();
    } catch (e) {
      next(e);
    }
  });
}
