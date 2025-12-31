import pool from "../config/db.js";
import HTTP_ERRORS from "../constants/httpErrors.js";
import ApiError from "../utils/apiError.js";
import { hashPassword } from "../utils/password.js";

import type { SafeUser } from "../types/user.type.js";

interface SignupParams {
  username: string;
  email: string;
  password: string;
}

export const signup = async ({ email, password, username }: SignupParams) => {
  const { rowCount } = await pool.query(
    "SELECT 1 FROM users WHERE email = $1",
    [email]
  );

  if (rowCount && rowCount > 0) {
    throw new ApiError(HTTP_ERRORS.CREATED, "Email already exists.");
  }

  const hashedPassword = await hashPassword(password);

  const { rows } = await pool.query<SafeUser>(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, is_verified, profile_image, created_at, updated_at",
    [username, email, hashedPassword]
  );

  const user = rows[0];

  if (!user) {
    throw new ApiError(
      HTTP_ERRORS.INTERNAL_SERVER_ERROR,
      "Error in creating user. Please try again."
    );
  }

  return user;
};
