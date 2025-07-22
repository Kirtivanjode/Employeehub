import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ChatComponent } from './chat.component';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employee.service';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let mockChatService: jasmine.SpyObj<ChatService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(async () => {
    const chatServiceSpy = jasmine.createSpyObj('ChatService', ['getChatRooms', 'getMessagesForRoom', 'sendMessage', 'markAsRead', 'createPrivateRoom']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployees']);

    await TestBed.configureTestingModule({
      imports: [ChatComponent, FormsModule],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    mockChatService = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;

    // Setup default mock returns
    mockChatService.getChatRooms.and.returnValue(of([]));
    mockEmployeeService.getEmployees.and.returnValue(of([]));
    mockAuthService.getCurrentUser.and.returnValue({ id: 1, email: 'test@example.com', password: 'test', role: 'employee', employeeId: 1 });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load chat rooms and employees on init', () => {
    component.ngOnInit();
    expect(mockChatService.getChatRooms).toHaveBeenCalled();
    expect(mockEmployeeService.getEmployees).toHaveBeenCalled();
  });

  it('should send message when form is valid', () => {
    const mockRoom = { id: 1, name: 'Test Room', participants: [1, 2], isGroup: false, unreadCount: 0 };
    component.selectedRoom = mockRoom;
    component.newMessage = 'Test message';
    mockChatService.getMessagesForRoom.and.returnValue([]);

    component.sendMessage();

    expect(mockChatService.sendMessage).toHaveBeenCalled();
    expect(component.newMessage).toBe('');
  });

  it('should not send empty message', () => {
    const mockRoom = { id: 1, name: 'Test Room', participants: [1, 2], isGroup: false, unreadCount: 0 };
    component.selectedRoom = mockRoom;
    component.newMessage = '   ';

    component.sendMessage();

    expect(mockChatService.sendMessage).not.toHaveBeenCalled();
  });
});