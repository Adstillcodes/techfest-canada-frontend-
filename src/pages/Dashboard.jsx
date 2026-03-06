// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import WalletTicket from "../components/WalletTicket";
import { fetchMe } from "../utils/api";
import { logout } from "../utils/auth";
import EventSchedule from "../components/EventSchedule";
import { client } from "../utils/sanity";

export default function Dashboard() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [venueSettings, setVenueSettings] = useState(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {

    const loadDashboardData = async () => {
      try {

        const userData = await fetchMe();
        setUser(userData);

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

  /* ================= GOOGLE CALENDAR ================= */

  const handleGoogleCalendar = () => {

    const eventName = venueSettings?.eventName || "TechFest Canada";
    const venueName = venueSettings?.venueName || "The Carlu";
    const venueAddress = venueSettings?.venueAddress || "Toronto";

    const url = new URL("https://calendar.google.com/calendar/render");

    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", eventName);
    url.searchParams.set("details", `${eventName} Conference`);
    url.searchParams.set("location", `${venueName}, ${venueAddress}`);
    url.searchParams.set("dates", "20261001T130000Z/20261003T210000Z");

    window.open(url.toString(), "_blank");
  };

  /* ================= APPLE CALENDAR ================= */

  const handleAppleCalendar = () => {

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

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: "center", padding: "120px 0" }}>
          <h2>Loading your dashboard...</h2>
        </div>
        <Footer />
      </>
    );

  }

  /* ================= ERROR ================= */

  if (!user) {

    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: "center", padding: "120px 0" }}>
          <h2>Failed to load user.</h2>
        </div>
        <Footer />
      </>
    );

  }

  /* ================= MAIN UI ================= */

  return (
    <>
      <Navbar />

      <div className="container dashboard-container">

        <h1 className="section-title">Dashboard</h1>

        <p style={{ color: "var(--text-muted)", marginBottom: 30 }}>
          Your personalized itinerary and sector intelligence.
        </p>

        {/* ================= GRID ================= */}

        <div className="dashboard-grid">

          {/* ================= TICKETS ================= */}

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

              <div className="card glass">

                <h3>No tickets yet</h3>

                <p style={{ color: "var(--text-muted)" }}>
                  Purchase a pass to see your delegate ticket.
                </p>

              </div>

            )}

          </div>

          {/* ================= VENUE + SCHEDULE ================= */}

          <div>

            <div className="card glass venue-card">

              <h3>Venue Details</h3>

              {venueSettings ? (

                <>

                  <p className="venue-block">

                    <strong>LOCATION</strong>

                    <span className="venue-title">
                      {venueSettings.venueName}
                    </span>

                    <span className="venue-sub">
                      {venueSettings.venueAddress}
                    </span>

                  </p>

                  <p className="venue-block">

                    <strong>DATES</strong>

                    <span className="venue-title">
                      {venueSettings.eventDates}
                    </span>

                    <span className="venue-sub">
                      {venueSettings.doorTime}
                    </span>

                  </p>

                </>

              ) : (

                <p>Loading venue information...</p>

              )}

              {/* ================= CALENDAR BUTTONS ================= */}

              <div className="calendar-buttons">

                <button
                  className="btn-primary"
                  onClick={handleGoogleCalendar}
                >
                  + GOOGLE CALENDAR
                </button>

                <button
                  className="btn-outline calendar-outline"
                  onClick={handleAppleCalendar}
                >
                  + APPLE / OUTLOOK
                </button>

              </div>

            </div>

            {/* ================= SCHEDULE ================= */}

            <EventSchedule />

            {/* ================= LOGOUT ================= */}

            <button
              className="btn-outline logout-btn"
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
