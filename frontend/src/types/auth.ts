import type { User } from "./user";

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

export interface MessageResponse {
  status: string;
  message: string;
}

export type RegisterFormValues = RegisterRequest;

export type LoginFormValues = LoginRequest;
