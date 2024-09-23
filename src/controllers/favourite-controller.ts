import { NextFunction, Request, Response } from "express";
import { User } from "../models/user-model";

const favouriteController = {
  async addToFavourites(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Favourites"]
      #swagger.description = "Add to User favourites"
    */
    try {
      const incomingFavourites = req.body.favourites;
      const updatedUserFavourites = await User.findByIdAndUpdate(
        req.currentUser,
        {
          $push: { favourites: incomingFavourites },
        },
        { new: true }
      ).populate("favourites");
      res.json(updatedUserFavourites);
    } catch (e) {
      console.log(e);

      if (e instanceof Error) {
        next({ status: 400, message: e.message });
      } else {
        next(e);
      }
    }
  },

  async removeFromFavourites(req: Request, res: Response, next: NextFunction) {
    /* 
      #swagger.tags = ["Favourites"]
      #swagger.description = "Remove from User favourites"
    */
    try {
      const { favouriteId } = req.params;

      await User.updateOne(
        { _id: req.currentUser },
        { $pull: { favourites: favouriteId } }
      );

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

export default favouriteController;
