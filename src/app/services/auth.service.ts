import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginRequest, AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    {
      id: 1,
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: 2,
      email: 'john.doe@company.com',
      password: 'john123',
      role: 'employee',
      employeeId: 1
    },
    {
      id: 3,
      email: 'jane.smith@company.com',
      password: 'jane123',
      role: 'employee',
      employeeId: 2
    },
    {
      id: 4,
      email: 'michael.johnson@company.com',
      password: 'michael123',
      role: 'employee',
      employeeId: 3
    },
    {
      id: 5,
      email: 'sarah.wilson@company.com',
      password: 'sarah123',
      role: 'employee',
      employeeId: 4
    },
    {
      id: 6,
      email: 'david.brown@company.com',
      password: 'david123',
      role: 'employee',
      employeeId: 5
    }
  ];

  private authState = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false
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

  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  login(credentials: LoginRequest): boolean {
    // Allow any email and password to login
    // Determine role based on email pattern
    const isAdmin = credentials.email.toLowerCase().includes('admin');
    
    const user: User = {
      id: Math.floor(Math.random() * 1000) + 100,
      email: credentials.email,
      password: credentials.password,
      role: isAdmin ? 'admin' : 'employee',
      employeeId: isAdmin ? undefined : Math.floor(Math.random() * 100) + 1
    };

    const authState = {
      user,
      isAuthenticated: true
    };
    this.authState.next(authState);
    this.saveAuthState(authState);
    return true;
  }

  logout(): void {
    const authState = {
      user: null,
      isAuthenticated: false
    };
    this.authState.next(authState);
    localStorage.removeItem('authState');
  }

  private saveAuthState(state: AuthState): void {
    localStorage.setItem('authState', JSON.stringify(state));
  }

  private loadAuthState(): void {
    const stored = localStorage.getItem('authState');
    if (stored) {
      const authState = JSON.parse(stored);
      this.authState.next(authState);
    }
  }
}