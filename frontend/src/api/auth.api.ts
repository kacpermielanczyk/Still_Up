import { apiFetch } from "./client";

import type {
  AuthResponse,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  User,
} from "@/types";

export function register(payload: RegisterRequest) {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function login(payload: LoginRequest) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function logout() {
  return apiFetch<MessageResponse>("/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser(signal?: AbortSignal) {
  return apiFetch<User>("/users/me", {
    signal,
  });
}
