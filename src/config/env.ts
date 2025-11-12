function getEnv(key: string): string {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return value;
}

const env = {
  port: getEnv("PORT"),
  nodeEnv: getEnv("NODE_ENV"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
};

export default env;
