import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import AboutUs from "../components/AboutUs";
import { EventCountdown } from "../components/ui/EventCountdown";
import { useEffect, useState, useRef, useCallback } from "react";
import InquiryModal from "../components/InquiryModal";
import CookieConsent from "../components/CookieConsent";
import PostPurchaseModal from "../components/PostPurchaseModal";
import OnboardingSurvey from "../components/OnboardingSurvey";

/* ─────────────────────────────────────────
   SCAN-LINE CANVAS  (inspired by WebGPU depth scan)
   Draws an animated red scan line + dot-grid overlay
   on top of the visual panel, no Three.js needed.
───────────────────────────────────────── */
function ScanCanvas() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(0);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const DOT_SPACING = 28;
    const DOT_R       = 1.1;

    const draw = (ts) => {
      tRef.current = ts * 0.001;
      ctx.clearRect(0, 0, W, H);

      // ── dot grid (cell noise approximation)
      for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
          const nx   = x / W;
          const ny   = y / H;
          // pseudo brightness from position hash
          const hash = Math.sin(nx * 127.1 + ny * 311.7) * 43758.5;
          const b    = 0.3 + 0.7 * Math.abs(hash - Math.floor(hash));
          const alpha = b * 0.35;
          ctx.beginPath();
          ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160,100,255,${alpha})`;
          ctx.fill();
        }
      }

      // ── animated scan line (sin wave like WebGPU uProgress)
      const prog    = (Math.sin(tRef.current * 0.5) * 0.5 + 0.5); // 0..1 top-to-bottom
      const scanY   = prog * H;
      const scanW   = 60;

      // glow band
      const grad = ctx.createLinearGradient(0, scanY - scanW, 0, scanY + scanW);
      grad.addColorStop(0,   "rgba(200,60,60,0)");
      grad.addColorStop(0.4, "rgba(220,80,80,0.18)");
      grad.addColorStop(0.5, "rgba(255,80,80,0.55)");
      grad.addColorStop(0.6, "rgba(220,80,80,0.18)");
      grad.addColorStop(1,   "rgba(200,60,60,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - scanW, W, scanW * 2);

      // sharp line
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(W, scanY);
      ctx.strokeStyle = `rgba(255,100,100,0.9)`;
      ctx.lineWidth   = 1.5;
      ctx.shadowColor = "rgba(255,80,80,0.8)";
      ctx.shadowBlur  = 12;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 3,
        borderRadius: "inherit",
      }}
    />
  );
}

/* ─────────────────────────────────────────
   WORD-BY-WORD ANIMATED TITLE
───────────────────────────────────────── */
const HEADLINE_WORDS = ["MEET", "|", "BUILD", "|", "SCALE"];

function AnimatedHeadline({ isDark }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= HEADLINE_WORDS.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), visible === 0 ? 600 : 220);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <h1 style={{
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
      fontWeight: 900,
      lineHeight: 1.2,
      marginBottom: "1.4rem",
      display: "flex", flexWrap: "wrap", gap: "0.5rem",
      opacity: visible > 0 ? 1 : 0,
      transition: "opacity 0.3s",
    }}>
      {HEADLINE_WORDS.map((word, i) => {
        const isDivider = word === "|";
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: i < visible ? 1 : 0,
              transform: i < visible ? "translateY(0)" : "translateY(18px)",
              transition: `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`,
              color: isDivider
                ? "rgba(160,100,255,0.4)"
                : i === 2
                  ? "var(--brand-orange)"
                  : isDark ? "#ffffff" : "#0f0520",
              fontWeight: isDivider ? 300 : 900,
              fontSize: isDivider ? "0.7em" : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </h1>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Home() {
  const [inquiryOpen,       setInquiryOpen]       = useState(false);
  const [surveyOpen,        setSurveyOpen]         = useState(false);
  const [surveyName,        setSurveyName]         = useState("");
  const [purchaseOpen,      setPurchaseOpen]       = useState(false);
  const [purchaseTicketType,setPurchaseTicketType] = useState("");
  const [isDarkMode,        setIsDarkMode]         = useState(
    () => typeof document !== "undefined" && document.body.classList.contains("dark-mode")
  );
  // Mouse parallax for visual panel
  const [mouse, setMouse]   = useState({ x: 0, y: 0 });
  const heroRef             = useRef(null);

  // Dark mode observer
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDarkMode(document.body.classList.contains("dark-mode"))
    );
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Mouse parallax
  const handleMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
      y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
    });
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Survey event
  useEffect(() => {
    const h = (e) => { setSurveyName(e.detail?.name || ""); setSurveyOpen(true); };
    window.addEventListener("showSurvey", h);
    return () => window.removeEventListener("showSurvey", h);
  }, []);

  // Purchase event
  useEffect(() => {
    const h = (e) => {
      setPurchaseTicketType(e.detail?.ticketType || "Delegate Pass");
      setPurchaseOpen(true);
    };
    window.addEventListener("purchaseComplete", h);
    return () => window.removeEventListener("purchaseComplete", h);
  }, []);

  // Subtitle fade-in state
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSubtitleVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const [ctaVisible, setCtaVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setCtaVisible(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        /* ── scan canvas host ── */
        .hero-visual-host {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
        }

        /* ── depth parallax wrapper ── */
        .hero-visual-parallax {
          will-change: transform;
          transition: transform 0.12s linear;
        }

        /* ── grid overlay ── */
        .hero-bg-grid {
          pointer-events: none;
          position: absolute;
          inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(122,63,209,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,63,209,0.045) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%);
        }

        /* ── orbs ── */
        .hero-orb {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none;
          animation: orbIn 2s ease forwards; opacity: 0;
        }
        @keyframes orbIn { to { opacity: 1; } }

        /* ── scroll hint ── */
        .scroll-hint {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(160,100,255,0.55);
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 1.2px; text-transform: uppercase;
          opacity: 0; animation: fadeIn 0.8s ease 3s forwards;
          margin-top: 2rem; cursor: pointer;
          border: none; background: none;
        }
        @keyframes fadeIn { to { opacity: 1; } }
        .scroll-arrow {
          width: 22px; height: 22px;
          animation: bounceDown 1.6s ease infinite;
        }
        @keyframes bounceDown {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }

        /* ── eyebrow badge ── */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(122,63,209,0.10);
          border: 1px solid rgba(122,63,209,0.28);
          color: #b99eff; padding: 6px 16px;
          border-radius: 999px; font-size: 0.72rem;
          font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; margin-bottom: 1.4rem;
          opacity: 0; animation: slideUp 0.6s ease 0.3s forwards;
        }
        body:not(.dark-mode) .hero-badge {
          background: rgba(122,63,209,0.07);
          border-color: rgba(122,63,209,0.20);
          color: #7a3fd1;
        }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--brand-orange);
          box-shadow: 0 0 7px var(--brand-orange);
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.4); opacity: 0.6; }
        }

        /* ── hero layout ── */
        .hero-wrap {
          position: relative; overflow: hidden;
        }
        .hero-inner {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: center; gap: 4rem;
          padding: clamp(2rem,6vw,4rem) 5% clamp(2.5rem,6vw,5rem);
          max-width: 1400px; margin: 0 auto; min-height: 80vh;
        }

        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { to { opacity: 1; transform: translateX(0); } }

        /* ── responsive ── */
        @media (max-width: 920px) {
          .hero-inner {
            grid-template-columns: 1fr; text-align: center;
            gap: 2rem; min-height: auto;
          }
          .hero-badge { margin-left: auto; margin-right: auto; }
          .hero-sub   { margin: 0 auto 2rem !important; }
          .hero-ctas  { justify-content: center !important; }
          .scroll-hint { margin-left: auto; margin-right: auto; display: flex; }
        }
        @media (max-width: 600px) {
          .hero-ctas { flex-direction: column !important; }
          .hero-ctas a { width: 100% !important; text-align: center !important; }
          .hero-sub { font-size: 0.85rem !important; }
        }
      `}</style>

      <UrgencyBanner />
      <Navbar />

      {/* ════ HERO ════ */}
      <section className="hero-wrap" ref={heroRef}>

        {/* Background orbs */}
        <div className="hero-orb" style={{
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(122,63,209,0.30) 0%, transparent 70%)",
          top: -180, left: -160, animationDelay: "0.1s",
        }} />
        <div className="hero-orb" style={{
          width: 440, height: 440,
          background: "radial-gradient(circle, rgba(245,166,35,0.16) 0%, transparent 70%)",
          top: 40, right: -100, animationDelay: "0.4s",
        }} />
        <div className="hero-orb" style={{
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(217,70,143,0.13) 0%, transparent 70%)",
          bottom: -60, left: "40%", animationDelay: "0.7s",
        }} />

        {/* Dot grid */}
        <div className="hero-bg-grid" />

        <div className="hero-inner">

          {/* ── LEFT: TEXT ── */}
          <div>
            {/* Badge */}
            <div className="hero-badge">
              <span className="badge-dot" />
              Oct 28, 2026 · The Carlu, Toronto
            </div>

            {/* Logo wordmark */}
            <img
              src={isDarkMode
                ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
              alt="Tech Festival Canada"
              style={{
                width: "100%", maxWidth: 460, height: "auto",
                objectFit: "contain", display: "block",
                marginBottom: "1.4rem",
                opacity: 0, animation: "slideUp 0.7s ease 0.15s forwards",
                filter: isDarkMode ? "drop-shadow(0 0 28px rgba(160,100,255,0.28))" : "none",
              }}
            />

            {/* Word-by-word headline */}
            <AnimatedHeadline isDark={isDarkMode} />

            {/* Subtitle */}
            <p
              className="hero-sub"
              style={{
                fontSize: "clamp(0.88rem,1.4vw,1.08rem)",
                color: "var(--text-muted)",
                lineHeight: 1.78, fontWeight: 500,
                maxWidth: 480, marginBottom: "2.4rem",
                opacity: subtitleVisible ? 1 : 0,
                transform: subtitleVisible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.65s ease, transform 0.65s ease",
              }}
            >
              Canada's first-of-its-kind deal-making platform — where innovators,
              buyers, investors, and policymakers turn emerging tech into real
              partnerships, pilots, and contracts. Not just conversations.
            </p>

            {/* CTAs */}
            <div
              className="hero-ctas"
              style={{
                display: "flex", gap: "1rem", flexWrap: "wrap",
                opacity: ctaVisible ? 1 : 0,
                transform: ctaVisible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              <a href="/tickets" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                ✦ Get Your Tickets
              </a>
              <a href="/speakers" className="btn-outline">
                Partner With Us
              </a>
            </div>

            {/* Scroll hint */}
            <button
              className="scroll-hint"
              onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Scroll to explore
              <svg className="scroll-arrow" viewBox="0 0 22 22" fill="none">
                <path d="M11 5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 12L11 17L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* ── RIGHT: SCAN VISUAL ── */}
          <div
            style={{
              opacity: 0,
              transform: "translateX(36px)",
              animation: "slideIn 0.9s ease 0.55s forwards",
            }}
          >
            {/* Parallax host — mouse-driven depth shift */}
            <div
              className="hero-visual-parallax"
              style={{
                transform: `translate(${mouse.x * -6}px, ${mouse.y * -4}px)`,
              }}
            >
              <div className="hero-visual-host">
                {/* The scan canvas overlays the countdown */}
                <ScanCanvas />
                <EventCountdown isDark={isDarkMode} />
              </div>
            </div>

            {/* Stats strip below visual */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12, marginTop: 20,
              opacity: 0, animation: "slideUp 0.7s ease 1.1s forwards",
            }}>
              {[
                { val: "500+",     label: "Decision Makers" },
                { val: "5",        label: "Tech Pillars" },
                { val: "Oct '26",  label: "Toronto" },
              ].map(s => (
                <div key={s.label} style={{
                  background: isDarkMode ? "rgba(122,63,209,0.07)" : "rgba(122,63,209,0.05)",
                  border: `1px solid ${isDarkMode ? "rgba(122,63,209,0.18)" : "rgba(122,63,209,0.14)"}`,
                  borderRadius: 16, padding: "14px 10px", textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "1.2rem", fontWeight: 900,
                    background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>{s.val}</div>
                  <div style={{
                    fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: isDarkMode ? "rgba(200,180,255,0.5)" : "rgba(122,63,209,0.55)",
                    marginTop: 4,
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <div id="about-section">
        <AboutUs onWriteToUs={() => setInquiryOpen(true)} />
      </div>

      <Footer />

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
