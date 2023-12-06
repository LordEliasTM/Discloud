import express from "express";
import { uploadFile } from "./bot";
import { RequestHandler } from "express";

export const initApi = async () => {
  const app = express();
  app.post("/upload", postUpload);
  app.listen(process.env.SRV_PORT, onListening);
};

const onListening = () => {
  console.log("API ready. Listening on port", process.env.SRV_PORT);
}

const postUpload: RequestHandler = (req, res) => {
  //console.log(req.headers["content-disposition"])
  
  uploadFile(req, req.headers["content-disposition"] ?? "no_filename")

  req.on("end", () => res.sendStatus(200));
}
