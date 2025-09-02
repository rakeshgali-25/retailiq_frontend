import React from "react";
import "./Vendors.css";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const vendorData = [
  { name: "Shakti Packaging", products: "Maggi, KitKat", onTime: 96, delay: 0.5, orders: 120, contribution: 30 },
  { name: "Bharat Cocoa Traders", products: "KitKat (Cocoa)", onTime: 78, delay: 3.0, orders: 80, contribution: 20 },
  { name: "Sunrise Dairy Farms", products: "Milkmaid, Everyday", onTime: 88, delay: 1.5, orders: 100, contribution: 25 },
  { name: "Global Coffee Imports", products: "Nescafé", onTime: 92, delay: 1.0, orders: 90, contribution: 15 },
  { name: "FreshLogistics Pvt Ltd", products: "Distribution", onTime: 85, delay: 2.0, orders: 150, contribution: 10 },
];

const COLORS = ["#00d4ff", "#0077ff", "#0d7377", "#2c5364", "#ff9800"];

function Vendors() {
  const totalVendors = vendorData.length;
  const avgOnTime = (vendorData.reduce((sum, v) => sum + v.onTime, 0) / totalVendors).toFixed(1);
  const avgDelay = (vendorData.reduce((sum, v) => sum + v.delay, 0) / totalVendors).toFixed(1);
  const pendingOrders = 3; // Example static, can link to DB later

  return (
    <div className="vendors-container">
      {/* KPI Cards */}
      <div className="stat-cards">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Total Vendors</h3>
          <p>{totalVendors}</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Avg. On-Time %</h3>
          <p>{avgOnTime}%</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Avg. Delay</h3>
          <p>{avgDelay} hrs</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Pending Orders</h3>
          <p>{pendingOrders}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-box">
          <h3>Vendor On-Time %</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" fill="#00d4ff" name="On-Time %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Vendor Supply Contribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vendorData}
                dataKey="contribution"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {vendorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vendor Table */}
      <div className="vendor-table">
        <h3>Vendor Details</h3>
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Products Supplied</th>
              <th>On-Time %</th>
              <th>Avg. Delay</th>
              <th>Orders</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendorData.map((v) => {
              const status =
                v.onTime >= 90 ? "excellent" : v.onTime >= 80 ? "average" : "poor";
              return (
                <tr key={v.name}>
                  <td>{v.name}</td>
                  <td>{v.products}</td>
                  <td>{v.onTime}%</td>
                  <td>{v.delay} hrs</td>
                  <td>{v.orders}</td>
                  <td>
                    <span className={`status ${status}`}>
                      {status === "excellent"
                        ? "Excellent"
                        : status === "average"
                        ? "Average"
                        : "Poor"}
                    </span>
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

export default Vendors;
