import mongoSanitize from "express-mongo-sanitize";
import { NextFunction, Request, Response } from "express";

export default function sanitizeRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body = mongoSanitize.sanitize(req.body);
  next();
}
