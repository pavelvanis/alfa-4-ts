import dgram from "dgram";
import { activeClients } from "../tcp/tcp-client";
import { HelloMessageCmd } from "../../utils/commands";
import config from "../../../config.json";
import { udpServer } from "./udp-server";

const {
  ports: { udp_port },
  broadcast: { interval, address },
} = config;

/**
 * Starts the UDP server and sets up broadcasting.
 */
export default function udp(): void {
  udpServer.bind(udp_port, () => {
    udpServer.setBroadcast(true);
    sendBroadcast(); // Initial broadcast

    // Regular broadcasts at the specified interval
    setInterval(() => {
      sendBroadcast();
      console.log(
        `Active TCP connections with: ${JSON.stringify(
          Object.keys(activeClients)
        )}`
      );
    }, interval);
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
    address,
    (err) => {
      if (err) console.error(err);
      console.log(`Sent UDP Discovery every ${interval}ms`);
    }
  );
}
