import React, { useEffect, useState } from "react";
import "./Analytics.css";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import API from "../api";
import Loader from "../components/Loader";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

const COLORS = ["#00d4ff", "#0077ff", "#0d7377", "#2c5364", "#ff9800"];

function Analytics() {
  const [summary, setSummary] = useState({});
  const [salesTrend, setSalesTrend] = useState([]);
  const [productContribution, setProductContribution] = useState([]);
  const [vendorDelays, setVendorDelays] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get("/analytics/summary/"),
      API.get("/analytics/sales-trend/"),
      API.get("/analytics/product-contribution/"),
      API.get("/analytics/vendor-delays/"),
      API.get("/analytics/insights/"),
    ])
      .then(([summaryRes, trendRes, productRes, delaysRes, insightsRes]) => {
        setSummary(summaryRes.data);

        // Format sales trend
        const formattedTrend = trendRes.data.map(d => {
          const date = new Date(d.month);
          return {
            month: date.toLocaleString("default", { month: "short" }),
            sales: d.total_sales,
          };
        });
        setSalesTrend(formattedTrend);

        // Product contribution
        const formattedProducts = productRes.data.map(d => ({
          name: d.product__name,
          value: d.total_sales,
        }));
        setProductContribution(formattedProducts);

        // Vendor delays
        const formattedDelays = delaysRes.data.map(d => ({
          product: d.product__name,
          // sales: d.total_sales,
          delays: d.avg_delay,
        }));
        console.log(formattedDelays,"formatted delays")
        setVendorDelays(formattedDelays);

        setInsights(insightsRes.data.insights);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="analytics-container">
      {/* KPI Cards */}
      <div className="stat-cards">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Top 2 Products Contribution</h3>
          <p>{summary.top2_contribution_percent}%</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>On-Time Fulfillment</h3>
          <p>{summary.on_time_fulfillment_percent}%</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Avg. Order Value</h3>
          <p>₹ {summary.avg_order_value?.toLocaleString()}</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Growth vs Apr</h3>
          <p>{summary.growth_vs_prev}%</p>
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
              <Line type="monotone" dataKey="sales" stroke="#00d4ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Product Contribution (May)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productContribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {productContribution.map((entry, index) => (
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
              <Bar dataKey="delays" fill="#ff9800" name="Avg Delay (mins)" />
            </BarChart>

          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="insights-box">
        <h3>Insights</h3>
        <ul>
          {insights.map((insight, i) => (
            <li key={i}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Analytics;
