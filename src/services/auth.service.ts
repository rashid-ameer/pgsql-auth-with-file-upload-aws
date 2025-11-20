import crypto from "crypto";
import jwt from "jsonwebtoken";

import type { SafeUser, User } from "../types/user.type.js";
import { type RefreshTokenPayload } from "../utils/jwt.js";
import type { PasswordVerification } from "../types/passwordVerification.type.js";

import pool from "../config/db.js";
import HTTP_CODES from "../constants/httpCodes.js";
import ApiError from "../utils/apiError.js";
import { hashPassword, validatePassword } from "../utils/password.js";
import env from "../config/env.js";
import verifyToken from "../utils/jwt.js";
import ERROR_CODES from "../constants/errorCodes.js";
import { getOtp } from "../utils/common.js";
import sendEmail from "../utils/email.js";

interface SignupParams {
  username: string;
  email: string;
  password: string;
}

export const signup = async ({ email, password, username }: SignupParams) => {
  const { rows: existingUsers } = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUsers.length > 0) {
    throw new ApiError(HTTP_CODES.CREATED, "Email already exists.");
  }

  const hashedPassword = await hashPassword(password);

  const { rows } = await pool.query<SafeUser>(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, is_verified, profile_image, created_at, updated_at",
    [username, email, hashedPassword]
  );
  const [user] = rows;
  if (!user)
    throw new ApiError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Internal server error."
    );
  const otp = getOtp();

  await pool.query(
    `INSERT INTO email_verifications (code, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 minutes') RETURNING id`,
    [otp, user.id]
  );

  await sendEmail(user.email, "Verify Your Email", `<strong>${otp}</strong>`);

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
  const { rows } = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (rows.length === 0) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "Incorrect email or password.");
  }

  const [user] = rows;
  if (!user) throw new ApiError(HTTP_CODES.INTERNAL_SERVER_ERROR,"Internal server error.")
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

  const { rows } = await pool.query<Pick<User, "id">>(
    "SELECT id FROM users WHERE id = $1",
    [payload.userId]
  );
  const [user] = rows;
  if (!user) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "User not found",
      ERROR_CODES.REFRESH_TOKEN_ERROR
    );
  }

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

interface EmailVerificationOtpParams {
  userId: number;
  email: string;
}
export const getEmailVerificationOtp = async ({
  userId,
  email,
}: EmailVerificationOtpParams) => {
  await pool.query("DELETE FROM email_verifications WHERE user_id = $1;", [
    userId,
  ]);

  const otp = getOtp();

  await pool.query(
    `INSERT INTO email_verifications (code, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 minutes') RETURNING id`,
    [otp, userId]
  );

  const { error } = await sendEmail(
    email,
    "Verify Your Email",
    `<strong>${otp}</strong>`
  );
  if (error) {
    throw new ApiError(
      HTTP_CODES.SERVICE_UNAVAILABLE,
      "Failed to send email. Please try again."
    );
  }
};

interface ValidateEmailVerificationOtpParams {
  userId: number;
  code: string;
}

export const validateEmailVerificationOtp = async ({
  userId,
  code,
}: ValidateEmailVerificationOtpParams) => {
  const { rows: vRows } = await pool.query(
    "SELECT id FROM email_verifications WHERE user_id = $1 AND code = $2 AND expires_at > NOW()",
    [userId, code]
  );

  if (vRows.length === 0) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, "Invalid or expired OTP.");
  }

  const { rows: uRows } = await pool.query<SafeUser>(
    "UPDATE users SET is_verified = true WHERE id = $1 RETURNING id, username, email, is_verified, profile_image, created_at, updated_at;",
    [userId]
  );

  const user = uRows[0] as SafeUser;
  await pool.query("DELETE FROM email_verifications WHERE user_id = $1", [
    user.id,
  ]);

  return user;
};

export const requestPasswordReset = async (email: string) => {
  const { rows: uRows } = await pool.query<Pick<User, "id">>(
    "SELECT id FROM users WHERE email = $1;",
    [email]
  );

  const user = uRows[0];
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  await pool.query("DELETE FROM password_verifications WHERE user_id = $1;", [
    user.id,
  ]);

  const { rows: pvRows } = await pool.query<
    Pick<PasswordVerification, "expires_at">
  >(
    "INSERT INTO password_verifications (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 minutes') RETURNING expires_at;",
    [hashedToken, user.id]
  );

  const [passwordVerification] = pvRows;
  if (!passwordVerification)
    throw new ApiError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Internal server error."
    );

  const url = `${
    env.frontendUrl
  }?token=${token}&exp=${passwordVerification.expires_at.getTime()}`;
  const { error } = await sendEmail(
    email,
    "Reset Password Link",
    `<strong>${url}</strong>`
  );

  if (error) {
    throw new ApiError(
      HTTP_CODES.SERVICE_UNAVAILABLE,
      "Failed to send email. Please try again."
    );
  }
};

interface ResetPasswordParams {
  password: string;
  token: string;
}
export const resetPassword = async ({
  password,
  token,
}: ResetPasswordParams) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const { rows } = await pool.query<
    Pick<PasswordVerification, "id" | "user_id">
  >(
    "SELECT id, user_id FROM password_verifications WHERE token = $1 AND expires_at > NOW();",
    [hashedToken]
  );
  const passwordVerification = rows[0];

  if (!passwordVerification)
    throw new ApiError(HTTP_CODES.BAD_REQUEST, "Invalid or expired token.");

  const hashedPassword = await hashPassword(password);
  await pool.query("UPDATE users SET password = $1 WHERE id = $2;", [
    hashedPassword,
    passwordVerification.user_id,
  ]);

  await pool.query("DELETE FROM password_verifications WHERE user_id = $1;", [
    passwordVerification.user_id,
  ]);
};
