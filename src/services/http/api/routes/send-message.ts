import { Request, Response } from "express";
import config from "../../../../../config.json";
import { SaveMessage } from "../../../../data/message-history";
import { SaveMessageProps } from "../../../../types/messages";
import { activeClients } from "../../../tcp/tcp-client";
import {
  BufferedMessage,
  HelloMessageCmd,
  NewMessageCmd,
} from "../../../../utils/commands";

export default function MessagesRoute(req: Request, res: Response) {
  const message = req.query.message.toString();

  // Return error when message is not set
  if (!message)
    return res.json({ status: "error", message: "Message is mising" });

  const timestamp = Date.now().toString();

  // Create message
  const new_message: SaveMessageProps = {
    peer_id: config.my_peer_id,
    message: message,
    message_id: timestamp,
  };

  // Save message
  SaveMessage(new_message);

  // Send to all clients
  for (const client of Object.values(activeClients)) {
    client.socket.write(BufferedMessage(HelloMessageCmd()));
    client.socket.write(
      BufferedMessage(
        NewMessageCmd({ message: message, message_id: timestamp })
      )
    );
  }

  res.json({ status: "ok" });
}
