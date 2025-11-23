import z from "zod";
import { zSerialIdSchema } from "./common.js";

export const getPostByIdRequestSchema = z.object({
  postId: zSerialIdSchema("Post id is required.", "Post id must be a number."),
  userId: zSerialIdSchema("User id is required.", "User id must a number."),
});
