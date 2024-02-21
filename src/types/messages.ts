/**
 * Type for a message.
 */
export type Message = {
  /**
   * The ID of the peer that sent the message.
   */
  peer_id: string;
  /**
   * The content of the message.
   */
  message: string;
};

/**
 * Type for a message history.
 * The keys are timestamps and the values are messages.
 */
export type MessageHistory = {
  [timestamp: string]: Message;
};

/**
 * Type for the properties needed to save a message.
 */
export type SaveMessageProps = {
  /**
   * The ID of the peer that sent the message.
   */
  peer_id: string;
  /**
   * The ID of the message.
   */
  message_id: string;
  /**
   * The content of the message.
   */
  message: string;
};
