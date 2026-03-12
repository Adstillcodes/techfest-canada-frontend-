import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import { fetchMe } from "../utils/api";
 
type User = { _id: string; name: string; email: string; role?: string };
 
export default function Navbar() {
  const [authOpen, setAuthOpen]     = useState(false);
  const [theme, setTheme]           = useState<"light" | "dark">("light");
  const [user, setUser]             = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location                    = useLocation();
 
  const navItems = [
    { label: "HOME",         path: "/" },
    { label: "First Timers", path: "/on-demand" },
    { label: "EXHIBITION",   path: "/sponsors" },
    { label: "SPEAKERS",     path: "/speakers" },
    { label: "AGENDA",       path: "/agenda" },
  ];
 
  const loggedIn = !!user;
  const isAdmin  = user?.role === "admin";
  if (isAdmin) navItems.push({ label: "ADMIN", path: "/admin" });
  const activeIndex = navItems.findIndex(i => i.path === location.pathname);
 
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setUser(null); return; }
      try { setUser(await fetchMe()); } catch { setUser(null); }
    };
    load();
    window.addEventListener("authChanged", load);
    window.addEventListener("authStateChanged", load);
    return () => {
      window.removeEventListener("authChanged", load);
      window.removeEventListener("authStateChanged", load);
    };
  }, []);
 
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(saved);
    document.body.classList.toggle("dark-mode", saved === "dark");
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);
 
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width    = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width    = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width    = "";
    };
  }, [mobileOpen]);
 
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.body.classList.toggle("dark-mode", next === "dark");
    document.documentElement.classList.toggle("dark", next === "dark");
  };
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChanged"));
    setUser(null);
    setMobileOpen(false);
  };
 
  const isDark = theme === "dark";
  const borderCol = isDark ? "rgba(122,63,209,0.18)" : "rgba(122,63,209,0.12)";
 
  return (
    <>
      {/* ════ STICKY NAV ════ */}
      <nav style={{
        height: 80, display: "flex", alignItems: "center", width: "100%",
        position: "sticky", top: 0, zIndex: 1000,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${borderCol}`,
        background: isDark ? "rgba(7,3,15,0.90)" : "rgba(255,255,255,0.93)",
        transition: "background 0.3s",
      }}>
        <div style={{
          width: "100%", maxWidth: 1400, margin: "0 auto", padding: "0 3%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
 
          {/* LOGO */}
          <Link to="/" style={{ flexShrink: 0 }}>
            <img
              src={isDark
                ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
              alt="Tech Festival Canada"
              style={{ height: 52, width: "auto", objectFit: "contain", display: "block" }}
            />
          </Link>
 
          {/* DESKTOP TABS — tubelight pill */}
          <div className="tfc-desk-nav">
            <div style={{
              display: "flex", alignItems: "center", gap: 2,
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(122,63,209,0.04)",
              border: `1px solid ${borderCol}`,
              borderRadius: 999, padding: "4px",
            }}>
              {navItems.map((item, i) => {
                const isActive = activeIndex === i;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      position: "relative",
                      padding: "8px 18px",
                      borderRadius: 999,
                      fontSize: "0.72rem", fontWeight: 800,
                      fontFamily: "'Orbitron', sans-serif",
                      letterSpacing: "0.8px", textTransform: "uppercase",
                      color: isActive ? "#fff" : (isDark ? "rgba(255,255,255,0.55)" : "rgba(15,5,32,0.55)"),
                      textDecoration: "none", whiteSpace: "nowrap",
                      transition: "color 0.2s",
                      zIndex: 1,
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="tfc-lamp-bg"
                        style={{
                          position: "absolute", inset: 0, borderRadius: 999,
                          background: "linear-gradient(135deg, var(--brand-purple), #9b68ff)",
                          zIndex: -1,
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {/* Tubelight glow — centered via margin:auto (transform gets overridden by layoutId) */}
                    {isActive && (
                      <motion.span
                        layoutId="tfc-lamp-glow"
                        style={{
                          position: "absolute",
                          top: -2,
                          left: 0,
                          right: 0,
                          marginLeft: "auto",
                          marginRight: "auto",
                          width: 32, height: 3,
                          borderRadius: "0 0 4px 4px",
                          background: "var(--brand-orange)",
                          boxShadow: "0 0 12px 4px rgba(245,166,35,0.6)",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
 
          {/* RIGHT ACTIONS */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 
            <div className="tfc-desk-actions">
              {!loggedIn ? (
                <button onClick={() => setAuthOpen(true)} style={{
                  padding: "0 22px", height: 40, borderRadius: 999,
                  background: "var(--brand-purple)", color: "#fff", border: "none",
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                  fontSize: "0.68rem", letterSpacing: "0.8px", cursor: "pointer",
                  textTransform: "uppercase",
                }}>MY ACCOUNT</button>
              ) : (
                <Link to="/dashboard" style={{
                  padding: "0 22px", height: 40, borderRadius: 999,
                  background: "var(--brand-purple)", color: "#fff",
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                  fontSize: "0.68rem", letterSpacing: "0.8px", textDecoration: "none",
                  display: "flex", alignItems: "center", textTransform: "uppercase",
                }}>MY ACCOUNT</Link>
              )}
              <Link to="/tickets" style={{
                padding: "0 22px", height: 40, borderRadius: 999,
                background: "transparent",
                border: `2px solid ${isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)"}`,
                color: isDark ? "#fff" : "#0f0520",
                fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                fontSize: "0.68rem", letterSpacing: "0.8px", textDecoration: "none",
                display: "flex", alignItems: "center", textTransform: "uppercase",
              }}>TICKETS</Link>
            </div>
 
            <button onClick={toggleTheme} style={{
              width: 38, height: 38, borderRadius: "50%", border: `1px solid ${borderCol}`,
              background: "transparent", cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{isDark ? "☀️" : "🌙"}</button>
 
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="tfc-hamburger"
              aria-label="Menu"
              style={{
                width: 38, height: 38, borderRadius: 8, border: "none",
                background: isDark ? "rgba(122,63,209,0.18)" : "rgba(122,63,209,0.10)",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 5, padding: 0,
              }}
            >
              <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
                style={{ width: 20, height: 2, background: isDark ? "#fff" : "#0f0520", borderRadius: 2, display: "block", transformOrigin: "center" }} />
              <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }}
                style={{ width: 20, height: 2, background: isDark ? "#fff" : "#0f0520", borderRadius: 2, display: "block" }} />
              <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
                style={{ width: 20, height: 2, background: isDark ? "#fff" : "#0f0520", borderRadius: 2, display: "block", transformOrigin: "center" }} />
            </button>
          </div>
        </div>
      </nav>
 
      {/* ════ MOBILE SHEET ════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 99990,
                background: "rgba(0,0,0,0.70)",
                backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
              }}
            />
            <motion.aside
              key="sheet"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0,
                width: "min(340px, 90vw)", zIndex: 99999,
                background: isDark ? "#0a0518" : "#ffffff",
                borderLeft: `1px solid ${borderCol}`,
                boxShadow: "-24px 0 80px rgba(0,0,0,0.5)",
                display: "flex", flexDirection: "column", overflowY: "auto",
              }}
            >
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 22px",
                borderBottom: `1px solid ${borderCol}`,
              }}>
                <img
                  src={isDark
                    ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                    : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
                  alt="TFC" style={{ height: 34, width: "auto" }}
                />
                <button onClick={() => setMobileOpen(false)} style={{
                  width: 32, height: 32, borderRadius: "50%", border: `1px solid ${borderCol}`,
                  background: "transparent", cursor: "pointer",
                  color: isDark ? "#fff" : "#0f0520", fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
              </div>
 
              {/* Nav links */}
              <div style={{ padding: "22px 20px", flex: 1 }}>
                <p style={{
                  fontSize: "0.58rem", fontWeight: 800, letterSpacing: "1.6px",
                  textTransform: "uppercase",
                  color: isDark ? "rgba(196,168,255,0.45)" : "rgba(122,63,209,0.45)",
                  marginBottom: 12,
                }}>Navigation</p>
 
                <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 28 }}>
                  {navItems.map((item, i) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "13px 16px", borderRadius: 12,
                        background: activeIndex === i
                          ? (isDark ? "rgba(122,63,209,0.16)" : "rgba(122,63,209,0.08)")
                          : "transparent",
                        border: `1px solid ${activeIndex === i ? "rgba(122,63,209,0.30)" : "transparent"}`,
                        textDecoration: "none",
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: "0.78rem", fontWeight: 800,
                        letterSpacing: "0.5px", textTransform: "uppercase",
                        color: activeIndex === i
                          ? (isDark ? "#c4a8ff" : "#7a3fd1")
                          : (isDark ? "rgba(255,255,255,0.70)" : "rgba(15,5,32,0.70)"),
                        transition: "all 0.18s",
                      }}
                    >
                      {item.label}
                      {activeIndex === i && (
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "var(--brand-orange)",
                          boxShadow: "0 0 6px var(--brand-orange)",
                        }} />
                      )}
                    </Link>
                  ))}
                </div>
 
                <div style={{ height: 1, background: borderCol, marginBottom: 22 }} />
 
                <p style={{
                  fontSize: "0.58rem", fontWeight: 800, letterSpacing: "1.6px",
                  textTransform: "uppercase",
                  color: isDark ? "rgba(196,168,255,0.45)" : "rgba(122,63,209,0.45)",
                  marginBottom: 12,
                }}>Account</p>
 
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {!loggedIn ? (
                    <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }} style={{
                      padding: "13px", borderRadius: 12, border: "none",
                      background: "var(--brand-purple)", color: "#fff",
                      fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                      fontSize: "0.76rem", cursor: "pointer",
                    }}>Sign Up / Log In</button>
                  ) : (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{
                        display: "block", padding: "13px", borderRadius: 12,
                        background: "var(--brand-purple)", color: "#fff",
                        textDecoration: "none", textAlign: "center",
                        fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.76rem",
                      }}>My Account</Link>
                      <button onClick={handleLogout} style={{
                        padding: "13px", borderRadius: 12, background: "transparent",
                        border: "1.5px solid rgba(239,68,68,0.30)", color: "#f87171",
                        fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                        fontSize: "0.74rem", cursor: "pointer",
                      }}>Log Out</button>
                    </>
                  )}
                  <Link to="/tickets" onClick={() => setMobileOpen(false)} style={{
                    display: "block", padding: "14px", borderRadius: 12,
                    background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                    color: "#fff", textDecoration: "none", textAlign: "center",
                    fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "0.78rem",
                    boxShadow: "0 4px 18px rgba(245,166,35,0.28)",
                  }}>✦ Get Your Tickets</Link>
                </div>
              </div>
 
              <div style={{
                padding: "14px 20px", borderTop: `1px solid ${borderCol}`,
                fontSize: "0.65rem",
                color: isDark ? "rgba(200,180,255,0.35)" : "rgba(122,63,209,0.40)",
                textAlign: "center",
              }}>
                The Tech Festival Canada · 27-28 Oct, 2026 · The Carlu, Toronto
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
 
      <style>{`
        .tfc-desk-nav { display: none; }
        .tfc-desk-actions { display: none; align-items: center; gap: 10px; }
        .tfc-hamburger { display: flex !important; }
        @media (min-width: 1024px) {
          .tfc-desk-nav { display: block; }
          .tfc-desk-actions { display: flex; }
          .tfc-hamburger { display: none !important; }
        }
      `}</style>
 
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
 
