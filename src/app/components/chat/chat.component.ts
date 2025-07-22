import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ChatComponent implements OnInit, OnDestroy {
  chatRooms: ChatRoom[] = [];
  selectedRoom: ChatRoom | null = null;
  roomMessages: ChatMessage[] = [];
  employees: Employee[] = [];
  newMessage = '';
  showEmployeeList = false;
  currentUserId: number = 1; // This should come from auth service

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.employeeId || 1;

    this.loadChatRooms();
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions if needed
  }

  loadChatRooms(): void {
    this.chatService.getChatRooms().subscribe((rooms) => {
      this.chatRooms = rooms;
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((employees) => {
      this.employees = employees.filter((emp) => emp.id !== this.currentUserId);
    });
  }

  selectRoom(room: ChatRoom): void {
    this.selectedRoom = room;
    this.roomMessages = this.chatService.getMessagesForRoom(room.id);
    this.showEmployeeList = false;

    // Mark messages as read
    this.roomMessages.forEach((message) => {
      if (!message.readBy.includes(this.currentUserId)) {
        this.chatService.markAsRead(message.id, this.currentUserId);
      }
    });
  }

  startPrivateChat(employeeId: number): void {
    const room = this.chatService.createPrivateRoom(
      this.currentUserId,
      employeeId
    );
    this.loadChatRooms();
    this.selectRoom(room);
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedRoom) {
      const user = this.authService.getCurrentUser();
      const employee = this.employees.find(
        (emp) => emp.id === this.currentUserId
      );
      const senderName = employee
        ? `${employee.firstName} ${employee.lastName}`
        : 'Current User';

      this.chatService.sendMessage(
        this.currentUserId,
        senderName,
        this.newMessage.trim(),
        this.selectedRoom.id
      );

      this.newMessage = '';
      this.roomMessages = this.chatService.getMessagesForRoom(
        this.selectedRoom.id
      );
      this.loadChatRooms(); // Refresh to update last message
    }
  }
}
