import { NextFunction, Request, Response } from "express";
import { Game } from "../models/game-model";

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
  async getSingleGame() {},
  async createNewGame() {},
  async updateGame() {},
  async deleteGame() {},
};

export default gameController;
