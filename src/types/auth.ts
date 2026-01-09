export interface User {
  username: string;
  role: 'admin' | 'dataentry';
  displayName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
