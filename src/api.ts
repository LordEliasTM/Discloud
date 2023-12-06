import express from "express";

export const initApi = async () => {

  const app = express();

  app.post("/upload", () => {
    
  })

  app.listen(process.env.SRV_PORT, () => {
    console.log("API ready. Listening on port", process.env.SRV_PORT);
  });

};
