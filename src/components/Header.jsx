import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Header.css";

function Header({ onLogout }) {
  const location = useLocation();
  const [theme, setTheme] = useState("dark");

  const pageTitles = {
    "/dashboard": "📊 Business Overview",
    "/sales": "💹 Sales Performance",
    "/inventory": "📦 Inventory Management",
    "/vendors": "🏭 Vendor Reliability",
    "/analytics": "🔍 Advanced Analytics",
  };

  const currentTitle = pageTitles[location.pathname] || "RetailIQ";

  useEffect(() => {
    document.body.classList.toggle("light-theme", theme === "light");
  }, [theme]);

  return (
    <header className="app-header">
      <div className="page-title">{currentTitle}</div>

      <div className="header-right">
        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <span className="user-name">Hi, Rakesh 👋</span>
        <div className="avatar">R</div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
