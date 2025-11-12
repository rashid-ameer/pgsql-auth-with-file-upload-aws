import HTTP_CODES from "../constants/httpCodes.js";
import { login, signup } from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
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
    path: "/refresh",
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
    path: "/refresh",
  });

  // send response
  res.status(HTTP_CODES.OK).json({
    success: true,
    data: { user, accessToken },
    message: "User logged in successfully.",
  });
});
