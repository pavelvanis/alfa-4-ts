import { MessageHistory, SaveMessageProps } from "../types/messages";

import config from "./../../config.json";

const { max_message_history } = config;

/**
 * A dictionary to store all messages.
 */
let messages: MessageHistory = {};

/**
 * Merges new messages into the existing message history, sorts them by message_id (timestamp),
 * and keeps only the last 'max_message_history' number of messages.
 *
 * @param new_messages - A dictionary of new messages to be merged into the existing message history.
 */
export function MergeMessages(new_messages: MessageHistory) {
  const all_messages = { ...messages, ...new_messages };
  // Convert the messages object to an array
  const messagesArray = Object.entries(all_messages);

  // Sort the array by the message_id
  const sortedMessages = messagesArray.sort(
    (a, b) => Number(b[0]) - Number(a[0])
  );

  // Get the last messages
  const lastMessages = sortedMessages.slice(0, max_message_history).reverse();

  // Convert the array back to an object
  messages = Object.fromEntries(lastMessages);
}

/**
 * Saves a new message into the message history.
 *
 * @param peer_id - The ID of the peer who sent the message.
 * @param message - The message content.
 * @param message_id - The ID of the message, which is a timestamp.
 */
export function SaveMessage({
  peer_id,
  message,
  message_id,
}: SaveMessageProps) {
  const new_message: MessageHistory = {
    [message_id]: {
      peer_id,
      message,
    },
  };
  MergeMessages(new_message);
  console.log(`New message from ${peer_id}: ${message}`);
}

/**
 * Returns the current message history.
 *
 * @returns A dictionary of all messages in the message history.
 */
export function GetMessages() {
  return messages;
}
