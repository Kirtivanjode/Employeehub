import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employee =
        this.employeeService.getEmployee(parseInt(id, 10)) || null;
    }
  }

  editEmployee(): void {
    if (this.employee) {
      this.router.navigate(['/employee/edit', this.employee.id]);
    }
  }

  deleteEmployee(): void {
    if (
      this.employee &&
      confirm('Are you sure you want to delete this employee?')
    ) {
      this.employeeService.deleteEmployee(this.employee.id);
      this.router.navigate(['/employees']);
    }
  }

  getYearsOfService(): number {
    if (!this.employee) return 0;
    const startDate = new Date(this.employee.startDate);
    const today = new Date();
    return Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    );
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
