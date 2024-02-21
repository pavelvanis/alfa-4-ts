import { Request, Response } from "express";
import { SaveMessage } from "../../../../data/message-history";
import { SaveMessageProps } from "../../../../types/messages";
import { activeClients } from "../../../tcp/tcp-client";
import { BufferedMessage, NewMessageCmd } from "../../../../utils/commands";
import my_peer_id from "../../../../data/peer-id";

/**
 * MessagesRoute is an Express middleware function that handles incoming requests to send messages.
 * It first validates the message, then saves it and sends it to all active clients.
 * 
 * @param req - The incoming HTTP request
 * @param res - The outgoing HTTP response
 * @returns - The function doesn't return anything. Instead, it calls `res.json()` to send a response to the client.
 */
export default function MessagesRoute(req: Request, res: Response) {
  const message = req.query.message?.toString();

  // Return error when message is not set
  if (!message) {
    return res.json({ status: "error", message: "Message is missing" });
  }

  const timestamp = Date.now().toString();

  // Create message
  const new_message: SaveMessageProps = {
    peer_id: my_peer_id,
    message,
    message_id: timestamp,
  };

  // Save message
  SaveMessage(new_message);

  // Send to all clients
  for (const [peer_id, client] of Object.entries(activeClients)) {
    const bufferedMessage = BufferedMessage(
      NewMessageCmd({ message, message_id: timestamp })
    );
    client.socket.write(bufferedMessage);
    console.log(`new message sent to ${peer_id}`);
  }

  res.json({ status: "ok" });
}