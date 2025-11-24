import { Router } from "express";

import {
  createPostHandler,
  getPostByIdHandler,
  getPostsHandler,
} from "../controllers/post.controller.js";
import upload from "../middlewares/multer.middleware.js";

const postsRouter = Router();

// prefix: /posts
postsRouter.post("/create", upload.array("media", 10), createPostHandler);
postsRouter.get("/get/:id", getPostByIdHandler);
postsRouter.get("/get", getPostsHandler);

export default postsRouter;
