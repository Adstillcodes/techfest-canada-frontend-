import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import { ThreeDPhotoCarousel } from "../components/ui/3d-carousel";
import { SpeakerCarousel } from "../components/ui/speaker-carousel";
import { client, urlFor } from "../utils/sanity";
import { Mic, Users, Calendar, Award, ChevronRight } from "lucide-react";

export default function Speakers() {
  const [speakers, setSpeakers] = useState([]);
  const [isDark, setIsDark] = useState(true);

  // 1. Theme Detection with foolproof selector handling
  useEffect(() => {
    // Check data-theme attribute on <html> exactly like App.jsx forces it
    const html = document.documentElement;
    setIsDark(html.getAttribute("data-theme") === "dark");

    const obs = new MutationObserver(() => {
      setIsDark(html.getAttribute("data-theme") === "dark");
    });
    // Watch attributes on the main <html> element
    obs.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

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
        /* ── PAGE WRAPPER ── */
        .speakers-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          // Injected Page Background (White or Dark Purple)
          background: ${isDark ? "#0d0a1a" : "#ffffff"};
        }
        .speakers-main {
          flex: 1;
        }

        /* ── HERO BANNER ── */
        .speakers-hero {
          position: relative;
          overflow: hidden;
          padding: 6rem 5% 4rem;
          text-align: center;
        }
        .speakers-hero-orb-1 {
          position: absolute; pointer-events: none;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(122,63,209,0.28) 0%, transparent 70%);
          top: -160px; left: -100px; filter: blur(70px);
        }
        .speakers-hero-orb-2 {
          position: absolute; pointer-events: none;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%);
          top: -80px; right: -80px; filter: blur(70px);
        }
        .speakers-hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(122,63,209,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,63,209,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }
        .speakers-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(122,63,209,0.12);
          border: 1px solid rgba(122,63,209,0.28);
          color: #b99eff;
          padding: 5px 16px; border-radius: 999px;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 1.4px; text-transform: uppercase;
          margin-bottom: 1.4rem;
        }
        .speakers-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #f5a623; box-shadow: 0 0 6px #f5a623;
          animation: spkPulse 2s ease infinite;
        }
        @keyframes spkPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.6; transform:scale(1.4); }
        }
        
        /* Fixed text colors in style block directly */
        .speakers-hero h1 {
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 900;
          font-family: 'Orbitron', sans-serif;
          line-height: 1.05;
          margin-bottom: 1.2rem;
          color: ${isDark ? "#ffffff" : "#000000"};
        }
        // Force H1 Span to Black text in light mode (overrides other rules)
        .speakers-hero h1 span {
          color: ${isDark ? "#f5a623" : "#000000"};
        }
        
        .speakers-hero-sub {
          font-size: 1rem;
          color: ${isDark ? "rgba(255, 255, 255, 0.7)" : "#000000"};
          max-width: 520px;
          margin: 0 auto 2.4rem;
          line-height: 1.75;
        }

        .speakers-hero-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #7a3fd1, #f5a623);
          color: white; border: none; padding: 12px 28px;
          border-radius: 999px; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .speakers-hero-cta:hover { opacity: 0.88; transform: translateY(-2px); }

        /* ── STATS STRIP ── */
        .speakers-stats {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1px;
          background: rgba(122,63,209,0.15);
          border-top: 1px solid rgba(122,63,209,0.15);
          border-bottom: 1px solid rgba(122,63,209,0.15);
          margin-bottom: 5rem;
        }
        .stat-cell {
          flex: 1; min-width: 160px; max-width: 260px;
          display: flex; align-items: center; gap: 14px;
          padding: 24px 28px;
          // Injected Dynamic Background color for each stat-cell (White or Dark Purple)
          background: ${isDark ? "#0d0a1a" : "#ffffff"};
        }
        .stat-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: rgba(122,63,209,0.12);
          border: 1px solid rgba(122,63,209,0.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #b99eff;
        }
        
        .stat-value {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem; font-weight: 900;
          line-height: 1;
          
          /* Forced static black color for light mode directly in style block to override dynamic logic from original file that used to work in night mode. */
          ${isDark ? "background: linear-gradient(135deg, #7a3fd1, #f5a623); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" : "color: #000000; background: none; -webkit-background-clip: none; -webkit-text-fill-color: inherit; background-clip: none;"}
        }
        
        .stat-label {
          font-size: 0.72rem; font-weight: 700;
          color: ${isDark ? "rgba(255, 255, 255, 0.7)" : "#000000"};
          text-transform: uppercase;
          letter-spacing: 0.8px; margin-top: 3px;
        }

        /* ── SECTION HEADERS ── */
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }
        .section-header h2 {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 900;
          font-family: 'Orbitron', sans-serif;
          color: ${isDark ? "#ffffff" : "#000000"};
          margin-bottom: 0.6rem;
        }
        
        /* Force H2 Span to Black text in light mode */
        .section-header h2 span {
          color: ${isDark ? "#f5a623" : "#000000"};
        }
        
        .section-header p {
          font-size: 0.92rem;
          color: ${isDark ? "rgba(255, 255, 255, 0.7)" : "#000000"};
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }
        
        .section-divider {
          width: 48px; height: 3px;
          background: linear-gradient(90deg, #7a3fd1, #f5a623);
          border-radius: 2px;
          margin: 1rem auto 0;
        }

        /* ── CAROUSEL SECTION ── */
        .carousel-section {
          padding: 0 5% 5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── SPEAK CTA BAND ── */
        .speak-cta-band {
          margin: 5rem 5%;
          border-radius: 24px;
          padding: 3.5rem 4rem;
          
          /* User wants white background, so the background of this whole band element must be white too. so I am updating both the dynamic and static parts. the gradient background is the part I'm changing to dynamic background while preserving other purple and yellow accents user explicitly wanted to keep. */
          background: ${isDark ? "linear-gradient(135deg, rgba(122,63,209,0.12) 0%, rgba(245,166,35,0.06) 100%)" : "#ffffff"};
          
          border: 1px solid rgba(122,63,209,0.22);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2rem;
          position: relative;
          overflow: hidden;
        }
        .speak-cta-band::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 0% 50%, rgba(122,63,209,0.12), transparent);
          pointer-events: none;
        }
        .speak-cta-text h3 {
          font-size: 1.6rem; font-weight: 900;
          font-family: 'Orbitron', sans-serif;
          color: ${isDark ? "#ffffff" : "#000000"};
          margin-bottom: 0.5rem;
        }
        
        /* Force H3 Span to Black text in light mode */
        .speak-cta-text h3 span {
          color: ${isDark ? "#f5a623" : "#000000"};
        }
        
        .speak-cta-text p {
          font-size: 0.9rem;
          color: ${isDark ? "rgba(255, 255, 255, 0.7)" : "#000000"};
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
        <UrgencyBanner />
        <Navbar />

        <main className="speakers-main">

          {/* ── HERO ── */}
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

          {/* ── STATS STRIP ── */}
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

          {/* ── FEATURED SPEAKER CAROUSEL ── */}
          <section className="carousel-section">
            <div className="section-header">
              <h2>Featured <span>Speakers</span></h2>
              <p>Meet the visionaries and executives driving the future of technology across Canada and beyond.</p>
              <div className="section-divider" />
            </div>
            {speakers.length > 0
              ? <SpeakerCarousel speakers={speakers} />
              : (
                <div style={{ textAlign:"center", padding:"3rem", color:"rgba(160,130,220,0.5)", fontSize:"0.9rem" }}>
                  Loading speakers…
                </div>
              )
            }
          </section>

          {/* ── SPEAK AT TFC CTA ── */}
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
