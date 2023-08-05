
export const validation = (joiSchema) =>{
    return (req, res, next) => {
        const validationResult = joiSchema.validate(req.body, { abortEarly : false});
        if(validationResult.error){
            return res.json({ message : 'Validation Error', validationResult: validationResult.error.details})
        }
        return next();
    }


}