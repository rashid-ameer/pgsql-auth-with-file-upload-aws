import { MulterError } from "multer";

import { type ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import ApiError from "../utils/apiError.js";
import HTTP_CODES from "../constants/httpCodes.js";
import { clearAuthCookies } from "../utils/cookies.js";
import { multerErrorMessages } from "../config/multer.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  console.log(`PATH: ${req.path} --- METHOD: ${req.method}`);
  console.log(err);

  // clear refresh cookie, if error happens
  // at path /auth/refresh
  if (req.path === "/auth/refresh") {
    clearAuthCookies(res);
  }

  if (err instanceof ZodError) {
    res.status(HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message: err.issues[0]?.message || "Request body issues.",
    });
    return;
  }

  if (err instanceof MulterError) {
    res
      .status(HTTP_CODES.BAD_REQUEST)
      .json({ success: false, message: multerErrorMessages[err.code] });
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
