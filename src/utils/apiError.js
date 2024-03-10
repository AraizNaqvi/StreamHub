class apiError extends Error{
    constructor(statusCode, message="Something went wrong", errors = [], statcheck = ""){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (statcheck){
            this.stack = statcheck
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}