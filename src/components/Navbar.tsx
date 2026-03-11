import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import { fetchMe } from "../utils/api";

type User = { _id: string; name: string; email: string; role?: string; };
type TabPosition = { left: number; width: number; opacity: number };
type TabProps = {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<TabPosition>>;
  onClick: () => void;
  to: string;
  isActive: boolean;
};

/* ── SLIDING CURSOR ── */
const Cursor = ({ position }: { position: TabPosition }) => (
  <motion.li
    animate={position}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    style={{
      position: "absolute", top: 4, bottom: 4,
      borderRadius: 999,
      background: "linear-gradient(135deg, var(--brand-purple), var(--brand-orange))",
      zIndex: 0, opacity: position.opacity,
    }}
  />
);

const Tab = React.forwardRef<HTMLLIElement, TabProps>(
  ({ children, setPosition, onClick, to, isActive }, ref) => (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref || typeof ref === "function") return;
        const el = (ref as React.RefObject<HTMLLIElement>).current;
        if (!el) return;
        setPosition({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
      }}
      style={{ position: "relative", zIndex: 1, listStyle: "none" }}
    >
      <Link to={to} onClick={onClick} style={{
        display: "block", padding: "8px 18px", borderRadius: 999,
        fontSize: "0.72rem", fontWeight: 800, fontFamily: "'Orbitron', sans-serif",
        letterSpacing: "0.8px", textTransform: "uppercase",
        color: isActive ? "#fff" : "var(--text-muted)",
        textDecoration: "none", transition: "color 0.2s", whiteSpace: "nowrap",
      }}>
        {children}
      </Link>
    </li>
  )
);

/* ── MAIN ── */
export default function Navbar() {
  const [authOpen, setAuthOpen]     = useState(false);
  const [theme, setTheme]           = useState<"light" | "dark">("light");
  const [user, setUser]             = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location                    = useLocation();
  const [position, setPosition]     = useState<TabPosition>({ left: 0, width: 0, opacity: 0 });
  const tabsRef                     = useRef<(HTMLLIElement | null)[]>([]);

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
    const tab = tabsRef.current[activeIndex];
    if (tab) setPosition({ left: tab.offsetLeft, width: tab.offsetWidth, opacity: 1 });
  }, [activeIndex, location.pathname]);

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

  /* Lock body scroll when sheet open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
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
  const textCol   = isDark ? "rgba(255,255,255,0.75)" : "rgba(15,5,32,0.75)";

  return (
    <>
      {/* ════ STICKY NAV BAR ════ */}
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

          {/* DESKTOP TABS */}
          <div className="tfc-desk-nav">
            <ul style={{
              position: "relative", display: "flex", alignItems: "center", borderRadius: 999,
              border: `1px solid ${borderCol}`,
              background: isDark ? "rgba(122,63,209,0.06)" : "rgba(122,63,209,0.04)",
              padding: "4px", margin: 0, listStyle: "none",
            }}>
              {navItems.map((item, i) => (
                <Tab
                  key={item.path} to={item.path}
                  ref={(el: HTMLLIElement | null) => { if (el) tabsRef.current[i] = el; }}
                  setPosition={setPosition} onClick={() => {}} isActive={activeIndex === i}
                >
                  {item.label}
                </Tab>
              ))}
              <Cursor position={position} />
            </ul>
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* Desktop buttons */}
            <div className="tfc-desk-actions">
              {!loggedIn ? (
                <button onClick={() => setAuthOpen(true)} style={{
                  padding: "0 22px", height: 40, borderRadius: 999,
                  background: "var(--brand-purple)", color: "#fff", border: "none",
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                  fontSize: "0.68rem", letterSpacing: "0.8px", cursor: "pointer", textTransform: "uppercase",
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
                padding: "0 22px", height: 40, borderRadius: 999, background: "transparent",
                border: `2px solid ${isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)"}`,
                color: isDark ? "#fff" : "#0f0520",
                fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                fontSize: "0.68rem", letterSpacing: "0.8px", textDecoration: "none",
                display: "flex", alignItems: "center", textTransform: "uppercase",
              }}>TICKETS</Link>
            </div>

            {/* Theme toggle */}
            <button onClick={toggleTheme} style={{
              width: 38, height: 38, borderRadius: "50%", border: `1px solid ${borderCol}`,
              background: "transparent", cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {isDark ? "☀️" : "🌙"}
            </button>

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
                borderLeft: `1px solid ${isDark ? "rgba(122,63,209,0.28)" : "rgba(122,63,209,0.18)"}`,
                boxShadow: "-24px 0 80px rgba(0,0,0,0.5)",
                display: "flex", flexDirection: "column", overflowY: "auto",
              }}
            >
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 22px",
                borderBottom: `1px solid ${isDark ? "rgba(122,63,209,0.15)" : "rgba(122,63,209,0.10)"}`,
              }}>
                <img
                  src={isDark
                    ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                    : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
                  alt="TFC" style={{ height: 34, width: "auto" }}
                />
                <button onClick={() => setMobileOpen(false)} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `1px solid ${borderCol}`,
                  background: "transparent", cursor: "pointer",
                  color: isDark ? "#fff" : "#0f0520", fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
              </div>

              {/* Nav links */}
              <div style={{ padding: "22px 20px", flex: 1 }}>
                <p style={{
                  fontSize: "0.58rem", fontWeight: 800, letterSpacing: "1.6px", textTransform: "uppercase",
                  color: isDark ? "rgba(196,168,255,0.45)" : "rgba(122,63,209,0.45)", marginBottom: 12,
                }}>Navigation</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 28 }}>
                  {navItems.map((item) => (
                    <Link
                      key={item.path} to={item.path}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "13px 16px", borderRadius: 12,
                        background: activeIndex === navItems.indexOf(item)
                          ? isDark ? "rgba(122,63,209,0.16)" : "rgba(122,63,209,0.08)"
                          : "transparent",
                        border: `1px solid ${activeIndex === navItems.indexOf(item) ? "rgba(122,63,209,0.30)" : "transparent"}`,
                        textDecoration: "none",
                        fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", fontWeight: 800,
                        letterSpacing: "0.5px", textTransform: "uppercase",
                        color: activeIndex === navItems.indexOf(item)
                          ? (isDark ? "#c4a8ff" : "#7a3fd1") : textCol,
                        transition: "all 0.18s",
                      }}
                    >
                      {item.label}
                      {activeIndex === navItems.indexOf(item) && (
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand-orange)", boxShadow: "0 0 6px var(--brand-orange)" }} />
                      )}
                    </Link>
                  ))}
                </div>

                <div style={{ height: 1, background: isDark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.08)", marginBottom: 22 }} />

                <p style={{
                  fontSize: "0.58rem", fontWeight: 800, letterSpacing: "1.6px", textTransform: "uppercase",
                  color: isDark ? "rgba(196,168,255,0.45)" : "rgba(122,63,209,0.45)", marginBottom: 12,
                }}>Account</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {!loggedIn ? (
                    <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }} style={{
                      padding: "13px", borderRadius: 12, border: "none",
                      background: "var(--brand-purple)", color: "#fff",
                      fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                      fontSize: "0.76rem", cursor: "pointer", letterSpacing: "0.4px",
                    }}>Sign Up / Log In</button>
                  ) : (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{
                        display: "block", padding: "13px", borderRadius: 12,
                        background: "var(--brand-purple)", color: "#fff", textDecoration: "none",
                        textAlign: "center", fontFamily: "'Orbitron', sans-serif",
                        fontWeight: 800, fontSize: "0.76rem",
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
                    display: "block", padding: "14px", borderRadius: 12, textDecoration: "none",
                    background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                    color: "#fff", textAlign: "center",
                    fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
                    fontSize: "0.78rem", letterSpacing: "0.4px",
                    boxShadow: "0 4px 18px rgba(245,166,35,0.30)",
                  }}>✦ Get Your Tickets</Link>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: "14px 20px",
                borderTop: `1px solid ${isDark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.08)"}`,
                fontSize: "0.65rem", color: isDark ? "rgba(200,180,255,0.35)" : "rgba(122,63,209,0.40)",
                textAlign: "center",
              }}>
                The Tech Festival Canada · Oct 28, 2026 · The Carlu, Toronto
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Responsive rules */}
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
