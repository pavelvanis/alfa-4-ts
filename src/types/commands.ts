import { MessageHistory } from "./messages";

/**
 * Type for a "hello" message.
 */
export type HelloMessageType = {
  command: "hello";
  peer_id: string;
};

/**
 * Type for an "ok" message.
 */
export type OkMessageType = {
  status: "ok";
  peer_id: string;
};

/**
 * Type for a "new_message" command.
 */
export type NewMessageType = {
  command: "new_message";
  message: string;
  message_id: string;
};

/**
 * Type for the properties of a new message.
 */
export type NewMessageProps = {
  message: string;
  message_id: string;
};

/**
 * Type for an "ok" response to a new message.
 */
export type NewMessageOkType = {
  status: "ok";
};

/**
 * Type for a "error" response with error message
 */
export type ErrorResponseType = {
  status: "error",
  error: string
}

/**
 * Type for a message history response.
 */
export type MessagesHistoyType = {
  status: "ok";
  messages: MessageHistory;
};