import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  signupHandler,
} from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

// prefix: /auth
authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/refresh", refreshAccessTokenHandler);

// protected routes
authRouter.get("/logout", authorize, logoutHandler);

export default authRouter;
