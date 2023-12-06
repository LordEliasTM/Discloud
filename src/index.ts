import "dotenv/config.js";
import { initApi } from "./api";
import { initBot } from "./bot";
import { spawnBigChunkus } from "./bigChungus";

(async () => {
  // spawn the all mighty big chunkus onto the Buffer
  spawnBigChunkus();

  // init bot before api, because yes
  await initBot();
  await initApi();
})();
