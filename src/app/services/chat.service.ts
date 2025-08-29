import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage, ChatRoom } from '../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messages: ChatMessage[] = [
    {
      id: 1,
      senderId: 1,
      senderName: 'John Doe',
      receiverId: 2,
      receiverName: 'Jane Smith',
      message: 'Hey Jane, how is the project going?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isGroupMessage: false,
      readBy: [1],
    },
    {
      id: 2,
      senderId: 2,
      senderName: 'Jane Smith',
      receiverId: 1,
      receiverName: 'John Doe',
      message: "Hi John! It's going well, should be done by tomorrow.",
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      isGroupMessage: false,
      readBy: [2],
    },
    {
      id: 3,
      senderId: 3,
      senderName: 'Michael Johnson',
      message: 'Good morning everyone! Ready for the sprint planning?',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isGroupMessage: true,
      readBy: [3],
    },
  ];

  private chatRooms: ChatRoom[] = [
    {
      id: 1,
      name: 'General',
      participants: [1, 2, 3, 4, 5],
      isGroup: true,
      unreadCount: 1,
    },
  ];

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private chatRoomsSubject = new BehaviorSubject<ChatRoom[]>([]);
  private currentUserId: number = 1; // default until set by component on login

  constructor() {
    this.loadChatRooms();
    this.loadMessages();
    // compute derived fields & emit
    this.updateMessages(); // emits messages
    this.updateChatRooms(); // computes lastMessage/unread and emits rooms
  }

  /********** Public API **********/
  setCurrentUserId(userId: number) {
    this.currentUserId = userId;
    // recompute unread counts for this user
    this.updateChatRooms();
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  getChatRooms(): Observable<ChatRoom[]> {
    return this.chatRoomsSubject.asObservable();
  }

  getMessagesForRoom(roomId: number): ChatMessage[] {
    const room = this.chatRooms.find((r) => r.id === roomId);
    if (!room) return [];

    if (room.isGroup) {
      return this.messages.filter(
        (m) => m.isGroupMessage && room.participants.includes(m.senderId)
      );
    } else if (room.participants.length === 2) {
      const [user1, user2] = room.participants;
      return this.messages.filter(
        (m) =>
          !m.isGroupMessage &&
          m.receiverId != null &&
          ((m.senderId === user1 && m.receiverId === user2) ||
            (m.senderId === user2 && m.receiverId === user1))
      );
    }

    return [];
  }

  sendMessage(
    senderId: number,
    senderName: string,
    message: string,
    roomId: number
  ): ChatMessage | null {
    const room = this.chatRooms.find((r) => r.id === roomId);
    if (!room) return null;

    const newId = this.messages.length
      ? Math.max(...this.messages.map((m) => m.id)) + 1
      : 1;

    const newMessage: ChatMessage = {
      id: newId,
      senderId,
      senderName,
      message,
      timestamp: new Date().toISOString(),
      isGroupMessage: room.isGroup,
      readBy: [senderId],
    };

    if (!room.isGroup && room.participants.length === 2) {
      const receiverId = room.participants.find((id) => id !== senderId);
      if (receiverId) {
        const receiverName = this.getEmployeeName(receiverId);
        newMessage.receiverId = receiverId;
        newMessage.receiverName = receiverName;
      }
    }

    this.messages.push(newMessage);
    this.updateMessages();
    this.updateChatRooms();
    return newMessage;
  }

  createPrivateRoom(userId1: number, userId2: number): ChatRoom {
    const existingRoom = this.chatRooms.find(
      (room) =>
        !room.isGroup &&
        room.participants.includes(userId1) &&
        room.participants.includes(userId2) &&
        room.participants.length === 2
    );

    if (existingRoom) return existingRoom;

    const otherUserName = this.getEmployeeName(userId2);

    const newRoom: ChatRoom = {
      id: this.chatRooms.length
        ? Math.max(...this.chatRooms.map((r) => r.id)) + 1
        : 1,
      name: otherUserName,
      participants: [userId1, userId2],
      lastMessage: undefined,
      unreadCount: 0,
      isGroup: false,
    };

    this.chatRooms.push(newRoom);
    this.saveChatRooms();
    this.updateChatRooms();
    return newRoom;
  }

  markAsRead(messageId: number, userId: number): void {
    const message = this.messages.find((m) => m.id === messageId);
    if (message && !message.readBy.includes(userId)) {
      message.readBy.push(userId);
      this.updateMessages();
      this.updateChatRooms();
    }
  }

  /********** Persistence + internal updates **********/
  private getEmployeeName(employeeId: number): string {
    const names: { [key: number]: string } = {
      1: 'John Doe',
      2: 'Jane Smith',
      3: 'Michael Johnson',
      4: 'Sarah Wilson',
      5: 'David Brown',
    };
    return names[employeeId] || 'Unknown';
  }

  private updateChatRooms(): void {
    // recompute lastMessage and unreadCount for each room using currentUserId
    this.chatRooms.forEach((room) => {
      const roomMessages = this.getMessagesForRoom(room.id);
      if (roomMessages.length > 0) {
        room.lastMessage = roomMessages[roomMessages.length - 1];
        room.unreadCount = roomMessages.filter(
          (m) => !m.readBy.includes(this.currentUserId)
        ).length;
      } else {
        room.lastMessage = undefined;
        room.unreadCount = 0;
      }
    });

    this.chatRoomsSubject.next([...this.chatRooms]);
    this.saveChatRooms();
  }

  private updateMessages(): void {
    this.messagesSubject.next([...this.messages]);
    this.saveMessages();
  }

  private saveMessages(): void {
    localStorage.setItem('chatMessages', JSON.stringify(this.messages));
  }

  private saveChatRooms(): void {
    localStorage.setItem('chatRooms', JSON.stringify(this.chatRooms));
  }

  private loadMessages(): void {
    const stored = localStorage.getItem('chatMessages');
    if (stored) {
      try {
        this.messages = JSON.parse(stored);
      } catch (e) {
        console.warn('Failed parsing chatMessages from localStorage', e);
      }
    }
    this.messagesSubject.next([...this.messages]);
  }

  private loadChatRooms(): void {
    const stored = localStorage.getItem('chatRooms');
    if (stored) {
      try {
        this.chatRooms = JSON.parse(stored);
      } catch (e) {
        console.warn('Failed parsing chatRooms from localStorage', e);
      }
    }
    this.chatRoomsSubject.next([...this.chatRooms]);
  }
}
