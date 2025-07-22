import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeService } from '../../../services/employee.service';

describe('EmployeeDetailComponent', () => {
  let component: EmployeeDetailComponent;
  let fixture: ComponentFixture<EmployeeDetailComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployee', 'deleteEmployee']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EmployeeDetailComponent],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailComponent);
    component = fixture.componentInstance;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default mock returns
    mockEmployeeService.getEmployee.and.returnValue({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      position: 'Developer',
      department: 'IT',
      salary: 50000,
      startDate: '2023-01-01',
      status: 'active'
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employee on init', () => {
    component.ngOnInit();
    expect(mockEmployeeService.getEmployee).toHaveBeenCalledWith(1);
    expect(component.employee).toBeTruthy();
  });

  it('should navigate to edit employee', () => {
    component.employee = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '', position: 'Developer', department: 'IT', salary: 50000, startDate: '2023-01-01', status: 'active' };
    component.editEmployee();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employee/edit', 1]);
  });

  it('should navigate back to employees list', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should calculate years of service', () => {
    component.employee = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '', position: 'Developer', department: 'IT', salary: 50000, startDate: '2020-01-01', status: 'active' };
    const years = component.getYearsOfService();
    expect(years).toBeGreaterThanOrEqual(4);
  });
});