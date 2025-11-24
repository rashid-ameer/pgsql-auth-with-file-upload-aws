import { S3Client } from "@aws-sdk/client-s3";

import env from "./env.js";

const s3 = new S3Client({
  region: env.awsRegion,
  credentials: {
    accessKeyId: env.awsAccessKey,
    secretAccessKey: env.awsSecretKey,
  },
});

export default s3;
