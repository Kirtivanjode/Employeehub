import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeaveRequest, LeaveBalance } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      employeeId: 1,
      employeeName: 'John Doe',
      leaveType: 'vacation',
      startDate: '2025-02-15',
      endDate: '2025-02-20',
      reason: 'Family vacation',
      status: 'pending',
      appliedDate: '2025-01-15'
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Jane Smith',
      leaveType: 'sick',
      startDate: '2025-01-20',
      endDate: '2025-01-22',
      reason: 'Flu symptoms',
      status: 'approved',
      appliedDate: '2025-01-18',
      approvedBy: 1,
      approvedDate: '2025-01-19'
    }
  ];

  private leaveBalances: LeaveBalance[] = [
    { employeeId: 1, sickLeave: 10, vacation: 15, personal: 5 },
    { employeeId: 2, sickLeave: 8, vacation: 12, personal: 5 },
    { employeeId: 3, sickLeave: 10, vacation: 15, personal: 5 },
    { employeeId: 4, sickLeave: 9, vacation: 13, personal: 4 },
    { employeeId: 5, sickLeave: 10, vacation: 15, personal: 5 }
  ];

  private leaveRequestsSubject = new BehaviorSubject<LeaveRequest[]>(this.leaveRequests);

  constructor() {
    this.loadLeaveRequests();
  }

  getLeaveRequests(): Observable<LeaveRequest[]> {
    return this.leaveRequestsSubject.asObservable();
  }

  getEmployeeLeaveRequests(employeeId: number): LeaveRequest[] {
    return this.leaveRequests.filter(req => req.employeeId === employeeId);
  }

  getLeaveBalance(employeeId: number): LeaveBalance | undefined {
    return this.leaveBalances.find(balance => balance.employeeId === employeeId);
  }

  applyLeave(leaveRequest: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>): void {
    const newRequest: LeaveRequest = {
      ...leaveRequest,
      id: Math.max(...this.leaveRequests.map(r => r.id), 0) + 1,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    this.leaveRequests.push(newRequest);
    this.updateLeaveRequests();
  }

  approveLeave(requestId: number, approvedBy: number, comments?: string): void {
    const request = this.leaveRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'approved';
      request.approvedBy = approvedBy;
      request.approvedDate = new Date().toISOString().split('T')[0];
      request.comments = comments;
      this.updateLeaveRequests();
    }
  }

  rejectLeave(requestId: number, approvedBy: number, comments?: string): void {
    const request = this.leaveRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'rejected';
      request.approvedBy = approvedBy;
      request.approvedDate = new Date().toISOString().split('T')[0];
      request.comments = comments;
      this.updateLeaveRequests();
    }
  }

  private updateLeaveRequests(): void {
    this.leaveRequestsSubject.next([...this.leaveRequests]);
    this.saveLeaveRequests();
  }

  private saveLeaveRequests(): void {
    localStorage.setItem('leaveRequests', JSON.stringify(this.leaveRequests));
  }

  private loadLeaveRequests(): void {
    const stored = localStorage.getItem('leaveRequests');
    if (stored) {
      this.leaveRequests = JSON.parse(stored);
      this.leaveRequestsSubject.next([...this.leaveRequests]);
    }
  }
}