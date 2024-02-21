import { Request, Response } from "express";
import path from "path";

/**
 * `"/"` user message web interface
 */
export default function Home(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "../../../../vendor/html", "home.html"));
}
