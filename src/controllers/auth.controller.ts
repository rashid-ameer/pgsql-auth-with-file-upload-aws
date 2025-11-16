import ERROR_CODES from "../constants/errorCodes.js";
import HTTP_CODES from "../constants/httpCodes.js";
import { login, refreshAccessToken, signup } from "../services/auth.service.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { clearAuthCookies } from "../utils/cookies.js";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "../validations/auth.validation.js";

export const signupHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = signupValidationSchema.parse(req.body);

  // call a service
  const { user, accessToken, refreshToken } = await signup(request);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/auth/refresh",
  });

  // send response
  res.status(HTTP_CODES.CREATED).json({
    success: true,
    data: { user, accessToken },
    message: "User created successfully.",
  });
});

export const loginHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = loginValidationSchema.parse(req.body);
  // call a service
  const { user, accessToken, refreshToken } = await login(request);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/auth/refresh",
  });

  // send response
  res.status(HTTP_CODES.OK).json({
    success: true,
    data: { user, accessToken },
    message: "User logged in successfully.",
  });
});

export const refreshAccessTokenHandler = asyncHandler(async (req, res) => {
  // validate a request
  const refreshToken: string | undefined = req.cookies["refreshToken"];
  console.log(refreshToken);
  if (!refreshToken) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Missing refresh token.",
      ERROR_CODES.REFRESH_TOKEN_ERROR
    );
  }

  // call a service
  const { accessToken, newRefreshToken } = await refreshAccessToken(
    refreshToken
  );

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/auth/refresh",
  });

  // send a response
  res.status(HTTP_CODES.OK).json({
    success: true,
    data: { accessToken },
    message: "Access token refreshed successfully.",
  });
});
