import {
  HelloMessageType,
  MessagesHistoyType,
  NewMessageOkType,
  NewMessageProps,
  NewMessageType,
  OkMessageType,
} from "../types/commands";
import { GetMessages } from "../data/message-history";
import my_peer_id from "../data/peer-id";

function stringifyCommand(command: any) {
  return JSON.stringify(command);
}

export function OkMessageCmd() {
  const command: OkMessageType = {
    status: "ok",
    peer_id: my_peer_id,
  };
  return stringifyCommand(command);
}

export function HelloMessageCmd() {
  const command: HelloMessageType = {
    command: "hello",
    peer_id: my_peer_id,
  };
  return stringifyCommand(command);
}

export function MessagesHistoryCmd() {
  const command: MessagesHistoyType = {
    status: "ok",
    messages: GetMessages(),
  };
  return stringifyCommand(command);
}

export function NewMessageCmd({ ...props }: NewMessageProps) {
  const command: NewMessageType = {
    command: "new_message",
    ...props,
  };
  return stringifyCommand(command);
}

export function NewMessageOkCmd() {
  const command: NewMessageOkType = {
    status: "ok",
  };
  return stringifyCommand(command);
}

export function BufferedMessage(message: string): Buffer {
  return Buffer.from(message + "\n");
}
