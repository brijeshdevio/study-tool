import { ErrorType, HTTPCode, HTTPStatus } from "../types";

class HttpError<T> extends Error {
  public statusCode: HTTPStatus;
  public code: HTTPCode;
  public details?: T;

  constructor(err: ErrorType<T>) {
    super(err.message);
    this.statusCode = err.statusCode;
    this.code = err.code;
    this.details = err.details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { HttpError };
