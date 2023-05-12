import Joi from "joi";

export const customersSchema = Joi.object({
    name: Joi.string().empty().required(),
    phone: Joi.string().min(10).max(11).pattern(/^[0-9]+$/),
    cpf: Joi.string().min(11).max(11).pattern(/^[0-9]+$/),
    birthday: Joi.date().iso()
})