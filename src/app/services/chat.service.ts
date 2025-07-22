import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage, ChatRoom } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
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
      readBy: [1]
    },
    {
      id: 2,
      senderId: 2,
      senderName: 'Jane Smith',
      receiverId: 1,
      receiverName: 'John Doe',
      message: 'Hi John! It\'s going well, should be done by tomorrow.',
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      isGroupMessage: false,
      readBy: [2]
    },
    {
      id: 3,
      senderId: 3,
      senderName: 'Michael Johnson',
      message: 'Good morning everyone! Ready for the sprint planning?',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isGroupMessage: true,
      readBy: [3]
    }
  ];

  private chatRooms: ChatRoom[] = [
    {
      id: 1,
      name: 'General',
      participants: [1, 2, 3, 4, 5],
      isGroup: true,
      unreadCount: 1
    },
    {
      id: 2,
      name: 'John Doe',
      participants: [1, 2],
      isGroup: false,
      unreadCount: 0
    }
  ];

  private messagesSubject = new BehaviorSubject<ChatMessage[]>(this.messages);
  private chatRoomsSubject = new BehaviorSubject<ChatRoom[]>(this.chatRooms);

  constructor() {
    this.loadMessages();
    this.updateChatRooms();
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  getChatRooms(): Observable<ChatRoom[]> {
    return this.chatRoomsSubject.asObservable();
  }

  getMessagesForRoom(roomId: number): ChatMessage[] {
    const room = this.chatRooms.find(r => r.id === roomId);
    if (!room) return [];

    if (room.isGroup) {
      return this.messages.filter(m => m.isGroupMessage);
    } else {
      return this.messages.filter(m => 
        !m.isGroupMessage && 
        room.participants.includes(m.senderId) && 
        (m.receiverId ? room.participants.includes(m.receiverId) : false)
      );
    }
  }

  sendMessage(senderId: number, senderName: string, message: string, roomId: number): void {
    const room = this.chatRooms.find(r => r.id === roomId);
    if (!room) return;

    const newMessage: ChatMessage = {
      id: Math.max(...this.messages.map(m => m.id), 0) + 1,
      senderId,
      senderName,
      message,
      timestamp: new Date().toISOString(),
      isGroupMessage: room.isGroup,
      readBy: [senderId]
    };

    if (!room.isGroup && room.participants.length === 2) {
      const receiverId = room.participants.find(id => id !== senderId);
      if (receiverId) {
        const receiverName = this.getEmployeeName(receiverId);
        newMessage.receiverId = receiverId;
        newMessage.receiverName = receiverName;
      }
    }

    this.messages.push(newMessage);
    this.updateMessages();
    this.updateChatRooms();
  }

  markAsRead(messageId: number, userId: number): void {
    const message = this.messages.find(m => m.id === messageId);
    if (message && !message.readBy.includes(userId)) {
      message.readBy.push(userId);
      this.updateMessages();
    }
  }

  createPrivateRoom(participant1: number, participant2: number): ChatRoom {
    const existingRoom = this.chatRooms.find(room => 
      !room.isGroup && 
      room.participants.includes(participant1) && 
      room.participants.includes(participant2)
    );

    if (existingRoom) {
      return existingRoom;
    }

    const newRoom: ChatRoom = {
      id: Math.max(...this.chatRooms.map(r => r.id), 0) + 1,
      name: this.getEmployeeName(participant1 === 1 ? participant2 : participant1),
      participants: [participant1, participant2],
      isGroup: false,
      unreadCount: 0
    };

    this.chatRooms.push(newRoom);
    this.updateChatRooms();
    return newRoom;
  }

  private getEmployeeName(employeeId: number): string {
    const names: { [key: number]: string } = {
      1: 'John Doe',
      2: 'Jane Smith',
      3: 'Michael Johnson',
      4: 'Sarah Wilson',
      5: 'David Brown'
    };
    return names[employeeId] || 'Unknown';
  }

  private updateChatRooms(): void {
    // Update last message and unread count for each room
    this.chatRooms.forEach(room => {
      const roomMessages = this.getMessagesForRoom(room.id);
      if (roomMessages.length > 0) {
        room.lastMessage = roomMessages[roomMessages.length - 1];
        room.unreadCount = roomMessages.filter(m => !m.readBy.includes(1)).length; // Assuming current user ID is 1
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
      this.messages = JSON.parse(stored);
      this.messagesSubject.next([...this.messages]);
    }
  }
}