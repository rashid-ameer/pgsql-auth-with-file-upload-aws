import * as z from "zod";

export const serialIdSchema = (requiredError: string, invalidError: string) =>
  z.number({
    error: (iss) => (iss.input === undefined ? requiredError : invalidError),
  });
