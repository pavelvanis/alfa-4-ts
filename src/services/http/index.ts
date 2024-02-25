import express from "express";
import api from "./api";
import settings from "../../utils/settings";
import logger from "../../utils/logger";

const {
  ports: { http_port },
} = settings;

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
  app.listen(http_port, () => {
    logger.success("HTTP", `listening on port ${http_port}`);
  });
}
