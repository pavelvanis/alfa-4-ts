// import http from "./src/services/http";
// import udp from "./src/services/udp";
import { http, udp, tcp } from "./src/services";

// Setup HTTP Server
http();

// Setup UDP server
udp();

// // Setup TCP server
tcp();
