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
  resendApiKey: getEnv("RESEND_API_KEY"),
  frontendUrl: getEnv("FRONTEND_URL"),
  awsRegion: getEnv("AWS_REGION"),
  awsS3Bucket: getEnv("AWS_S3_BUCKET"),
  awsAccessKey: getEnv("AWS_ACCESS_KEY"),
  awsSecretKey: getEnv("AWS_SECRET_KEY"),
};

export default env;
