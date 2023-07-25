//For try catch error
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(error =>{
            return next(new Error(error))
        })
    }
}

//failure  response
export const globalErrorHandling = (error, req, res, next) => {
    return res.status(error.cause || 400).json({
        errMsg: error.message,
        stack: error.stack,
        error
    })
}

//Success Response
export const SuccessResponse = (res, data, statusCode) => {
    return res.status(statusCode).json(data)
}