import { initApi } from "./api.js";
import { initBot } from "./bot.js";
import "dotenv/config.js";

(async () => {
  await Promise.all([initBot(), initApi()]);
})();
