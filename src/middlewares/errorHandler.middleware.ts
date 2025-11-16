import { type ErrorRequestHandler } from "express";
import ApiError from "../utils/apiError.js";
import HTTP_CODES from "../constants/httpCodes.js";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  console.log(`PATH: ${req.path} --- METHOD: ${req.method}`);
  console.log(err);

  if (err instanceof ZodError) {
    res.status(HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message: err.issues[0]?.message || "Request body issues.",
    });
    return;
  }

  if (err instanceof ApiError) {
    res
      .status(err.status)
      .json({ success: false, message: err.message, errorCode: err.errorCode });
    return;
  }

  res
    .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: "Internal Server Error." });
};
