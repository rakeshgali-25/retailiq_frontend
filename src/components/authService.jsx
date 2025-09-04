// authService.js
import API, { BASE_URL } from "../api";

export async function login(username, password) {
  const { data } = await API.post("/auth/token/", { username, password });
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  return data;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
