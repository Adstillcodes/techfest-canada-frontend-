import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import { ThreeDPhotoCarousel } from "../components/ui/3d-carousel";
import { SpeakerCarousel } from "../components/ui/speaker-carousel";
import { client, urlFor } from "../utils/sanity";
import { Mic, Users, Calendar, Award, ChevronRight } from "lucide-react";

export default function Speakers() {
  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    const query = '*[_type == "speaker" && isFeatured == true]';
    client.fetch(query)
      .then((data) => {
        const formatted = data
          .filter(s => s.image)
          .map(s => ({
            id: s._id,
            name: s.name || "Unknown Speaker",
            role: s.role || "",
            company: s.company || "",
            bio: s.bio || "",
            topics: s.topics || [],
            linkedinUrl: s.linkedinUrl || null,
            twitterUrl: s.twitterUrl || null,
            websiteUrl: s.websiteUrl || null,
            imgUrl: urlFor(s.image).width(600).height(660).quality(90).fit('crop').url(),
          }));
        setSpeakers(formatted);
      })
      .catch((err) => console.error("Error fetching speakers:", err));
  }, []);

  const stats = [
    { icon: Mic,      value: "50+",  label: "World-Class Speakers" },
    { icon: Users,    value: "500+", label: "Expected Attendees"   },
    { icon: Calendar, value: "3",    label: "Days of Content"      },
    { icon: Award,    value: "10",   label: "Tech Pillars Covered" },
  ];


  
  return (
    <>
      <style>{`
        /* ===== THEME VARIABLES ===== */
        :root {
          /* Brand colors (assumed to be defined globally) */
          --brand-purple: #7a3fd1;
          --brand-orange: #f5a623;
          --gradient-brand: linear-gradient(135deg, var(--brand-purple), var(--brand-orange));

          /* RGB versions for opacity effects */
          --brand-purple-rgb: 122, 63, 209;
          --brand-orange-rgb: 245, 166, 35;

          /* Component‑specific variables – light mode defaults */
          --orb-purple: radial-gradient(circle, rgba(var(--brand-purple-rgb), 0.2) 0%, transparent 70%);
          --orb-orange: radial-gradient(circle, rgba(var(--brand-orange-rgb), 0.1) 0%, transparent 70%);
          --grid-line: rgba(var(--brand-purple-rgb), 0.04);
          --eyebrow-bg: rgba(var(--brand-purple-rgb), 0.08);
          --eyebrow-border: rgba(var(--brand-purple-rgb), 0.2);
          --stat-icon-bg: rgba(var(--brand-purple-rgb), 0.08);
          --stat-icon-border: rgba(var(--brand-purple-rgb), 0.15);
          --stat-icon-color: var(--brand-purple);
          --stat-value-color: var(--text-main);
          --stats-strip-bg: rgba(var(--brand-purple-rgb), 0.08);
          --stats-strip-border: rgba(var(--brand-purple-rgb), 0.15);
          --cta-band-glow: rgba(var(--brand-purple-rgb), 0.08);
          --loading-text: var(--text-muted);
        }

        [data-theme="dark"] {
          --orb-purple: radial-gradient(circle, rgba(var(--brand-purple-rgb), 0.28) 0%, transparent 70%);
          --orb-orange: radial-gradient(circle, rgba(var(--brand-orange-rgb), 0.15) 0%, transparent 70%);
          --grid-line: rgba(var(--brand-purple-rgb), 0.1);
          --eyebrow-bg: rgba(var(--brand-purple-rgb), 0.15);
          --eyebrow-border: rgba(var(--brand-purple-rgb), 0.3);
          --stat-icon-bg: rgba(var(--brand-purple-rgb), 0.15);
          --stat-icon-border: rgba(var(--brand-purple-rgb), 0.25);
          --stat-icon-color: #b99eff;      /* softer purple for dark mode */
          --stat-value-color: transparent;  /* will be overridden by gradient */
          --stats-strip-bg: rgba(var(--brand-purple-rgb), 0.15);
          --stats-strip-border: rgba(var(--brand-purple-rgb), 0.2);
          --cta-band-glow: rgba(var(--brand-purple-rgb), 0.2);
          --loading-text: rgba(160, 130, 220, 0.5);
        }

        /* ===== PAGE WRAPPER ===== */
        .speakers-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-main);
        }
        .speakers-main {
          flex: 1;
        }

        /* ===== HERO BANNER ===== */
        .speakers-hero {
          position: relative;
          overflow: hidden;
          padding: 6rem 5% 4rem;
          text-align: center;
        }
        .speakers-hero-orb-1 {
          position: absolute; pointer-events: none;
          width: 500px; height: 500px; border-radius: 50%;
          background: var(--orb-purple);
          top: -160px; left: -100px; filter: blur(70px);
        }
        .speakers-hero-orb-2 {
          position: absolute; pointer-events: none;
          width: 400px; height: 400px; border-radius: 50%;
          background: var(--orb-orange);
          top: -80px; right: -80px; filter: blur(70px);
        }
        .speakers-hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }
        .speakers-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--eyebrow-bg);
          border: 1px solid var(--eyebrow-border);
          color: var(--brand-purple);
          padding: 5px 16px; border-radius: 999px;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 1.4px; text-transform: uppercase;
          margin-bottom: 1.4rem;
        }
        .speakers-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--brand-orange);
          box-shadow: 0 0 6px var(--brand-orange);
          animation: spkPulse 2s ease infinite;
        }
        @keyframes spkPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.6; transform:scale(1.4); }
        }
        .speakers-hero h1 {
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 900;
          font-family: 'Orbitron', sans-serif;
          line-height: 1.05;
          margin-bottom: 1.2rem;
          color: var(--text-main);
        }
        .speakers-hero h1 span { color: var(--brand-orange); }
        .speakers-hero-sub {
          font-size: 1rem;
          color: var(--text-muted);
          max-width: 520px;
          margin: 0 auto 2.4rem;
          line-height: 1.75;
        }
        .speakers-hero-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--gradient-brand);
          color: var(--brand-white);
          border: none; padding: 12px 28px;
          border-radius: 999px; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .speakers-hero-cta:hover { opacity: 0.88; transform: translateY(-2px); }

        /* ===== STATS STRIP ===== */
        .speakers-stats {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1px;
          background: var(--stats-strip-bg);
          border-top: 1px solid var(--stats-strip-border);
          border-bottom: 1px solid var(--stats-strip-border);
          margin-bottom: 5rem;
        }
        .stat-cell {
          flex: 1; min-width: 160px; max-width: 260px;
          display: flex; align-items: center; gap: 14px;
          padding: 24px 28px;
          background: var(--bg-card);
        }
        .stat-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: var(--stat-icon-bg);
          border: 1px solid var(--stat-icon-border);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: var(--stat-icon-color);
        }
        .stat-value {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem; font-weight: 900;
          line-height: 1;
          color: var(--stat-value-color);
        }
        [data-theme="dark"] .stat-value {
          background: var(--gradient-brand);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label {
          font-size: 0.72rem; font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px; margin-top: 3px;
        }

        /* ===== SECTION HEADERS ===== */
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }
        .section-header h2 {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 900;
          font-family: 'Orbitron', sans-serif;
          color: var(--text-main);
          margin-bottom: 0.6rem;
        }
        .section-header h2 span { color: var(--brand-orange); }
        .section-header p {
          font-size: 0.92rem;
          color: var(--text-muted);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .section-divider {
          width: 48px; height: 3px;
          background: var(--gradient-brand);
          border-radius: 2px;
          margin: 1rem auto 0;
        }

        /* ===== CAROUSEL SECTION ===== */
        .carousel-section {
          padding: 0 5% 5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ===== SPEAK CTA BAND ===== */
        .speak-cta-band {
          margin: 5rem 5%;
          border-radius: 24px;
          padding: 3.5rem 4rem;
          background: var(--bg-card);
          border: 1px solid var(--border-main);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2rem;
          position: relative;
          overflow: hidden;
        }
        [data-theme="dark"] .speak-cta-band {
          background: linear-gradient(135deg,
            rgba(var(--brand-purple-rgb), 0.12) 0%,
            rgba(var(--brand-orange-rgb), 0.06) 100%);
        }
        .speak-cta-band::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 0% 50%, var(--cta-band-glow), transparent);
          pointer-events: none;
        }
        .speak-cta-text h3 {
          font-size: 1.6rem; font-weight: 900;
          font-family: 'Orbitron', sans-serif;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }
        .speak-cta-text h3 span { color: var(--brand-orange); }
        .speak-cta-text p {
          font-size: 0.9rem;
          color: var(--text-muted);
          max-width: 420px;
          line-height: 1.65;
        }

        @media (max-width: 768px) {
          .speak-cta-band { padding: 2rem; text-align: center; justify-content: center; }
          .speak-cta-text p { margin: 0 auto; }
          .stat-cell { min-width: 140px; padding: 18px 20px; }
        }
      `}</style>

      <div className="speakers-page">
        <Navbar />

        <main className="speakers-main">
          {/* Hero section – unchanged markup */}
          <section className="speakers-hero">
            <div className="speakers-hero-orb-1" />
            <div className="speakers-hero-orb-2" />
            <div className="speakers-hero-grid" />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div className="speakers-eyebrow">
                <span className="speakers-eyebrow-dot" />
                TFC 2026 · Toronto & London
              </div>
              <h1>
                World-Class<br />
                <span>Speakers</span>
              </h1>
              <p className="speakers-hero-sub">
                Hear from the brightest minds in AI, quantum computing, cybersecurity,
                sustainability, and robotics shaping tomorrow's world.
              </p>
              <a href="/tickets" className="speakers-hero-cta">
                Secure Your Seat <ChevronRight size={16} />
              </a>
            </div>
          </section>

          {/* Stats strip */}
          <div className="speakers-stats">
            {stats.map(({ icon: Icon, value, label }) => (
              <div className="stat-cell" key={label}>
                <div className="stat-icon"><Icon size={18} /></div>
                <div>
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured speaker carousel */}
          <section className="carousel-section">
            <div className="section-header">
              <h2>Featured <span>Speakers</span></h2>
              <p>Meet the visionaries and executives driving the future of technology across Canada and beyond.</p>
              <div className="section-divider" />
            </div>
            {speakers.length > 0
              ? <SpeakerCarousel speakers={speakers} />
              : (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--loading-text)", fontSize: "0.9rem" }}>
                  Loading speakers…
                </div>
              )
            }
          </section>

          {/* Speak at TFC CTA */}
          <div className="speak-cta-band">
            <div className="speak-cta-text">
              <h3>Want to <span>Speak</span> at TFC?</h3>
              <p>
                We're looking for visionary leaders, innovators, and experts to take the stage.
                Applications for TFC 2026 speakers are now open.
              </p>
            </div>
            <a href="/contact" className="speakers-hero-cta" style={{ whiteSpace: "nowrap" }}>
              Apply to Speak <ChevronRight size={16} />
            </a>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
