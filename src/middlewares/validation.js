// const dataMethods = ['body', 'params', 'query', 'headers', 'file', 'files'];

// export const validation = (JoiSchema) =>{
//     return (req, res, next) => {
//         const validationErr = [];
//         dataMethods.forEach(key => {
//             if(JoiSchema[key]){
//                const validationResult = JoiSchema[key].validate(req[key], { abortEarly : false});
//                if(validationResult.error){
//                     validationErr.push(validationResult.error.details)
//                }
//             }
//         });
//         if(validationErr.length > 0){
//             return res.json({ message : 'Validation Error', validationErr})
//         }
//         return next();
//     }
// }

export const validation = (JoiSchema) =>{
    return (req, res, next) => {
        const allDataFromAllMethods = { ...req.body, ...req.params, ...req.query}
        const validationResult = JoiSchema.validate(allDataFromAllMethods, { abortEarly : false});
        if(validationResult.error){
             return res.json({ message : 'Validation Error', validationErr: validationResult.error.details})
        }
        return next();
    }
}