import apiClient from './api';
import { User } from '../types';

// Backend user type (from API response)
interface BackendUser {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdDate: string;
  updatedDate: string;
  fullName: string;
  roles: string[];
}

// Types based on backend DTOs
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  token?: string;
  user?: BackendUser;
}

// Convert backend user to frontend user
export const convertBackendUserToFrontend = (backendUser: BackendUser): User => {
  return {
    id: backendUser.userId,
    email: backendUser.email,
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    phoneNumber: backendUser.phoneNumber,
    dateOfBirth: backendUser.dateOfBirth,
    isActive: backendUser.isActive,
    createdAt: backendUser.createdDate,
    updatedAt: backendUser.updatedDate,
  };
};

class AuthService {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResult> {
    try {
      const response = await apiClient.post('/authentication/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Network error occurred');
    }
  }

  // Register
  async register(userData: RegisterRequest): Promise<AuthResult> {
    try {
      const response = await apiClient.post('/authentication/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Network error occurred');
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Set user data in localStorage
  setUserData(user: User, token: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
}

export default new AuthService(); 