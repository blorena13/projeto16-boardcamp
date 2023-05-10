import { Router } from "express";
import { getCustumers, getCustumersById, postCustumers, newCustumers } from "../controllers/customers.controllers.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustumers);
customersRouter.get("/customers/:id", getCustumersById);
customersRouter.post("/customers", postCustumers);
customersRouter.put("/customers/:id", newCustumers);

export default customersRouter;