import pool from "../config/db.js";
import HTTP_ERRORS from "../constants/httpErrors.js";
import type { User } from "../types/user.type.js";
import ApiError from "../utils/apiError.js";
import { hashPassword } from "../utils/password.js";

interface SignupParams {
  username: string;
  email: string;
  password: string;
}

export const signup = async ({ email, password, username }: SignupParams) => {
  const existingUser = await pool.query<User>(
    "SELECT 1 FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    throw new ApiError(HTTP_ERRORS.CREATED, "Email already exists.");
  }

  const hashedPassword = await hashPassword(password)

  const user = await pool.query<User>(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, is_verified, profile_image, created_at, updated_at",
    [username, email, hashedPassword]
  );

  return user.rows[0];
};
