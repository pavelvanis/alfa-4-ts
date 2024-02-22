import net from "net";
import { activeClients } from "./tcp-client";
import { GetMessages, SaveMessage } from "../../data/message-history";
import {
  BufferedMessage,
  ErrorResponseCmd,
  MessagesHistoryCmd,
  NewMessageOkCmd,
} from "../../utils/commands";

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
      const { command, message_id, message, peer_id } = response;

      if (command === "hello" && peer_id) {
        socket.write(BufferedMessage(MessagesHistoryCmd()));
        logTcpServer(
          `Sent messages to (${response.peer_id}) - [${
            Object.keys(GetMessages()).length
          }x]`
        );
        // Add peer_id to active clients
        return;
      }

      if (command === "new_message") {
        // Find peer_id by IP in active clients
        const ip = socket.remoteAddress?.split(":").pop();
        const peer_id = Object.keys(activeClients).find(
          (key) => activeClients[key].socket.remoteAddress === ip
        );

        if (peer_id) {
          SaveMessage({ peer_id, message, message_id });
          socket.write(BufferedMessage(NewMessageOkCmd()));
        } else {
          socket.write(
            BufferedMessage(
              JSON.stringify({
                status: "error",
                error: "Make TCP handshake before this command",
              })
            )
          );
          logTcpServer("Peer not found for IP:", ip);
        }
        return;
      }
      socket.write(BufferedMessage(ErrorResponseCmd("Invalid comand")));
    } catch (error) {
      if (error instanceof SyntaxError) {
        return socket.write(
          BufferedMessage(
            JSON.stringify({ status: "error", error: "Invalid JSON" })
          )
        );
      }
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
