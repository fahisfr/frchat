class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
  static badRequest(message) {
    return new ApiError(400, "Bad Request");
  }
  static Unauthorized(message) {
    return new ApiError(401, "you are not authorized");
  }
  static Forbidden(message) {
    return new ApiError(403, "forbidden");
  }
  static internalServerError(message) {
    return new ApiError(500, "Oops! Something went wrong");
  }

}

module.exports = ApiError;