export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  receiverId?: number;
  receiverName?: string;
  message: string;
  timestamp: string;
  isGroupMessage: boolean;
  readBy: number[];
}

export interface ChatRoom {
  id: number;
  name: string;
  participants: number[];
  isGroup: boolean;
  lastMessage?: ChatMessage;
  unreadCount: number;
}