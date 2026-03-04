import { useState } from "react";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";

export default function Programme() {
  const [filter, setFilter] = useState("all");

  const sessions = [
    {
      id: 1,
      type: "keynote",
      title: "Scalable Cloud Functions for the Enterprise",
      meta: "Stage A | 10:00 AM | 45 MIN",
      desc: "Learn RBC's approach to serverless adoption and scaling.",
    },
    {
      id: 2,
      type: "workshop",
      title: "Hands-on: Next.js + Tailwind on Vercel",
      meta: "Masterclass | 2:00 PM | 90 MIN",
      desc: "Build and deploy a functional dashboard.",
    },
    {
      id: 3,
      type: "workshop",
      title: "A320 Crew Coordination & Simulation",
      meta: "Aviation Lab | 11:00 AM | 60 MIN",
      desc: "Apply tech fest principles to high-stakes decision making.",
    },
  ];

  const filteredSessions =
    filter === "all"
      ? sessions
      : sessions.filter((s) => s.type === filter);

  return (
    <>
      <UrgencyBanner />
      <Navbar />

      <div className="container">
        <h1 className="section-title">2026 Programme</h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "3rem",
            color: "var(--text-muted)",
            fontSize: "1.1rem",
            fontWeight: 500,
          }}
        >
          3 Days. 180+ Sessions. Hands-on learning across all key modern
          technology domains.
        </p>

        {/* FILTER TABS */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Sessions
          </button>

          <button
            className={`filter-tab ${filter === "keynote" ? "active" : ""}`}
            onClick={() => setFilter("keynote")}
          >
            Keynotes
          </button>

          <button
            className={`filter-tab ${filter === "workshop" ? "active" : ""}`}
            onClick={() => setFilter("workshop")}
          >
            Workshops
          </button>
        </div>

        {/* PROGRAM GRID */}
        <div className="grid-3">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="card program-item"
              data-type={session.type}
            >
              <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
                {session.title}
              </h3>

              <p className="program-meta">{session.meta}</p>

              <p style={{ color: "var(--text-muted)" }}>{session.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}