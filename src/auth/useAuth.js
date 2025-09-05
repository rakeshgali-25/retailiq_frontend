// src/auth/useAuth.js
import { jwtDecode } from "jwt-decode";

export function getAccessToken() {
  return localStorage.getItem("access") || null;
}

export function getRefreshToken() {
  return localStorage.getItem("refresh") || null;
}

export function isTokenValid(token) {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
