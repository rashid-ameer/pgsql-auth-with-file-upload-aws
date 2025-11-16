import { type Response } from "express";

export const REFRESH_COOKIE_PATH = "/auth/refresh";

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    path: REFRESH_COOKIE_PATH,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });
  return res;
};
