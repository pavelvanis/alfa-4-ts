import dgram from "dgram";

import { handleTCPClient } from "../tcp/tcp-client";
import { HelloMessageCmd, OkMessageCmd } from "../../utils/commands";

import config from "../../../config.json";

const {
  ports: { udp_port },
  broadcast: { interval, address },
} = config;

// UDP Server
const udpServer = dgram.createSocket("udp4");

export default function udp() {
  // Setup udp server ...
  udpServer.bind(udp_port, () => {
    udpServer.setBroadcast(true);
    sendBroadcast();
    setInterval(sendBroadcast, interval);
  });
}

function sendBroadcast(): void {
  udpServer.send(
    HelloMessageCmd(),
    0,
    HelloMessageCmd().length,
    udp_port,
    address,
    (err) => {
      if (err) console.error(err);
      logudp(`Sent UDP Discovery every ${interval}ms`);
    }
  );
}

udpServer.on("listening", () => {
  const address = udpServer.address();
  logudp(`UDP server listening on ${address.address}:${address.port}`);
});

// Listen on messages
udpServer.on("message", (msg, rinfo) => {
  const response = JSON.parse(msg.toString());
  const { peer_id, command, status } = response;

  // Ignore my peer_id
  if (peer_id === config.my_peer_id) return;

  logudp(`Recieved from ${rinfo.address} - ${msg.toString()}`);

  if (status === "ok") {
    // Handle TCP connections
    handleTCPClient(response, rinfo.address);
  }
  if (command === "hello") {
    // Return ok message
    udpServer.send(
      OkMessageCmd(),
      0,
      OkMessageCmd().length,
      rinfo.port,
      rinfo.address,
      (err) => {
        if (err) console.error(err);
      }
    );
  }
});

function logudp(text: string) {
  console.log("UDP: SERVER:", text);
}
