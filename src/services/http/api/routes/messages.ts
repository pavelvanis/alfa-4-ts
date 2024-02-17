import { Request, Response } from "express";
import { GetMessages } from "../../../../data/message-history";

export default function MessagesRoute(req: Request, res: Response) {
  res.json(GetMessages());
}
