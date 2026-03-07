import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import AboutUs from "../components/AboutUs";
import { InteractiveGlobe } from "../components/ui/interactive-globe";
import { useEffect, useState } from "react";

export default function Home() {
  // Detect dark-mode from body class (matches existing pattern)
  const [isDarkMode, setIsDarkMode] = useState(
    () => typeof document !== "undefined" && document.body.classList.contains("dark-mode")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── HERO WRAPPER ── */
        .hero-section-wrapper {
          position: relative;
          overflow: hidden;
        }

        /* ── AMBIENT ORB LAYER ── */
        .hero-orbs {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0;
          animation: orbFadeIn 1.8s ease forwards;
        }
        .hero-orb-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(122,63,209,0.35) 0%, transparent 70%);
          top: -140px; left: -120px;
          animation-delay: 0.2s;
        }
        .hero-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(245,166,35,0.18) 0%, transparent 70%);
          top: 60px; right: -80px;
          animation-delay: 0.5s;
        }
        .hero-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(217,70,143,0.15) 0%, transparent 70%);
          bottom: -80px; left: 38%;
          animation-delay: 0.8s;
        }
        @keyframes orbFadeIn { to { opacity: 1; } }

        /* ── SUBTLE GRID TEXTURE ── */
        .hero-grid-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image:
            linear-gradient(rgba(122,63,209,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,63,209,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        /* ── HERO INNER ── */
        .hero-inner {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
          padding: 7rem 5% 6rem;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 85vh;
        }

        /* ── TEXT ANIMATIONS ── */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(122,63,209,0.12);
          border: 1px solid rgba(122,63,209,0.25);
          color: var(--brand-purple);
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 1.6rem;
          opacity: 0;
          transform: translateY(16px);
          animation: slideUp 0.7s ease 0.1s forwards;
        }
        body.dark-mode .hero-eyebrow {
          background: rgba(122,63,209,0.18);
          border-color: rgba(122,63,209,0.35);
          color: #b99eff;
        }
        .hero-eyebrow-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--brand-orange);
          box-shadow: 0 0 6px var(--brand-orange);
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.35); }
        }

        .hero-headline {
          font-size: 5rem;
          line-height: 1.0;
          margin-bottom: 1.6rem;
          color: var(--brand-purple);
          opacity: 0;
          transform: translateY(22px);
          animation: slideUp 0.75s ease 0.25s forwards;
        }
        body.dark-mode .hero-headline { color: var(--brand-white); }
        .hero-headline span { color: var(--brand-orange); }

        .hero-sub {
          font-size: 1.15rem;
          color: var(--text-muted);
          margin-bottom: 2.8rem;
          font-weight: 500;
          line-height: 1.75;
          max-width: 460px;
          opacity: 0;
          transform: translateY(22px);
          animation: slideUp 0.75s ease 0.42s forwards;
        }

        .hero-cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(22px);
          animation: slideUp 0.75s ease 0.58s forwards;
        }

        .hero-divider {
          width: 56px;
          height: 3px;
          border-radius: 2px;
          background: var(--gradient-brand);
          margin-bottom: 2rem;
          opacity: 0;
          animation: slideUp 0.75s ease 0.18s forwards;
        }

        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

        /* ── VISUAL SIDE ── */
        .hero-visual-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(30px);
          animation: slideLeft 0.9s ease 0.45s forwards;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @keyframes slideLeft { to { opacity: 1; transform: translateX(0); } }

        /* ── GLOBE CONTAINER ── */
        .hero-globe-frame {
          position: relative;
          width: 460px;
          height: 460px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Subtle border ring around the canvas */
        .hero-globe-frame::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            rgba(122,63,209,0.5),
            rgba(245,166,35,0.4),
            rgba(122,63,209,0.5),
            rgba(245,166,35,0.4),
            rgba(122,63,209,0.5)
          );
          animation: spinBorder 12s linear infinite;
          opacity: 0.4;
          pointer-events: none;
        }
        .hero-globe-frame::after {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 50%;
          background: transparent;
          box-shadow:
            0 0 40px rgba(122,63,209,0.20),
            0 0 80px rgba(122,63,209,0.08),
            inset 0 0 40px rgba(122,63,209,0.04);
          pointer-events: none;
        }
        body:not(.dark-mode) .hero-globe-frame::after {
          box-shadow:
            0 0 30px rgba(122,63,209,0.12),
            0 0 60px rgba(122,63,209,0.05),
            inset 0 0 30px rgba(122,63,209,0.02);
        }
        @keyframes spinBorder { to { transform: rotate(360deg); } }

        /* ── FLOATING LEGEND BADGES ── */
        .hero-badge {
          position: absolute;
          background: var(--bg-card, rgba(28,16,52,0.85));
          border: 1px solid rgba(122,63,209,0.25);
          backdrop-filter: blur(14px);
          border-radius: 16px;
          padding: 14px 18px;
          z-index: 10;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
          animation: badgeFloat 5s ease-in-out infinite;
        }
        body:not(.dark-mode) .hero-badge {
          background: rgba(255,255,255,0.92);
          border-color: rgba(122,63,209,0.18);
          box-shadow: 0 8px 32px rgba(17,17,17,0.10);
        }
        .hero-badge-top {
          top: 16px; left: -16px;
          animation-delay: 0s;
        }
        .hero-badge-bottom {
          bottom: 40px; right: -16px;
          animation-delay: 2.5s;
        }
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .badge-number {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 900;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .badge-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted, #BFC5CC);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 3px;
        }

        /* ── LEGEND DOTS ── */
        .globe-legend {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 10;
          pointer-events: none;
          white-space: nowrap;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .legend-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .legend-dot-pillar { background: rgba(245,166,35,0.9); box-shadow: 0 0 5px rgba(245,166,35,0.5); }
        .legend-dot-sector { background: rgba(160,100,255,0.9); box-shadow: 0 0 5px rgba(160,100,255,0.5); }

        /* ── DECORATIVE ORBIT RING ── */
        .hero-ring {
          position: absolute;
          width: 560px; height: 560px;
          border-radius: 50%;
          border: 1px dashed rgba(122,63,209,0.15);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          animation: spinRing 40s linear infinite;
          pointer-events: none;
        }
        .hero-ring::before {
          content: '';
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--brand-orange);
          top: 8px; left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 8px var(--brand-orange);
        }
        .hero-ring-2 {
          width: 520px; height: 520px;
          border: 1px dashed rgba(245,166,35,0.08);
          animation: spinRing 25s linear infinite reverse;
        }
        @keyframes spinRing {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hero-inner {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: 4rem;
          }
          .hero-cta-row { justify-content: center; }
          .hero-sub { margin-left: auto; margin-right: auto; }
          .hero-eyebrow { margin-left: auto; margin-right: auto; }
          .hero-divider { margin-left: auto; margin-right: auto; }
          .hero-visual-wrap { display: none; }
          .hero-headline { font-size: 3.2rem; }
        }
      `}</style>

      <UrgencyBanner />
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-section-wrapper">
        {/* Ambient orbs */}
        <div className="hero-orbs">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="hero-grid-overlay" />

        <div className="hero-inner">

          {/* LEFT — TEXT */}
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Toronto · London 
            </div>

            <div className="hero-divider" />

            <h1 className="hero-headline">
              MEET.<br />
              <span>BUILD.</span><br />
              SCALE.
            </h1>

            <p className="hero-sub">
        The Tech Festival Canada is the country’s deal-making platform where innovators, buyers, investors,
              and policymakers meet to turn emerging tech into real partnerships, pilots, and contracts
               Expect senior decision-makers from enterprise and critical sectors alongside government bodies, associations, media,
              and leading research institutions creating the right room for announcements, procurement conversations, 
              and collaborations that move faster than “business as usual.”
            </p>

            <div className="hero-cta-row">
              <a href="/tickets" className="btn-primary">
                Get Your Tickets 
              </a>
              <a href="/on-demand" className="btn-outline">
                Partner With Us 
              </a>
            </div>
          </div>

          {/* RIGHT — GLOBE */}
          <div className="hero-visual-wrap">

            {/* Floating orbit rings */}
            <div className="hero-ring" />
            <div className="hero-ring hero-ring-2" />

            {/* Floating badge — top left (Pillars) */}
            <div className="hero-badge hero-badge-top">
              <div className="badge-number">500+</div>
              <div className="badge-label">Attendees</div>
            </div>

            {/* Globe canvas frame */}
            <div className="hero-globe-frame">
              <InteractiveGlobe
                size={460}
                isDarkMode={isDarkMode}
                autoRotateSpeed={0.0018}
              />

              {/* Pillar/Sector legend */}
              <div className="globe-legend">
                <div className="legend-item">
                  <span className="legend-dot legend-dot-pillar" />
                  Tech Pillars
                </div>
                <div className="legend-item">
                  <span className="legend-dot legend-dot-sector" />
                  Applied Sectors
                </div>
              </div>
            </div>

            {/* Floating badge — bottom right (Sectors) */}
            <div className="hero-badge hero-badge-bottom">
              <div className="badge-number">3</div>
              <div className="badge-label">Days of Content</div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <AboutUs />

      <Footer />
    </>
  );
}
