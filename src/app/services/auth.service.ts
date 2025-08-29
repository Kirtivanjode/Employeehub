import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginRequest, AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: User[] = [
    {
      id: 1,
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin',
      name: 'System Admin',
    },
    {
      id: 2,
      email: 'john.doe@company.com',
      password: '12345',
      role: 'employee',
      employeeId: 1,
      name: 'John Doe',
    },
    {
      id: 3,
      email: 'jane.smith@company.com',
      password: '12345',
      role: 'employee',
      employeeId: 2,
      name: 'Jane Smith',
    },
    {
      id: 4,
      email: 'michael.johnson@company.com',
      password: '12345',
      role: 'employee',
      employeeId: 3,
      name: 'Michael Johnson',
    },
    {
      id: 5,
      email: 'sarah.wilson@company.com',
      password: '12345',
      role: 'employee',
      employeeId: 4,
      name: 'Sarah Wilson',
    },
    {
      id: 6,
      email: 'david.brown@company.com',
      password: '12345',
      role: 'employee',
      employeeId: 5,
      name: 'David Brown',
    },
  ];

  private authState = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  constructor() {
    this.loadAuthState();
  }

  getAuthState(): Observable<AuthState> {
    return this.authState.asObservable();
  }

  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  getCurrentEmployeeId(): number | null {
    // first check sessionStorage
    const stored = sessionStorage.getItem('currentEmployeeId');
    if (stored) {
      return Number(stored);
    }
    // fallback to authState
    return this.getCurrentUser()?.employeeId || null;
  }

  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  login(credentials: LoginRequest): boolean {
    const user = this.users.find((u) => u.email === credentials.email);
    if (!user) return false;

    const authState: AuthState = {
      user,
      isAuthenticated: true,
    };

    this.authState.next(authState);
    this.saveAuthState(authState);

    // ✅ store employeeId separately for quick access
    if (user.employeeId) {
      sessionStorage.setItem('currentEmployeeId', user.employeeId.toString());
    }

    return true;
  }

  logout(): void {
    const authState: AuthState = {
      user: null,
      isAuthenticated: false,
    };
    this.authState.next(authState);

    sessionStorage.removeItem('authState');
    sessionStorage.removeItem('currentEmployeeId'); // ✅ clean up
  }

  private saveAuthState(state: AuthState): void {
    sessionStorage.setItem('authState', JSON.stringify(state));
  }

  private loadAuthState(): void {
    const stored = sessionStorage.getItem('authState');
    if (stored) {
      const authState = JSON.parse(stored);
      this.authState.next(authState);
    }
  }
}
