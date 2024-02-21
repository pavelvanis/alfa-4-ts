import { Request, Response } from "express";
import { GetMessages } from "../../../../data/message-history";

/**
 * `"/messages"` route returns all messages ins json
 */
export default function MessagesRoute(req: Request, res: Response) {
  res.json(GetMessages());
}
