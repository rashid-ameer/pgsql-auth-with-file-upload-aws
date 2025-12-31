import express from "express";
import cookieParser from "cookie-parser";

import router from "./routes/index.js";

const app = express();

// basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// health check route
app.get("/", (_, res) => {
  res.json({ message: "Status is healthy" });
});

// app router - contains all routes
app.use(router);

export default app;
