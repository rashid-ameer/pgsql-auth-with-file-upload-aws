import type { RequestHandler } from "express";
import type { User } from "../types/user.type.js";
import { type AccessTokenPayload } from "../utils/jwt.js";

import ApiError from "../utils/apiError.js";
import HTTP_CODES from "../constants/httpCodes.js";
import env from "../config/env.js";
import verifyToken from "../utils/jwt.js";
import pool from "../config/db.js";
import ERROR_CODES from "../constants/errorCodes.js";

const authorize: RequestHandler = async (req, _, next) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if (!accessToken) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Missing access token.",
      ERROR_CODES.ACCESS_TOKEN_ERROR
    );
  }
  // validate access token
  const { payload, error } = verifyToken<AccessTokenPayload>(
    accessToken,
    env.accessTokenSecret
  );
  if (!payload) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      error,
      ERROR_CODES.ACCESS_TOKEN_ERROR
    );
  }

  // check if the user exists
  const { rows } = await pool.query<User>("SELECT * FROM users WHERE id = $1", [
    payload.userId,
  ]);
  if (rows.length === 0) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "User not found.",
      ERROR_CODES.ACCESS_TOKEN_ERROR
    );
  }

  const user = rows[0] as User;

  req.userId = user.id;
  req.email = user.email;
  next();
};

export default authorize;
