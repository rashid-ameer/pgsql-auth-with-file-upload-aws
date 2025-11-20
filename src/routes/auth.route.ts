import { Router } from "express";
import {
  getEmailVerificationOtpHandler,
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  requestPasswordResetHandler,
  signupHandler,
  validateEmailVerificationOtpHandler,
} from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

// prefix: /auth
authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/refresh", refreshAccessTokenHandler);
authRouter.post("/request-password-reset", requestPasswordResetHandler)

// protected routes
authRouter.get(
  "/get-email-verification-otp",
  authorize,
  getEmailVerificationOtpHandler
);
authRouter.post(
  "/verify-email",
  authorize,
  validateEmailVerificationOtpHandler
);
authRouter.get("/logout", authorize, logoutHandler);

export default authRouter;
