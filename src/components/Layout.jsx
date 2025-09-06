import React, { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { FaHome, FaChartLine, FaBoxes, FaTruck, FaChartBar } from "react-icons/fa";
import Header from "./Header";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false); // <- new

  const handleLogout = () => {
    localStorage.removeItem("refresh");
    localStorage.removeItem("access");
    navigate("/login", { replace: true });
  };

  return (
    // toggle a CSS class for zoom mode
    <div className={`app-layout ${isZoomed ? "zoomed" : ""}`}>
      {/* Sidebar: hide entirely when zoomed */}
      {!isZoomed && (
        <aside
          className={`app-sidebar ${collapsed ? "collapsed" : ""}`}
          onMouseEnter={() => setCollapsed(false)}
          onMouseLeave={() => setCollapsed(true)}
        >
          <h2 className="logo">{!collapsed && <>Retail<span>IQ</span></>}</h2>
          <nav>
            <NavLink to="/dashboard" className="sidebar-link">
              <FaHome className="icon" /> {!collapsed && "Dashboard"}
            </NavLink>
            <NavLink to="/sales" className="sidebar-link">
              <FaChartLine className="icon" /> {!collapsed && "Sales"}
            </NavLink>
            <NavLink to="/inventory" className="sidebar-link">
              <FaBoxes className="icon" /> {!collapsed && "Inventory"}
            </NavLink>
            <NavLink to="/vendors" className="sidebar-link">
              <FaTruck className="icon" /> {!collapsed && "Vendors"}
            </NavLink>
            <NavLink to="/analytics" className="sidebar-link">
              <FaChartBar className="icon" /> {!collapsed && "Analytics"}
            </NavLink>
          </nav>
        </aside>
      )}

      {/* Main content */}
      <div className="app-main">
        {/* Header hidden when zoomed; pass toggle handler to Header */}
        {!isZoomed && <Header onLogout={handleLogout} onToggleZoom={() => setIsZoomed(true)} user={null} />}
        {/* If zoomed, show a small floating control to exit zoom (optional) */}
        {isZoomed && (
          <div className="zoom-exit">
            <button
              className="zoom-exit-btn"
              onClick={() => setIsZoomed(false)}
              aria-label="Exit zoom"
            >
              ⤢
            </button>
          </div>
        )}

        <div className="app-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
