// src/auth/RequireAuth.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import API, { BASE_URL } from "../api";
import { getAccessToken, getRefreshToken, isTokenValid } from "./useAuth";
import axios from "axios";

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState("checking"); // checking | authed | denied
  const loc = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const access = getAccessToken();
      if (isTokenValid(access)) {
        if (!cancelled) setStatus("authed");
        return;
      }
      // try refresh
      const refresh = getRefreshToken();
      if (!refresh) {
        setStatus("denied");
        return;
      }
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh });
        localStorage.setItem("access", data.access);
        API.defaults.headers.Authorization = `Bearer ${data.access}`;
        if (!cancelled) setStatus("authed");
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        if (!cancelled) setStatus("denied");
      }
    }

    verify();
    return () => { cancelled = true; };
  }, [loc.pathname]);

  if (status === "checking") return null; // or a loader
  if (status === "denied") {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return children;
}
