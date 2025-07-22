import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditing = false;
  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      status: ['', Validators.required],
      avatar: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditing = true;
      this.employeeId = parseInt(id, 10);
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    if (this.employeeId) {
      const employee = this.employeeService.getEmployee(this.employeeId);
      if (employee) {
        this.employeeForm.patchValue(employee);
      }
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      if (this.isEditing && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, formValue);
      } else {
        this.employeeService.addEmployee(formValue);
      }

      this.router.navigate(['/employees']);
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
