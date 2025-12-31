import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ErrorType } from "@/types";
import { HttpError } from "@/utils";
import pino from "pino";

const formateZodError = (issues: ZodError["issues"]) => {
  return issues.map((issue) => {
    return {
      field: issue.path[0],
      message: issue.message,
    };
  });
};

const errorFormat = <T>(res: Response, err: ErrorType<T>) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    error: {
      code: err.code,
      message: err.message,
      details: err.details,
    },
  });
};

const globalError = (
  err: Error | ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    return errorFormat(res, err);
  } else if (err instanceof ZodError) {
    return errorFormat(res, {
      statusCode: 400,
      code: "BAD_REQUEST",
      message: "Invalid Input",
      details: formateZodError(err.issues),
    });
  }
  
  pino().error(err);

  return errorFormat(res, {
    statusCode: 500,
    code: "SERVER_ERROR",
    message: "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.name : undefined,
  });
};

export { globalError };
