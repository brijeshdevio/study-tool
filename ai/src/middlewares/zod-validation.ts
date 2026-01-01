import { NextFunction, Response, Request } from "express";
import { Schema } from "zod";

type Source = "body" | "params" | "query";
const zodValidation =
  (schema: Schema, source: Source = "body") =>
  async (req: Request, _: Response, next: NextFunction) => {
    const data = req[source];
    await schema.parseAsync(data);
    next();
  };

export { zodValidation };
