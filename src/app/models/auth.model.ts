export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  employeeId?: number;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
