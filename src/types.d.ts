export type CloudIndex = {
  files: CloudFile[];
}

export type CloudFile = {
  id: string;
  name: string;
  size: number;
  chunks: CloudFileChunk[];
}

export type CloudFileChunk = {
  id: number;
  length: number;
  messageId: string;
}
