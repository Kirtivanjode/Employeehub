import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';
import { AuthService } from '../../services/auth.service';
import {
  AttendanceRecord,
  AttendanceStats,
} from '../../models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: AttendanceRecord[] = [];
  displayedRecords: AttendanceRecord[] = [];
  employeeHistory: AttendanceRecord[] = [];
  attendanceStats: AttendanceStats = {
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    averageWorkingHours: 0,
  };

  isAdmin = false;
  currentEmployeeId: number | null = null;
  hasCheckedIn = false;
  hasCheckedOut = false;

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    console.log('Current user from AuthService:', user);

    this.isAdmin = this.authService.isAdmin();
    this.currentEmployeeId = user?.employeeId || null;

    console.log('Is Admin:', this.isAdmin);
    console.log('Current Employee ID:', this.currentEmployeeId);

    this.loadAttendanceData();
    this.checkTodayStatus();
  }
  loadAttendanceData(): void {
    this.attendanceService.getAttendanceRecords().subscribe((records) => {
      this.attendanceRecords = records;
      console.log('All attendance records:', this.attendanceRecords);

      if (this.isAdmin) {
        this.displayedRecords = this.attendanceService.getTodayAttendance();
        this.attendanceStats = this.attendanceService.getAttendanceStats();
        console.log("Today's attendance (Admin view):", this.displayedRecords);
        console.log('Attendance stats:', this.attendanceStats);
      } else if (this.currentEmployeeId) {
        this.displayedRecords = this.attendanceService
          .getTodayAttendance()
          .filter((record) => record.employeeId === this.currentEmployeeId);
        console.log(
          "Today's attendance (Current employee):",
          this.displayedRecords
        );

        this.employeeHistory = this.attendanceService
          .getEmployeeAttendance(this.currentEmployeeId)
          .slice(-10); // Show last 10 records
        console.log('Employee history (last 10):', this.employeeHistory);
      }
    });
  }

  checkTodayStatus(): void {
    if (this.currentEmployeeId) {
      const todayRecord = this.attendanceService
        .getTodayAttendance()
        .find((record) => record.employeeId === this.currentEmployeeId);

      this.hasCheckedIn = !!todayRecord?.checkInTime;
      this.hasCheckedOut = !!todayRecord?.checkOutTime;
    }
  }

  checkIn(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !user.employeeId) return;

    const employeeId = user.employeeId;
    const employeeName = user.name || 'Unknown Employee';

    this.attendanceService.checkIn(employeeId, employeeName);
    this.hasCheckedIn = true;
    this.loadAttendanceData();
  }

  checkOut(): void {
    if (this.currentEmployeeId) {
      console.log('Checking out:', this.currentEmployeeId);

      this.attendanceService.checkOut(this.currentEmployeeId);
      this.hasCheckedOut = true;
      this.loadAttendanceData();
    }
  }
}
