export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'sick' | 'vacation' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: number;
  approvedDate?: string;
  comments?: string;
}

export interface LeaveBalance {
  employeeId: number;
  sickLeave: number;
  vacation: number;
  personal: number;
}