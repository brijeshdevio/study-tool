"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    statusCode;
    code;
    details;
    constructor(err) {
        super(err.message);
        this.statusCode = err.statusCode;
        this.code = err.code;
        this.details = err.details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
