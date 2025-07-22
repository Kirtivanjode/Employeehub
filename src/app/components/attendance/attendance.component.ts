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
    this.isAdmin = this.authService.isAdmin();
    this.currentEmployeeId = user?.employeeId || null;

    this.loadAttendanceData();
    this.checkTodayStatus();
  }

  loadAttendanceData(): void {
    this.attendanceService.getAttendanceRecords().subscribe((records) => {
      this.attendanceRecords = records;

      if (this.isAdmin) {
        this.displayedRecords = this.attendanceService.getTodayAttendance();
        this.attendanceStats = this.attendanceService.getAttendanceStats();
      } else if (this.currentEmployeeId) {
        this.displayedRecords = this.attendanceService
          .getTodayAttendance()
          .filter((record) => record.employeeId === this.currentEmployeeId);
        this.employeeHistory = this.attendanceService
          .getEmployeeAttendance(this.currentEmployeeId)
          .slice(-10); // Show last 10 records
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
    if (this.currentEmployeeId) {
      const user = this.authService.getCurrentUser();
      if (user?.employeeId) {
        const employeeName = 'Current Employee';
        this.attendanceService.checkIn(this.currentEmployeeId, employeeName);
        this.hasCheckedIn = true;
        this.loadAttendanceData();
      }
    }
  }

  checkOut(): void {
    if (this.currentEmployeeId) {
      this.attendanceService.checkOut(this.currentEmployeeId);
      this.hasCheckedOut = true;

      this.loadAttendanceData();
    }
  }
}
