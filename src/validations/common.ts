import * as z from "zod";

export const zSerialIdSchema = (requiredError: string, invalidError: string) =>
  z.number({
    error: (iss) => (iss.input === undefined ? requiredError : invalidError),
  });

export const zRequiredString = (key: string) =>
  z.string({
    error: (iss) =>
      iss.input === undefined ? `${key} is required.` : `${key} must be string`,
  });

export const zEmailSchema = z.email({
  error: (iss) => {
    if (iss.input === undefined) return "Email is required.";
    if (iss.code === "invalid_type") return "Email must be string.";
    return "Invalid email.";
  },
});
