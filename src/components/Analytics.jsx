import React from "react";
import "./Analytics.css";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

// Sales trend (Jan–May)
const salesTrend = [
  { month: "Jan", total: 445 },
  { month: "Feb", total: 420 },
  { month: "Mar", total: 492 },
  { month: "Apr", total: 540 },
  { month: "May", total: 577 },
];

// Sales by product (May)
const salesByProduct = [
  { name: "Maggi", value: 240 },
  { name: "KitKat", value: 125 },
  { name: "Nescafé", value: 88 },
  { name: "Milkmaid", value: 52 },
  { name: "Everyday", value: 72 },
];

// Vendor delays (mock for demo)
const vendorDelays = [
  { product: "Maggi", sales: 240, delay: 1 },
  { product: "KitKat", sales: 125, delay: 3 },
  { product: "Nescafé", sales: 88, delay: 1 },
  { product: "Milkmaid", sales: 52, delay: 2 },
  { product: "Everyday", sales: 72, delay: 1 },
];

const COLORS = ["#00d4ff", "#0077ff", "#0d7377", "#2c5364", "#ff9800"];

function Analytics() {
  const top2Contribution = ((240 + 125) / 577 * 100).toFixed(1);
  const onTimeFulfillment = ((23 / 25) * 100).toFixed(1); // Example: 23/25 orders on-time
  const avgOrderValue = (577 * 100) / 25; // crude calc
  const growthVsApr = (((577 - 540) / 540) * 100).toFixed(1);

  return (
    <div className="analytics-container">
      {/* KPI Cards */}
      <div className="stat-cards">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Top 2 Products Contribution</h3>
          <p>{top2Contribution}%</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>On-Time Fulfillment</h3>
          <p>{onTimeFulfillment}%</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Avg. Order Value</h3>
          <p>₹ {avgOrderValue.toFixed(2)} Lakh</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Growth vs Apr</h3>
          <p>+{growthVsApr}%</p>
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
              <Line type="monotone" dataKey="total" stroke="#00d4ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Product Contribution (May)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={salesByProduct}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {salesByProduct.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Vendor Delays by Product</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vendorDelays}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="product" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#00d4ff" name="Sales (₹ Cr)" />
              <Bar dataKey="delay" fill="#ff9800" name="Delays (Orders)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="insights-box">
        <h3>Insights</h3>
        <ul>
          <li>⚠️ Maggi + KitKat contribute {top2Contribution}% of sales → high dependency risk.</li>
          <li>⚠️ Bharat Cocoa Traders caused multiple KitKat delays → affecting sales.</li>
          <li>✅ On-Time Fulfillment is strong at {onTimeFulfillment}% overall.</li>
        </ul>
      </div>
    </div>
  );
}

export default Analytics;
