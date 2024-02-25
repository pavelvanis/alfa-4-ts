import { Request, Response } from "express";
import path from "path";
import logger from "../../../../utils/logger";

/**
 * `"/"` user message web interface
 */
export default function Home(req: Request, res: Response) {
  logger.info("HTTP", "[GET /] User message web interface");
  res.sendFile(path.join(__dirname, "../../../../vendor/html", "home.html"));
}
