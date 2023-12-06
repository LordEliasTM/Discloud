import { initApi } from "./api";
import { initBot } from "./bot";
import "dotenv/config.js";

(async () => {
  await Promise.all([initBot(), initApi()]);
})();
