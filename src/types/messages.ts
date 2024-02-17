
export type Message = {
  peer_id: string;
  message: string;
};

export type MessageHistory = {
  [timestamp: string]: Message;
};

export type SaveMessageProps = {
  peer_id: string;
  message_id: string;
  message: string;
};
