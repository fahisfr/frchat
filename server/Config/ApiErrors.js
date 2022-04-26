  class ApiError{
    constructor(statuscode, message){
        this.code = statuscode;
        this.message = message;
    }
    static badRequest(message) {
        return new ApiError(400, message);
    }
    static forbidden(message) {
        return new ApiError(403, message);
    }
    static internalServerError(message) {
        return new ApiError(500, message);
    }

  }

module.exports = ApiError;