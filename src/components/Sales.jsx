import React from "react";
import "./Sales.css";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

// Nestlé Sales Data
const salesTrend = [
  { month: "Jan", Maggi: 180, KitKat: 95, Nescafe: 70, Milkmaid: 40, Everyday: 60, total: 445 },
  { month: "Feb", Maggi: 170, KitKat: 85, Nescafe: 72, Milkmaid: 38, Everyday: 55, total: 420 },
  { month: "Mar", Maggi: 200, KitKat: 110, Nescafe: 75, Milkmaid: 45, Everyday: 62, total: 492 },
  { month: "Apr", Maggi: 220, KitKat: 120, Nescafe: 82, Milkmaid: 50, Everyday: 68, total: 540 },
  { month: "May", Maggi: 240, KitKat: 125, Nescafe: 88, Milkmaid: 52, Everyday: 72, total: 577 },
];

const salesByProduct = [
  { name: "Maggi", value: 240 },
  { name: "KitKat", value: 125 },
  { name: "Nescafé", value: 88 },
  { name: "Milkmaid", value: 52 },
  { name: "Everyday", value: 72 },
];

const recentOrders = [
  { id: "ORD-201", product: "Maggi", vendor: "Shakti Packaging", qty: "1,20,000 packs", value: "₹1.8 Cr", date: "2025-05-25", status: "Completed" },
  { id: "ORD-202", product: "KitKat", vendor: "Bharat Cocoa Traders", qty: "80,000 bars", value: "₹1.6 Cr", date: "2025-05-26", status: "Pending" },
  { id: "ORD-203", product: "Nescafé", vendor: "Global Coffee Imports", qty: "40,000 jars", value: "₹1.28 Cr", date: "2025-05-27", status: "Completed" },
  { id: "ORD-204", product: "Milkmaid", vendor: "Sunrise Dairy Farms", qty: "50,000 tins", value: "₹65 Lakh", date: "2025-05-28", status: "Completed" },
  { id: "ORD-205", product: "Everyday", vendor: "Sunrise Dairy Farms", qty: "30,000 packs", value: "₹1.65 Cr", date: "2025-05-29", status: "Pending" },
];

const COLORS = ["#00d4ff", "#0077ff", "#0d7377", "#2c5364", "#ff9800"];

function Sales() {


    

  return (
    <div className="sales-container">
      {/* KPI Cards */}
      <div className="stat-cards">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Total Sales (May)</h3>
          <p>₹ 577 Cr</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Top Product</h3>
          <p>Maggi (₹ 240 Cr)</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Growth vs Apr</h3>
          <p>+6.8%</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Pending Orders</h3>
          <p>2</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-box">
          <h3>Sales Trend (₹ Cr)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="Maggi" stroke="#00d4ff" strokeWidth={2} />
              <Line type="monotone" dataKey="KitKat" stroke="#ff9800" strokeWidth={2} />
              <Line type="monotone" dataKey="Nescafe" stroke="#0077ff" strokeWidth={2} />
              <Line type="monotone" dataKey="Milkmaid" stroke="#0d7377" strokeWidth={2} />
              <Line type="monotone" dataKey="Everyday" stroke="#2c5364" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Sales by Product (May)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesByProduct}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value">
                {salesByProduct.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Table */}
      <div className="sales-table">
        <h3>Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Vendor</th>
              <th>Quantity</th>
              <th>Value</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.product}</td>
                <td>{order.vendor}</td>
                <td>{order.qty}</td>
                <td>{order.value}</td>
                <td>{order.date}</td>
                <td style={{ color: order.status === "Pending" ? "#ff9800" : "#00d4ff" }}>
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sales;
