import type { Post } from "../types/post.type.js";

import pool from "../config/db.js";
import ApiError from "../utils/apiError.js";
import HTTP_CODES from "../constants/httpCodes.js";

interface CreatePostParams {
  content: string;
  media: string[];
  userId: number;
}
export const createPost = async ({
  content,
  media,
  userId,
}: CreatePostParams) => {
  const { rows } = await pool.query<Post>(
    "INSERT INTO posts (content,  media, user_id) VALUES ($1, $2, $3) RETURNING *;",
    [content, media, userId]
  );

  const [post] = rows;
  if (!post)
    throw new ApiError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Failed to create post. Please try again."
    );

  return post;
};

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
