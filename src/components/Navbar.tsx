import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AuthModal from "./AuthModal";
import { fetchMe } from "../utils/api";

type User = { _id: string; name: string; email: string; role?: string; };
type TabPosition = { left: number; width: number; opacity: number; };
type TabProps = {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<TabPosition>>;
  onClick: () => void;
  to: string;
  isActive: boolean;
};

const Tab = React.forwardRef<HTMLLIElement, TabProps>(
  ({ children, setPosition, onClick, to, isActive }, ref) => (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref || typeof ref === "function" || !ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ left: ref.current.offsetLeft, width, opacity: 1 });
      }}
      className={`relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase transition-colors duration-300 md:px-5 md:py-2 md:text-sm font-['Orbitron'] font-bold
        ${isActive ? "text-white" : "text-gray-900 dark:text-[var(--text-main)]"}
        dark:mix-blend-difference`}
    >
      <Link to={to} onClick={onClick} className="block w-full h-full">{children}</Link>
    </li>
  )
);
Tab.displayName = "Tab";

const Cursor = ({ position }: { position: TabPosition }) => (
  <motion.li animate={{ ...position }} className="absolute z-0 h-7 rounded-full bg-black dark:bg-white md:h-10" />
);

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const loggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const [position, setPosition] = useState<TabPosition>({ left: 0, width: 0, opacity: 0 });
  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  const navItems = [
    { label: "HOME",        path: "/" },
    { label: "First Timers", path: "/on-demand" },
    { label: "EXHIBITION",  path: "/sponsors" },
    { label: "ATTENDEES",   path: "/speakers" },
  ];
  if (isAdmin) navItems.push({ label: "ADMIN", path: "/admin" });

  const activeIndex = navItems.findIndex((item) => item.path === location.pathname);

  useEffect(() => {
    const tab = tabsRef.current[activeIndex];
    if (tab) {
      const { width } = tab.getBoundingClientRect();
      setPosition({ left: tab.offsetLeft, width, opacity: 1 });
    }
  }, [activeIndex, location.pathname]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setUser(null); return; }
      try { setUser(await fetchMe()); } catch { setUser(null); }
    };
    loadUser();
    window.addEventListener("authChanged", loadUser);
    return () => window.removeEventListener("authChanged", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChanged"));
    setUser(null);
  };

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

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">

          {/* LOGO — left */}
          <Link to="/" onClick={closeMobile}>
            <img
              src="/updatednavlogo.png"
              alt="TechFest Canada"
              className="h-[70px] w-[80px]"
              
            />
          </Link>

          {/* TABS — centre */}
          <div className="hidden lg:block mx-auto">
            <ul className="relative flex w-fit rounded-full border border-[var(--border-main)] bg-[var(--bg-card)] p-1">
              {navItems.map((item, i) => (
                <Tab
                  key={item.path}
                  to={item.path}
                  ref={(el: HTMLLIElement | null) => { if (el) tabsRef.current[i] = el; }}
                  setPosition={setPosition}
                  onClick={closeMobile}
                  isActive={activeIndex === i}
                >
                  {item.label}
                </Tab>
              ))}
              <Cursor position={position} />
            </ul>
          </div>

          {/* ACTIONS — right */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              {!loggedIn ? (
                <button
                  className="btn-primary"
                  onClick={() => setAuthOpen(true)}
                  style={{ padding: "0 24px", fontSize: "0.75rem", fontWeight: 900, borderRadius: "100px", height: "44px", background: "var(--brand-purple)", color: "white" }}
                >
                  SIGN UP
                </button>
              ) : (
                <Link to="/dashboard" className="btn-primary"
                  style={{ padding: "0 24px", fontSize: "0.75rem", fontWeight: 900, borderRadius: "100px", height: "44px", display: "flex", alignItems: "center" }}>
                  MY ACCOUNT
                </Link>
              )}
              <Link to="/tickets" className="btn-outline"
                style={{ padding: "0 24px", fontSize: "0.75rem", fontWeight: 900, borderRadius: "100px", height: "44px", display: "flex", alignItems: "center", border: "2px solid var(--text-main)" }}>
                TICKETS
              </Link>
            </div>

            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              className={`hamburger lg:hidden ${mobileOpen ? "active" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`nav-mobile ${mobileOpen ? "open" : ""}`}>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} onClick={closeMobile} className="mobile-link">{item.label}</Link>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            {!loggedIn ? (
              <button className="btn-primary" onClick={() => { setAuthOpen(true); closeMobile(); }}>SIGN UP</button>
            ) : (
              <>
                <Link to="/dashboard" className="btn-primary" onClick={closeMobile}>MY ACCOUNT</Link>
                <button className="btn-outline" onClick={handleLogout}>LOGOUT</button>
              </>
            )}
            <Link to="/tickets" className="btn-primary" onClick={closeMobile}>GET YOUR PASS NOW</Link>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
