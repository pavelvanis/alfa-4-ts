import net from "net";
import { activeClients } from "./tcp-client";
import { SaveMessage } from "../../data/message-history";
import { BufferedMessage, MessagesHistoryCmd, NewMessageOkCmd } from "../../utils/commands";

/**
 * The TCP server that handles incoming connections and data from clients.
 * 
 * When a client sends data, the server parses it as JSON and handles it based on the command.
 * If the command is "hello", the server sends the message history to the client.
 * If the command is "new_message", the server saves the message and sends a confirmation to the client.
 */
export const tcpServer = net.createServer((socket) => {
  socket.on("data", (data) => {
    try {
      const response = JSON.parse(data.toString());
      const { command, message_id, message } = response;

      if (command === "hello") {
        socket.write(BufferedMessage(MessagesHistoryCmd()));
        logTcpServer(`Sent messages to ${response.peer_id}`);
      }

      if (command === "new_message") {
        // Find peer_id by IP
        const ip = socket.remoteAddress?.split(":").pop();
        const peer_id = Object.keys(activeClients).find(
          (key) => activeClients[key].socket.remoteAddress === ip
        );

        if (peer_id) {
          SaveMessage({ peer_id, message, message_id });
          socket.write(BufferedMessage(NewMessageOkCmd()));
        } else {
          logTcpServer("Peer not found for IP:", ip);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("error", (err: any) => {
    if (err.code === "ECONNRESET") {
      logTcpServer("TCP connection reset by peer");
    } else {
      logTcpServer("Socket error:", err);
    }
  });
});

/**
 * Logs a message to the console with a "TCP: SERVER:" prefix.
 * 
 * @param text - The main text to log
 * @param args - Additional data to log
 */
function logTcpServer(text: string, args?: any) {
  console.log("TCP: SERVER:", text, args ? args : "");
}