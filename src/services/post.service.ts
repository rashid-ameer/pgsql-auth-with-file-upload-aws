import type { Post } from "../types/post.type.js";

import pool from "../config/db.js";
import ApiError from "../utils/apiError.js";
import HTTP_CODES from "../constants/httpCodes.js";

export const getPostById = async (postId: number) => {
  const { rows } = await pool.query<Post>(
    "SELECT * FROM posts WHERE id = $1;",
    [postId]
  );

  const [post] = rows;
  if (!post) throw new ApiError(HTTP_CODES.NOT_FOUND, "Post not found.");

  return post;
};

export const getPosts = async () => {
  const { rows } = await pool.query<Post>("SELECT * FROM posts;");
  return rows;
};
