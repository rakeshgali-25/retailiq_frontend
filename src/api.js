import axios from "axios";

const API = axios.create({
  baseURL: "https://retailiq-backend.onrender.com/api", // local for now, later change to prod
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors (useful for JWT auth later)
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default API;
