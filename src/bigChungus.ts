export interface BigChunkus extends Buffer {
  currentLen: number;
  addChunk(chunk: Buffer): Buffer | null
}

/**
 * Spawns the all mighty big chunkus, which hacks the Buffer class
 * to make it able to write to the buffer in chunks
 */
export const spawnBigChunkus = () => {
  Buffer.prototype.currentLen = 0;
  Buffer.prototype.addChunk = function (this: BigChunkus, chunk: Buffer) {
    const remainingLen = this.length - this.currentLen;
    
    // if full
    if (remainingLen == 0) return chunk;

    if (chunk.length <= remainingLen) {
      chunk.copy(this, this.currentLen, 0, chunk.length);
      this.currentLen += chunk.length;
      return null;
    }
    // chunk.len bigger than remainingLen
    else {
      // copy as much as i can
      chunk.copy(this, this.currentLen, 0, remainingLen);
      // return the remainder as Buffer
      return chunk.subarray(remainingLen, chunk.length);
    }
  }
}
