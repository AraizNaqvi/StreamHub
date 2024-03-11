// A basic API response that will include the statuscode, data and message and will return it.
class apiResponse{
    constructor(statusCode, data, message="Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        
    }
}

export {apiResponse};