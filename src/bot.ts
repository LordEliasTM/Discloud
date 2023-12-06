import { Client, Events, GatewayIntentBits } from "discord.js";

export const initBot = () => new Promise<boolean>(resolve => {

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once(Events.ClientReady, readyClient => {
    console.log(`Bot ready. Logged in as ${readyClient.user.tag}`);
    resolve(true);
  });

  client.login(process.env.BOT_TOKEN);

});
