import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

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

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
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

  editEmployee(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['/employee/edit', id]);
  }

  deleteEmployee(event: Event, id: number): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id);
      this.loadEmployees();
    }
  }

  addEmployee(): void {
    this.router.navigate(['/employee/new']);
  }
}
