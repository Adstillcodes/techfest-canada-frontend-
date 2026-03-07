import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import { useEffect } from "react";
import AboutUs from "../components/AboutUs";

export default function Home() {
  useEffect(() => {
    const slides = document.querySelectorAll("#hero-slideshow .slideshow-image");
    let index = 0;
    if (!slides.length) return;
    const interval = setInterval(() => {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, 3500);
    return () => clearInterval(interval);
  }, []);

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
        @keyframes orbFadeIn {
          to { opacity: 1; }
        }

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

        /* ── DIVIDER LINE ACCENT ── */
        .hero-divider {
          width: 56px;
          height: 3px;
          border-radius: 2px;
          background: var(--gradient-brand);
          margin-bottom: 2rem;
          opacity: 0;
          animation: slideUp 0.75s ease 0.18s forwards;
        }

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── VISUAL SIDE ── */
        .hero-visual-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(30px);
          animation: slideLeft 0.9s ease 0.45s forwards;
        }
        @keyframes slideLeft {
          to { opacity: 1; transform: translateX(0); }
        }

        /* Glowing frame */
        .hero-image-frame {
          position: relative;
          width: 100%;
          height: 500px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(122,63,209,0.3),
            0 25px 60px rgba(0,0,0,0.35),
            0 0 80px rgba(122,63,209,0.12);
        }
        .hero-image-frame::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 3;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.08);
          pointer-events: none;
        }
        /* Bottom gradient fade on image */
        .hero-image-frame::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 45%;
          z-index: 3;
          background: linear-gradient(to top, rgba(13,10,26,0.7) 0%, transparent 100%);
          pointer-events: none;
          border-radius: 0 0 28px 28px;
        }
        body:not(.dark-mode) .hero-image-frame::after {
          background: linear-gradient(to top, rgba(255,255,255,0.4) 0%, transparent 100%);
        }

        .slideshow-image {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1.2s ease-in-out;
        }
        .slideshow-image.active { opacity: 1; z-index: 2; }

        /* Corner accent lines */
        .frame-corner {
          position: absolute;
          width: 28px; height: 28px;
          z-index: 5;
          pointer-events: none;
        }
        .frame-corner-tl { top: 14px; left: 14px; border-top: 2px solid var(--brand-orange); border-left: 2px solid var(--brand-orange); border-radius: 3px 0 0 0; }
        .frame-corner-tr { top: 14px; right: 14px; border-top: 2px solid var(--brand-orange); border-right: 2px solid var(--brand-orange); border-radius: 0 3px 0 0; }
        .frame-corner-bl { bottom: 14px; left: 14px; border-bottom: 2px solid var(--brand-orange); border-left: 2px solid var(--brand-orange); border-radius: 0 0 0 3px; }
        .frame-corner-br { bottom: 14px; right: 14px; border-bottom: 2px solid var(--brand-orange); border-right: 2px solid var(--brand-orange); border-radius: 0 0 3px 0; }

        /* ── FLOATING STAT BADGES ── */
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
          top: -20px; left: -24px;
          animation-delay: 0s;
        }
        .hero-badge-bottom {
          bottom: 28px; right: -22px;
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

        /* ── DECORATIVE RING ── */
        .hero-ring {
          position: absolute;
          width: 160px; height: 160px;
          border-radius: 50%;
          border: 1px dashed rgba(122,63,209,0.3);
          bottom: -50px; left: -60px;
          z-index: 0;
          animation: spinRing 20s linear infinite;
        }
        .hero-ring::before {
          content: '';
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--brand-orange);
          top: 12px; left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 8px var(--brand-orange);
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
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
      `}
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
        @keyframes orbFadeIn {
          to { opacity: 1; }
        }

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

        /* ── DIVIDER LINE ACCENT ── */
        .hero-divider {
          width: 56px;
          height: 3px;
          border-radius: 2px;
          background: var(--gradient-brand);
          margin-bottom: 2rem;
          opacity: 0;
          animation: slideUp 0.75s ease 0.18s forwards;
        }

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── VISUAL SIDE ── */
        .hero-visual-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(30px);
          animation: slideLeft 0.9s ease 0.45s forwards;
        }
        @keyframes slideLeft {
          to { opacity: 1; transform: translateX(0); }
        }

        /* Glowing frame */
        .hero-image-frame {
          position: relative;
          width: 100%;
          height: 500px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(122,63,209,0.3),
            0 25px 60px rgba(0,0,0,0.35),
            0 0 80px rgba(122,63,209,0.12);
        }
        .hero-image-frame::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 3;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.08);
          pointer-events: none;
        }
        /* Bottom gradient fade on image */
        .hero-image-frame::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 45%;
          z-index: 3;
          background: linear-gradient(to top, rgba(13,10,26,0.7) 0%, transparent 100%);
          pointer-events: none;
          border-radius: 0 0 28px 28px;
        }
        body:not(.dark-mode) .hero-image-frame::after {
          background: linear-gradient(to top, rgba(255,255,255,0.4) 0%, transparent 100%);
        }

        .slideshow-image {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1.2s ease-in-out;
        }
        .slideshow-image.active { opacity: 1; z-index: 2; }

        /* Corner accent lines */
        .frame-corner {
          position: absolute;
          width: 28px; height: 28px;
          z-index: 5;
          pointer-events: none;
        }
        .frame-corner-tl { top: 14px; left: 14px; border-top: 2px solid var(--brand-orange); border-left: 2px solid var(--brand-orange); border-radius: 3px 0 0 0; }
        .frame-corner-tr { top: 14px; right: 14px; border-top: 2px solid var(--brand-orange); border-right: 2px solid var(--brand-orange); border-radius: 0 3px 0 0; }
        .frame-corner-bl { bottom: 14px; left: 14px; border-bottom: 2px solid var(--brand-orange); border-left: 2px solid var(--brand-orange); border-radius: 0 0 0 3px; }
        .frame-corner-br { bottom: 14px; right: 14px; border-bottom: 2px solid var(--brand-orange); border-right: 2px solid var(--brand-orange); border-radius: 0 0 3px 0; }

        /* ── FLOATING STAT BADGES ── */
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
          top: -20px; left: -24px;
          animation-delay: 0s;
        }
        .hero-badge-bottom {
          bottom: 28px; right: -22px;
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

        /* ── DECORATIVE RING ── */
        .hero-ring {
          position: absolute;
          width: 160px; height: 160px;
          border-radius: 50%;
          border: 1px dashed rgba(122,63,209,0.3);
          bottom: -50px; left: -60px;
          z-index: 0;
          animation: spinRing 20s linear infinite;
        }
        .hero-ring::before {
          content: '';
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--brand-orange);
          top: 12px; left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 8px var(--brand-orange);
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
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
      ` }</style>

      <UrgencyBanner />
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-section-wrapper">
        {/* Ambient background orbs */}
        <div className="hero-orbs">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        {/* Subtle grid texture */}
        <div className="hero-grid-overlay" />

        <div className="hero-inner">

          {/* LEFT — TEXT */}
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
                Get Your Tickets ➡️
              </a>
              <a href="/sponsors" className="btn-outline">
                View Exhibitors
              </a>
            </div>
          </div>

          {/* RIGHT — IMAGE */}
          <div className="hero-visual-wrap">
            <div className="hero-ring" />

            {/* Floating badge — top left */}
            <div className="hero-badge hero-badge-top">
              <div className="badge-number">500+</div>
              <div className="badge-label">Attendees</div>
            </div>

            {/* Glowing image frame */}
            <div className="hero-image-frame" id="hero-slideshow">
              <div className="frame-corner frame-corner-tl" />
              <div className="frame-corner frame-corner-tr" />
              <div className="frame-corner frame-corner-bl" />
              <div className="frame-corner frame-corner-br" />
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80"
                className="slideshow-image active"
                alt="Event visual 1"
              />
              <img
                src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1000&q=80"
                className="slideshow-image"
                alt="Event visual 2"
              />
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&q=80"
                className="slideshow-image"
                alt="Event visual 3"
              />
            </div>

            {/* Floating badge — bottom right */}
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
