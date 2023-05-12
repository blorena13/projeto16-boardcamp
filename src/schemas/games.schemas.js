import Joi from "joi";

export const gamesSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri(),
    stockTotal: Joi.number().min(1),
    pricePerDay: Joi.number().min(1)
});