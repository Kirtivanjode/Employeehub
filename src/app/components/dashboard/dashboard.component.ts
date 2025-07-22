import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeStats } from '../../models/employee.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stats: EmployeeStats = {
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    departments: [],
    averageSalary: 0,
  };
  recentEmployees: Employee[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentEmployees();
  }

  loadStats(): void {
    this.stats = this.employeeService.getStats();
  }

  loadRecentEmployees(): void {
    this.employeeService.getEmployees().subscribe((employees) => {
      this.recentEmployees = employees
        .sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )
        .slice(0, 4);
    });
  }

  viewEmployee(id: number): void {
    this.router.navigate(['/employee', id]);
  }

  goToEmployees(): void {
    this.router.navigate(['/employees']);
  }

  addEmployee(): void {
    this.router.navigate(['/employee/new']);
  }
}
