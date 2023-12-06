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
  const filename = req.headers["content-disposition"]
  if(!filename) return res.send("Content-Disposition header missing!").status(400);
  const size = req.headers["content-length"]
  if(!size) return res.send("Content-Length header missing!").status(400);
  
  uploadFile(req, filename, parseInt(size));

  req.on("end", () => res.sendStatus(200));
}
