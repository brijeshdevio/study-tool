"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodValidation = void 0;
const zodValidation = (schema, source = "body") => async (req, _, next) => {
    const data = req[source];
    await schema.parseAsync(data);
    next();
};
exports.zodValidation = zodValidation;
