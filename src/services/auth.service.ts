import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import HTTP_CODES from "../constants/httpCodes.js";
import type { SafeUser, User } from "../types/user.type.js";
import ApiError from "../utils/apiError.js";
import { hashPassword, validatePassword } from "../utils/password.js";
import env from "../config/env.js";
import verifyToken, { type RefreshTokenPayload } from "../utils/jwt.js";
import ERROR_CODES from "../constants/errorCodes.js";
import { getOtp } from "../utils/common.js";
import resend from "../config/resend.js";

interface SignupParams {
  username: string;
  email: string;
  password: string;
}

export const signup = async ({ email, password, username }: SignupParams) => {
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new ApiError(HTTP_CODES.CREATED, "Email already exists.");
  }

  const hashedPassword = await hashPassword(password);

  const result = await pool.query<SafeUser>(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, is_verified, profile_image, created_at, updated_at",
    [username, email, hashedPassword]
  );

  const user = result.rows[0] as SafeUser;

  const otp = getOtp();

  await pool.query(
    "INSERT INTO email_verifications (code, user_id, expires_at) VALUES ($1, $2, $3) RETURNING id",
    [otp, user.id, new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)]
  );

  resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Verify your email",
    html: `<strong>${otp}</strong>`,
  });

  const accessToken = jwt.sign({ userId: user.id }, env.accessTokenSecret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user.id }, env.refreshTokenSecret, {
    expiresIn: "30d",
  });

  return { user, accessToken, refreshToken };
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

  const accessToken = jwt.sign({ userId: user.id }, env.accessTokenSecret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user.id }, env.refreshTokenSecret, {
    expiresIn: "30d",
  });

  const { password: _, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const { payload, error } = verifyToken<RefreshTokenPayload>(
    refreshToken,
    env.refreshTokenSecret
  );
  if (!payload) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      error,
      ERROR_CODES.REFRESH_TOKEN_ERROR
    );
  }

  const result = await pool.query("SELECT id FROM users WHERE id = $1", [
    payload.userId,
  ]);
  if (result.rows.length === 0) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "User not found",
      ERROR_CODES.REFRESH_TOKEN_ERROR
    );
  }

  const user = result.rows[0] as Pick<User, "id">;

  const accessToken = jwt.sign({ userId: user.id }, env.accessTokenSecret, {
    expiresIn: "15m",
  });
  const newRefreshToken = jwt.sign(
    { userId: user.id },
    env.refreshTokenSecret,
    { expiresIn: "30d" }
  );

  return { accessToken, newRefreshToken };
};
