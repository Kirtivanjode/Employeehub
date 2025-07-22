import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EmployeeFormComponent } from './employee-form.component';
import { EmployeeService } from '../../../services/employee.service';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployee', 'addEmployee', 'updateEmployee']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('new')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EmployeeFormComponent, ReactiveFormsModule],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.employeeForm.get('firstName')?.value).toBe('');
    expect(component.employeeForm.get('lastName')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const firstNameControl = component.employeeForm.get('firstName');
    const lastNameControl = component.employeeForm.get('lastName');

    expect(firstNameControl?.valid).toBeFalsy();
    expect(lastNameControl?.valid).toBeFalsy();

    firstNameControl?.setValue('John');
    lastNameControl?.setValue('Doe');

    expect(firstNameControl?.valid).toBeTruthy();
    expect(lastNameControl?.valid).toBeTruthy();
  });

  it('should navigate back to employees list', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees']);
  });
});