class ApiError extends Error {
  constructor(statusCode,message) {
    super(message);
    this.statusCode = statusCode;
  }
  static badRequest() {
    return new ApiError(400, "Bad Request");
  }
  static unauthorized() {
    return new ApiError(401, "unauthorized");
  }
  static forbidden() {
    return new ApiError(403, "forbidden");
  }
  static internalServerError() {
    return new ApiError(500, "Oops! Something went wrong");
  }

}

module.exports = ApiError;