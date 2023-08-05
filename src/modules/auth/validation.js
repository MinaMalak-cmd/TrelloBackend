import Joi from 'joi';

export const signup = {
    body : 
        Joi.object({
            userName : Joi.string().min(3).max(100).pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}/)).required(),
            email : Joi.string().email({ tlds: { allow: ['com', 'net', 'eg', 'gov', 'edu']} }).required(),
            password : Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
            cPassword : Joi.string().valid(Joi.ref('password')).required(),
            age: Joi.number().integer().positive().min(3).max(90).required(),
            phone : Joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)).required(),
            gender : Joi.string().valid('male', 'female'),
            confirmEmail: Joi.boolean().truthy("1").falsy("0").sensitive(),
            coverImages : Joi.array().items(Joi.string())
        // }).required().options({allowUnknown:true});
        }).required(),
    // params: Joi.object({
    //     flag: Joi.boolean().required()
    // }).required()
}


export const login = Joi.object({
    userName : Joi.string().min(3).max(100).pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}/)),
    email : Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 4 ,tlds: { allow: ['com', 'net', 'eg', 'gov', 'edu']} }),
    phone : Joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)),
    password : Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),

}).required().xor('email', 'userName', 'phone');