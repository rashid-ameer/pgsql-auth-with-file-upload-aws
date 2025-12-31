import { Router } from "express";

import authRouter from "./auth.route.js";

// router instance
const router = Router();

// routes
router.use("/auth", authRouter);

// router export
export default router;
