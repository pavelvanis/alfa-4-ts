import express from "express";
import config from "../../../config.json";
import api from "./api";

// Destructure the ports from the config
const { ports } = config;

/**
 * Initializes and starts the HTTP server.
 *
 * This function creates an Express application, sets up the API routes using the `api` function,
 * and then starts the server on the port specified in the config.
 */
export default function http(): void {
  // Create an Express application
  const app = express();

  // Set up the API routes
  api(app);

  // Start the server
  app.listen(ports.http_port, () => {
    console.log(`HTTP server is listening on port ${ports.http_port}`);
  });
}
