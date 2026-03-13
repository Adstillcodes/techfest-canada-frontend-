import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";

export default function Agenda() {
  var s1 = useState(false); var dark = s1[0]; var setDark = s1[1];

  useEffect(function () {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () {
      setDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);

  var bg       = dark ? "#06020f" : "#ffffff";
  var textMain = dark ? "#ffffff" : "#0d0520";
  var textMid  = dark ? "rgba(200,185,255,0.65)" : "rgba(13,5,32,0.58)";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: textMain, display: "flex", flexDirection: "column", transition: "background 0.3s ease, color 0.3s ease" }}>
      <Navbar />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" }}
        >
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(3rem, 6vw, 5rem)",
              fontWeight: 900,
              letterSpacing: "6px",
              background: "linear-gradient(90deg, #7a3fd1, #f5a623)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "20px",
            }}
          >
            COMING SOON
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              color: textMid,
              fontSize: "1.1rem",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            The full TechFest 2026 agenda is currently being finalized.
            Expect world-class keynotes, infrastructure deep dives, and
            cutting-edge discussions on the future of technology in Canada.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: "40px" }}
          >
            <motion.a
              href="/tickets"
              whileHover={{ scale: 1.04, translateY: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "16px 40px", borderRadius: 14,
                background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                color: "#ffffff",
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 800, fontSize: "0.78rem",
                letterSpacing: "1.2px", textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 6px 28px rgba(122,63,209,0.30)",
                transition: "box-shadow 0.25s ease",
              }}
            >
              Get Your Pass
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

