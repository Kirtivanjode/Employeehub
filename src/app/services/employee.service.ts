import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee, EmployeeStats } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employees: Employee[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      position: 'Software Engineer',
      department: 'Engineering',
      salary: 85000,
      startDate: '2022-01-15',
      status: 'active',
      avatar:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+1 (555) 234-5678',
      position: 'Product Manager',
      department: 'Product',
      salary: 95000,
      startDate: '2021-08-20',
      status: 'active',
      avatar:
        'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@company.com',
      phone: '+1 (555) 345-6789',
      position: 'UX Designer',
      department: 'Design',
      salary: 78000,
      startDate: '2023-03-10',
      status: 'active',
      avatar:
        'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@company.com',
      phone: '+1 (555) 456-7890',
      position: 'HR Manager',
      department: 'Human Resources',
      salary: 82000,
      startDate: '2020-11-05',
      status: 'inactive',
      avatar:
        'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@company.com',
      phone: '+1 (555) 567-8901',
      position: 'Data Analyst',
      department: 'Analytics',
      salary: 72000,
      startDate: '2022-06-15',
      status: 'active',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    },
  ];

  private employeesSubject = new BehaviorSubject<Employee[]>(this.employees);

  constructor() {
    this.loadEmployees();
  }

  getEmployees(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

  getEmployee(id: number): Employee | undefined {
    return this.employees.find((emp) => emp.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id'>): void {
    const newEmployee: Employee = {
      ...employee,
      id: Math.max(...this.employees.map((e) => e.id)) + 1,
    };
    this.employees.push(newEmployee);
    this.updateEmployees();
  }

  updateEmployee(id: number, employee: Partial<Employee>): void {
    const index = this.employees.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...employee };
      this.updateEmployees();
    }
  }

  deleteEmployee(id: number): void {
    this.employees = this.employees.filter((emp) => emp.id !== id);
    this.updateEmployees();
  }

  getStats(): EmployeeStats {
    const totalEmployees = this.employees.length;
    const activeEmployees = this.employees.filter(
      (emp) => emp.status === 'active'
    ).length;
    const inactiveEmployees = totalEmployees - activeEmployees;

    const departmentCounts = this.employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const departments = Object.entries(departmentCounts).map(
      ([name, count]) => ({
        name,
        count,
      })
    );

    const averageSalary =
      this.employees.reduce((sum, emp) => sum + emp.salary, 0) / totalEmployees;

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      departments,
      averageSalary,
    };
  }

  private updateEmployees(): void {
    this.employeesSubject.next([...this.employees]);
    this.saveEmployees();
  }

  private saveEmployees(): void {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }

  private loadEmployees(): void {
    const stored = localStorage.getItem('employees');
    if (stored) {
      this.employees = JSON.parse(stored);
      this.employeesSubject.next([...this.employees]);
    }
  }
}
