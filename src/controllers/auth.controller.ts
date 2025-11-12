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
  const user = await signup(request);

  // send response
  res.json({
    success: true,
    data: user,
    message: "User created successfully.",
  });
});

export const loginHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = loginValidationSchema.parse(req.body);
  // call a service
  const user = await login(request);

  // send response
  res.json({
    success: true,
    data: user,
    message: "User logged in successfully.",
  });
});
