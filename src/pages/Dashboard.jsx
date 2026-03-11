import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import WalletTicket from "../components/WalletTicket";
import { fetchMe } from "../utils/api";
import { logout } from "../utils/auth";
import EventSchedule from "../components/EventSchedule";
import { client } from "../utils/sanity";
import { getNewsForField } from "../data/newsData";

// ── TAG COLOR MAP ──────────────────────────────────────────────────────────────
const TAG_COLORS = [
  "#7a3fd1","#f5a623","#22c55e","#06b6d4","#ec4899",
  "#a855f7","#f97316","#10b981","#3b82f6","#eab308",
];
function tagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(122,63,209,0.20)",
        borderRadius: 16, padding: "20px 22px",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
      <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "1.4rem", fontWeight: 900, color: "#fff", marginBottom: 4,
      }}>{value}</div>
      <div style={{ fontSize: "0.7rem", color: "rgba(200,180,255,0.6)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{label}</div>
    </motion.div>
  );
}

// ── NEWS CARD ─────────────────────────────────────────────────────────────────
function NewsCard({ item, index }) {
  const color = tagColor(item.tag);
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ x: 4 }}
      style={{
        display: "flex", alignItems: "flex-start", gap: 14,
        padding: "16px 18px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: `3px solid ${color}`,
        borderRadius: 12,
        textDecoration: "none",
        cursor: "pointer",
        transition: "background 0.2s",
        marginBottom: 8,
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(122,63,209,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
    >
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "0.65rem", fontWeight: 800,
        color, minWidth: 24, paddingTop: 2, letterSpacing: "0.5px",
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "0.85rem", fontWeight: 600,
          color: "rgba(255,255,255,0.92)", lineHeight: 1.45,
          marginBottom: 6,
        }}>
          {item.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontSize: "0.65rem", fontWeight: 700,
            background: `${color}20`, color,
            padding: "2px 8px", borderRadius: 99,
            border: `1px solid ${color}40`,
          }}>{item.tag}</span>
          <span style={{ fontSize: "0.65rem", color: "rgba(200,180,255,0.45)" }}>
            {item.source} · {item.date}
          </span>
          <span style={{ fontSize: "0.65rem", color: "rgba(200,180,255,0.4)", marginLeft: "auto" }}>↗</span>
        </div>
      </div>
    </motion.a>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [venueSettings, setVenueSettings] = useState(null);
  const [activeTab, setActiveTab]     = useState("overview");
  const [isDark, setIsDark]           = useState(true);
  const [newsField, setNewsField]     = useState(null);
  const [newsItems, setNewsItems]     = useState([]);

  useEffect(() => {
    setIsDark(document.body.classList.contains("dark-mode"));
    const observer = new MutationObserver(() => setIsDark(document.body.classList.contains("dark-mode")));
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userData = await fetchMe();
        setUser(userData);
        const field = userData?.fieldOfWork || localStorage.getItem("tfc_field") || null;
        setNewsField(field);
        setNewsItems(getNewsForField(field));
        const settingsData = await client.fetch('*[_type == "siteSettings"][0]');
        setVenueSettings(settingsData);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleGoogleCalendar = () => {
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", venueSettings?.eventName || "The Tech Festival Canada");
    url.searchParams.set("details", "Canada's premier tech conference — The Carlu, Toronto");
    url.searchParams.set("location", `${venueSettings?.venueName || "The Carlu"}, ${venueSettings?.venueAddress || "444 Yonge St, Toronto, ON"}`);
    url.searchParams.set("dates", "20261028T130000Z/20261028T210000Z");
    window.open(url.toString(), "_blank");
  };

  const handleAppleCalendar = () => {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${venueSettings?.eventName || "The Tech Festival Canada"}\nLOCATION:${venueSettings?.venueName || "The Carlu"}, ${venueSettings?.venueAddress || "444 Yonge St, Toronto"}\nDTSTART:20261028T130000Z\nDTEND:20261028T210000Z\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "techfest-canada-2026.ics";
    a.click();
  };

  const bg       = isDark ? "#07030f"                   : "#f4f0ff";
  const card     = isDark ? "rgba(255,255,255,0.03)"    : "rgba(122,63,209,0.06)";
  const border   = isDark ? "rgba(255,255,255,0.08)"    : "rgba(122,63,209,0.20)";
  const textMain = isDark ? "#ffffff"                   : "#0f0520";
  const textMuted= isDark ? "rgba(200,180,255,0.65)"    : "rgba(60,30,110,0.65)";

  const TABS = [
    { id: "overview", label: "Overview",   icon: "⚡" },
    { id: "tickets",  label: "My Tickets", icon: "🎟" },
    { id: "news",     label: "Industry Intel", icon: "📡" },
    { id: "schedule", label: "Schedule",   icon: "📅" },
  ];

  if (loading) {
    return (
      <div style={{ background: "#07030f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Navbar />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: 40, height: 40, border: "3px solid rgba(122,63,209,0.3)", borderTopColor: "#7a3fd1", borderRadius: "50%" }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", background: "#07030f", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#fff" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif" }}>Session expired</h2>
            <p style={{ color: "rgba(200,180,255,0.6)", marginBottom: 24 }}>Please log in again.</p>
            <button onClick={() => window.location.href = "/"} style={{ padding: "12px 28px", background: "linear-gradient(135deg,#7a3fd1,#f5a623)", border: "none", borderRadius: 12, color: "#fff", fontFamily: "'Orbitron',sans-serif", fontWeight: 800, cursor: "pointer" }}>
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const firstName = user.name?.split(" ")[0] || "Delegate";
  const ticketCount = user.tickets?.length || 0;
  const hasTickets = ticketCount > 0;

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain }}>
      <Navbar />

      {/* ── HERO HEADER ── */}
      <div style={{
        position: "relative", paddingTop: 120, paddingBottom: 48,
        paddingLeft: "5%", paddingRight: "5%",
        background: isDark
          ? "linear-gradient(180deg, rgba(122,63,209,0.12) 0%, transparent 100%)"
          : "linear-gradient(180deg, rgba(122,63,209,0.08) 0%, transparent 100%)",
        borderBottom: `1px solid ${border}`,
        overflow: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(${isDark ? "rgba(122,63,209,0.05)" : "rgba(122,63,209,0.07)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(122,63,209,0.05)" : "rgba(122,63,209,0.07)"} 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Greeting */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: isDark ? "rgba(122,63,209,0.15)" : "rgba(122,63,209,0.10)",
              border: `1px solid rgba(122,63,209,0.30)`,
              borderRadius: 999, padding: "5px 16px", marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", display: "inline-block" }} />
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: isDark ? "#c4a8ff" : "#6b21d6" }}>
                Delegate Portal
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900, marginBottom: 8, lineHeight: 1.1,
            }}>
              Welcome back,{" "}
              <span style={{ background: "linear-gradient(135deg,#7a3fd1,#f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {firstName}
              </span>
            </h1>
            <p style={{ color: textMuted, fontSize: "0.95rem", marginBottom: 32 }}>
              {newsField ? `Your ${newsField} industry intel is ready.` : "Your personalized event portal — October 28, 2026."}
            </p>
          </motion.div>

          {/* Stat strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, maxWidth: 700 }}>
            <StatCard label="Days to Event"     value="231"           icon="⏳" color="#7a3fd1" delay={0.1} />
            <StatCard label="My Tickets"        value={ticketCount}   icon="🎟" color="#f5a623" delay={0.2} />
            <StatCard label="News Articles"     value={newsItems.length} icon="📡" color="#22c55e" delay={0.3} />
            <StatCard label="Event Venue"       value="The Carlu"     icon="📍" color="#06b6d4" delay={0.4} />
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{
        borderBottom: `1px solid ${border}`,
        paddingLeft: "5%", paddingRight: "5%",
        background: isDark ? "rgba(0,0,0,0.3)" : "rgba(122,63,209,0.04)",
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 4, overflowX: "auto" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "16px 20px", background: "none",
                border: "none", borderBottom: `2px solid ${activeTab === t.id ? "#7a3fd1" : "transparent"}`,
                color: activeTab === t.id ? (isDark ? "#fff" : "#0f0520") : textMuted,
                cursor: "pointer", fontSize: "0.82rem", fontWeight: 700,
                fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.5px",
                textTransform: "uppercase", whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 5% 80px" }}>
        <AnimatePresence mode="wait">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                {/* Venue Card */}
                <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 24, padding: "32px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#7a3fd1,#f5a623)" }} />
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c4a8ff", marginBottom: 20 }}>📍 Venue & Date</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    {[
                      { label: "LOCATION", main: venueSettings?.venueName || "The Carlu", sub: venueSettings?.venueAddress || "444 Yonge St, Toronto, ON" },
                      { label: "DATE", main: "Wednesday", sub: "October 28, 2026" },
                      { label: "DOORS OPEN", main: "08:00 AM", sub: "EST — Registration" },
                      { label: "FORMAT", main: "1-Day Summit", sub: "Full Day Program" },
                    ].map(v => (
                      <div key={v.label} style={{ background: isDark ? "rgba(122,63,209,0.08)" : "rgba(122,63,209,0.05)", border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(196,168,255,0.7)", marginBottom: 4 }}>{v.label}</div>
                        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: textMain, marginBottom: 2 }}>{v.main}</div>
                        <div style={{ fontSize: "0.72rem", color: textMuted }}>{v.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Map link */}
                  <a
                    href="https://maps.google.com/?q=The+Carlu+444+Yonge+St+Toronto"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "block", textAlign: "center", padding: "12px",
                      background: isDark ? "rgba(122,63,209,0.15)" : "rgba(122,63,209,0.10)",
                      border: `1px solid rgba(122,63,209,0.30)`,
                      borderRadius: 12, color: "#c4a8ff",
                      textDecoration: "none", fontSize: "0.75rem", fontWeight: 700,
                      letterSpacing: "0.5px", marginBottom: 16,
                    }}
                  >
                    🗺 View on Google Maps →
                  </a>

                  {/* Calendar buttons */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={handleGoogleCalendar} style={{
                      flex: 1, padding: "12px", background: "linear-gradient(135deg,#7a3fd1,#f5a623)",
                      border: "none", borderRadius: 12, color: "#fff",
                      fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                      fontSize: "0.7rem", cursor: "pointer", letterSpacing: "0.5px",
                    }}>+ Google Calendar</button>
                    <button onClick={handleAppleCalendar} style={{
                      flex: 1, padding: "12px",
                      background: card, border: `1.5px solid ${border}`,
                      borderRadius: 12, color: textMain,
                      fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                      fontSize: "0.7rem", cursor: "pointer",
                    }}>+ Apple / Outlook</button>
                  </div>
                </div>

                {/* Top News Preview */}
                <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 24, padding: "32px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#22c55e,#06b6d4)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#86efac" }}>
                      📡 {newsField ? `${newsField.split(" ")[0]} Intel` : "Industry Intel"}
                    </div>
                    <button onClick={() => setActiveTab("news")} style={{ background: "none", border: "none", color: "rgba(134,239,172,0.7)", fontSize: "0.7rem", cursor: "pointer", fontWeight: 700 }}>
                      See all →
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {newsItems.slice(0, 5).map((item, i) => (
                      <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{
                        display: "flex", gap: 10, alignItems: "flex-start",
                        padding: "10px 12px",
                        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.04)",
                        border: `1px solid ${border}`, borderRadius: 10,
                        textDecoration: "none",
                        transition: "background 0.2s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.04)"}
                      >
                        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", fontWeight: 800, color: tagColor(item.tag), minWidth: 20, paddingTop: 1 }}>{i + 1}</span>
                        <div>
                          <div style={{ fontSize: "0.78rem", color: isDark ? "rgba(255,255,255,0.85)" : "#1a0a40", lineHeight: 1.4, fontWeight: 500, marginBottom: 3 }}>{item.title}</div>
                          <div style={{ fontSize: "0.62rem", color: textMuted }}>{item.source} · {item.date}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Account info */}
                <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 24, padding: "32px", gridColumn: "span 2", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#a855f7,#f5a623)" }} />
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c4a8ff", marginBottom: 20 }}>👤 Your Account</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                    {[
                      { label: "Name", val: user.name || "—" },
                      { label: "Email", val: user.email || "—" },
                      { label: "Field", val: user.fieldOfWork || newsField || "Not set" },
                      { label: "LinkedIn", val: user.linkedinUrl ? "Connected ✓" : "Not linked" },
                    ].map(f => (
                      <div key={f.label} style={{ background: isDark ? "rgba(122,63,209,0.06)" : "rgba(122,63,209,0.04)", border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: textMuted, marginBottom: 5 }}>{f.label}</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: textMain, wordBreak: "break-word" }}>{f.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={logout} style={{
                      padding: "10px 22px",
                      background: "rgba(239,68,68,0.10)", border: "1.5px solid rgba(239,68,68,0.25)",
                      borderRadius: 10, color: "#f87171",
                      fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                      fontSize: "0.72rem", cursor: "pointer", letterSpacing: "0.5px",
                    }}>
                      Log Out →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TICKETS TAB */}
          {activeTab === "tickets" && (
            <motion.div key="tickets" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {hasTickets ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                  {user.tickets.map(t => (
                    <WalletTicket key={t.ticketId} user={user} ticket={t} />
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: "center", padding: "80px 20px",
                  background: card, border: `1.5px solid ${border}`, borderRadius: 24,
                }}>
                  <div style={{ fontSize: "4rem", marginBottom: 20 }}>🎟</div>
                  <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.2rem", fontWeight: 900, color: textMain, marginBottom: 12 }}>No Tickets Yet</h3>
                  <p style={{ color: textMuted, marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
                    Secure your delegate pass to The Tech Festival Canada — October 28, 2026 at The Carlu, Toronto.
                  </p>
                  <a href="/tickets" style={{
                    display: "inline-block", padding: "14px 32px",
                    background: "linear-gradient(135deg,#7a3fd1,#f5a623)",
                    border: "none", borderRadius: 12, color: "#fff",
                    fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                    fontSize: "0.85rem", textDecoration: "none",
                  }}>
                    ✦ Get Your Tickets
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {/* NEWS TAB */}
          {activeTab === "news" && (
            <motion.div key="news" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 28, alignItems: "start" }}>
                <div>
                  {/* Header */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.2rem", fontWeight: 900, color: textMain }}>
                        {newsField ? `${newsField}` : "Industry Intelligence"}
                      </div>
                    </div>
                    <p style={{ color: textMuted, fontSize: "0.85rem" }}>
                      Top {newsItems.length} stories curated for your field · Updated March 2026
                    </p>
                  </div>

                  {/* News list */}
                  {newsItems.map((item, i) => (
                    <NewsCard key={i} item={item} index={i} />
                  ))}
                </div>

                {/* Sidebar */}
                <div style={{ position: "sticky", top: 80 }}>
                  <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 20, padding: "24px" }}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: isDark ? "#c4a8ff" : "#6b21d6", marginBottom: 16 }}>
                      Your Field
                    </div>
                    <div style={{
                      background: isDark ? "rgba(122,63,209,0.12)" : "rgba(122,63,209,0.08)",
                      border: "1px solid rgba(122,63,209,0.25)",
                      borderRadius: 12, padding: "14px 16px",
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "0.78rem", fontWeight: 700, color: textMain,
                      marginBottom: 16,
                    }}>
                      {newsField || "General Technology"}
                    </div>
                    <p style={{ fontSize: "0.78rem", color: textMuted, lineHeight: 1.6, marginBottom: 20 }}>
                      News is curated based on the field you selected during onboarding. To change your field, update your profile.
                    </p>
                    <div style={{ borderTop: `1px solid ${border}`, paddingTop: 16 }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: textMuted, marginBottom: 12 }}>
                        Sources Include
                      </div>
                      {["Reuters", "Bloomberg", "MIT Tech Review", "Globe and Mail", "Financial Post", "The Verge", "Wired", "Nature"].map(s => (
                        <div key={s} style={{ fontSize: "0.75rem", color: textMuted, paddingBottom: 6, borderBottom: `1px solid ${border}`, marginBottom: 6 }}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === "schedule" && (
            <motion.div key="schedule" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <EventSchedule />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
