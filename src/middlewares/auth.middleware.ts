import type { RequestHandler } from "express";

import ApiError from "../utils/apiError.js";
import HTTP_CODES from "../constants/httpCodes.js";
import env from "../config/env.js";
import verifyToken from "../utils/jwt.js";

const authorize: RequestHandler = (req, _, next) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if (!accessToken) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, "Missing access token.");
  }

  const { payload, error } = verifyToken(accessToken, env.accessTokenSecret);
  if (!payload) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, error);
  }

  req.userId = payload.userId;
  next();
};

export default authorize;
