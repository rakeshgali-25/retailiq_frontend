import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";   // ✅ import tilt
import "./LoginPage.css";
import ParticlesBackground from "./ParticlesBackground";

function LoginPage() {
  return (
    <div className="login-container">
      <ParticlesBackground />

      {/* ✅ Wrap login box inside Tilt */}
      <Tilt
        tiltMaxAngleX={10}  // max tilt left/right
        tiltMaxAngleY={10}  // max tilt up/down
        glareEnable={true}  // enable shiny glare
        glareMaxOpacity={0.4}
        scale={1.05}        // slight zoom effect
        transitionSpeed={1500}
      >
        <motion.div
          className="login-box"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="brand">
            Retail <span>IQ</span>
          </h1>
          <p className="subtitle">Sales & Inventory Analytics</p>

          <form className="login-form">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" required />

            <label>Password</label>
            <input type="password" placeholder="••••••••" required />

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px #00d4ff" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
            >
              Login
            </motion.button>
          </form>
        </motion.div>
      </Tilt>
    </div>
  );
}

export default LoginPage;
