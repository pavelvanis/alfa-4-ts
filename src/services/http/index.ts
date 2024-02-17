import express from "express";

import config from "../../../config.json";
import api from "./api";

const { ports } = config;

export default function http() {
  const app = express();

  api(app);

  app.listen(ports.http_port, () => {
    console.log(`HTTP server is listening on port ${ports.http_port}`);
  });
}
