import React from "react";
import "./Inventory.css";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// Inventory Data
const inventoryData = [
  { product: "Maggi", stock: 500000, reorder: 200000, price: 150 },
  { product: "KitKat", stock: 350000, reorder: 150000, price: 20 },
  { product: "Nescafé", stock: 120000, reorder: 50000, price: 320 },
  { product: "Milkmaid", stock: 200000, reorder: 80000, price: 130 },
  { product: "Everyday", stock: 100000, reorder: 40000, price: 550 },
];

const COLORS = ["#00d4ff", "#0077ff", "#0d7377", "#2c5364", "#ff9800"];

// KPI calculations
const totalStock = inventoryData.reduce((sum, i) => sum + i.stock, 0);
const lowStockItems = inventoryData.filter(i => i.stock <= i.reorder).length;
const inventoryValue = inventoryData.reduce((sum, i) => sum + (i.stock * i.price), 0);
const stockCoverageDays = Math.round(totalStock / 20000); // assume daily demand = 20k units
const lowStockPercent = ((lowStockItems / inventoryData.length) * 100).toFixed(1);

function Inventory() {
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
              <XAxis dataKey="product" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#00d4ff" />
              <Bar dataKey="reorder" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Inventory Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryData}
                dataKey="stock"
                nameKey="product"
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
              const isLow = item.stock <= item.reorder;
              return (
                <tr key={item.product}>
                  <td>{item.product}</td>
                  <td>{item.stock.toLocaleString()}</td>
                  <td>{item.reorder.toLocaleString()}</td>
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
