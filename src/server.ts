import "dotenv/config";
import app from "./app.js";
import env from "./config/env.js";

app.listen(env.port, () => {
  console.log(
    `🚀 Server is listeneing on port ${env.port} in ${env.nodeEnv} environment`
  );
});