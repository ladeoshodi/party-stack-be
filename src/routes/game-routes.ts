import { Router } from "express";
import gameController from "../controllers/game-controller";
import sanitizeRoute from "../middleware/sanitizeRoute";
import secureRoute from "../middleware/secureRoute";

const gameRouter = Router();

gameRouter.get("/", secureRoute, gameController.getAllGames);
gameRouter.get("/:gameId", secureRoute, gameController.getSingleGame);
gameRouter.post("/", sanitizeRoute, secureRoute, gameController.createNewGame);

export default gameRouter;
