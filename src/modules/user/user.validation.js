import Joi from 'joi';

export const updateUser = {
    params : Joi.object({
        id : Joi.string().required()
    }).required(),

    body : Joi.object({
            userName : Joi.string().min(3).max(100).pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}/)).required(),
            age : Joi.number().integer().positive().min(3).max(90).required(),
            phone : Joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)).required(),
    }).required()
}