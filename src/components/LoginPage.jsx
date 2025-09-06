import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import "./LoginPage.css";
import ParticlesBackground from "./ParticlesBackground";
import { login } from "./authService";
import API from "../api";            // make sure your axios instance sets Authorization from localStorage
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");  // <-- username, not email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!username || !password) return setErr("Enter username & password");
    setLoading(true);
    try {
      const { access, refresh } = await login(username, password); // calls /api/auth/token/
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("username", username);

      API.defaults.headers.Authorization = `Bearer ${access}`;
      navigate("/dashboard"); // or wherever your app’s main page is
    } catch (e) {
      setErr(
        e?.response?.data?.detail ||
        "Login failed. Check your username/password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ParticlesBackground />
      <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable glareMaxOpacity={0.4} scale={1.05} transitionSpeed={1500}>
        <motion.div
          className="login-box"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="brand">Retail <span>IQ</span></h1>
          <p className="subtitle">Sales & Inventory Analytics</p>

          <form className="login-form" onSubmit={onSubmit}>
            <label>Username</label>
            <input
              type="text"
              placeholder="your-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {err && <div className="error">{err}</div>}

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px #00d4ff" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>
        </motion.div>
      </Tilt>
    </div>
  );
}

export default LoginPage;

