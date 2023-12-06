import fs from "node:fs/promises";
import { v1 as uuid } from "uuid";
import { Mutex } from "async-mutex";
import { CloudFile, CloudFileChunk, CloudIndex } from "./types";

const indexJsonMutex = new Mutex();

export const registerCloudFile = (name: string, size: number) => {
  const cloudFile: CloudFile = {
    id: uuid(),
    name,
    size,
    chunks: [],
  }

  // registerCloudFileChunk
  return (id: number, size: number, messageId: string) => {
    const cloudFileChunk: CloudFileChunk = {
      id,
      size,
      messageId,
    }

    cloudFile.chunks.push(cloudFileChunk);

    // finish
    return async () => {
      const release = await indexJsonMutex.acquire();

      try {
        const indexStr = await fs.readFile("./cloud/index.json", { encoding: "utf8" });
        const index: CloudIndex = JSON.parse(indexStr);

        index.files.push(cloudFile);

        const newIndexStr = JSON.stringify(index, null, 2);
        fs.writeFile("./cloud/index.json", newIndexStr);
      }
      catch(e) {
        throw e
      }
      finally {
        release();
      }
      
    }
  }
}
