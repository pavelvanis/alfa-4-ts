import { Express, Request, Response } from "express";
import Home, { MessagesRoute, SendMessageRoute } from "./routes";

export default function api(app: Express) {
  app.get("/test", (req: Request, res: Response) => {
    res.send("Working");
  });

  app.get("/", Home);

  app.get("/messages", MessagesRoute);

  app.get("/send", SendMessageRoute);
}
