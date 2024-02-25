import net from "net";
import {
  BufferedMessage,
  ErrorResponseCmd,
  HelloMessageCmd,
} from "../../utils/commands";
import { MergeMessages } from "../../data/message-history";
import settings from "../../utils/settings";
import logger from "../../utils/logger";

const {
  ports: { tcp_port },
} = settings;

type Client = {
  socket: net.Socket;
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
    logger.waiting("TCP", `Creating connection with ${peer_id} ...`);
  });

  // Handle incoming data
  client.on("data", (data) => {
    try {
      const response = JSON.parse(data.toString());
      const { status, messages } = response;

      // If the status is "ok", merge the messages
      if (status === "ok") {
        logger.receive(
          "TCP",
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
      logger.error("TCP", error);
    }
  });

  // Handle connection
  client.on("connect", () => {
    // Add connection to active clients
    activeClients[peer_id] = {
      socket: client,
    };
    logger.info("TCP", `Connection with ${peer_id} is established`);
  });

  // Handle connection closure
  client.on("close", () => {
    logger.info("TCP", `Connection with ${peer_id} closed.`);
    delete activeClients[peer_id];
  });

  // Handle errors
  client.on("error", (err: any) => {
    if (err.code === "ETIMEDOUT") {
      const ip = client.remoteAddress;
      logger.error("TCP", `${ip} was removed due to ETIMEDOUT error`);
      client.destroy();
      delete activeClients[peer_id];
    } else {
      logger.error("TCP", `Socket error: ${err}`);
    }
  });
};
