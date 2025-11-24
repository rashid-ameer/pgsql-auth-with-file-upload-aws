import z from "zod";
import { zRequiredString, zSerialIdSchema } from "./common.js";

export const createPostRequestSchema = z.object(
  {
    content: zRequiredString("Content"),
    userId: zSerialIdSchema(
      "User id is required.",
      "User id must be a number."
    ),
  },
  {
    error: (iss) =>
      iss.input === undefined
        ? "Request body is required."
        : "Request body must be a valid object.",
  }
);
