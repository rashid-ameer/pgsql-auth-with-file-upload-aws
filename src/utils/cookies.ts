import { type CookieOptions, type Response } from "express";
import env from "../config/env.js";

export const REFRESH_COOKIE_PATH = "/auth/refresh";

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: REFRESH_COOKIE_PATH,
};

export const setAuthCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, authCookieOptions);
  return res;
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", authCookieOptions);
  return res;
};
