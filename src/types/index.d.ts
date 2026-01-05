export type HTTPStatus = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 429 | 500;

export type HTTPCode =
  | "OK"
  | "CREATED"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "TOO_MANY_REQUESTS"
  | "SERVER_ERROR";

export type Message = string;

export interface ErrorType<T> {
  statusCode: HTTPStatus;
  code: HTTPCode;
  message: Message;
  details?: T;
}

