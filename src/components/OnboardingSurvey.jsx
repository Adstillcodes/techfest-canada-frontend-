import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Briefcase, ChevronDown, Sparkles, ArrowRight, CheckCircle, PartyPopper } from "lucide-react";

const FIELDS = [
  "Artificial Intelligence & Machine Learning",
  "Cybersecurity",
  "Quantum Computing",
  "Blockchain & Web3",
  "Cloud Computing & Infrastructure",
  "FinTech & Digital Payments",
  "Investment Banking",
  "Venture Capital & Private Equity",
  "Asset Management",
  "InsurTech",
  "RegTech & Compliance",
  "Software Engineering",
  "Data Science & Analytics",
  "DevOps & Platform Engineering",
  "Product Management",
  "Healthcare & Life Sciences Tech",
  "Supply Chain & Logistics Tech",
  "Defence & GovTech",
  "Clean Tech & Sustainability",
  "Robotics & Automation",
  "Telecommunications",
  "Media & AdTech",
  "EdTech",
  "PropTech & Real Estate Tech",
  "Other",
];

const API = "https://techfest-canada-backend.onrender.com/api/auth";

export default function OnboardingSurvey({ isOpen, onClose, userName = "there" }) {
  const [step, setStep] = useState(0); // 0=survey, 1=welcome
  const [linkedin, setLinkedin] = useState("");
  const [field, setField] = useState("");
  const [fieldOpen, setFieldOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.body.classList.contains("dark-mode")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.body.classList.contains("dark-mode")));
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!isOpen) return null;

  const bg     = isDark ? "#0f0720"              : "#ffffff";
  const cardBg = isDark ? "#160c2c"              : "#f8f6ff";
  const border = isDark ? "rgba(122,63,209,0.30)": "rgba(122,63,209,0.20)";
  const text   = isDark ? "#ffffff"              : "#1a0a40";
  const muted  = isDark ? "rgba(190,165,240,0.7)": "rgba(90,60,150,0.65)";
  const inputBg  = isDark ? "#1e1040"            : "#ede8ff";
  const dropBg   = isDark ? "#1a0e3a"            : "#f0ebff";

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    borderRadius: 12, border: `1.5px solid ${border}`,
    background: inputBg, color: text,
    fontSize: "0.92rem", fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (token && (linkedin || field)) {
        await fetch(`${API}/profile`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ linkedinUrl: linkedin, fieldOfWork: field }),
        });
      }
    } catch { /* silent — don't block UX */ }
    setSubmitting(false);
    setStep(1);
  };

  const firstName = userName?.split(" ")[0] || "there";

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: isDark ? "rgba(0,0,0,0.80)" : "rgba(20,10,50,0.50)",
      backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, zIndex: 99998,
    }}>
      <AnimatePresence mode="wait">

        {/* ── STEP 0: SURVEY ── */}
        {step === 0 && (
          <motion.div
            key="survey"
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              width: "100%", maxWidth: 480,
              background: cardBg, border: `1.5px solid ${border}`,
              borderRadius: 24, padding: "36px 32px",
              boxShadow: isDark
                ? "0 30px 80px rgba(0,0,0,0.7)"
                : "0 20px 60px rgba(122,63,209,0.15)",
              position: "relative", overflow: "visible",
            }}
          >
            {/* Progress bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "24px 24px 0 0", overflow: "hidden" }}>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: field && linkedin ? "100%" : field || linkedin ? "55%" : "10%" }}
                transition={{ duration: 0.5 }}
                style={{ height: "100%", background: "linear-gradient(90deg, #7a3fd1, #f5a623)" }}
              />
            </div>

            {/* Eyebrow */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: isDark ? "rgba(122,63,209,0.15)" : "rgba(122,63,209,0.10)", border: `1px solid ${border}`, borderRadius: 999, padding: "4px 14px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: isDark ? "#c4a8ff" : "#7a3fd1", marginBottom: 16 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f5a623", boxShadow: "0 0 5px #f5a623", display: "inline-block" }} />
              Quick Setup · 1 min
            </div>

            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", fontWeight: 900, color: text, marginBottom: 6 }}>
              Hey {firstName}! 👋
            </h2>
            <p style={{ fontSize: "0.85rem", color: muted, lineHeight: 1.6, marginBottom: 28 }}>
              Help us personalise your TFC experience. Takes 30 seconds.
            </p>

            {/* LinkedIn */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: muted, marginBottom: 8 }}>
                <Linkedin size={13} /> LinkedIn Profile URL
              </label>
              <input
                style={inputStyle}
                type="url"
                placeholder="https://linkedin.com/in/yourname"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
              />
            </div>

            {/* Field of Work */}
            <div style={{ marginBottom: 28, position: "relative" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: muted, marginBottom: 8 }}>
                <Briefcase size={13} /> Field of Work
              </label>
              <button
                onClick={() => setFieldOpen(v => !v)}
                style={{
                  ...inputStyle,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer", textAlign: "left",
                  border: `1.5px solid ${fieldOpen ? "rgba(122,63,209,0.6)" : border}`,
                }}
              >
                <span style={{ color: field ? text : muted }}>{field || "Select your field..."}</span>
                <ChevronDown size={16} style={{ color: muted, transition: "transform 0.2s", transform: fieldOpen ? "rotate(180deg)" : "rotate(0)" }} />
              </button>

              <AnimatePresence>
                {fieldOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                      background: dropBg, border: `1.5px solid ${border}`,
                      borderRadius: 14, overflow: "hidden auto",
                      maxHeight: 240, zIndex: 100,
                      boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.5)" : "0 12px 32px rgba(122,63,209,0.12)",
                    }}
                  >
                    {FIELDS.map(f => (
                      <button
                        key={f}
                        onClick={() => { setField(f); setFieldOpen(false); }}
                        style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "10px 16px", background: field === f
                            ? isDark ? "rgba(122,63,209,0.25)" : "rgba(122,63,209,0.12)"
                            : "transparent",
                          border: "none", color: field === f ? (isDark ? "#c4a8ff" : "#7a3fd1") : text,
                          fontSize: "0.83rem", cursor: "pointer", fontFamily: "inherit",
                          fontWeight: field === f ? 700 : 400,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => { if (field !== f) e.currentTarget.style.background = isDark ? "rgba(122,63,209,0.12)" : "rgba(122,63,209,0.07)"; }}
                        onMouseLeave={e => { if (field !== f) e.currentTarget.style.background = "transparent"; }}
                      >
                        {field === f && <CheckCircle size={12} style={{ display: "inline", marginRight: 8, color: "#7a3fd1" }} />}
                        {f}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  flex: 1, padding: "14px",
                  background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                  border: "none", borderRadius: 12, color: "white",
                  fontWeight: 800, fontSize: "0.88rem",
                  fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.4px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {submitting ? "Saving..." : <><Sparkles size={15} /> Continue</>}
              </button>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: "14px 20px",
                  background: "none", border: `1.5px solid ${border}`,
                  borderRadius: 12, color: muted,
                  fontSize: "0.82rem", cursor: "pointer",
                }}
              >
                Skip
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 1: WELCOME ── */}
        {step === 1 && (
          <motion.div
            key="welcome"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1] }}
            style={{
              width: "100%", maxWidth: 480,
              background: cardBg, border: `1.5px solid ${border}`,
              borderRadius: 24, padding: "48px 36px",
              boxShadow: isDark ? "0 30px 80px rgba(0,0,0,0.7)" : "0 20px 60px rgba(122,63,209,0.15)",
              textAlign: "center", position: "relative", overflow: "hidden",
            }}
          >
            {/* Background glow */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(122,63,209,0.18), transparent)" }} />

            {/* Confetti-like dots */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5], x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 }}
                transition={{ duration: 1.2, delay: i * 0.07, ease: "easeOut" }}
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: 6, height: 6, borderRadius: "50%",
                  background: i % 2 === 0 ? "#7a3fd1" : "#f5a623",
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
              style={{
                width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
                background: "linear-gradient(135deg, rgba(122,63,209,0.25), rgba(245,166,35,0.20))",
                border: `2px solid ${border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem",
              }}
            >
              🎉
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: isDark ? "rgba(122,63,209,0.15)" : "rgba(122,63,209,0.10)", border: `1px solid ${border}`, borderRadius: 999, padding: "4px 14px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: isDark ? "#c4a8ff" : "#7a3fd1", marginBottom: 20 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f5a623", boxShadow: "0 0 5px #f5a623", display: "inline-block" }} />
                Welcome to the family
              </div>

              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.6rem", fontWeight: 900, color: text, marginBottom: 12, lineHeight: 1.2 }}>
                Welcome to the <span style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>TFC Family</span>!
              </h2>

              <p style={{ fontSize: "0.88rem", color: muted, lineHeight: 1.7, marginBottom: 28, maxWidth: 360, margin: "0 auto 28px" }}>
                You're now part of Canada's most exciting tech community. Get ready for October 5th at The Carlu, Toronto.
              </p>

              {/* 3 perks */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {[
                  { emoji: "🎟", text: "Early access to speaker announcements" },
                  { emoji: "🤝", text: "Connect with 500+ innovators & decision-makers" },
                  { emoji: "📍", text: "The Carlu, Toronto · October 5, 2026" },
                ].map(p => (
                  <div key={p.text} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: isDark ? "rgba(122,63,209,0.08)" : "rgba(122,63,209,0.05)",
                    border: `1px solid ${border}`, borderRadius: 12, padding: "10px 16px",
                    textAlign: "left",
                  }}>
                    <span style={{ fontSize: "1.1rem" }}>{p.emoji}</span>
                    <span style={{ fontSize: "0.82rem", color: text, fontWeight: 600 }}>{p.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                style={{
                  width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                  border: "none", borderRadius: 12, color: "white",
                  fontWeight: 800, fontSize: "0.88rem",
                  fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.4px",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                Let's Go <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
