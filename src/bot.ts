import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import Stream from "node:stream";
import { BigChunkus } from "./bigChungus";
import { registerCloudFile } from "./cloud";

let _client: Client<true>;

export const initBot = () => new Promise<boolean>(resolve => {

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once(Events.ClientReady, readyClient => {
    console.log(`Bot ready. Logged in as ${readyClient.user.tag}`);
    _client = readyClient;
    resolve(true);

    //coolCloudThings(readyClient);
  });

  client.login(process.env.BOT_TOKEN);
});

const uploadSegmentToCloud = async (buff: Buffer, filename: string, segId: number, registerCloudFileChunk: ReturnType<typeof registerCloudFile>) => {
  const name = filename + "_" + segId;
  console.log("uploading", name, "of size", buff.length, "bytes");
  (buff as any).path = name;

  const cloudChannel = _client.channels.cache.get("1181963047510753281") as TextChannel;

  const message = await cloudChannel.send({
    files: [buff],
  })
  
  console.log("done     ", name);

  return registerCloudFileChunk(segId, buff.length, message.id);
}

export const uploadFile = (stream: Stream.Readable, filename: string, size: number) => {
  const chunk25 = Buffer.alloc(26214400) as BigChunkus;
  let chunkCount25 = 0;

  const registerCloudFileChunk = registerCloudFile(filename, size);
  let registerFinish: ReturnType<typeof registerCloudFileChunk>;

  stream.on("data", async (chunk: Buffer) => {
    const ret = chunk25.addChunk(chunk);
    if (ret instanceof Buffer) {
      stream.pause();

      registerFinish = await uploadSegmentToCloud(chunk25, filename, chunkCount25++, registerCloudFileChunk);

      chunk25.fill(0);
      chunk25.currentLen = 0;
      chunk25.addChunk(ret);

      stream.resume();
    }
  })

  stream.on("end", async () => {
    if (chunk25.currentLen > 0) {
      const lastSeg = chunk25.subarray(0, chunk25.currentLen)

      registerFinish = await uploadSegmentToCloud(lastSeg, filename, chunkCount25++, registerCloudFileChunk);
      
      chunk25.fill(0);
      chunk25.currentLen = 0;
    }
    console.log("EOF");
    registerFinish();
  })

  return stream;
}
