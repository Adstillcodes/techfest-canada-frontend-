import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import AboutUs from "../components/AboutUs";
import { EventCountdown } from "../components/ui/EventCountdown";
import { useEffect, useState } from "react";
import InquiryModal from "../components/InquiryModal";
import CookieConsent from "../components/CookieConsent";
import PostPurchaseModal from "../components/PostPurchaseModal";
import OnboardingSurvey from "../components/OnboardingSurvey";

export default function Home() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyName, setSurveyName] = useState("");
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseTicketType, setPurchaseTicketType] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
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

  useEffect(() => {
    const handleMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail;
      setSurveyName(detail?.name || "");
      setSurveyOpen(true);
    };
    window.addEventListener("showSurvey", handler);
    return () => window.removeEventListener("showSurvey", handler);
  }, []);

  useEffect(() => {
    const handlePurchase = (e) => {
      const detail = e.detail;
      setPurchaseTicketType(detail?.ticketType || "Delegate Pass");
      setPurchaseOpen(true);
    };
    window.addEventListener("purchaseComplete", handlePurchase);
    return () => window.removeEventListener("purchaseComplete", handlePurchase);
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
          padding: 2rem 5% 4rem;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 75vh;
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
          font-size: 1.4rem !important;
          line-height: 1.4;
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
            padding-top: 3rem;
            gap: 2rem;
          }
          .hero-cta-row { justify-content: center; flex-wrap: wrap; gap: 10px; }
          .hero-sub { margin-left: auto; margin-right: auto; font-size: 0.9rem; }
          .hero-eyebrow { margin-left: auto; margin-right: auto; }
          .hero-divider { margin-left: auto; margin-right: auto; }
          .hero-visual-wrap { display: flex; justify-content: center; transform: scale(0.85); transform-origin: top center; }
          .hero-headline { font-size: 1.4rem; }
          .hero-section-wrapper { min-height: auto; padding: 1rem 4%; }
        }
        @media (max-width: 600px) {
          .hero-headline { font-size: 1.1rem; }
          .hero-sub { font-size: 0.82rem; max-width: 100% !important; }
          .hero-visual-wrap { 
            transform: scale(0.72); 
            transform-origin: top center;
            margin-top: -20px;
            overflow: hidden;
            max-width: 100vw;
          }
          .hero-inner { padding-top: 1.5rem; gap: 0.5rem; }
          .hero-section-wrapper { padding: 0.5rem 4%; overflow: hidden; }
          .hero-cta-row { gap: 8px !important; }
          .hero-cta-row a, .hero-cta-row button {
            width: 100% !important;
            text-align: center !important;
            justify-content: center !important;
            padding: 12px 16px !important;
            font-size: 0.78rem !important;
          }
        }
        @media (max-width: 400px) {
          .hero-visual-wrap { transform: scale(0.62); margin-top: -30px; }
          .hero-headline { font-size: 0.98rem; }
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


            {/* Full wordmark logo — hero sized */}
            <img
              src={isDarkMode
                ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
              alt="Tech Festival Canada"
              style={{
                height: "auto",
                width: "100%",
                maxWidth: 480,
                objectFit: "contain",
                display: "block",
                marginBottom: "1.2rem",
                opacity: 0,
                animation: "slideUp 0.75s ease 0.2s forwards",
                filter: isDarkMode ? "drop-shadow(0 0 24px rgba(160,100,255,0.25))" : "none",
              }}
            />

            <h1 className="hero-headline">
              MEET <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>|</span> <span>BUILD</span> <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>|</span> SCALE
            </h1>

            <p className="hero-sub">
              The Tech Festival Canada is Canada's first-of-its-kind, deal-making platform where innovators, buyers, investors, and policymakers turn emerging tech into real partnerships, pilots, and contracts — not just conversations. Expect a never-seen-before concentration of senior decision-makers from enterprise and critical sectors, alongside government, associations, media, and leading research institutions.
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

      <CookieConsent />

      <PostPurchaseModal
        isOpen={purchaseOpen}
        onClose={() => setPurchaseOpen(false)}
        ticketType={purchaseTicketType}
      />

      <OnboardingSurvey
        isOpen={surveyOpen}
        onClose={() => { setSurveyOpen(false); window.location.reload(); }}
        userName={surveyName}
      />

    </>
  );
}
