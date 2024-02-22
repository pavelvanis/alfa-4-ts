import net from "net";
import config from "../../../config.json";
import {
  BufferedMessage,
  ErrorResponseCmd,
  HelloMessageCmd,
} from "../../utils/commands";
import { MergeMessages } from "../../data/message-history";

const {
  ports: { tcp_port },
  timeouts: { tcp_timeout },
} = config;

type Client = {
  socket: net.Socket;
  lastMessage: number;
};

/**
 * Store for active clients
 */
export let activeClients: Record<string, Client> = {};

/**
 * Handles a TCP client by establishing a connection and setting up event listeners.
 *
 * @param response - The response from the client
 * @param address - The address of the client
 */
export const handleTCPClient = (response: any, address: string) => {
  const { peer_id } = response;

  // If there's already an active connection, return
  if (activeClients[peer_id]) {
    return;
  }

  // Create a new connection
  const client = net.createConnection({ port: tcp_port, host: address }, () => {
    client.write(BufferedMessage(HelloMessageCmd()));
    logTcpClient(`Hello message to ${peer_id} sent`);
  });

  // Handle incoming data
  client.on("data", (data) => {
    try {
      const response = JSON.parse(data.toString());
      const { status, messages } = response;

      // If the status is "ok", merge the messages
      if (status === "ok") {
        logTcpClient(
          `Recieved messages from (${peer_id}) - [${
            Object.keys(messages).length
          }x]`
        );
        MergeMessages(messages);
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        return client.write(
          BufferedMessage(ErrorResponseCmd("Invalid command"))
        );
      }
      console.error(error);
    }
  });

  // Handle connection
  client.on("connect", () => {
    // Add connection to active clients
    activeClients[peer_id] = {
      socket: client,
      lastMessage: Date.now(),
    };
    logTcpClient(`Connection with ${peer_id} is established`);
  });

  // Handle connection closure
  client.on("close", () => {
    logTcpClient(`TCP connection with ${peer_id} closed.`);
    delete activeClients[peer_id];
  });

  // Handle errors
  client.on("error", (err: any) => {
    if (err.code === "ETIMEDOUT") {
      const peer = err.address;
      logTcpClient(`${peer} was removed due to ETIMEDOUT error`);
      client.destroy();
      delete activeClients[peer_id];
    } else {
      logTcpClient("Socket error:", err);
    }
  });
};

/**
 * Logs a message to the console with a "TCP: CLIENT:" prefix.
 *
 * @param text - The main text to log
 * @param args - Additional data to log
 */
function logTcpClient(text: string, args?: any) {
  console.log("TCP: CLIENT:", text, args ? args : "");
}
