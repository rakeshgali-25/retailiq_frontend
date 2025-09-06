import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Header.css";

function Header({ onLogout }) {
  const location = useLocation();
  const [theme, setTheme] = useState("dark");
  const [username, setUsername] = useState(localStorage.getItem("username") || "Guest");

  const pageTitles = {
    "/dashboard": "📊 Business Overview",
    "/sales": "💹 Sales Performance",
    "/inventory": "📦 Inventory Management",
    "/vendors": "🏭 Vendor Reliability",
    "/analytics": "🔍 Advanced Analytics",
  };

  const currentTitle = pageTitles[location.pathname] || "RetailIQ";

  // Theme toggle
  useEffect(() => {
    document.body.classList.toggle("light-theme", theme === "light");
  }, [theme]);

  // Sync username from localStorage (on mount + if localStorage changes)
  useEffect(() => {
    const syncName = () => {
      const stored = localStorage.getItem("username");
      setUsername(stored || "Guest");
    };
    syncName();
    window.addEventListener("storage", syncName);
    return () => window.removeEventListener("storage", syncName);
  }, []);

  const avatarChar = username.charAt(0).toUpperCase();

  return (
    <header className="app-header">
      <div className="page-title">{currentTitle}</div>

      <div className="header-right">
        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <span className="user-name">Hi, {username} </span>
        <div className="avatar">{avatarChar}</div>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
