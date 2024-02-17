import { Request, Response } from "express";
import path from "path";

export { default as MessagesRoute } from "./messages";
export { default as SendMessageRoute } from "./send-message";

export default function Home(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "../../", "home.html"));
}
