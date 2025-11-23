import { Router } from "express";

import {
  getPostByIdHandler,
  getPostsHandler,
} from "../controllers/post.controller.js";

const postsRouter = Router();

// prefix: /posts
postsRouter.get("/get/:id", getPostByIdHandler);
postsRouter.get("/get", getPostsHandler);

export default postsRouter;
