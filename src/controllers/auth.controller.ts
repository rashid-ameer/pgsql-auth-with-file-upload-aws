import ERROR_CODES from "../constants/errorCodes.js";
import HTTP_CODES from "../constants/httpCodes.js";
import {
  getEmailVerificationOtp,
  login,
  refreshAccessToken,
  signup,
  validateEmailVerificationOtp,
} from "../services/auth.service.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { clearAuthCookies, setAuthCookie } from "../utils/cookies.js";
import {
  emailVerificationOtpRequestSchema,
  loginRequestSchema,
  signupRequestSchema,
  validateEmailVerificationOtpRequestSchema,
} from "../validations/auth.validation.js";

export const signupHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = signupRequestSchema.parse(req.body);

  // call a service
  const { user, accessToken, refreshToken } = await signup(request);

  // send response
  setAuthCookie(res, refreshToken).status(HTTP_CODES.CREATED).json({
    success: true,
    data: { user, accessToken },
    message: "User created successfully.",
  });
});

export const loginHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = loginRequestSchema.parse(req.body);
  // call a service
  const { user, accessToken, refreshToken } = await login(request);

  // send response
  setAuthCookie(res, refreshToken).status(HTTP_CODES.OK).json({
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

  // send a response
  setAuthCookie(res, newRefreshToken).status(HTTP_CODES.OK).json({
    success: true,
    data: { accessToken },
    message: "Access token refreshed successfully.",
  });
});

export const logoutHandler = asyncHandler(async (_, res) => {
  // clear cookies and send a success response
  clearAuthCookies(res)
    .status(HTTP_CODES.OK)
    .json({ success: true, message: "User logout successfully." });
});

export const getEmailVerificationOtpHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = emailVerificationOtpRequestSchema.parse({
    userId: req.userId,
    email: req.email,
  });

  // call a service
  await getEmailVerificationOtp(request);

  // return a success response
  res
    .status(HTTP_CODES.OK)
    .json({ success: true, message: "Otp send successfully on email." });
});

export const validateEmailVerificationOtpHandler = asyncHandler(
  async (req, res) => {
    // validate a request
    const request = validateEmailVerificationOtpRequestSchema.parse({
      userId: req.userId,
      ...req.body,
    });

    // call a service
    const user = await validateEmailVerificationOtp(request);

    // send a respnose
    res.status(HTTP_CODES.OK).json({
      success: true,
      data: user,
      message: "User verified successfully.",
    });
  }
);
