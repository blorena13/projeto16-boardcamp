import { Router } from "express";
import { getCustumers, getCustumersById, postCustumers, newCustumers } from "../controllers/customers.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customersSchema } from "../schemas/customers.schemas.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustumers);
customersRouter.get("/customers/:id", getCustumersById);
customersRouter.post("/customers", validateSchema(customersSchema), postCustumers);
customersRouter.put("/customers/:id", validateSchema(customersSchema), newCustumers);

export default customersRouter;