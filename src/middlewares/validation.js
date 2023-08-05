const dataMethods = ['body', 'params', 'query', 'headers', 'file', 'files'];

export const validation = (JoiSchema) =>{
    return (req, res, next) => {
        const validationErr = [];
        dataMethods.forEach(key => {
            if(JoiSchema[key]){
               const validationResult = JoiSchema[key].validate(req[key], { abortEarly : false});
               if(validationResult.error){
                    validationErr.push(validationResult.error.details)
               }
            }
        });
        if(validationErr.length > 0){
            return res.json({ message : 'Validation Error', validationErr})
        }
        return next();
    }


}