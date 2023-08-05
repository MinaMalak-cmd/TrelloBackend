
export const validation = (schema) =>{
    return (req, res, next) => {
        const validationResult = schema?.validate(req.body, { abortEarly : false});
        return validationResult.error ? 
                res.json({ message : 'Validation Error', validationResult})
                : next();
    }


}