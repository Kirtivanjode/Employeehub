import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { LeaveManagementComponent } from './leave-management.component';
import { LeaveService } from '../../../services/leave.service';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employee.service';

describe('LeaveManagementComponent', () => {
  let component: LeaveManagementComponent;
  let fixture: ComponentFixture<LeaveManagementComponent>;
  let mockLeaveService: jasmine.SpyObj<LeaveService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(async () => {
    const leaveServiceSpy = jasmine.createSpyObj('LeaveService', ['getLeaveRequests', 'getLeaveBalance', 'applyLeave', 'approveLeave', 'rejectLeave']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAdmin']);
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployee']);

    await TestBed.configureTestingModule({
      imports: [LeaveManagementComponent, ReactiveFormsModule],
      providers: [
        { provide: LeaveService, useValue: leaveServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveManagementComponent);
    component = fixture.componentInstance;
    mockLeaveService = TestBed.inject(LeaveService) as jasmine.SpyObj<LeaveService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;

    // Setup default mock returns
    mockLeaveService.getLeaveRequests.and.returnValue(of([]));
    mockAuthService.getCurrentUser.and.returnValue({ id: 1, email: 'test@example.com', password: 'test', role: 'employee', employeeId: 1 });
    mockAuthService.isAdmin.and.returnValue(false);
    mockLeaveService.getLeaveBalance.and.returnValue({ employeeId: 1, sickLeave: 10, vacation: 15, personal: 5 });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load leave requests on init', () => {
    component.ngOnInit();
    expect(mockLeaveService.getLeaveRequests).toHaveBeenCalled();
  });

  it('should load leave balance for non-admin users', () => {
    component.ngOnInit();
    expect(mockLeaveService.getLeaveBalance).toHaveBeenCalledWith(1);
  });

  it('should submit leave request when form is valid', () => {
    component.currentEmployeeId = 1;
    mockEmployeeService.getEmployee.and.returnValue({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '',
      position: 'Developer',
      department: 'IT',
      salary: 50000,
      startDate: '2023-01-01',
      status: 'active'
    });

    component.leaveForm.patchValue({
      leaveType: 'vacation',
      startDate: '2025-02-01',
      endDate: '2025-02-05',
      reason: 'Family vacation'
    });

    component.onSubmit();

    expect(mockLeaveService.applyLeave).toHaveBeenCalled();
    expect(component.showApplyForm).toBeFalsy();
  });

  it('should approve leave request', () => {
    component.approveLeave(1);
    expect(mockLeaveService.approveLeave).toHaveBeenCalledWith(1, 1);
  });

  it('should reject leave request', () => {
    component.rejectLeave(1);
    expect(mockLeaveService.rejectLeave).toHaveBeenCalledWith(1, 1);
  });
});