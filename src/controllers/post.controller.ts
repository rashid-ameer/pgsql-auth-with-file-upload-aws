import asyncHandler from "../utils/asyncHandler.js";

export const getCurrentUserPostsHandler = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, posts: [] });
});
