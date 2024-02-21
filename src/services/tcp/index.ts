import config from "../../../config.json";
import { tcpServer } from "./tcp-server";

// Destructure the TCP port from the config
const { tcp_port } = config.ports;

/**
 * Starts the TCP server.
 *
 * This function starts the TCP server on the port specified in the config.
 */
export default function tcp(): void {
  tcpServer.listen(tcp_port, () => {
    console.log(`TCP server is listening on port ${tcp_port}`);
  });
}
