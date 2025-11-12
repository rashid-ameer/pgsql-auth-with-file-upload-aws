import { Router } from "express";
import { loginHandler, signupHandler } from "../controllers/auth.controller.js";

const authRouter = Router();

// prefix: /auth
authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);


export default authRouter;