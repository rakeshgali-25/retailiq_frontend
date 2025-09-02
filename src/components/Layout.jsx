import React, { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { FaHome, FaChartLine, FaBoxes, FaTruck, FaChartBar } from "react-icons/fa";
import Header  from "./Header";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true); // collapsed by default

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
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

      {/* Main content */}
      <div className="app-main">
        <Header onLogout={handleLogout} />

        <div className="app-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
