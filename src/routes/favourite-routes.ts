import { Router } from "express";
import favouriteController from "../controllers/favourite-controller";
import sanitizeRoute from "../middleware/sanitizeRoute";
import secureRoute from "../middleware/secureRoute";

const favouriteRouter = Router();

favouriteRouter.post(
  "/",
  sanitizeRoute,
  secureRoute,
  favouriteController.addToFavourites
);

favouriteRouter.delete(
  "/:favouriteId",
  secureRoute,
  favouriteController.removeFromFavourites
);

export default favouriteRouter
