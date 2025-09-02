import React, { useEffect, useState } from "react";
import "./Dashboard.css";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import API from "../api"; // axios wrapper
import Loader from "../components/Loader"; // ⬅️ your custom loader
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

function Dashboard() {
  const [summary, setSummary] = useState({ total_sales: 0, active_vendors: 0, pending_orders: 0 });
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#00d4ff", "#0077ff", "#0d7377", "#2c5364"];

  useEffect(() => {
    setLoading(true);

    Promise.all([
      API.get("/dashboard/summary/"),
      API.get("/dashboard/sales-over-time/"),
      API.get("/dashboard/inventory-levels/"),
      API.get("/dashboard/vendor-contribution/"),
    ])
      .then(([summaryRes, salesRes, inventoryRes, vendorRes]) => {
        setSummary(summaryRes.data);

        // Sales
        const formattedSales = salesRes.data.map((d) => {
          const date = new Date(d.month);
          return { month: date.toLocaleString("default", { month: "short" }), sales: d.total_sales };
        });
        setSalesData(formattedSales);

        // Inventory
        const formattedInventory = inventoryRes.data.map((d) => ({
          item: d.product__category,
          qty: d.total_stock,
        }));
        setInventoryData(formattedInventory);

        // Vendors
        const formattedVendors = vendorRes.data.map((d) => ({
          name: d.vendor__name,
          value: d.total_sales,
        }));
        setVendorData(formattedVendors);
      })
      .catch((err) => console.error("Dashboard API error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />; // ⬅️ show loader while fetching

  return (
    <div className="dashboard-body">
      {/* Stat Cards */}
      <div className="stat-cards">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Total Sales</h3>
          <p>₹ {summary.total_sales}</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Active Vendors</h3>
          <p>{summary.active_vendors}</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Pending Orders</h3>
          <p>{summary.pending_orders}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="charts">
        <motion.div className="chart-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3>Sales Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#00d4ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="chart-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3>Inventory Levels</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="item" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="qty" fill="#0077ff" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="chart-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3>Vendor Contribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={vendorData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                {vendorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
