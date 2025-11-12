import { hash, verify } from "argon2";

export const hashPassword = async (password: string) => {
  return hash(password);
};

export const validatePassword = async (
  hashedPassword: string,
  password: string
) => {
  return verify(hashedPassword, password);
};
