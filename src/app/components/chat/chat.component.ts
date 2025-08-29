import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { ChatMessage, ChatRoom } from '../../models/chat.model';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  chatRooms: ChatRoom[] = [];
  selectedRoom: ChatRoom | null = null;
  roomMessages: ChatMessage[] = [];
  employees: Employee[] = [];
  newMessage = '';
  showEmployeeList = false;
  currentUserId: number = 1;

  @ViewChild('messagesContainer') private messagesContainer?: ElementRef;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.employeeId || 1;

    // Tell the service who the current user is (so unread counts are correct)
    this.chatService.setCurrentUserId(this.currentUserId);

    // Load all employees except the current user (for "New Chat" list)
    this.employeeService.getEmployees().subscribe((employees) => {
      this.employees = employees.filter((e) => e.id !== this.currentUserId);
    });

    // Subscribe to service rooms (service persists to localStorage)
    this.chatService.getChatRooms().subscribe((rooms) => {
      this.chatRooms = rooms
        .filter((room) => room.participants.includes(this.currentUserId))
        .map((room) => ({
          ...room,
          unreadCount: room.unreadCount ?? 0,
        }));

      // If selectedRoom exists, keep it in sync with service object
      if (this.selectedRoom) {
        const synced = this.chatRooms.find(
          (r) => r.id === this.selectedRoom!.id
        );
        if (synced) this.selectedRoom = synced;
      }
    });
  }

  ngAfterViewChecked(): void {
    // auto-scroll to latest message
    this.scrollToBottom();
  }

  ngOnDestroy(): void {}

  loadRoomMessages(room: ChatRoom): void {
    this.roomMessages = this.chatService.getMessagesForRoom(room.id);
  }

  selectRoom(room: ChatRoom): void {
    this.selectedRoom = room;
    this.loadRoomMessages(room);
    this.showEmployeeList = false;

    // mark unread messages as read
    this.roomMessages.forEach((msg) => {
      if (!msg.readBy.includes(this.currentUserId)) {
        this.chatService.markAsRead(msg.id, this.currentUserId);
      }
    });

    // refresh messages
    this.loadRoomMessages(room);
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedRoom) {
      // ✅ FIX: fetch current user directly from EmployeeService
      const sender = this.employeeService.getEmployee(this.currentUserId);
      const senderName = sender
        ? `${sender.firstName} ${sender.lastName}`
        : 'Unknown User';

      this.chatService.sendMessage(
        this.currentUserId,
        senderName,
        this.newMessage.trim(),
        this.selectedRoom.id
      );

      // refresh messages and rooms
      this.loadRoomMessages(this.selectedRoom);
      this.newMessage = '';

      // ensure UI updates unread/lastMessage via service subscription
      const latestRoom = this.chatRooms.find(
        (r) => r.id === this.selectedRoom!.id
      );
      if (latestRoom) this.selectedRoom = latestRoom;
    }
  }

  startNewChat(employeeId: number): void {
    const room = this.chatService.createPrivateRoom(
      this.currentUserId,
      employeeId
    );

    this.selectedRoom = room;
    this.loadRoomMessages(room);
    this.showEmployeeList = false;

    this.roomMessages.forEach((msg) => {
      if (!msg.readBy.includes(this.currentUserId)) {
        this.chatService.markAsRead(msg.id, this.currentUserId);
      }
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer && this.messagesContainer.nativeElement) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) {
      // ignore
    }
  }
}
