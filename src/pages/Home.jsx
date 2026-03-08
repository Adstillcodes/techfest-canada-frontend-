import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import AboutUs from "../components/AboutUs";
import { EventCountdown } from "../components/ui/EventCountdown";
import { useEffect, useState } from "react";
import InquiryModal from "../components/InquiryModal";

export default function Home() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
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

        .footer-watermark-line {
          position: absolute;
          top: 0; left: 5%; right: 5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(122,63,209,0.3), rgba(245,166,35,0.2), rgba(122,63,209,0.3), transparent);
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
        <div className="hero-orbs">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="hero-grid-overlay" />

        <div className="hero-inner">

          {/* LEFT — TEXT (unchanged) */}
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Toronto · Vancouver · Montreal
            </div>

            <div className="hero-divider" />

            <h1 className="hero-headline">
              MEET.<br />
              <span>BUILD.</span><br />
              SCALE.
            </h1>

            <p className="hero-sub">
              Canada's premier AI, blockchain & emerging tech conference.
              3 days of keynotes, deep-dive workshops, and high-value
              networking across Toronto, Vancouver, and Montreal.
            </p>

            <div className="hero-cta-row">
              <a href="/tickets" className="btn-primary">
                Get Your Tickets
              </a>
              <a href="/speakers" className="btn-outline">
                Partner With Us
              </a>
            </div>
          </div>

          {/* RIGHT — EVENT COUNTDOWN */}
          <div className="hero-visual-wrap">
            <EventCountdown isDark={isDarkMode} />
          </div>

        </div>
      </section>

      {/* ABOUT SECTION */}
      <AboutUs onWriteToUs={() => setInquiryOpen(true)} />

      <Footer />

      {/* INQUIRY MODAL */}
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
