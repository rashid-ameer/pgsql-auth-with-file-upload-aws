import { type RequestHandler } from "express";

function asyncHandler(fn: RequestHandler): RequestHandler {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default asyncHandler;
