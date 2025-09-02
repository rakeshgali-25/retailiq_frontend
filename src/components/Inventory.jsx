import React, { useEffect, useState } from "react";
import "./Inventory.css";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import API from "../api"; // axios wrapper
import Loader from "../components/Loader"; // your bouncing dots loader
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#00d4ff", "#0077ff", "#0d7377", "#2c5364", "#ff9800"];

function Inventory() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get("/inventory/details/") // ⬅️ your backend endpoint
      .then((res) => {
        setInventoryData(res.data);
      })
      .catch((err) => console.error("Inventory API error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  // KPI calculations
  const totalStock = inventoryData.reduce((sum, i) => sum + i.stock_level, 0);
  const lowStockItems = inventoryData.filter(i => i.stock_level <= i.reorder_level).length;
  const inventoryValue = inventoryData.reduce((sum, i) => sum + (i.stock_level * i.unit_price), 0);
  const stockCoverageDays = Math.round(totalStock / 20000); // assume daily demand = 20k units
  const lowStockPercent = ((lowStockItems / (inventoryData.length || 1)) * 100).toFixed(1);

  return (
    <div className="inventory-container">
      {/* Alerts */}
      {lowStockItems > 0 && (
        <div className="alert-banner">
          ⚠️ {lowStockItems} products are below reorder level. Reorder immediately!
        </div>
      )}

      {/* KPI Cards */}
      <div className="stat-cards">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Total Stock Units</h3>
          <p>{totalStock.toLocaleString()}</p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Inventory Value</h3>
          <p>₹ {(inventoryValue / 10000000).toFixed(2)} Cr</p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Stock Coverage</h3>
          <p>{stockCoverageDays} days</p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Low Stock %</h3>
          <p>{lowStockPercent}%</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-box">
          <h3>Stock vs Reorder Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryData}>
              <XAxis dataKey="product_name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock_level" name="Stock" fill="#00d4ff" />
              <Bar dataKey="reorder_level" name="Reorder" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="chart-box">
          <h3>Inventory Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={inventoryData}
      dataKey="stock_level"
      nameKey="product_name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {inventoryData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>

        </div>
      </div>

      {/* Table */}
      <div className="inventory-table">
        <h3>Stock Details</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock Level</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {inventoryData.map((item) => {
    const isLow = item.stock_level <= item.reorder_level;
    return (
      <tr key={item.id}>
        <td>{item.product_name}</td>
        <td>{item.stock_level.toLocaleString()}</td>
        <td>{item.reorder_level.toLocaleString()}</td>
        <td>
          <span className={`status ${isLow ? "low" : "healthy"}`}>
            {isLow ? "Low Stock" : "Healthy"}
          </span>
        </td>
        <td>
          {isLow ? (
            <button className="reorder-btn">Reorder</button>
          ) : (
            "-"
          )}
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </div>
    </div>
  );
}

export default Inventory;
