import net from "net";

import { activeClients } from "./tcp-client";

import { SaveMessage } from "../../data/message-history";
import {
  BufferedMessage,
  MessagesHistoryCmd,
  NewMessageOkCmd,
} from "../../utils/commands";

export const tcpServer = net.createServer((socket) => {
  socket.on("data", (data) => {
    try {
      const response = JSON.parse(data.toString());
      const { command, message_id, message } = response;
      if (command === "hello") {
        socket.write(BufferedMessage(MessagesHistoryCmd()));
      }
      if (command === "new_message") {
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
      socket.write("Something were wrong\n");
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

function logTcpServer(text: string, args?: any) {
  console.log("TCP: SERVER:", text, args ? args : "");
}
