import {
  HelloMessageType,
  MessagesHistoyType,
  NewMessageOkType,
  NewMessageProps,
  NewMessageType,
  OkMessageType,
} from "../types/commands";
import config from "../../config.json";
import { GetMessages } from "../data/message-history";

export function OkMessageCmd() {
  const command: OkMessageType = {
    status: "ok",
    peer_id: config.my_peer_id,
  };
  return JSON.stringify(command);
}

export function HelloMessageCmd() {
  const command: HelloMessageType = {
    command: "hello",
    peer_id: config.my_peer_id,
  };
  return JSON.stringify(command);
}

export function MessagesHistoryCmd() {
  const command: MessagesHistoyType = {
    status: "ok",
    messages: GetMessages(),
  };
  return JSON.stringify(command);
}

export function NewMessageCmd({ ...props }: NewMessageProps) {
  const command: NewMessageType = {
    command: "new_message",
    ...props,
  };
  return JSON.stringify(command);
}

export function NewMessageOkCmd() {
  const command: NewMessageOkType = {
    status: "ok",
  };
  return JSON.stringify(command);
}

export function BufferedMessage(message: string): Buffer {
  return Buffer.from(message + "\n");
}
