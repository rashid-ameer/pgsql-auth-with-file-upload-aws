import jwt from "jsonwebtoken";

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

const verifyToken = <T>(token: string, secret: string) => {
  try {
    const payload = jwt.verify(token, secret) as T;
    return { payload };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { error: "Token expired." };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { error: "Invalid token." };
    }

    return { error: "Token verification failed." };
  }
};

export default verifyToken;
