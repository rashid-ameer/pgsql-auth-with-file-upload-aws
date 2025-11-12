import { Router } from "express";
import { signupHandler } from "../controllers/auth.controller.js";

const authRouter = Router();

// prefix: /auth
authRouter.post("/signup", signupHandler);


export default authRouter;