import pool from "../config/db.js";
import HTTP_CODES from "../constants/httpCodes.js";
import type { User } from "../types/user.type.js";
import ApiError from "../utils/apiError.js";
import { hashPassword, validatePassword } from "../utils/password.js";

interface SignupParams {
  username: string;
  email: string;
  password: string;
}

export const signup = async ({ email, password, username }: SignupParams) => {
  const existingUser = await pool.query("SELECT FROM users WHERE email = $1", [
    email,
  ]);

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    throw new ApiError(HTTP_CODES.CREATED, "Email already exists.");
  }

  const hashedPassword = await hashPassword(password);

  const user = await pool.query<Omit<User, "Password">>(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, is_verified, profile_image, created_at, updated_at",
    [username, email, hashedPassword]
  );

  return user.rows[0] as Omit<User, "password">;
};

interface LoginParams {
  email: string;
  password: string;
}
export const login = async ({ email, password }: LoginParams) => {
  const result = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "Incorrect email or password.");
  }

  const user = result.rows[0] as User;

  const isPasswordValid = await validatePassword(user.password, password);

  if (!isPasswordValid) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "Incorrect email or password.");
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
};
