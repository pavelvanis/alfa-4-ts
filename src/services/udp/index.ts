import { activeClients } from "../tcp/tcp-client";
import { HelloMessageCmd } from "../../utils/commands";
import { udpServer } from "./udp-server";
import settings from "../../utils/settings";
import logger from "../../utils/logger";

const {
  network: { broadcast },
  broadcast_interval,
  ports: { udp_port },
} = settings;

/**
 * Starts the UDP server and sets up broadcasting.
 */
export default function udp(): void {
  udpServer.bind(udp_port, () => {
    udpServer.setBroadcast(true);
    sendBroadcast(); // Initial broadcast

    // Regular broadcasts at the specified interval
    setInterval(() => {
      let clients = Object.keys(activeClients);
      sendBroadcast();
      logger.success(
        "UDP",
        `Active TCP connections (${clients.length}) with: ${JSON.stringify(
          clients
        )}`
      );
    }, broadcast_interval);
  });
}

/**
 * Sends a broadcast message from the UDP server.
 */
function sendBroadcast(): void {
  const helloMessage = HelloMessageCmd();
  udpServer.send(
    helloMessage,
    0,
    helloMessage.length,
    udp_port,
    broadcast,
    (err) => {
      if (err) console.error(err);
      logger.send("UDP", `Sent UDP Discovery every ${broadcast_interval}ms`);
    }
  );
}
