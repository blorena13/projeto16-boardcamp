import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gamesSchema } from "../schemas/games.schemas.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames );
gamesRouter.post("/games", validateSchema(gamesSchema), postGames);

export default gamesRouter;