import "dotenv/config.js";
import { initApi } from "./api";
import { initBot } from "./bot";
import { spawnBigChunkus } from "./bigChungus";

(async () => {
  spawnBigChunkus();
  await Promise.all([initBot(), initApi()]);
})();
