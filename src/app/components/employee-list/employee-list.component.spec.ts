import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../../../services/employee.service';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'deleteEmployee']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EmployeeListComponent, FormsModule],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default mock returns
    mockEmployeeService.getEmployees.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    component.ngOnInit();
    expect(mockEmployeeService.getEmployees).toHaveBeenCalled();
  });

  it('should navigate to employee detail', () => {
    component.viewEmployee(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employee', 1]);
  });

  it('should navigate to edit employee', () => {
    const event = new Event('click');
    component.editEmployee(event, 1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employee/edit', 1]);
  });

  it('should navigate to add employee', () => {
    component.addEmployee();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employee/new']);
  });

  it('should filter employees by search term', () => {
    component.employees = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '', position: 'Developer', department: 'IT', salary: 50000, startDate: '2023-01-01', status: 'active' }
    ];
    component.searchTerm = 'John';
    component.filterEmployees();
    expect(component.filteredEmployees.length).toBe(1);
  });
});