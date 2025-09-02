import React, { useEffect, useState } from "react";
import API from "../api"; // axios wrapper
import "./Sales.css";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";

const COLORS = ["#00d4ff", "#0077ff", "#0d7377", "#2c5364", "#ff9800"];

function Sales() {
  const [summary, setSummary] = useState({});
  const [trend, setTrend] = useState([]);
  const [byProduct, setByProduct] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setLoading(true);

  Promise.all([
    API.get("/sales/summary/"),
    API.get("/sales/trend/"),
    API.get("/sales/by-product/"),
    API.get("/sales/recent-orders/"),
  ])
    .then(([summaryRes, trendRes, byProductRes, recentRes]) => {
      setSummary(summaryRes.data);

      // Process Trend
      const grouped = {};
      trendRes.data.forEach(row => {
        const month = new Date(row.month).toLocaleString("default", { month: "short" });
        if (!grouped[month]) grouped[month] = { month };
        grouped[month][row.product__name] = row.total_sales;
      });
      setTrend(Object.values(grouped));

      // By Product
      const formatted = byProductRes.data.map(d => ({
        name: d.product__name,
        value: d.total_sales,
      }));
      setByProduct(formatted);

      setRecentOrders(recentRes.data);
    })
    .finally(() => setLoading(false));
}, []);

    if (loading) return <Loader />;

  return (
    <div className="sales-container">
      {/* KPI Cards */}
      <div className="stat-cards">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Total Sales (May)</h3>
          <p>₹ {summary.total_sales?.toLocaleString()}</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Top Product</h3>
          <p>
            {summary.top_product?.product__name} (₹ {summary.top_product?.total_sales})
          </p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Growth vs Apr</h3>
          <p>{summary.growth_vs_prev}%</p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Pending Orders</h3>
          <p>{summary.pending_orders}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-box">
          <h3>Sales Trend (₹ Cr)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trend}>
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
            <BarChart data={byProduct}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="value">
              {byProduct.map((entry, index) => (
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
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.product_name}</td>
                <td>{order.vendor_name}</td>
                <td>{order.quantity}</td>
                <td>₹{parseFloat(order.order_value).toLocaleString()}</td>
                <td>{order.order_date}</td>
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
