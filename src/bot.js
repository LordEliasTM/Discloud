import { Client, Events, GatewayIntentBits } from "discord.js";

/** @type {() => Promise<boolean>} */
export const initBot = () => new Promise(resolve => {

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once(Events.ClientReady, readyClient => {
    console.log(`Bot ready. Logged in as ${readyClient.user.tag}`);
    resolve(true);
  });

  client.login(process.env.BOT_TOKEN);

});
