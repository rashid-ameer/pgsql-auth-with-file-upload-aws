import { Router } from "express";
import { getCurrentUserPostsHandler } from "../controllers/post.controller.js";

const postsRouter = Router();

// prefix: /posts

postsRouter.get("/current-user", getCurrentUserPostsHandler);

export default postsRouter;
