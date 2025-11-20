import * as z from "zod";
import { zEmailSchema, zRequiredString, zSerialIdSchema } from "./common.js";

export const signupRequestSchema = z.object(
  {
    username: zRequiredString("Username").min(
      3,
      "Username must be atleast 3 characters."
    ),
    email: zEmailSchema,
    password: zRequiredString("Password").regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,25}$/,
      "Password must be 8-25 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.."
    ),
  },
  {
    error: (iss) => {
      return iss.input === undefined
        ? "Request body is required."
        : "Request body must be a valid object.";
    },
  }
);

export const loginRequestSchema = z.object(
  {
    email: zEmailSchema,
    password: zRequiredString("Password"),
  },
  {
    error: (iss) => {
      return iss.input === undefined
        ? "Request body is required."
        : "Request body must be a valid object.";
    },
  }
);

export const emailVerificationOtpRequestSchema = z.object(
  {
    userId: zSerialIdSchema("User id is required.", "Invalid user id."),
    email: zEmailSchema,
  },
  {
    error: (iss) => {
      return iss.input === undefined
        ? "Request body is required."
        : "Request body must be a valid object.";
    },
  }
);

export const validateEmailVerificationOtpRequestSchema = z.object(
  {
    userId: zSerialIdSchema("User id is required.", "Invalid user id."),
    code: zRequiredString("Otp"),
  },
  {
    error: (iss) => {
      return iss.input === undefined
        ? "Request body is required."
        : "Request body must be a valid object.";
    },
  }
);
