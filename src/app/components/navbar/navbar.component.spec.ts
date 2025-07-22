import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../services/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthState', 'isAdmin', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default mock returns
    mockAuthService.getAuthState.and.returnValue(of({
      isAuthenticated: true,
      user: { id: 1, email: 'test@example.com', password: 'test', role: 'employee' }
    }));
    mockAuthService.isAdmin.and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to specified path', () => {
    component.goTo('/employees');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should toggle mobile menu', () => {
    expect(component.isMobileMenuOpen).toBeFalsy();
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeTruthy();
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeFalsy();
  });

  it('should close mobile menu', () => {
    component.isMobileMenuOpen = true;
    component.closeMobileMenu();
    expect(component.isMobileMenuOpen).toBeFalsy();
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});