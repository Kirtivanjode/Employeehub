import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { LeaveRequest, LeaveBalance } from '../../models/leave.model';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.css'],
})
export class LeaveManagementComponent implements OnInit {
  leaveForm: FormGroup;
  leaveRequests: LeaveRequest[] = [];
  filteredRequests: LeaveRequest[] = [];
  leaveBalance: LeaveBalance | null = null;
  showApplyForm = false;
  isAdmin = false;
  currentEmployeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.currentEmployeeId = user?.employeeId || null;

    this.loadLeaveRequests();
    if (!this.isAdmin && this.currentEmployeeId) {
      this.loadLeaveBalance();
    }
  }

  loadLeaveRequests(): void {
    this.leaveService.getLeaveRequests().subscribe((requests) => {
      this.leaveRequests = requests;
      this.filterRequests();
    });
  }

  loadLeaveBalance(): void {
    if (this.currentEmployeeId) {
      this.leaveBalance =
        this.leaveService.getLeaveBalance(this.currentEmployeeId) ?? null;
    }
  }

  filterRequests(): void {
    if (this.isAdmin) {
      this.filteredRequests = this.leaveRequests;
    } else if (this.currentEmployeeId) {
      this.filteredRequests = this.leaveRequests.filter(
        (req) => req.employeeId === this.currentEmployeeId
      );
    }
  }

  onSubmit(): void {
    if (this.leaveForm.valid && this.currentEmployeeId) {
      const user = this.authService.getCurrentUser();
      const employee = this.employeeService.getEmployee(this.currentEmployeeId);

      if (employee) {
        const leaveRequest = {
          ...this.leaveForm.value,
          employeeId: this.currentEmployeeId,
          employeeName: `${employee.firstName} ${employee.lastName}`,
        };

        this.leaveService.applyLeave(leaveRequest);
        this.leaveForm.reset();
        this.showApplyForm = false;
        this.loadLeaveRequests();
      }
    }
  }

  approveLeave(requestId: number): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.leaveService.approveLeave(requestId, user.id);
      this.loadLeaveRequests();
    }
  }

  rejectLeave(requestId: number): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.leaveService.rejectLeave(requestId, user.id);
      this.loadLeaveRequests();
    }
  }
}
