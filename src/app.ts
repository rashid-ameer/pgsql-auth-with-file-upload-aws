import express from "express";
import cookieParser from "cookie-parser";

import { authRouter, postsRouter } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import authorize from "./middlewares/auth.middleware.js";

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

// protected routes
app.use(authorize);

app.use("/posts", postsRouter);

// error handler middleware
app.use(errorHandler);

export default app;
