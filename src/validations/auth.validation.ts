import * as z from "zod";

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
      return iss === undefined
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
      return iss === undefined
        ? "Request body is required."
        : "Request body must be a valid object.";
    },
  }
);
