// asyncHandler will accept the requestHandler and is a super function that is a function that will execute a function
// If the promise is resolved it shall execute requestHandler else catches error and sends it to the next middleware
// Mostly, apiError
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
    }
}

export {asyncHandler};