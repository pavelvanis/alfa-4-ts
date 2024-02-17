import { MessageHistory } from "./messages";

export type HelloMessageType = {
  command: "hello";
  peer_id: string;
};

export type OkMessageType = {
  status: "ok";
  peer_id: string;
};

export type NewMessageType = {
  command: "new_message";
  message: string;
  message_id: string;
};

export type NewMessageProps = {
  message: string;
  message_id: string;
};

export type NewMessageOkType = {
  status: "ok";
};

export type MessagesHistoyType = {
  status: "ok";
  messages: MessageHistory;
};
