import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { EmployeeService } from '../../../services/employee.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getStats', 'getEmployees']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default mock returns
    mockEmployeeService.getStats.and.returnValue({
      totalEmployees: 5,
      activeEmployees: 4,
      inactiveEmployees: 1,
      departments: [{ name: 'Engineering', count: 3 }],
      averageSalary: 80000
    });
    mockEmployeeService.getEmployees.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on init', () => {
    component.ngOnInit();
    expect(mockEmployeeService.getStats).toHaveBeenCalled();
    expect(component.stats.totalEmployees).toBe(5);
  });

  it('should navigate to employee detail', () => {
    component.viewEmployee(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employee', 1]);
  });

  it('should navigate to employees list', () => {
    component.goToEmployees();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should navigate to add employee', () => {
    component.addEmployee();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employee/new']);
  });
});