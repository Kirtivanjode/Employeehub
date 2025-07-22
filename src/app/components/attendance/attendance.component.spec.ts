import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AttendanceComponent } from './attendance.component';
import { AttendanceService } from '../../../services/attendance.service';
import { AuthService } from '../../../services/auth.service';

describe('AttendanceComponent', () => {
  let component: AttendanceComponent;
  let fixture: ComponentFixture<AttendanceComponent>;
  let mockAttendanceService: jasmine.SpyObj<AttendanceService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const attendanceServiceSpy = jasmine.createSpyObj('AttendanceService', ['getAttendanceRecords', 'getTodayAttendance', 'getAttendanceStats', 'getEmployeeAttendance', 'checkIn', 'checkOut']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAdmin']);

    await TestBed.configureTestingModule({
      imports: [AttendanceComponent],
      providers: [
        { provide: AttendanceService, useValue: attendanceServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AttendanceComponent);
    component = fixture.componentInstance;
    mockAttendanceService = TestBed.inject(AttendanceService) as jasmine.SpyObj<AttendanceService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Setup default mock returns
    mockAttendanceService.getAttendanceRecords.and.returnValue(of([]));
    mockAttendanceService.getTodayAttendance.and.returnValue([]);
    mockAttendanceService.getAttendanceStats.and.returnValue({
      totalEmployees: 0,
      presentToday: 0,
      absentToday: 0,
      lateToday: 0,
      averageWorkingHours: 0
    });
    mockAuthService.getCurrentUser.and.returnValue({ id: 1, email: 'test@example.com', password: 'test', role: 'employee', employeeId: 1 });
    mockAuthService.isAdmin.and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load attendance data on init', () => {
    component.ngOnInit();
    expect(mockAttendanceService.getAttendanceRecords).toHaveBeenCalled();
  });

  it('should check in employee', () => {
    component.currentEmployeeId = 1;
    component.checkIn();
    expect(mockAttendanceService.checkIn).toHaveBeenCalled();
    expect(component.hasCheckedIn).toBeTruthy();
  });

  it('should check out employee', () => {
    component.currentEmployeeId = 1;
    component.checkOut();
    expect(mockAttendanceService.checkOut).toHaveBeenCalledWith(1);
    expect(component.hasCheckedOut).toBeTruthy();
  });
});