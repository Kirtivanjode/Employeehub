import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AttendanceRecord, AttendanceStats } from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private attendanceRecords: AttendanceRecord[] = [
    // Today's attendance
    {
      id: 1,
      employeeId: 1,
      employeeName: 'John Doe',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '09:00',
      checkOutTime: '17:30',
      status: 'present',
      workingHours: 8.5,
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Jane Smith',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '09:15',
      checkOutTime: '17:45',
      status: 'late',
      workingHours: 8.5,
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: 'Michael Johnson',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '08:45',
      status: 'present',
      workingHours: 0,
    },
    {
      id: 4,
      employeeId: 4,
      employeeName: 'Sarah Wilson',
      date: new Date().toISOString().split('T')[0],
      status: 'absent',
      workingHours: 0,
    },
    {
      id: 5,
      employeeId: 5,
      employeeName: 'David Brown',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '09:30',
      checkOutTime: '13:30',
      status: 'half-day',
      workingHours: 4,
    },
    {
      id: 6,
      employeeId: 6,
      employeeName: 'Emily Davis',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '08:30',
      checkOutTime: '17:00',
      status: 'present',
      workingHours: 8.5,
    },
    {
      id: 7,
      employeeId: 7,
      employeeName: 'Robert Miller',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '09:45',
      checkOutTime: '18:15',
      status: 'late',
      workingHours: 8.5,
    },
    {
      id: 8,
      employeeId: 8,
      employeeName: 'Lisa Anderson',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '09:00',
      checkOutTime: '17:30',
      status: 'present',
      workingHours: 8.5,
    },
    {
      id: 9,
      employeeId: 9,
      employeeName: 'James Taylor',
      date: new Date().toISOString().split('T')[0],
      status: 'absent',
      workingHours: 0,
    },
    {
      id: 10,
      employeeId: 10,
      employeeName: 'Maria Garcia',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '08:45',
      checkOutTime: '17:15',
      status: 'present',
      workingHours: 8.5,
    },
    {
      id: 11,
      employeeId: 11,
      employeeName: 'Kevin White',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '10:00',
      checkOutTime: '14:00',
      status: 'half-day',
      workingHours: 4,
    },
    {
      id: 12,
      employeeId: 12,
      employeeName: 'Amanda Clark',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '09:20',
      checkOutTime: '17:50',
      status: 'late',
      workingHours: 8.5,
    },
    {
      id: 13,
      employeeId: 13,
      employeeName: 'Daniel Lewis',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '08:55',
      checkOutTime: '17:25',
      status: 'present',
      workingHours: 8.5,
    },
    {
      id: 14,
      employeeId: 14,
      employeeName: 'Rachel Martinez',
      date: new Date().toISOString().split('T')[0],
      status: 'absent',
      workingHours: 0,
    },
    {
      id: 15,
      employeeId: 15,
      employeeName: 'Christopher Lee',
      date: new Date().toISOString().split('T')[0],
      checkInTime: '09:10',
      checkOutTime: '17:40',
      status: 'present',
      workingHours: 8.5,
    },
    // Yesterday's attendance for history
    {
      id: 16,
      employeeId: 1,
      employeeName: 'John Doe',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      checkInTime: '08:55',
      checkOutTime: '17:25',
      status: 'present',
      workingHours: 8.5,
    },
    {
      id: 17,
      employeeId: 2,
      employeeName: 'Jane Smith',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      checkInTime: '09:00',
      checkOutTime: '17:30',
      status: 'present',
      workingHours: 8.5,
    },
    {
      id: 18,
      employeeId: 3,
      employeeName: 'Michael Johnson',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      checkInTime: '09:30',
      checkOutTime: '17:45',
      status: 'late',
      workingHours: 8.25,
    },
    {
      id: 19,
      employeeId: 4,
      employeeName: 'Sarah Wilson',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      checkInTime: '09:05',
      checkOutTime: '17:35',
      status: 'present',
      workingHours: 8.5,
    },
    {
      id: 20,
      employeeId: 5,
      employeeName: 'David Brown',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      status: 'absent',
      workingHours: 0,
    },
  ];

  private attendanceSubject = new BehaviorSubject<AttendanceRecord[]>(
    this.attendanceRecords
  );

  constructor() {
    this.loadAttendance();
  }

  getAttendanceRecords(): Observable<AttendanceRecord[]> {
    return this.attendanceSubject.asObservable();
  }

  getTodayAttendance(): AttendanceRecord[] {
    const today = new Date().toISOString().split('T')[0];
    return this.attendanceRecords.filter((record) => record.date === today);
  }

  getEmployeeAttendance(employeeId: number): AttendanceRecord[] {
    return this.attendanceRecords.filter(
      (record) => record.employeeId === employeeId
    );
  }

  checkIn(employeeId: number, employeeName: string): void {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().slice(0, 5);

    const existingRecord = this.attendanceRecords.find(
      (record) => record.employeeId === employeeId && record.date === today
    );

    if (existingRecord) {
      existingRecord.checkInTime = currentTime;
      existingRecord.status = this.getStatusFromTime(currentTime);
    } else {
      const newRecord: AttendanceRecord = {
        id: Math.max(...this.attendanceRecords.map((r) => r.id), 0) + 1,
        employeeId,
        employeeName,
        date: today,
        checkInTime: currentTime,
        status: this.getStatusFromTime(currentTime),
        workingHours: 0,
      };
      this.attendanceRecords.push(newRecord);
    }

    this.updateAttendance();
  }

  checkOut(employeeId: number): void {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().slice(0, 5);

    const record = this.attendanceRecords.find(
      (record) => record.employeeId === employeeId && record.date === today
    );

    if (record && record.checkInTime) {
      record.checkOutTime = currentTime;
      record.workingHours = this.calculateWorkingHours(
        record.checkInTime,
        currentTime
      );
    }

    this.updateAttendance();
  }

  getAttendanceStats(): AttendanceStats {
    const todayRecords = this.getTodayAttendance();
    const totalEmployees = 15; // Updated to reflect all employees

    return {
      totalEmployees,
      presentToday: todayRecords.filter(
        (r) => r.status === 'present' || r.status === 'late'
      ).length,
      absentToday: todayRecords.filter((r) => r.status === 'absent').length,
      lateToday: todayRecords.filter((r) => r.status === 'late').length,
      averageWorkingHours:
        todayRecords.reduce((sum, r) => sum + (r.workingHours || 0), 0) /
          todayRecords.length || 0,
    };
  }

  private getStatusFromTime(checkInTime: string): 'present' | 'late' {
    const [hours, minutes] = checkInTime.split(':').map(Number);
    const checkInMinutes = hours * 60 + minutes;
    const standardStartTime = 9 * 60; // 9:00 AM in minutes

    return checkInMinutes > standardStartTime ? 'late' : 'present';
  }

  private calculateWorkingHours(checkIn: string, checkOut: string): number {
    const [inHours, inMinutes] = checkIn.split(':').map(Number);
    const [outHours, outMinutes] = checkOut.split(':').map(Number);

    const inTotalMinutes = inHours * 60 + inMinutes;
    const outTotalMinutes = outHours * 60 + outMinutes;

    return (outTotalMinutes - inTotalMinutes) / 60;
  }

  private updateAttendance(): void {
    this.attendanceSubject.next([...this.attendanceRecords]);
    this.saveAttendance();
  }

  private saveAttendance(): void {
    localStorage.setItem('attendance', JSON.stringify(this.attendanceRecords));
  }

  private loadAttendance(): void {
    const stored = localStorage.getItem('attendance');
    if (stored) {
      this.attendanceRecords = JSON.parse(stored);
      this.attendanceSubject.next([...this.attendanceRecords]);
    }
  }
}
