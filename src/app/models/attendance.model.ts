export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string; // HH:mm
  checkOutTime?: string; // HH:mm
  status: 'present' | 'late' | 'absent' | 'half-day';
  workingHours: number;
}

export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  averageWorkingHours: number;
}
