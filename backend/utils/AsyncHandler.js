// Express doesn't handle the errors by default
//To avoid the use of repeated try/catch inside every route we use wrapper

//here requestHandler is the async controller function

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch(err => next(err))
    }
}

export { asyncHandler };