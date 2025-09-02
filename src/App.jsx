import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Analytics from "./components/Analytics";
import Vendors from "./components/Vendors";
import Sales from "./components/Sales";
import Layout from "./components/Layout";


function App() {
  return (
    <Router>
      <Routes>
        {/* Login page (no sidebar/header) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Layout (with sidebar + header) */}
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
