// A class apiError that extends from the built in Error class will be used to issue any error handling relating to API's
class apiError extends Error{
    constructor(statusCode, message="Something went wrong", errors = [], customStackTrace = ""){
        super(message);                         // Leverage the Error class with custom message
        this.statusCode = statusCode;           // statusCode refers to the success or failure status
        this.data = null;                       
        this.message = message;                 // message is initialized to the passed message
        this.success = false;                   // success status is false since its used to handle errors in the first place
        this.errors = errors;                   // errors is set to set errors


        // If a custom stacktrace is present we would simply set the stack to it. Else, set this i.e. this error class to the
        // stacktrace of the current constructor.
        if (customStackTrace){
            this.stack = customStackTrace
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {apiError};