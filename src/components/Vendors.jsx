import React, { useEffect, useState } from "react";
import "./Vendors.css";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import API from "../api"; // axios wrapper
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import Loader from "../components/Loader";

const COLORS = ["#0077ff", "#ff9800", "#2c5364", "#00d4ff", "#0d7377"];

function Vendors() {
  const [summary, setSummary] = useState({});
  const [onTimeData, setOnTimeData] = useState([]);
  const [contributionData, setContributionData] = useState([]);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get("/vendors/summary/"),
      API.get("/vendors/on-time/"),
      API.get("/vendors/supply-contribution/"),
      API.get("/vendors/details/"),
    ])
     .then(([summaryRes, onTimeRes, contribRes, detailsRes]) => {
  setSummary(summaryRes.data);

  setOnTimeData(
    onTimeRes.data.map(d => ({
      vendor: d.vendor,
      onTime: d.on_time_percent,
    }))
  );

setContributionData(
  contribRes.data.map(d => ({
    name: d.vendor__name,      // ✅ correct field
    value: d.total_supply,     // ✅ correct field
  }))
);


  setVendorDetails(detailsRes.data);
})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="vendors-container">
      {/* KPI Cards */}
      <div className="stat-cards">
      <div className="stat-cards">
  <motion.div className="card" whileHover={{ scale: 1.05 }}>
    <h3>Total Vendors</h3>
    <p>{summary.total_vendors}</p>
  </motion.div>

  <motion.div className="card" whileHover={{ scale: 1.05 }}>
    <h3>Avg. On-Time %</h3>
    <p>{summary.avg_on_time_percent}%</p>
  </motion.div>

  <motion.div className="card" whileHover={{ scale: 1.05 }}>
    <h3>Avg. Delay</h3>
    <p>{(summary.avg_delay_minutes / 60).toFixed(1)} hrs</p>
  </motion.div>

  <motion.div className="card" whileHover={{ scale: 1.05 }}>
    <h3>Pending Orders</h3>
    <p>{summary.pending_orders}</p>
  </motion.div>
</div>

      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-box">
          <h3>Vendor On-Time %</h3>
          <ResponsiveContainer width="100%" height={300}>
           <BarChart data={onTimeData}>
            <XAxis dataKey="vendor" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="onTime" fill="#00d4ff" />
          </BarChart>

          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Vendor Supply Contribution</h3>
          <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={contributionData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {contributionData.map((entry, index) => (
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
      <div className="vendors-table">
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
  {vendorDetails.map((v) => (
    <tr key={v.id}>
      <td>{v.vendor_name}</td>
      <td>{v.products_supplied || "-"}</td>
      <td>{v.on_time_percent ? `${v.on_time_percent}%` : "-"}</td>
      <td>{v.avg_delay ? `${v.avg_delay} hrs` : "-"}</td>
      <td>{v.total_orders || "-"}</td>
      <td>
        <span className={`status ${v.status?.toLowerCase() || "active"}`}>
          {v.status || "Active"}
        </span>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
}

export default Vendors;
