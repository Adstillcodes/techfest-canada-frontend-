import { useState, useEffect } from "react";
import { Cookie, X, Shield, BarChart2, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.body.classList.contains("dark-mode")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.body.classList.contains("dark-mode")));
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem("tfc_cookie_consent");
    if (!consent) setTimeout(() => setVisible(true), 1200);
  }, []);

  const accept = (type) => {
    localStorage.setItem("tfc_cookie_consent", type);
    localStorage.setItem("tfc_cookie_date", new Date().toISOString());
    setVisible(false);
  };

  const bg      = isDark ? "rgba(12,6,28,0.97)"  : "rgba(255,255,255,0.98)";
  const border  = isDark ? "rgba(122,63,209,0.30)" : "rgba(122,63,209,0.18)";
  const text    = isDark ? "#ffffff"              : "#1a0a40";
  const muted   = isDark ? "rgba(190,165,240,0.7)": "rgba(90,60,150,0.65)";
  const chipBg  = isDark ? "rgba(122,63,209,0.12)": "rgba(122,63,209,0.07)";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 200 }}
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            width: "calc(100% - 48px)", maxWidth: 560,
            background: bg, border: `1.5px solid ${border}`,
            borderRadius: 20, padding: "24px 28px",
            boxShadow: isDark
              ? "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(122,63,209,0.1)"
              : "0 20px 60px rgba(122,63,209,0.12), 0 0 0 1px rgba(122,63,209,0.08)",
            zIndex: 99999, backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: "linear-gradient(135deg, rgba(122,63,209,0.2), rgba(245,166,35,0.15))",
              border: `1px solid ${border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#c4a8ff",
            }}>
              <Cookie size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.88rem", fontWeight: 800, color: text, marginBottom: 4 }}>
                We use cookies 🍪
              </div>
              <p style={{ fontSize: "0.8rem", color: muted, lineHeight: 1.6, margin: 0 }}>
                TFC uses cookies to enhance your experience, remember your login, and analyse site usage. You control what we store.
              </p>
            </div>
            <button onClick={() => accept("essential")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: muted, padding: 4, flexShrink: 0,
            }}>
              <X size={16} />
            </button>
          </div>

          {/* Cookie type chips */}
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}
            >
              {[
                { icon: <Shield size={13} />, label: "Essential", desc: "Login, security, preferences — always on", on: true },
                { icon: <BarChart2 size={13} />, label: "Analytics", desc: "Anonymous usage data to improve the site", on: true },
                { icon: <Settings size={13} />, label: "Personalisation", desc: "Remember your session and settings", on: true },
              ].map(c => (
                <div key={c.label} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: chipBg, borderRadius: 10, padding: "8px 12px",
                  border: `1px solid ${border}`,
                }}>
                  <span style={{ color: "#c4a8ff" }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: text }}>{c.label}</span>
                    <span style={{ fontSize: "0.72rem", color: muted, marginLeft: 8 }}>{c.desc}</span>
                  </div>
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px",
                    borderRadius: 999, background: c.on ? "rgba(122,63,209,0.20)" : "rgba(200,200,200,0.15)",
                    color: c.on ? "#c4a8ff" : muted,
                  }}>{c.on ? "ON" : "OFF"}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => accept("all")} style={{
              flex: 2, minWidth: 120, padding: "11px 0",
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
              border: "none", borderRadius: 12, color: "white",
              fontWeight: 800, fontSize: "0.82rem", cursor: "pointer",
              fontFamily: "'Orbitron', monospace", letterSpacing: "0.3px",
            }}>
              Accept All
            </button>
            <button onClick={() => accept("essential")} style={{
              flex: 1, minWidth: 100, padding: "11px 0",
              background: chipBg, border: `1.5px solid ${border}`,
              borderRadius: 12, color: text,
              fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
            }}>
              Essential Only
            </button>
            <button onClick={() => setShowDetails(v => !v)} style={{
              padding: "11px 16px",
              background: "none", border: `1.5px solid ${border}`,
              borderRadius: 12, color: muted,
              fontWeight: 600, fontSize: "0.78rem", cursor: "pointer",
            }}>
              {showDetails ? "Hide" : "Details"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
