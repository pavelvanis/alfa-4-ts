import dgram from "dgram";
import { handleTCPClient } from "../tcp/tcp-client";
import { OkMessageCmd } from "../../utils/commands";

import settings from "../../utils/settings";
import logger from "../../utils/logger";

const { my_peer_id } = settings;

/**
 * UDP Server instance.
 */
export const udpServer = dgram.createSocket("udp4");

/**
 * Event listener for when the UDP server starts listening.
 * Logs the address and port the server is listening on.
 */
udpServer.on("listening", () => {
  const address = udpServer.address();
  logger.success("UDP", `listening on ${address.address}:${address.port}`);
});

/**
 * Event listener for incoming messages to the UDP server.
 *
 * @param msg - The incoming message
 * @param rinfo - Information about the sender
 */
udpServer.on("message", (msg, rinfo) => {
  const response = JSON.parse(msg.toString());
  const { peer_id, command, status } = response;

  // Ignore messages from self
  if (peer_id === my_peer_id) return;

  logger.receive(
    "UDP",
    `Received from (${peer_id}) ${rinfo.address} - ${msg.toString().trim()}`
  );

  // If the status is "ok", handle TCP connections
  if (status === "ok") {
    handleTCPClient(response, rinfo.address);
  }

  // If the command is "hello", return an "ok" message
  if (command === "hello") {
    const okMessage = OkMessageCmd();
    udpServer.send(
      okMessage,
      0,
      okMessage.length,
      rinfo.port,
      rinfo.address,
      (err) => {
        if (err) console.error(err);
      }
    );
    logger.send("UDP", `Sent ok to ${peer_id}`);
  }
});
