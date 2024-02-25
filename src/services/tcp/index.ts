import logger from "../../utils/logger";
import settings from "../../utils/settings";
import { tcpServer } from "./tcp-server";

// Destructure the TCP port from the settigns
const {
  ports: { tcp_port },
} = settings;

/**
 * Starts the TCP server.
 *
 * This function starts the TCP server on the port specified in the config.
 */
export default function tcp(): void {
  tcpServer.listen(tcp_port, () => {
    logger.success("TCP", `listening on port ${tcp_port}`);
  });
}
