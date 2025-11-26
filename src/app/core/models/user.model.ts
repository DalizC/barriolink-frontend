export interface User {
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'registered';
  tenant_id?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
}
