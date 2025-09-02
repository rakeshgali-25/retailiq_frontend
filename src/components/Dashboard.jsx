import React from "react";
import "./Dashboard.css";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

function Dashboard() {
  // Sample data
  const salesData = [
    { month: "Jan", sales: 400 },
    { month: "Feb", sales: 300 },
    { month: "Mar", sales: 600 },
    { month: "Apr", sales: 800 },
    { month: "May", sales: 700 },
  ];

  const inventoryData = [
    { item: "Raw Materials", qty: 120 },
    { item: "Finished Goods", qty: 80 },
    { item: "In Transit", qty: 50 },
  ];

  const vendorData = [
    { name: "Vendor A", value: 40 },
    { name: "Vendor B", value: 30 },
    { name: "Vendor C", value: 20 },
    { name: "Others", value: 10 },
  ];

  const COLORS = ["#00d4ff", "#0077ff", "#0d7377", "#2c5364"];

  return (
    <div className="dashboard-body">
      {/* Stat Cards */}
      <div className="stat-cards">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Total Sales</h3>
          <p>₹ 1.2 Cr</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Active Vendors</h3>
          <p>56</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Pending Orders</h3>
          <p>32</p>
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
