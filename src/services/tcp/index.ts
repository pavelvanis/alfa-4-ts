import config from "../../../config.json";
import { tcpServer } from "./tcp-server";

const {
  ports: { tcp_port },
} = config;

export default function tcp() {
  tcpServer.listen(tcp_port, () => {
    console.log(`TCP server is listening on port ${tcp_port}`);
  });
}
