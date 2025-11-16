import jwt from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
  try {
    const payload = jwt.verify(token, secret) as { userId: string };
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
