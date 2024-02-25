import { Request, Response } from "express";
import { GetMessages } from "../../../../data/message-history";
import logger from "../../../../utils/logger";

/**
 * `"/messages"` route returns all messages ins json
 */
export default function MessagesRoute(req: Request, res: Response) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  logger.info(
    "HTTP",
    `(HTTP) [GET /messages] : Sent messages - [${
      Object.keys(GetMessages()).length
    }x] to ${ip}`
  );
  res.json(GetMessages());
}
