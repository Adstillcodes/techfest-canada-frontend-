import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PARTNER_SUBS = [
{ label: "Exhibit", path: "/exhibit" },
{ label: "Sponsor", path: "/sponsor" },
];

export default function Navbar() {

const [theme, setTheme] = useState<"light" | "dark">("light");
const [mobileOpen, setMobileOpen] = useState(false);
const [partnersOpen, setPartnersOpen] = useState(false);
const [mobilePartnersOpen, setMobilePartnersOpen] = useState(false);

const partnersTimeout = useRef<number | null>(null);

const location = useLocation();
const navigate = useNavigate();

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
return location.pathname === item.path;
});

useEffect(() => {
const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";

```
setTheme(saved);

document.body.classList.toggle("dark-mode", saved === "dark");
document.documentElement.classList.toggle("dark", saved === "dark");
```

}, []);

const toggleTheme = () => {

```
const next = theme === "dark" ? "light" : "dark";

setTheme(next);

localStorage.setItem("theme", next);

document.body.classList.toggle("dark-mode", next === "dark");
document.documentElement.classList.toggle("dark", next === "dark");
```

};

const handlePartnersEnter = () => {

```
if (partnersTimeout.current) clearTimeout(partnersTimeout.current);

setPartnersOpen(true);
```

};

const handlePartnersLeave = () => {

```
partnersTimeout.current = window.setTimeout(() => {

  setPartnersOpen(false);

}, 180);
```

};

const isDark = theme === "dark";

const borderCol = isDark
? "rgba(122,63,209,0.18)"
: "rgba(122,63,209,0.12)";

return (

```
<>
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
      borderBottom: `1px solid ${borderCol}`,
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

      <Link to="/" style={{ flexShrink: 0 }}>

        <img
          src={
            isDark
              ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
              : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"
          }
          alt="Tech Festival Canada"
          style={{ height: 52 }}
        />

      </Link>

      {/* NAVIGATION PILL */}

      <div className="tfc-desk-nav">

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            border: `1px solid ${borderCol}`,
            borderRadius: 999,
            padding: "4px",
          }}
        >

          {navItems.map((item, i) => {

            const isPartners = item.hasDropdown;

            if (isPartners) {

              return (

                <div
                  key={item.path}
                  style={{ position: "relative" }}
                  onMouseEnter={handlePartnersEnter}
                  onMouseLeave={handlePartnersLeave}
                >

                  <Link
                    to={item.path}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 999,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      fontFamily: "'Orbitron', sans-serif",
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      color: isDark
                        ? "rgba(255,255,255,0.65)"
                        : "rgba(15,5,32,0.65)",
                    }}
                  >
                    {item.label}
                  </Link>

                  <AnimatePresence>
                    {partnersOpen && (

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 12px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          minWidth: 180,
                          background: isDark ? "#0a0518" : "#ffffff",
                          border: `1px solid ${borderCol}`,
                          borderRadius: 16,
                          padding: 8,
                          zIndex: 100,
                        }}
                      >

                        {PARTNER_SUBS.map((sub) => (

                          <Link
                            key={sub.label}
                            to={sub.path}
                            onClick={() => setPartnersOpen(false)}
                            style={{
                              display: "block",
                              padding: "12px 16px",
                              borderRadius: 10,
                              fontFamily: "'Orbitron', sans-serif",
                              fontSize: "0.72rem",
                              textTransform: "uppercase",
                              textDecoration: "none",
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
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: isDark
                    ? "rgba(255,255,255,0.65)"
                    : "rgba(15,5,32,0.65)",
                }}
              >
                {item.label}
              </Link>

            );

          })}

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        <Link
          to="/tickets"
          style={{
            padding: "0 22px",
            height: 40,
            borderRadius: 999,
            border: `2px solid ${
              isDark
                ? "rgba(255,255,255,0.22)"
                : "rgba(0,0,0,0.18)"
            }`,
            color: isDark ? "#fff" : "#0f0520",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 800,
            fontSize: "0.68rem",
            letterSpacing: "0.8px",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            textTransform: "uppercase",
          }}
        >
          TICKETS
        </Link>

        <button
          onClick={toggleTheme}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: `1px solid ${borderCol}`,
            background: "transparent",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="tfc-hamburger"
        >
          ☰
        </button>

      </div>

    </div>

  </nav>

  <AnimatePresence>

    {mobileOpen && (

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(340px, 90vw)",
          background: isDark ? "#0a0518" : "#ffffff",
          padding: 24,
          zIndex: 9999,
        }}
      >

        {navItems.map((item) => (

          <div key={item.path} style={{ marginBottom: 16 }}>

            <Link
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>

          </div>

        ))}

        <Link
          to="/tickets"
          onClick={() => setMobileOpen(false)}
          style={{
            display: "block",
            padding: "14px",
            borderRadius: 12,
            background:
              "linear-gradient(135deg,#7a3fd1,#f5a623)",
            color: "#fff",
            textDecoration: "none",
            textAlign: "center",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
          }}
        >
          ✦ Get Your Tickets
        </Link>

      </motion.aside>

    )}

  </AnimatePresence>

</>
```

);

}
