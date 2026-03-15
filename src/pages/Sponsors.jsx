import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Sponsors() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.body.classList.contains("dark-mode"));
    const obs = new MutationObserver(() => {
      setIsDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const bg        = isDark ? "#06020f"                : "#f4f0ff";
  const textMain  = isDark ? "#ffffff"                : "#0f0520";
  const textMuted = isDark ? "rgba(200,180,255,0.8)"  : "rgba(60,30,110,0.85)";
  const cardBg    = isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.04)";
  const border    = isDark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.18)";

  return (
    <div style={{ background: bg, color: textMain, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 5%", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 800, width: "100%" }}
        >
          <h1 style={{ 
            fontFamily: "'Orbitron', sans-serif", 
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)", 
            fontWeight: 900, 
            letterSpacing: "2px", 
            marginBottom: "1rem", 
            textTransform: "uppercase" 
          }}>
            2026 Partners
          </h1>
          
          <h2 style={{ 
            fontFamily: "'Orbitron', sans-serif", 
            fontSize: "clamp(3.5rem, 8vw, 6.5rem)", 
            fontWeight: 900, 
            marginBottom: "2rem", 
            background: "linear-gradient(135deg, #7a3fd1, #f5a623)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent", 
            backgroundClip: "text" 
          }}>
            Coming Soon.
          </h2>
          
          <p style={{ 
            fontSize: "1.2rem", 
            color: textMuted, 
            lineHeight: 1.8, 
            marginBottom: "4rem", 
            maxWidth: 600, 
            margin: "0 auto 4rem", 
            fontWeight: 500 
          }}>
            We are currently curating the ecosystem of innovators and leaders. The full partner directory will be announced shortly.
          </p>
          
          <div style={{ 
            padding: "40px", 
            background: cardBg, 
            border: `1px solid ${border}`, 
            borderRadius: "24px" 
          }}>
            <p style={{ fontSize: "1.05rem", color: textMuted, marginBottom: "24px" }}>
              Interested in showcasing your infrastructure at Tech Fest 2026?
            </p>
            <a 
              href="/Brochure.pdf" 
              download
              style={{
                display: "inline-block",
                padding: "16px 32px",
                borderRadius: "12px",
                background: "transparent",
                border: `2px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(122,63,209,0.3)"}`,
                color: textMain,
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#7a3fd1";
                e.currentTarget.style.color = "#7a3fd1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(122,63,209,0.3)";
                e.currentTarget.style.color = textMain;
              }}
            >
              Download Sponsorship Prospectus
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}