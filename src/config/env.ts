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
  databaseUrl: getEnv("DATABASE_URL"),
  accessTokenSecret: getEnv("ACCESS_TOKEN_SECRET"),
  refreshTokenSecret: getEnv("REFRESH_TOKEN_SECRET"),
};

export default env;
