import { MessageHistory, SaveMessageProps } from "../types/messages";

let messages: MessageHistory = {};

export function MergeMessages(new_messages: MessageHistory) {
  messages = { ...messages, ...new_messages };
}

export function SaveMessage({ peer_id, message, message_id }: SaveMessageProps) {
  const new_message: MessageHistory = {
    [message_id]: {
      peer_id,
      message,
    },
  };
  MergeMessages(new_message);
  console.log(`New message from ${peer_id}: ${message}`);
}

export function GetMessages() {
  return messages;
}
