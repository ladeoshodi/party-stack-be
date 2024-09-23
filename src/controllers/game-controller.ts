import { NextFunction, Request, Response } from "express";
import { Game } from "../models/game-model";
import gameRouter from "../routes/game-routes";

const gameController = {
  async getAllGames(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Games"]
      #swagger.description = "Get all games"
    */
    try {
      const games = await Game.find({})
        .sort("title createdAt")
        .populate("creator");
      res.json(games);
    } catch (e) {
      next(e);
    }
  },
  async getSingleGame(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Games"]
      #swagger.description = "Get a single game"
    */
    try {
      const { gameId } = req.params;
      const game = await Game.findById(gameId).populate("creator");

      if (!game) {
        throw { status: 404, message: "Game not found" };
      }
      res.json(game);
    } catch (e) {
      if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },
  async createNewGame(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Games"]
      #swagger.description = "Create a new game"
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/gameSchema"
            }
          }
        }
      }
    */
    try {
      req.body.creator = req.currentUser._id;
      const newGame = await Game.create(req.body);
      res.status(201).json(newGame);
    } catch (e) {
      if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },
  async updateGame(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Games"]
      #swagger.description = "Update a game"
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/gameSchema"
            }
          }
        }
      }
    */
    try {
      const { gameId } = req.params;

      // check if game exists
      const gameToUpdate = await Game.findById(gameId);
      if (!gameToUpdate) {
        throw { status: 404, message: "Task not found" };
      }

      // check if current user owns the game
      if (!req.currentUser._id.equals(gameToUpdate.creator)) {
        throw {
          status: 401,
          message: "User not unauthorized to update this resource",
        };
      }

      // update the game object
      gameToUpdate.set(req.body);
      const updatedGame = await gameToUpdate.save();
      res.json(updatedGame);
    } catch (e) {
      if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },
  async deleteGame() {},
};

export default gameController;
