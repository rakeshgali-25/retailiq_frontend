// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Loader = () => {
  const bounceTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeOut",
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            style={styles.dot}
            transition={{ ...bounceTransition, delay: i * 0.2 }}
            animate={{ y: ["100%", "-100%"] }}
          />
        ))}
      </div>
      <p style={styles.text}>Loading RetailIQ...</p>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(20,20,20,0.4)",
    backdropFilter: "blur(6px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  dots: {
    display: "flex",
    gap: "12px",
  },
  dot: {
    width: "14px",
    height: "14px",
    backgroundColor: "#00d4ff",
    borderRadius: "50%",
  },
  text: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#00d4ff",
    fontFamily: "Poppins, sans-serif",
  },
};

export default Loader;
