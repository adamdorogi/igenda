class HttpError extends Error {
  constructor({ message, name, statusCode }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, HttpError);
  }
}

class HttpBadRequestError extends HttpError {
  constructor(message = "Bad Request") {
    super({
      message,
      name: "HttpBadRequestError",
      statusCode: 400,
    });
  }
}

class HttpNotFoundError extends HttpError {
  constructor(message = "Not Found", data) {
    super({
      message,
      name: "HttpNotFoundError",
      statusCode: 404,
    });
  }
}

class HttpInternalServerErrorError extends HttpError {
  constructor(message = "Internal Server Error", data) {
    super({
      message,
      name: "HttpInternalServerErrorError",
      statusCode: 500,
    });
  }
}

module.exports = {
  HttpBadRequestError,
  HttpNotFoundError,
  HttpInternalServerErrorError,
};
