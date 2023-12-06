import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import fs from "node:fs";
import Stream from "node:stream";
import { BigChunkus } from "./bigChungus";

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

const coolCloudThings = async (client: Client<true>) => {
  const cloudChannel = client.channels.cache.get("1181963047510753281") as TextChannel;

  let chunkCounter = 0;

  const testFile = fs.createReadStream("./cloud/test2", {highWaterMark: 26214400});
  testFile.on("data", async (chunk: Buffer) => {
    testFile.pause();
    console.log(chunk.length);

    (chunk as any).path = "test2" + chunkCounter++
    
    await cloudChannel.send({
      files: [chunk],
    })

    testFile.resume();
  })
  testFile.on("end", () => console.log("EOF"))
};

const uploadSegmentToCloud = async (buff: Buffer, filename: string, segId: number) => {
  const name = filename + "_" + segId;
  console.log("uploading", name, "of size", buff.length, "bytes");
  (buff as any).path = name;

  const cloudChannel = _client.channels.cache.get("1181963047510753281") as TextChannel;

  await cloudChannel.send({
    files: [buff],
  })

  console.log("done", filename, segId);
}

export const uploadFile = (stream: Stream.Readable, filename: string) => {
  const chunk25 = Buffer.alloc(26214400) as BigChunkus;
  let chunkCount25 = 0;

  stream.on("data", async (chunk: Buffer) => {
    const ret = chunk25.addChunk(chunk);
    if (ret instanceof Buffer) {
      stream.pause();

      await uploadSegmentToCloud(chunk25, filename, chunkCount25++)

      chunk25.fill(0);
      chunk25.currentLen = 0;
      chunk25.addChunk(ret);

      stream.resume();
    }
  })

  stream.on("end", async () => {
    if (chunk25.currentLen > 0) {
      const lastSeg = chunk25.subarray(0, chunk25.currentLen)

      await uploadSegmentToCloud(lastSeg, filename, chunkCount25++)
      
      chunk25.fill(0);
      chunk25.currentLen = 0;
    }
    console.log("EOF")
  })

  return stream;
}
