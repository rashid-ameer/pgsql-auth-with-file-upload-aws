import { unlink, createReadStream } from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import s3 from "../config/s3.js";
import HTTP_CODES from "../constants/httpCodes.js";
import { createPost, getPostById, getPosts } from "../services/post.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { zSerialIdSchema } from "../validations/common.js";
import { createPostRequestSchema } from "../validations/post.validation.js";
import env from "../config/env.js";
import ApiError from "../utils/apiError.js";

export const createPostHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = createPostRequestSchema.parse({
    userId: req.userId,
    ...req.body,
  });

  const files = req.files as Express.Multer.File[];
  const mediaKeys = files.map((path) => path.filename);

  try {
    await Promise.all(
      files.map(async (file) => {
        const command = new PutObjectCommand({
          Bucket: env.awsS3Bucket,
          Key: file.filename,
          Body: createReadStream(file.path),
        });
        return await s3.send(command);
      })
    );
  } catch (error) {
    throw new ApiError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Failed to upload files to aws. Please try again."
    );
  } finally {
    files.forEach((file) => {
      unlink(file.path, (unlinkError) => {
        console.log("Failed to delete file.", file.path, unlinkError);
      });
    });
  }

  // call a service
  const post = await createPost({ ...request, media: mediaKeys });

  // send a response back
  res.status(200).json(new ApiResponse("Post created successfully.", post));
});

export const getPostByIdHandler = asyncHandler(async (req, res) => {
  // validate a request
  const postId = zSerialIdSchema(
    "Post id is required.",
    "Post id must be a number."
  ).parse(Number(req.params.id));

  // call a service
  const post = await getPostById(postId);

  const media = await Promise.all(
    post.media.map(async (mediaKey) => {
      const command = new GetObjectCommand({
        Bucket: env.awsS3Bucket,
        Key: mediaKey,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return url;
    })
  );
  post.media = media;

  // send a response back
  res
    .status(HTTP_CODES.OK)
    .json(new ApiResponse("Post fetched successfully.", post));
});

export const getPostsHandler = asyncHandler(async (req, res) => {
  // call a service
  const posts = await getPosts();

  const updatedPosts = await Promise.all(
    posts.map(async (post) => {
      const media = await Promise.all(
        post.media.map(async (mediaKey) => {
          const command = new GetObjectCommand({
            Bucket: env.awsS3Bucket,
            Key: mediaKey,
          });
          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
          return url;
        })
      );
      post.media = media;
      return post;
    })
  );

  // send a response back
  res
    .status(HTTP_CODES.OK)
    .json(new ApiResponse("Posts fetched successfully.", updatedPosts));
});
