import { Express } from "express";
import { HomeRoute, MessagesRoute, SendMessageRoute } from "./routes";

/**
 * Sets up the API routes for the application.
 *
 * @param app - The Express application instance
 */
export default function api(app: Express): void {
  // Home route
  // GET / - Returns the home page
  app.get("/", HomeRoute);

  // Messages route
  // GET /messages - Returns all messages
  app.get("/messages", MessagesRoute);

  // Send message route
  // GET /send - Sends a message
  app.get("/send", SendMessageRoute);
}
