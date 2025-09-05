// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Analytics from "./components/Analytics";
import Vendors from "./components/Vendors";
import Sales from "./components/Sales";
import Layout from "./components/Layout";
import RequireAuth from "./auth/RequireAuth";
import { getAccessToken, isTokenValid } from "./auth/useAuth";

function App() {
  const authed = isTokenValid(getAccessToken());

  return (
    <Router>
      <Routes>
        {/* Login: if already authed, send to dashboard */}
        <Route
          path="/login"
          element={authed ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* Protected shell */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sales" element={<Sales />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={authed ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
