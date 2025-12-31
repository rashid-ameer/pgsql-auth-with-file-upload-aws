import HTTP_CODES from "../constants/httpCodes.js";
import { signup } from "../services/auth.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { signupValidationSchema } from "../validations/auth.validation.js";

export const signupHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = signupValidationSchema.parse(req.body);

  // call a service
  const user = await signup(request);

  // send response
  res
    .status(HTTP_CODES.CREATED)
    .json(new ApiResponse("User created successfully.", user));
});
