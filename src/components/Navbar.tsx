import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PARTNER_SUBS = [
  { label: "Exhibit", path: "/exhibit" },
  { label: "Sponsor", path: "/sponsor" },
];

export default function Navbar() {

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [partnersOpen, setPartnersOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "FIRST TIMERS", path: "/on-demand" },
    { label: "PARTNERS", path: "/sponsors", hasDropdown: true },
    { label: "SPEAKERS", path: "/speakers" },
    { label: "AGENDA", path: "/agenda" },
  ];

  const activeIndex = navItems.findIndex((item) => {
    if (item.path === "/sponsors") {
      return (
        location.pathname === "/sponsors" ||
        location.pathname === "/exhibit" ||
        location.pathname === "/sponsor"
      );
    }
    return item.path === location.pathname;
  });

  useEffect(() => {
    const saved =
      (localStorage.getItem("theme") as "light" | "dark") || "light";

    setTheme(saved);
    document.body.classList.toggle("dark-mode", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";

    setTheme(next);
    localStorage.setItem("theme", next);
    document.body.classList.toggle("dark-mode", next === "dark");
  };

  const isDark = theme === "dark";

  const borderCol = isDark
    ? "rgba(122,63,209,0.18)"
    : "rgba(122,63,209,0.12)";

  return (
    <>
      {/* NAVBAR */}
      <nav
        style={{
          height: 80,
          display: "flex",
          alignItems: "center",
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid " + borderCol,
          background: isDark
            ? "rgba(7,3,15,0.90)"
            : "rgba(255,255,255,0.93)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 3%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

          {/* LOGO */}
          <Link to="/">
            <img
              src={
                isDark
                  ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                  : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"
              }
              style={{ height: 52 }}
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="tfc-desk-nav">
            <div
              style={{
                display: "flex",
                gap: 2,
                border: "1px solid " + borderCol,
                borderRadius: 999,
                padding: "4px",
              }}
            >
              {navItems.map((item, i) => {

                const isActive = activeIndex === i;

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.path}
                      onMouseEnter={() => setPartnersOpen(true)}
                      onMouseLeave={() => setPartnersOpen(false)}
                      style={{ position: "relative" }}
                    >
                      <Link
                        to={item.path}
                        style={{
                          padding: "8px 18px",
                          borderRadius: 999,
                          fontFamily: "Orbitron",
                          fontSize: "0.72rem",
                          textDecoration: "none",
                          color: isActive
                            ? "#fff"
                            : isDark
                            ? "#aaa"
                            : "#333",
                        }}
                      >
                        {item.label}
                      </Link>

                      <AnimatePresence>
                        {partnersOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                              position: "absolute",
                              top: "120%",
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: isDark
                                ? "#0a0518"
                                : "#fff",
                              borderRadius: 12,
                              padding: 10,
                              border: "1px solid " + borderCol,
                            }}
                          >
                            {PARTNER_SUBS.map((sub) => (
                              <Link
                                key={sub.label}
                                to={sub.path}
                                style={{
                                  display: "block",
                                  padding: "10px 16px",
                                  textDecoration: "none",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 999,
                      fontFamily: "Orbitron",
                      fontSize: "0.72rem",
                      textDecoration: "none",
                      color: isActive
                        ? "#fff"
                        : isDark
                        ? "#aaa"
                        : "#333",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* TICKETS */}
            <Link
              to="/tickets"
              style={{
                padding: "0 22px",
                height: 40,
                borderRadius: 999,
                border: isDark
                  ? "2px solid rgba(255,255,255,0.22)"
                  : "2px solid rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                fontFamily: "Orbitron",
                textDecoration: "none",
              }}
            >
              TICKETS
            </Link>

            {/* THEME */}
            <button
              onClick={toggleTheme}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "1px solid " + borderCol,
                background: "transparent",
                cursor: "pointer",
              }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* HAMBURGER */}
            <button
              className="tfc-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              height: "100%",
              width: 300,
              background: isDark ? "#0a0518" : "#fff",
              padding: 30,
              zIndex: 9999,
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  marginBottom: 20,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/tickets"
              onClick={() => setMobileOpen(false)}
            >
              Get Tickets
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .tfc-desk-nav{display:none}
        .tfc-hamburger{display:flex}

        @media(min-width:1024px){
          .tfc-desk-nav{display:block}
          .tfc-hamburger{display:none}
        }
      `}</style>
    </>
  );
}
