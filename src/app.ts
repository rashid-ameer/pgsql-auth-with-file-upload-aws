import express from "express";
import cookieParser from "cookie-parser";

import { authRouter } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

// basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// health check route
app.get("/", (_, res) => {
  res.json({ message: "Status is healthy" });
});

// Routes
app.use("/auth", authRouter);

// error handler middleware
app.use(errorHandler);

export default app;
