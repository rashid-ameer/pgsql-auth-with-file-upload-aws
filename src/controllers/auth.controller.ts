import pool from "../config/db.js";
import { signup } from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { signupValidationSchema } from "../validations/auth.validation.js";

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
