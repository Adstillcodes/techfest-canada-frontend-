import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";

type User = { _id: string; name: string; email: string; role?: string };

const PARTNERS_DROPDOWN = [
  { label: "Sponsor Us",        path: "/sponsor" },
  { label: "First Timers",      path: "/on-demand" },
  { label: "Speakers",          path: "/speakers" },
];

export default function Navbar() {
  const [authOpen,    setAuthOpen]    = useState(false);
  const [theme,       setTheme]       = useState<"light" | "dark">("light");
  const [user,        setUser]        = useState<User | null>(null);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  /* ── theme bootstrap ── */
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(saved);
    document.body.classList.toggle("dark-mode", saved === "dark");
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.body.classList.toggle("dark-mode", next === "dark");
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  /* ── auth ── */
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setUser(null); return; }
      try {
        const { fetchMe } = await import("../utils/api");
        setUser(await fetchMe());
      } catch { setUser(null); }
    };
    load();
    window.addEventListener("authChanged", load);
    return () => window.removeEventListener("authChanged", load);
  }, []);

  /* ── close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── close mobile on route change ── */
  useEffect(() => { setMobileOpen(false); setDropOpen(false); }, [location.pathname]);

  const dark = theme === "dark";
  const bg          = dark ? "rgba(6,2,15,0.92)"   : "rgba(255,255,255,0.94)";
  const border      = dark ? "rgba(155,135,245,0.12)" : "rgba(122,63,209,0.10)";
  const textMain    = dark ? "#ffffff"              : "#0d0520";
  const textMuted   = dark ? "rgba(200,185,255,0.70)" : "rgba(13,5,32,0.60)";
  const pillBg      = dark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.06)";
  const pillBorder  = dark ? "rgba(155,135,245,0.18)" : "rgba(122,63,209,0.18)";
  const dropBg      = dark ? "#0e0820"              : "#ffffff";
  const dropBorder  = dark ? "rgba(155,135,245,0.18)" : "rgba(122,63,209,0.14)";
  const mobileBg    = dark ? "#0a0518"              : "#ffffff";

  const navItems = [
    { label: "HOME",         path: "/" },
    { label: "PARTNERS",     path: null }, // dropdown trigger
    { label: "SPEAKERS",     path: "/speakers" },
    { label: "AGENDA",       path: "/agenda" },
  ];

  const isActive = (path: string | null) => {
    if (!path) return PARTNERS_DROPDOWN.some(d => d.path === location.pathname);
    return location.pathname === path;
  };

  return (
    <>
      <style>{
        .tfc-navbar-wrap {
          position: sticky; top: 0; z-index: 1000; width: 100%;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
        }
        .tfc-nav-link {
          font-family: 'Orbitron', sans-serif; font-size: 0.72rem; font-weight: 800;
          letter-spacing: 1.2px; text-transform: uppercase;
          padding: 9px 18px; border-radius: 999px;
          text-decoration: none; transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }
        .tfc-nav-link:hover { background: rgba(122,63,209,0.10); }
        .tfc-nav-link.active { background: rgba(122,63,209,0.14); }

        /* hamburger */
        .tfc-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 6px; }
        .tfc-hamburger span { display: block; width: 22px; height: 2px; border-radius: 2px; transition: all 0.25s ease; }
        .tfc-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .tfc-hamburger.open span:nth-child(2) { opacity: 0; }
        .tfc-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        @media (max-width: 1024px) {
          .tfc-desktop-nav { display: none !important; }
          .tfc-hamburger { display: flex !important; }
        }
        @media (max-width: 640px) {
          .tfc-tickets-btn { display: none !important; }
        }
      }</style>

      <nav
        className="tfc-navbar-wrap"
        style={{ background: bg, borderBottom: "1px solid " + border }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2.5%", height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

          {/* ── LOGO ── */}
          <Link to="/" style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <img
              src={dark
                ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
              alt="The Tech Festival Canada"
              style={{ height: 52, width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="tfc-desktop-nav" style={{ display: "flex", alignItems: "center" }}>
            <ul style={{ display: "flex", alignItems: "center", gap: 4, listStyle: "none", margin: 0, padding: "6px", background: pillBg, border: "1px solid " + pillBorder, borderRadius: 999 }}>
              {navItems.map((item) => {
                if (item.path === null) {
                  /* Partners dropdown */
                  return (
                    <li key="partners" style={{ position: "relative" }} ref={dropRef}>
                      <button
                        onClick={() => setDropOpen(!dropOpen)}
                        className={"tfc-nav-link" + (isActive(null) ? " active" : "")}
                        style={{
                          color: isActive(null) ? (dark ? "#ffffff" : "#0d0520") : textMuted,
                          background: "none", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 6,
                        }}
                      >
                        PARTNERS
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {dropOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.18 }}
                            style={{
                              position: "absolute", top: "calc(100% + 12px)", left: "50%",
                              transform: "translateX(-50%)",
                              background: dropBg, border: "1px solid " + dropBorder,
                              borderRadius: 16, padding: "8px",
                              minWidth: 200,
                              boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(122,63,209,0.12)",
                              zIndex: 200,
                            }}
                          >
                            {PARTNERS_DROPDOWN.map((d) => (
                              <Link
                                key={d.path}
                                to={d.path}
                                onClick={() => setDropOpen(false)}
                                style={{
                                  display: "block", padding: "10px 16px", borderRadius: 10,
                                  fontFamily: "'Orbitron', sans-serif", fontSize: "0.68rem",
                                  fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase",
                                  color: location.pathname === d.path ? "#7a3fd1" : textMain,
                                  textDecoration: "none", background: location.pathname === d.path ? "rgba(122,63,209,0.08)" : "transparent",
                                  transition: "background 0.15s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(122,63,209,0.08)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = location.pathname === d.path ? "rgba(122,63,209,0.08)" : "transparent")}
                              >
                                {d.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={"tfc-nav-link" + (isActive(item.path) ? " active" : "")}
                      style={{ color: isActive(item.path) ? textMain : textMuted }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── RIGHT ACTIONS ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {/* Tickets */}
            <Link
              to="/tickets"
              className="tfc-tickets-btn"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 24px", borderRadius: 999,
                fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", fontWeight: 800,
                letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none",
                background: dark ? "#ffffff" : "#0d0520",
                color: dark ? "#0d0520" : "#ffffff",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#7a3fd1,#f5a623)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = dark ? "#ffffff" : "#0d0520"; e.currentTarget.style.color = dark ? "#0d0520" : "#ffffff"; }}
            >
              TICKETS
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.15rem", padding: "6px", lineHeight: 1 }}
              aria-label="Toggle theme"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* Hamburger */}
            <button
              className={"tfc-hamburger" + (mobileOpen ? " open" : "")}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span style={{ background: textMain }} />
              <span style={{ background: textMain }} />
              <span style={{ background: textMain }} />
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden", background: mobileBg, borderTop: "1px solid " + border }}
            >
              <div style={{ padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
                {/* Regular nav items */}
                {navItems.filter(i => i.path !== null).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path!}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", fontWeight: 800,
                      letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none",
                      padding: "12px 16px", borderRadius: 12,
                      color: location.pathname === item.path ? "#7a3fd1" : textMain,
                      background: location.pathname === item.path ? "rgba(122,63,209,0.08)" : "transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Partners section in mobile */}
                <div style={{ paddingLeft: 16, marginTop: 4 }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: textMuted, marginBottom: 8 }}>PARTNERS</div>
                  {PARTNERS_DROPDOWN.map((d) => (
                    <Link
                      key={d.path}
                      to={d.path}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "block", fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem",
                        fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase",
                        textDecoration: "none", padding: "10px 16px", borderRadius: 10,
                        color: location.pathname === d.path ? "#7a3fd1" : textMuted,
                        background: location.pathname === d.path ? "rgba(122,63,209,0.08)" : "transparent",
                      }}
                    >
                      — {d.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile CTA */}
                <Link
                  to="/tickets"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: 12, padding: "14px", borderRadius: 14,
                    fontFamily: "'Orbitron', sans-serif", fontSize: "0.76rem", fontWeight: 800,
                    letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none",
                    background: "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#fff",
                  }}
                >
                  GET YOUR PASS
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
