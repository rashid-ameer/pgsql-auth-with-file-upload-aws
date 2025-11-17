import * as z from "zod";
import { serialIdSchema } from "./common.js";

export const signupValidationSchema = z.object(
  {
    username: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Username is required."
            : "Username must be string",
      })
      .min(3, "Username must be atleast 3 characters."),
    email: z.email({
      error: (iss) => {
        if (iss.input === undefined) return "Email is required.";
        if (iss.code === "invalid_type") return "Email must be string.";
        return "Invalid email.";
      },
    }),
    password: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Password is required."
            : "Password must be string",
      })
      .regex(
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

export const loginValidationSchema = z.object(
  {
    email: z.email({
      error: (iss) => {
        if (iss.input === undefined) return "Email is required.";
        if (iss.code === "invalid_type") return "Email must be string.";
        return "Invalid email.";
      },
    }),
    password: z.string({
      error: (iss) =>
        iss.input === undefined
          ? "Password is required."
          : "Password must be string",
    }),
  },
  {
    error: (iss) => {
      return iss.input === undefined
        ? "Request body is required."
        : "Request body must be a valid object.";
    },
  }
);

export const emailVerificationValidationSchema = z.object(
  {
    userId: serialIdSchema("User id is required.", "Invalid user id."),
    code: z.string({
      error: (iss) =>
        iss.input === undefined ? "Otp is required." : "Otp must be string.",
    }),
  },
  {
    error: (iss) => {
      return iss.input === undefined
        ? "Request body is required."
        : "Request body must be a valid object.";
    },
  }
);
