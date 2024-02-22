import {
  ErrorResponseType,
  HelloMessageType,
  MessagesHistoyType,
  NewMessageOkType,
  NewMessageProps,
  NewMessageType,
  OkMessageType,
} from "../types/commands";
import { GetMessages } from "../data/message-history";
import my_peer_id from "../data/peer-id";

/**
 * Function to convert a command object to a JSON string
 * @param {any} command - The command object to stringify
 * @returns {string} - The stringified command
 */
function stringifyCommand(command: any) {
  return JSON.stringify(command);
}

/**
 * Function to create an "ok" message command
 * @returns {string} - The stringified "ok" message command
 */
export function OkMessageCmd() {
  const command: OkMessageType = {
    status: "ok",
    peer_id: my_peer_id,
  };
  return stringifyCommand(command);
}

/**
 * Function to create a "hello" message command
 * @returns {string} - The stringified "hello" message command
 */
export function HelloMessageCmd() {
  const command: HelloMessageType = {
    command: "hello",
    peer_id: my_peer_id,
  };
  return stringifyCommand(command);
}

/**
 * Function to create a messages history command
 * @returns {string} - The stringified messages history command
 */
export function MessagesHistoryCmd() {
  const command: MessagesHistoyType = {
    status: "ok",
    messages: GetMessages(),
  };
  return stringifyCommand(command);
}

/**
 * Function to create a new message command
 * @param {NewMessageProps} props - The properties of the new message
 * @returns {string} - The stringified new message command
 */
export function NewMessageCmd({ ...props }: NewMessageProps) {
  const command: NewMessageType = {
    command: "new_message",
    ...props,
  };
  return stringifyCommand(command);
}

/**
 * Function to create a new message "ok" command
 * @returns {string} - The stringified new message "ok" command
 */
export function NewMessageOkCmd() {
  const command: NewMessageOkType = {
    status: "ok",
  };
  return stringifyCommand(command);
}

/**
 * Function to create an error response command
 * @param {string} message - The error message
 * @returns {string} - The stringified error response command
 */
export function ErrorResponseCmd(message: string) {
  const command: ErrorResponseType = {
    status: "error",
    error: message,
  };
  return JSON.stringify(command);
}

/**
 * Function to create a buffered message
 * @param {string} message - The message to buffer
 * @returns {Buffer} - The buffered message
 */
export function BufferedMessage(message: string): Buffer {
  return Buffer.from(message + "\n");
}
