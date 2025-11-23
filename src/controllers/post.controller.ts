import HTTP_CODES from "../constants/httpCodes.js";
import { getPostById, getPosts } from "../services/post.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { zSerialIdSchema } from "../validations/common.js";

export const getPostByIdHandler = asyncHandler(async (req, res) => {
  // validate a request
  const postId = zSerialIdSchema(
    "Post id is required.",
    "Post id must be a number."
  ).parse(Number(req.params.id));

  // call a service
  const post = await getPostById(postId);

  // send a response back
  res
    .status(HTTP_CODES.OK)
    .json(new ApiResponse("Post fetched successfully.", post));
});

export const getPostsHandler = asyncHandler(async (req, res) => {
  // call a service
  const posts = await getPosts();

  // send a response back
  res
    .status(HTTP_CODES.OK)
    .json(new ApiResponse("Posts fetched successfully.", posts));
});
