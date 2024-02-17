import net from "net";
import config from "../../../config.json";
import { BufferedMessage, HelloMessageCmd } from "../../utils/commands";
import { MergeMessages } from "../../data/message-history";

const {
  ports: { tcp_port },
  timeouts: { tcp_timeout },
} = config;

type Client = {
  socket: net.Socket;
  lastMessage: number;
};

export let activeClients: Record<string, Client> = {};

export const handleTCPClient = (response: any, address: string) => {
  const { peer_id } = response;

  // When exist active connection update and return
  if (activeClients[peer_id]) {
    activeClients[peer_id].lastMessage = Date.now();
    return;
  }

  const client = net.createConnection({ port: tcp_port, host: address }, () => {
    logTcpClient(`TCP connection with ${peer_id} established.`);
    client.write(BufferedMessage(HelloMessageCmd()));
    activeClients[peer_id] = {
      socket: client,
      lastMessage: Date.now(),
    };
  });

  const responseTimeout = setTimeout(() => {
    logTcpClient(
      `No response from ${peer_id} within 30 seconds. Disconnecting.`
    );
    client.end();
    delete activeClients[peer_id];
  }, tcp_timeout);

  client.on("data", (data) => {
    try {
      clearTimeout(responseTimeout);
      const response = JSON.parse(data.toString());
      const { status, messages } = response;

      if (status === "ok") {
        logTcpClient(`OK from ${peer_id}`);
        MergeMessages(messages);
      }
    } catch (error) {
      console.log(error);
    }
  });

  client.on("close", () => {
    logTcpClient(`TCP connection with ${peer_id} closed.`);
    delete activeClients[peer_id];
  });

  client.on("error", (err: any) => {
    if (err.code === "ECONNRESET") {
      logTcpClient("TCP connection reset by peer");
    } else {
      logTcpClient("Socket error:", err);
    }
  });
};

function logTcpClient(text: string, args?: any) {
  console.log("TCP: CLIENT:", text, args ? args : "");
}
