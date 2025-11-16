import { Router } from "express";
import {
  loginHandler,
  refreshAccessTokenHandler,
  signupHandler,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// prefix: /auth
authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/refresh", refreshAccessTokenHandler);

export default authRouter;
