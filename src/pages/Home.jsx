import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import AboutUs from "../components/AboutUs";
import InquiryModal from "../components/InquiryModal";
import CookieConsent from "../components/CookieConsent";
import PostPurchaseModal from "../components/PostPurchaseModal";
import OnboardingSurvey from "../components/OnboardingSurvey";
import WavyBackground from "../components/ui/WavyBackground";
import AnimatedGroup from "../components/ui/AnimatedGroup";
import ScrollReveal from "../components/ui/ScrollReveal";
import { useEffect, useState, useRef } from "react";

/* ── Headline words with stagger ── */
var WORDS = ["MEET", "BUILD", "SCALE"];

/* ── Animated counter for stats ── */
function AnimatedCounter({ target, suffix, duration }) {
  var ref = useRef(null);
  var [count, setCount] = useState(0);
  var [started, setStarted] = useState(false);

  useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var obs = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return function () { obs.disconnect(); };
  }, [started]);

  useEffect(function () {
    if (!started) return;
    var num = parseInt(target);
    if (isNaN(num)) { setCount(target); return; }
    var d = duration || 1600;
    var steps = 40;
    var inc = num / steps;
    var step = 0;
    var t = setInterval(function () {
      step++;
      if (step >= steps) {
        setCount(num);
        clearInterval(t);
      } else {
        setCount(Math.round(inc * step));
      }
    }, d / steps);
    return function () { clearInterval(t); };
  }, [started, target, duration]);

  var display = typeof count === "number" ? count + (suffix || "") : target;

  return <span ref={ref}>{display}</span>;
}

/* ── Floating particle dots ── */
function FloatingParticles({ dark }) {
  var dots = [];
  for (var i = 0; i < 30; i++) {
    dots.push({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 8,
      dur: 6 + Math.random() * 10,
      opacity: 0.15 + Math.random() * 0.3,
    });
  }
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
      {dots.map(function (d) {
        return (
          <span
            key={d.id}
            className="hero-particle"
            style={{
              position: "absolute",
              left: d.left + "%",
              top: d.top + "%",
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: dark ? "rgba(155,135,245," + d.opacity + ")" : "rgba(122,63,209," + d.opacity + ")",
              animation: "particle-float " + d.dur + "s ease-in-out " + d.delay + "s infinite alternate",
            }}
          />
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOME PAGE
   ══════════════════════════════════════════════════════════════ */
export default function Home() {
  /* ── state ── */
  var s1  = useState(false);  var inquiryOpen = s1[0];         var setInquiryOpen = s1[1];
  var s2  = useState(false);  var surveyOpen = s2[0];          var setSurveyOpen = s2[1];
  var s3  = useState("");     var surveyName = s3[0];          var setSurveyName = s3[1];
  var s4  = useState(false);  var purchaseOpen = s4[0];        var setPurchaseOpen = s4[1];
  var s5  = useState("");     var purchaseTicketType = s5[0];  var setPurchaseTicketType = s5[1];
  var s6  = useState(false);  var dark = s6[0];                var setDark = s6[1];
  var s7  = useState(false);  var heroReady = s7[0];           var setHeroReady = s7[1];

  /* ── dark mode observer ── */
  useEffect(function () {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () {
      setDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);

  /* ── hero entrance delay ── */
  useEffect(function () {
    var t = setTimeout(function () { setHeroReady(true); }, 200);
    return function () { clearTimeout(t); };
  }, []);

  /* ── custom events ── */
  useEffect(function () {
    function h(e) { setSurveyName(e.detail && e.detail.name ? e.detail.name : ""); setSurveyOpen(true); }
    window.addEventListener("showSurvey", h);
    return function () { window.removeEventListener("showSurvey", h); };
  }, []);

  useEffect(function () {
    function h(e) { setPurchaseTicketType(e.detail && e.detail.ticketType ? e.detail.ticketType : "Delegate Pass"); setPurchaseOpen(true); }
    window.addEventListener("purchaseComplete", h);
    return function () { window.removeEventListener("purchaseComplete", h); };
  }, []);

  function scrollDown() {
    var el = document.getElementById("about-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  /* ── theme tokens ── */
  var bg        = dark ? "#06020f"                  : "#ffffff";
  var textMain  = dark ? "#ffffff"                  : "#0d0520";
  var textMid   = dark ? "rgba(255,255,255,0.6)"    : "rgba(13,5,32,0.6)";
  var textSoft  = dark ? "rgba(200,185,255,0.45)"   : "rgba(90,40,180,0.45)";
  var accent    = dark ? "#b99eff"                   : "#7a3fd1";
  var pillBg    = dark ? "rgba(122,63,209,0.10)"     : "rgba(122,63,209,0.06)";
  var pillBdr   = dark ? "rgba(122,63,209,0.22)"     : "rgba(122,63,209,0.18)";
  var cardBg    = dark ? "rgba(155,135,245,0.04)"    : "rgba(122,63,209,0.03)";
  var cardBdr   = dark ? "rgba(155,135,245,0.12)"    : "rgba(122,63,209,0.14)";
  var waveBg    = dark ? "rgba(6,2,15,0.92)"         : "rgba(255,255,255,0.88)";
  var waveColors = dark
    ? ["#7a3fd1", "#9b57e8", "#f5a623", "#c084fc", "#6d28d9"]
    : ["rgba(122,63,209,0.3)", "rgba(155,87,232,0.25)", "rgba(245,166,35,0.2)", "rgba(192,132,252,0.2)", "rgba(109,40,217,0.15)"];

  /* ── stat data ── */
  var stats = [
    { num: "500",  suffix: "+",  label: "Decision Makers" },
    { num: "5",    suffix: "",   label: "Tech Pillars" },
    { num: "Oct 28",             label: "2026", isText: true },
    { num: "The Carlu",          label: "Toronto, ON", isText: true },
  ];

  /* ── partner logos (inline SVG placeholders) ── */
  var pillars = [
    "Artificial Intelligence",
    "Cybersecurity",
    "Cloud & SaaS",
    "Fintech",
    "GreenTech",
  ];

  return (
    <>
      <style>{`
        /* ─────────────── GLOBAL KEYFRAMES ─────────────── */

        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes hero-fade-in {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes particle-float {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(12px, -18px) scale(1.3); }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }

        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.8); opacity: 0.4; }
        }

        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
        }

        @keyframes word-pop {
          0%   { opacity: 0; transform: translateY(30px) scale(0.9); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes line-draw {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* ─────────────── HERO SHELL ─────────────── */

        .hero-shell {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* ─── Grid overlay (from Hero-1) ─── */
        .hero-grid-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(122,63,209,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,63,209,0.045) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(ellipse 80% 65% at 50% 35%, black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 65% at 50% 35%, black 20%, transparent 100%);
        }

        /* ─── Radial accents (from Hero-1 + existing glows) ─── */
        .hero-radial {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: glow-pulse 6s ease-in-out infinite;
        }

        /* ─── Inner content ─── */
        .hero-inner {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: clamp(6rem, 10vw, 9rem) 6% clamp(5rem, 8vw, 7rem);
          max-width: 920px;
          margin: 0 auto;
          width: 100%;
        }

        /* ─── Badge ─── */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 22px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          opacity: 0;
          animation: hero-fade-up 0.8s cubic-bezier(.16,1,.3,1) 0.3s forwards;
        }

        .hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--brand-orange);
          box-shadow: 0 0 10px var(--brand-orange);
          animation: dot-pulse 2.2s ease infinite;
        }

        /* ─── Logo ─── */
        .hero-logo-wrap {
          opacity: 0;
          animation: hero-fade-up 0.9s cubic-bezier(.16,1,.3,1) 0.5s forwards;
          margin: 2rem 0 1.4rem;
        }

        /* ─── Headline ─── */
        .hero-headline {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(2.4rem, 5.5vw, 4.5rem);
          font-weight: 900;
          line-height: 1.05;
          margin-bottom: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.6rem;
          letter-spacing: -0.5px;
        }

        .hero-word {
          display: inline-block;
          opacity: 0;
          animation: word-pop 0.7s cubic-bezier(.16,1,.3,1) forwards;
        }

        /* ─── Divider line ─── */
        .hero-divider-line {
          width: 80px;
          height: 2px;
          margin: 1.4rem auto 1.8rem;
          border-radius: 2px;
          background: linear-gradient(90deg, #7a3fd1, #f5a623);
          transform-origin: center;
          animation: line-draw 0.6s ease 1.6s both;
        }

        /* ─── Subtext ─── */
        .hero-sub {
          font-size: clamp(1rem, 1.6vw, 1.15rem);
          line-height: 1.85;
          font-weight: 400;
          max-width: 600px;
          margin-bottom: 2.6rem;
          opacity: 0;
          animation: hero-fade-in 0.8s ease 1.8s forwards;
        }

        /* ─── CTA buttons ─── */
        .hero-ctas {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          animation: hero-fade-in 0.7s ease 2.1s forwards;
        }

        .hero-cta-primary {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 17px 40px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #7a3fd1 0%, #9b57e8 50%, #f5a623 140%);
          background-size: 200% 200%;
          background-position: 0% 50%;
          color: #fff;
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          font-size: 0.78rem;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 8px 32px rgba(122,63,209,0.35), 0 2px 8px rgba(0,0,0,0.18);
          transition: background-position 0.5s ease, box-shadow 0.35s ease, transform 0.25s ease;
        }

        .hero-cta-primary:hover {
          background-position: 100% 50%;
          box-shadow: 0 14px 48px rgba(122,63,209,0.5), 0 2px 8px rgba(0,0,0,0.18);
          transform: translateY(-3px);
        }

        .hero-cta-primary::after {
          content: '';
          position: absolute; inset: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .hero-cta-primary:hover::after { opacity: 1; }

        .hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 34px;
          border-radius: 999px;
          border: 1.5px solid rgba(122,63,209,0.28);
          background: transparent;
          font-size: 0.86rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-cta-secondary:hover {
          border-color: rgba(122,63,209,0.6);
          background: rgba(122,63,209,0.08);
          transform: translateY(-2px);
        }

        body.dark-mode .hero-cta-secondary {
          border-color: rgba(155,135,245,0.28);
        }
        body.dark-mode .hero-cta-secondary:hover {
          border-color: rgba(155,135,245,0.55);
          background: rgba(155,135,245,0.08);
        }

        /* ─── Stat strip ─── */
        .hero-stats-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1px;
          margin-top: 3.5rem;
          border: 1px solid ${cardBdr};
          border-radius: 22px;
          overflow: hidden;
          opacity: 0;
          animation: hero-fade-in 0.7s ease 2.5s forwards;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .hero-stat-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 36px;
          flex: 1;
          min-width: 140px;
          background: ${cardBg};
          border-right: 1px solid ${cardBdr};
          transition: background 0.25s ease;
          cursor: default;
        }

        .hero-stat-cell:last-child { border-right: none; }

        .hero-stat-cell:hover {
          background: ${dark ? "rgba(155,135,245,0.09)" : "rgba(122,63,209,0.08)"};
        }

        .hero-stat-num {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 1.1rem;
          background: linear-gradient(135deg, #7a3fd1, #f5a623);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }

        .hero-stat-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: ${textSoft};
        }

        /* ─── Scroll cue ─── */
        .hero-scroll-cue {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-top: 3rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          opacity: 0;
          animation: hero-fade-in 0.6s ease 3.2s forwards;
          transition: opacity 0.3s;
        }

        .hero-scroll-cue:hover { opacity: 0.8 !important; }

        .hero-scroll-cue svg {
          animation: scroll-bounce 1.8s ease infinite;
        }

        /* ─── Pillar showcase ─── */
        .pillar-showcase {
          position: relative;
          z-index: 5;
          padding: 5rem 6% 4rem;
          text-align: center;
        }

        .pillar-tag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 28px;
          border-radius: 14px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pillar-tag:hover {
          transform: translateY(-3px);
        }

        /* ─── Bottom divider ─── */
        .hero-bottom-divider {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(122,63,209,0.22) 30%, rgba(245,166,35,0.15) 70%, transparent 100%);
        }

        /* ─── Bottom fade ─── */
        .hero-bottom-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 100px;
          z-index: 4;
          pointer-events: none;
        }

        /* ─── Shimmer text effect ─── */
        .shimmer-text {
          background: linear-gradient(
            90deg,
            ${accent} 0%,
            ${dark ? "#e0d0ff" : "#f5a623"} 40%,
            ${accent} 80%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        /* ─── Responsive ─── */
        @media (max-width: 640px) {
          .hero-ctas { flex-direction: column; width: 100%; }
          .hero-cta-primary,
          .hero-cta-secondary { width: 100%; justify-content: center; }
          .hero-sub { text-align: left; }
          .hero-stat-cell { padding: 14px 18px; }
          .hero-stats-row { border-radius: 16px; }
          .hero-headline { font-size: clamp(2rem, 8vw, 3rem); }
          .pillar-showcase { padding: 3rem 4% 2rem; }
        }
      `}</style>

      <UrgencyBanner />
      <Navbar />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="hero-shell" style={{ background: bg }}>

        {/* Canvas wavy background */}
        <WavyBackground
          colors={waveColors}
          backgroundFill={dark ? "#06020f" : "#f8f6ff"}
          blur={dark ? 12 : 8}
          speed="slow"
          waveOpacity={dark ? 0.45 : 0.3}
          waveWidth={dark ? 55 : 45}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            minHeight: "100%",
          }}
        />

        {/* Overlay gradient to fade waves */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: dark
            ? "radial-gradient(ellipse 100% 80% at 50% 30%, rgba(6,2,15,0.3) 0%, rgba(6,2,15,0.85) 100%)"
            : "radial-gradient(ellipse 100% 80% at 50% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.9) 100%)",
        }} />

        {/* Grid overlay (inspired by Hero-1) */}
        <div className="hero-grid-overlay" />

        {/* Floating particles */}
        <FloatingParticles dark={dark} />

        {/* Radial glows */}
        <div className="hero-radial" style={{
          width: 750, height: 750,
          background: dark
            ? "radial-gradient(circle, rgba(122,63,209,0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(122,63,209,0.1) 0%, transparent 70%)",
          top: -280, left: -220,
          filter: "blur(80px)",
        }} />
        <div className="hero-radial" style={{
          width: 550, height: 550,
          background: dark
            ? "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)",
          top: -180, right: -200,
          filter: "blur(90px)",
          animationDelay: "2s",
        }} />
        <div className="hero-radial" style={{
          width: 500, height: 350,
          background: dark
            ? "radial-gradient(circle, rgba(155,135,245,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(155,135,245,0.06) 0%, transparent 70%)",
          bottom: -80, left: "30%",
          filter: "blur(100px)",
          animationDelay: "4s",
        }} />

        {/* ── HERO CONTENT ── */}
        <div className="hero-inner">

          {/* Badge */}
          <div
            className="hero-badge"
            style={{
              background: pillBg,
              border: "1px solid " + pillBdr,
              color: accent,
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="hero-badge-dot" />
            Canada&rsquo;s Premier Tech Conference
          </div>

          {/* Logo */}
          <div className="hero-logo-wrap">
            <img
              src={dark
                ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
              alt="The Tech Festival Canada"
              style={{
                width: "100%",
                maxWidth: 520,
                height: "auto",
                objectFit: "contain",
                filter: dark
                  ? "drop-shadow(0 0 50px rgba(155,135,245,0.25))"
                  : "drop-shadow(0 10px 30px rgba(122,63,209,0.12))",
              }}
            />
          </div>

          {/* Animated headline */}
          <h1 className="hero-headline">
            {WORDS.map(function (word, i) {
              return (
                <span
                  key={i}
                  className="hero-word"
                  style={{
                    animationDelay: (0.9 + i * 0.18) + "s",
                    color: i === 0 ? textMain :
                           i === 1 ? accent :
                           "var(--brand-orange, #f5a623)",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </h1>

          {/* Decorative divider */}
          <div className="hero-divider-line" />

          {/* Sub */}
          <p className="hero-sub" style={{ color: textMid }}>
            Canada&rsquo;s first-of-its-kind deal-making platform — where innovators,
            buyers, investors, and policymakers turn emerging technology into
            real partnerships, pilots, and contracts. One day. One venue.
            Unlimited momentum.
          </p>

          {/* CTAs */}
          <div className="hero-ctas">
            <a href="/tickets" className="hero-cta-primary">
              Get Your Tickets
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/speakers"
              className="hero-cta-secondary"
              style={{ color: dark ? "rgba(200,185,255,0.85)" : "rgba(90,40,180,0.8)" }}
            >
              Partner With Us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>

          {/* Stat strip */}
          <div className="hero-stats-row">
            {stats.map(function (s) {
              return (
                <div className="hero-stat-cell" key={s.label}>
                  <span className="hero-stat-num">
                    {s.isText ? s.num : (
                      <AnimatedCounter target={s.num} suffix={s.suffix} duration={1800} />
                    )}
                  </span>
                  <span className="hero-stat-label">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Scroll cue */}
          <button
            onClick={scrollDown}
            className="hero-scroll-cue"
            style={{ color: dark ? "rgba(155,135,245,0.4)" : "rgba(122,63,209,0.38)" }}
          >
            <span>Discover More</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </div>

        <div className="hero-bottom-divider" />
        <div className="hero-bottom-fade" style={{
          background: "linear-gradient(to bottom, transparent, " + bg + ")",
        }} />
      </section>

      {/* ═══════════════════ PILLAR SHOWCASE (scroll-reveal) ═══════════════════ */}
      <section className="pillar-showcase" style={{ background: bg }}>
        <ScrollReveal
          rotateFrom={8}
          rotateTo={0}
          scaleFrom={0.92}
          scaleTo={1}
          translateFrom={40}
          translateTo={0}
        >
          <AnimatedGroup
            preset="blur-slide"
            stagger={100}
            delay={0}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2.5rem",
            }}
          >
            <p style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: textSoft,
            }}>
              Five Technology Pillars
            </p>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              maxWidth: 720,
            }}>
              {pillars.map(function (p, i) {
                var colors = [
                  { bg: "rgba(122,63,209,0.08)", border: "rgba(122,63,209,0.2)", color: accent },
                  { bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.2)", color: "#f5a623" },
                  { bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.2)", color: "#38bdf8" },
                  { bg: "rgba(34,211,238,0.08)", border: "rgba(34,211,238,0.2)", color: "#22d3ee" },
                  { bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)", color: "#4ade80" },
                ];
                var c = colors[i % colors.length];
                return (
                  <span
                    key={p}
                    className="pillar-tag"
                    style={{
                      background: c.bg,
                      border: "1px solid " + c.border,
                      color: c.color,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {p}
                  </span>
                );
              })}
            </div>

            <p style={{
              fontSize: "clamp(0.95rem, 1.4vw, 1.08rem)",
              lineHeight: 1.8,
              color: textMid,
              maxWidth: 560,
              textAlign: "center",
            }}>
              Each pillar features curated matchmaking, live demos, and
              investment-ready showcases designed to accelerate real business outcomes.
            </p>
          </AnimatedGroup>
        </ScrollReveal>
      </section>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <div id="about-section">
        <AboutUs onWriteToUs={function () { setInquiryOpen(true); }} />
      </div>

      <Footer />

      {/* ── Modals ── */}
      <InquiryModal isOpen={inquiryOpen} onClose={function () { setInquiryOpen(false); }} />
      <CookieConsent />
      <PostPurchaseModal
        isOpen={purchaseOpen}
        onClose={function () { setPurchaseOpen(false); }}
        ticketType={purchaseTicketType}
      />
      <OnboardingSurvey
        isOpen={surveyOpen}
        onClose={function () { setSurveyOpen(false); window.location.reload(); }}
        userName={surveyName}
      />
    </>
  );
}
