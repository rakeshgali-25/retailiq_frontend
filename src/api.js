// src/api.js
import axios from "axios";

// Prefer env var, fallback to local Django
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// Main API instance (with interceptors)
const API = axios.create({ baseURL: BASE_URL });

// A plain axios instance (no interceptors) for token refresh
const plain = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // If unauthorized and we haven't retried yet...
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      // Queue requests while a refresh is in flight
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject, original });
        });
      }

      try {
        isRefreshing = true;
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        // Use the plain client and FULL backend base URL for refresh
        const { data } = await plain.post("/auth/refresh/", { refresh });

        localStorage.setItem("access", data.access);

        // Replay queued requests with the new token
        pendingRequests.forEach(({ resolve, original: queued }) => {
          queued.headers = queued.headers || {};
          queued.headers.Authorization = `Bearer ${data.access}`;
          resolve(API(queued));
        });
        pendingRequests = [];

        // Retry the original request
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.access}`;
        return API(original);
      } catch (e) {
        // On refresh failure, clear tokens + fail all pending requests
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        pendingRequests.forEach(({ reject }) => reject(e));
        pendingRequests = [];
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    // Any other error: just bubble up
    throw error;
  }
);

export default API;
export { BASE_URL };
