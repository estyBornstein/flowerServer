import joi from "joi";
export const productValidation = joi.object({
    _id: joi.string(),
    name: joi.string().min(2).max(30).required(),
    price: joi.number().positive().required(),
    description: joi.string().min(5).max(100).allow(""),
    pickDate: joi.date().max("now"),
    shelfLife: joi.number().min(1).required(),
    needSun: joi.boolean().required(),
    existColors: joi.array().items(joi.string()).required(),
    isExist: joi.boolean(),
    img:joi.string(),
    __v:joi.string()
})