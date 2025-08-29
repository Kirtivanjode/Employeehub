import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = '';
  statusFilter = '';
  departmentFilter = '';
  departments: string[] = [];
  isAdmin = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin(); // ✅ check role
    this.loadEmployees();
  }

  // ... existing code ...

  editEmployee(event: Event, id: number): void {
    if (!this.isAdmin) {
      alert('Only admins can edit employees.');
      return;
    }
    event.stopPropagation();
    this.router.navigate(['/employee/edit', id]);
  }

  deleteEmployee(event: Event, id: number): void {
    if (!this.isAdmin) {
      alert('Only admins can delete employees.');
      return;
    }
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id);
      this.loadEmployees();
    }
  }

  addEmployee(): void {
    if (this.isAdmin) {
      this.router.navigate(['/employee/new']);
    } else {
      alert('Only admins can add employees.');
    }
  }
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((employees) => {
      this.employees = employees;
      this.filteredEmployees = employees;
      this.extractDepartments();
    });
  }

  extractDepartments(): void {
    this.departments = [
      ...new Set(this.employees.map((emp) => emp.department)),
    ];
  }

  filterEmployees(): void {
    this.filteredEmployees = this.employees.filter((employee) => {
      const matchesSearch =
        !this.searchTerm ||
        employee.firstName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        employee.lastName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.position
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        employee.department
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        !this.statusFilter || employee.status === this.statusFilter;
      const matchesDepartment =
        !this.departmentFilter || employee.department === this.departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }

  viewEmployee(id: number): void {
    this.router.navigate(['/employee', id]);
  }
}
