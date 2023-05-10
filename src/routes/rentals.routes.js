import { Router } from "express";
import { getRentals, postRentals, finalRentals, deleteRentals } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRentals);
rentalsRouter.post("/rentals/:id/return", finalRentals);
rentalsRouter.delete("/rentals/:id", deleteRentals);

export default rentalsRouter;