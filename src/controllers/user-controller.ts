import { NextFunction, Request, Response } from "express";
import { User, validatePassword } from "../models/user-model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environment";

const userController = {
  async register(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["User"]
      #swagger.description = "Register a new user"
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/userSchema"
            },
            example: {
              username: "swaggeruser",
              email: "swaggeruser@example.com",
              password: "#Passw0rd",
              passwordConfirmation: "#Passw0rd"
            }
          }
        }
      }
    */
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
    } catch (e: any) {
      if (e.code === 11000 || e.codeName === "DuplicateKey") {
        next({
          status: 400,
          message: "Duplicate Error: username/email already exists",
        });
      } else if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["User"]
      #swagger.description = "Login a user"
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/userSchema"
            },
            example: {
              email: "swaggeruser@example.com",
              password: "#Passw0rd"
            }
          }
        }
      }
    */
    try {
      const incomingEmail: string = req.body.email;
      const incomingPassword: string = req.body.password;

      // check if user exists
      const foundUser = await User.findOne({ email: incomingEmail }).select(
        "+password"
      );

      if (!foundUser) {
        throw {
          status: 404,
          message: `Login failed. User email: "${incomingEmail}" not found`,
        };
      }

      // verify password
      const isValidPw = validatePassword(incomingPassword, foundUser.password);
      if (isValidPw) {
        // issue unique jwt for the user
        if (!JWT_SECRET) {
          throw {
            status: 500,
            message: "JWT_SECRET is not defined in environment variables",
          };
        }

        // issue a token
        const token = jwt.sign(
          { userId: foundUser._id, email: foundUser.email },
          JWT_SECRET,
          { expiresIn: "14d" }
        );

        res.json({
          message: `Login successful, welcome ${foundUser.username}`,
          token: token,
        });
      } else {
        throw {
          status: 401,
          message: `Login failed. Wrong password/username`,
        };
      }
    } catch (e) {
      if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["User"]
      #swagger.description = "Get current user"
    */
    try {
      res.json(req.currentUser);
    } catch (e) {
      next(e);
    }
  },
  async updateCurrentUser(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["User"]
      #swagger.description = "Update current user"
      #swagger.requestBody = {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/userSchema"
            },
            example: {
              username: "updatedswaggeruser",
              email: "updatedswaggeruser@example.com",
              password: "#Ch@ngePassw0rd",
            }
          }
        }
      }
    */
    try {
      const currentUser = await User.findById(req.currentUser).select(
        "+password"
      );

      if (!currentUser) {
        throw {
          status: 404,
          message: "User not found",
        };
      }

      currentUser.set(req.body);
      await currentUser.save();

      // query the current user to return the user object with the password hidden
      const updatedUser = await User.findById(currentUser);

      res.json(updatedUser);
    } catch (e: any) {
      if (e.code === 11000 || e.codeName === "DuplicateKey") {
        next({
          status: 400,
          message: "Duplicate Error: username/email already exists",
        });
      } else if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },
  async deleteCurrentUser(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["User"]
      #swagger.description = "Delete current user"
    */
    try {
      await req.currentUser.deleteOne();
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

export default userController;
