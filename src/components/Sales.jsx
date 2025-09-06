import React, { useEffect, useState } from "react";
import API from "../api"; // axios wrapper
import "./Sales.css";
import Loader from "../components/Loader";
// eslint-disable-next-line no-unused-vars
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

  // Dropdown data
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);

  // CRUD State
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    vendor: "",
    quantity: "",
    order_value: "",
    order_date: "",
    status: "Pending",
  });

  // Fetch Sales + Dropdown Data
  const fetchData = () => {
    setLoading(true);
    Promise.all([
      API.get("/sales/summary/"),
      API.get("/sales/trend/"),
      API.get("/sales/by-product/"),
      API.get("/sales/orders/"),
      API.get("/inventory/products/"), // new endpoint
      API.get("/vendors/vendors/"),  // new endpoint
    ])
      .then(([summaryRes, trendRes, byProductRes, ordersRes, productsRes, vendorsRes]) => {
        setSummary(summaryRes.data);

        // Process Trend
        const grouped = {};
        trendRes.data.forEach((row) => {
          const month = new Date(row.month).toLocaleString("default", {
            month: "short",
          });
          if (!grouped[month]) grouped[month] = { month };
          grouped[month][row.product__name] = row.total_sales;
        });
        setTrend(Object.values(grouped));

        // By Product
        const formatted = byProductRes.data.map((d) => ({
          name: d.product,
          value: d.total_sales,
        }));
        setByProduct(formatted);
        setRecentOrders(ordersRes.data.results);
        setProducts(productsRes.data);
        setVendors(vendorsRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Form Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Update Order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingOrder) {
      await API.put(`/sales/orders/${editingOrder.id}/`, formData);
    } else {
      await API.post("/sales/orders/", formData);
    }
    setShowModal(false);
    setEditingOrder(null);
    setFormData({
      product: "",
      vendor: "",
      quantity: "",
      order_value: "",
      order_date: "",
      status: "Pending",
    });
    fetchData();
  };

  // Edit Order
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      product: order.product,   // keep IDs for update
      vendor: order.vendor,
      quantity: order.quantity,
      order_value: order.order_value,
      order_date: order.order_date,
      status: order.status,
    });
    setShowModal(true);
  };

  // Delete Order
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await API.delete(`/sales/orders/${id}/`);
      fetchData();
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="sales-container">
      {/* KPI Cards */}
      <div className="stat-cards">
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Total Sales</h3>
          <p>₹ {summary.total_sales?.toLocaleString()}</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Top Product</h3>
          <p>
            {summary.top_product?.product__name} (₹{" "}
            {summary.top_product?.total_sales})
          </p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.05 }}>
          <h3>Growth vs Prev</h3>
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
              {Object.keys(trend[0] || {})
                .filter((k) => k !== "month")
                .map((key, i) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Sales by Product</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byProduct}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value">
                {byProduct.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Table */}
      <div className="sales-table">
        <div className="table-header">
          <h3>Orders</h3>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add Order
          </button>
        </div>
        <div className="sales-table-wrapper">
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_id}</td>
                  <td>{order.product_name}</td>
                  <td>{order.vendor_name}</td>
                  <td>{order.quantity}</td>
                  <td>₹{parseFloat(order.order_value).toLocaleString()}</td>
                  <td>{order.order_date}</td>
                  <td
                    style={{
                      color: order.status === "Pending" ? "#ff9800" : "#00d4ff",
                    }}
                  >
                    {order.status}
                  </td>
                  <td>
                   {order.status !== "Completed" && (
                        <>
                          <button onClick={() => handleEdit(order)}>✏️</button>
                          <button onClick={() => handleDelete(order.id)}>🗑️</button>
                        </>
                      )}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingOrder ? "Edit Order" : "Add Order"}</h3>
            <form onSubmit={handleSubmit}>
              {/* Product Dropdown */}
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* Vendor Dropdown */}
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Vendor --</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="order_value"
                placeholder="Order Value"
                value={formData.order_value}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="order_date"
                value={formData.order_date}
                onChange={handleChange}
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <button type="submit">
                {editingOrder ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingOrder(null);
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;
