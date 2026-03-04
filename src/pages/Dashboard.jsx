// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import WalletTicket from "../components/WalletTicket";
import { fetchMe } from "../utils/api";
import { logout } from "../utils/auth";
import EventSchedule from "../components/EventSchedule";

// ⚠️ Ensure this path correctly points to your sanity client configuration
import { client } from "../utils/sanity";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for Sanity CMS site settings (venue, dates, etc.)
  const [venueSettings, setVenueSettings] = useState(null);

  // ================= LOAD DATA =================
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 1. Fetch User Data
        const userData = await fetchMe();
        setUser(userData);

        // 2. Fetch Sanity Site Settings
        const query = '*[_type == "siteSettings"][0]';
        const settingsData = await client.fetch(query);
        setVenueSettings(settingsData);

      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ================= GOOGLE CALENDAR =================
  const handleGoogleCalendar = () => {
    // Fallback to hardcoded values if Sanity data isn't loaded
    const eventName = venueSettings?.eventName || "TechFest Canada";
    const venueName = venueSettings?.venueName || "The Carlu";
    const venueAddress = venueSettings?.venueAddress || "Toronto";
    
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", eventName);
    url.searchParams.set("details", `${eventName} Conference`);
    url.searchParams.set("location", `${venueName}, ${venueAddress}`);

    // ⚠️ adjust dates later if needed. You could potentially pull start/end dates from Sanity too.
    url.searchParams.set("dates", "20261001T130000Z/20261003T210000Z");

    window.open(url.toString(), "_blank");
  };

  // ================= APPLE / OUTLOOK =================
  const handleAppleCalendar = () => {
    // Fallback to hardcoded values if Sanity data isn't loaded
    const eventName = venueSettings?.eventName || "TechFest Canada";
    const venueName = venueSettings?.venueName || "The Carlu";
    const venueAddress = venueSettings?.venueAddress || "Toronto";

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventName}
LOCATION:${venueName}, ${venueAddress}
DTSTART:20261001T130000Z
DTEND:20261003T210000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "techfest.ics";
    a.click();
  };

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Loading your dashboard...</h2>
        </div>
        <Footer />
      </>
    );
  }

  // ================= ERROR STATE =================
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Failed to load user.</h2>
        </div>
        <Footer />
      </>
    );
  }

  // ================= MAIN UI =================
  return (
    <>
      <Navbar />

      <div className="container" style={{ padding: "40px 20px" }}>
        <h1 className="section-title">Dashboard</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 30 }}>
          Your personalized itinerary and sector intelligence.
        </p>

        <div
          className="dashboard-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 420px) 1fr",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* ================= LEFT — WALLET TICKETS ================= */}
          <div>
            {user.tickets && user.tickets.length > 0 ? (
              <div className="tickets-grid">
                {user.tickets.map((t) => (
                  <WalletTicket
                    key={t.ticketId}
                    user={user}
                    ticket={t}
                  />
                ))}
              </div>
            ) : (
              <div className="card glass" style={{ padding: "20px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 10px 0" }}>No tickets yet</h3>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>
                  Purchase a pass to see your delegate ticket.
                </p>
              </div>
            )}
          </div>

          {/* ================= RIGHT — VENUE CARD & CONTENT ================= */}
          <div>
            <div className="card glass" style={{ padding: "24px", borderRadius: "12px", marginBottom: "28px" }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "1.5rem" }}>Venue Details</h3>

              {venueSettings ? (
                <div style={{ marginTop: 14 }}>
                  <p style={{ marginBottom: 16 }}>
                    <strong style={{ display: "block", color: "var(--text-muted)", fontSize: "0.85rem", letterSpacing: "1px", marginBottom: "4px" }}>LOCATION</strong>
                    <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{venueSettings.venueName}</span>
                    <br />
                    <span style={{ color: "var(--text-muted)" }}>{venueSettings.venueAddress}</span>
                  </p>

                  <p style={{ marginBottom: 24 }}>
                    <strong style={{ display: "block", color: "var(--text-muted)", fontSize: "0.85rem", letterSpacing: "1px", marginBottom: "4px" }}>DATES</strong>
                    <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{venueSettings.eventDates}</span>
                    <br />
                    <span style={{ color: "var(--text-muted)" }}>{venueSettings.doorTime}</span>
                  </p>
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)" }}>Loading venue information from Sanity...</p>
              )}

              {/* ================= CALENDAR BUTTONS ================= */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                <button
                  className="btn-primary"
                  onClick={handleGoogleCalendar}
                  style={{ padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer", background: "linear-gradient(90deg, #8B5CF6, #F97316)", color: "white" }}
                >
                  + GOOGLE CALENDAR
                </button>

                <button
                  className="btn-primary"
                  onClick={handleAppleCalendar}
                  style={{ padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", border: "1px solid #4B5563", cursor: "pointer", background: "transparent", color: "green" }}
                >
                  + APPLE / OUTLOOK
                </button>
              </div>
            </div>

            {/* ================= SCHEDULE COMPONENT ================= */}
            <div style={{ marginBottom: "28px" }}>
              <EventSchedule />
            </div>

            {/* ================= LOGOUT ================= */}
            <button
              className="btn-outline"
              style={{ padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", border: "1px solid #EF4444", cursor: "pointer", background: "transparent", color: "#EF4444" }}
              onClick={logout}
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}