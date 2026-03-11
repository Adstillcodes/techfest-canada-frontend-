import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import AboutUs from "../components/AboutUs";
import { useEffect, useState, useRef } from "react";
import InquiryModal from "../components/InquiryModal";
import CookieConsent from "../components/CookieConsent";
import PostPurchaseModal from "../components/PostPurchaseModal";
import OnboardingSurvey from "../components/OnboardingSurvey";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════
   STAGGER VARIANTS
   ═══════════════════════════════════════════════════════ */
var container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.25,
    },
  },
};

var blurSlide = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 22 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { type: "spring", bounce: 0.3, duration: 1.4 },
  },
};

var gentleFade = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.2, duration: 1.6 },
  },
};

var slowReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.15, duration: 2, delay: 0.05 },
  },
};

/* ═══════════════════════════════════════════════════════
   HEADLINE WORDS
   ═══════════════════════════════════════════════════════ */
var WORDS = ["MEET", "BUILD", "SCALE"];

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════ */
function AnimatedCounter(props) {
  var target = props.target;
  var suffix = props.suffix || "";
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-40px" });
  var s = useState(0); var count = s[0]; var setCount = s[1];
  var s2 = useState(false); var done = s2[0]; var setDone = s2[1];

  useEffect(function () {
    if (!inView || done) return;
    var num = parseInt(target);
    if (isNaN(num)) { setCount(target); setDone(true); return; }
    var steps = 30;
    var step = 0;
    var t = setInterval(function () {
      step++;
      if (step >= steps) {
        setCount(num); setDone(true); clearInterval(t);
      } else {
        setCount(Math.round((num / steps) * step));
      }
    }, 40);
    return function () { clearInterval(t); };
  }, [inView, done, target]);

  return <span ref={ref}>{typeof count === "number" ? count + suffix : target}</span>;
}

/* ═══════════════════════════════════════════════════════
   SVG ANIMATED WAVES (no canvas)
   ═══════════════════════════════════════════════════════ */
function AnimatedWaves(props) {
  var dark = props.dark;
  var layers = [
    { opacity: dark ? 0.08 : 0.05, speed: "32s", dy: 0,  color: dark ? "155,135,245" : "122,63,209" },
    { opacity: dark ? 0.06 : 0.04, speed: "26s", dy: 20, color: dark ? "122,63,209" : "155,135,245" },
    { opacity: dark ? 0.05 : 0.035, speed: "20s", dy: 40, color: dark ? "245,166,35" : "245,166,35" },
    { opacity: dark ? 0.04 : 0.025, speed: "36s", dy: 10, color: dark ? "192,132,252" : "192,132,252" },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 1,
      overflow: "hidden", pointerEvents: "none",
    }}>
      {layers.map(function (l, i) {
        return (
          <svg
            key={i}
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              bottom: l.dy,
              left: "-5%",
              width: "110%",
              height: "45%",
              opacity: l.opacity,
              animation: "wave-drift-" + (i % 2 === 0 ? "left" : "right") + " " + l.speed + " linear infinite",
            }}
          >
            <path
              d={i % 2 === 0
                ? "M0,160 C180,80 360,260 540,160 C720,60 900,240 1080,160 C1260,80 1350,200 1440,160 L1440,320 L0,320 Z"
                : "M0,200 C160,120 320,280 480,180 C640,80 800,260 960,180 C1120,100 1280,240 1440,180 L1440,320 L0,320 Z"
              }
              fill={"rgba(" + l.color + ",1)"}
            />
          </svg>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FLOATING PARTICLES (CSS only)
   ═══════════════════════════════════════════════════════ */
function Particles(props) {
  var dark = props.dark;
  var dots = [];
  for (var i = 0; i < 20; i++) {
    dots.push({
      id: i,
      left: (Math.sin(i * 2.39) * 0.5 + 0.5) * 100,
      top: (Math.cos(i * 1.73) * 0.5 + 0.5) * 100,
      size: 1.5 + (i % 4) * 0.7,
      delay: (i * 0.5) % 7,
      dur: 8 + (i % 5) * 2.5,
      o: 0.12 + (i % 3) * 0.09,
    });
  }
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden", pointerEvents: "none" }}>
      {dots.map(function (d) {
        return (
          <span
            key={d.id}
            style={{
              position: "absolute",
              left: d.left + "%",
              top: d.top + "%",
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: dark ? "rgba(155,135,245," + d.o + ")" : "rgba(122,63,209," + d.o + ")",
              animation: "particle-float " + d.dur + "s ease-in-out " + d.delay + "s infinite alternate",
            }}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PILLAR SHOWCASE
   ═══════════════════════════════════════════════════════ */
var PILLARS = [
  { name: "Artificial Intelligence", hue: "122,63,209" },
  { name: "Cybersecurity",           hue: "245,166,35" },
  { name: "Cloud & SaaS",            hue: "56,189,248" },
  { name: "Fintech",                 hue: "34,211,238" },
  { name: "GreenTech",               hue: "74,222,128" },
];

function PillarShowcase(props) {
  var dark = props.dark;
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-60px" });

  var textSoft = dark ? "rgba(200,185,255,0.4)" : "rgba(90,40,180,0.4)";
  var textMid  = dark ? "rgba(255,255,255,0.55)" : "rgba(13,5,32,0.58)";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 70, damping: 20, duration: 1.4 }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "2rem", padding: "5rem 6% 4rem", textAlign: "center",
      }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.15, duration: 0.8 }}
        style={{
          fontSize: "0.66rem", fontWeight: 700,
          letterSpacing: "2.2px", textTransform: "uppercase",
          color: textSoft,
        }}
      >
        Five Technology Pillars
      </motion.p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", maxWidth: 740 }}>
        {PILLARS.map(function (p, i) {
          return (
            <motion.span
              key={p.name}
              initial={{ opacity: 0, filter: "blur(8px)", y: 14 }}
              animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
              transition={{ type: "spring", bounce: 0.3, duration: 1.2, delay: 0.3 + i * 0.08 }}
              whileHover={{ y: -3, scale: 1.04 }}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "12px 26px", borderRadius: "14px",
                fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.4px",
                background: "rgba(" + p.hue + ",0.08)",
                border: "1px solid rgba(" + p.hue + ",0.2)",
                color: "rgb(" + p.hue + ")",
                cursor: "default",
              }}
            >
              {p.name}
            </motion.span>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7, duration: 0.9 }}
        style={{
          fontSize: "clamp(0.95rem, 1.4vw, 1.08rem)",
          lineHeight: 1.82, color: textMid, maxWidth: 560, textAlign: "center",
        }}
      >
        Each pillar features curated matchmaking, live demos, and
        investment-ready showcases designed to accelerate real business outcomes.
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  var s1  = useState(false);  var inquiryOpen = s1[0];         var setInquiryOpen = s1[1];
  var s2  = useState(false);  var surveyOpen = s2[0];          var setSurveyOpen = s2[1];
  var s3  = useState("");     var surveyName = s3[0];          var setSurveyName = s3[1];
  var s4  = useState(false);  var purchaseOpen = s4[0];        var setPurchaseOpen = s4[1];
  var s5  = useState("");     var purchaseTicketType = s5[0];  var setPurchaseTicketType = s5[1];
  var s6  = useState(false);  var dark = s6[0];                var setDark = s6[1];

  /* ── gentle parallax — only drifts 60px, fades late ── */
  var heroRef = useRef(null);
  var sd = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  var heroY       = useTransform(sd.scrollYProgress, [0, 1], [0, -60]);
  var heroOpacity = useTransform(sd.scrollYProgress, [0, 0.85], [1, 0]);

  /* ── dark mode observer ── */
  useEffect(function () {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () {
      setDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
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

  /* ── tokens ── */
  var bg       = dark ? "#06020f"                  : "#ffffff";
  var textMain = dark ? "#ffffff"                  : "#0d0520";
  var textMid  = dark ? "rgba(255,255,255,0.55)"   : "rgba(13,5,32,0.58)";
  var textSoft = dark ? "rgba(200,185,255,0.45)"   : "rgba(90,40,180,0.42)";
  var accent   = dark ? "#b99eff"                   : "#7a3fd1";
  var pillBg   = dark ? "rgba(122,63,209,0.10)"     : "rgba(122,63,209,0.06)";
  var pillBdr  = dark ? "rgba(122,63,209,0.22)"     : "rgba(122,63,209,0.18)";
  var cardBg   = dark ? "rgba(155,135,245,0.04)"    : "rgba(122,63,209,0.025)";
  var cardBdr  = dark ? "rgba(155,135,245,0.12)"    : "rgba(122,63,209,0.12)";

  /* solid word colors — no background-clip hacks */
  var wordColors = [
    textMain,
    accent,
    "var(--brand-orange, #f5a623)",
  ];

  var stats = [
    { num: "500", suffix: "+", label: "Decision Makers" },
    { num: "5",   suffix: "",  label: "Tech Pillars" },
    { num: "Oct 28",           label: "2026", isText: true },
    { num: "The Carlu",        label: "Toronto, ON", isText: true },
  ];

  return (
    <>
      <style>{`
        /* ── Wave animations ── */
        @keyframes wave-drift-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-15%); }
        }
        @keyframes wave-drift-right {
          0%   { transform: translateX(0); }
          100% { transform: translateX(15%); }
        }

        /* ── Particles ── */
        @keyframes particle-float {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(12px, -18px) scale(1.35); }
        }

        /* ── Glow breathe ── */
        @keyframes glow-breathe {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }

        /* ── Badge dot ── */
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.7); opacity: 0.4; }
        }

        /* ── Mouse wheel ── */
        @keyframes wheel-bob {
          0%   { transform: translateY(0); opacity: 1; }
          50%  { transform: translateY(5px); opacity: 0.3; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* ── Grid ── */
        .hero-grid {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image:
            linear-gradient(rgba(122,63,209,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,63,209,0.04) 1px, transparent 1px);
          background-size: 68px 68px;
          mask-image: radial-gradient(ellipse 80% 65% at 50% 35%, black 15%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 65% at 50% 35%, black 15%, transparent 100%);
        }

        /* ── Glow blobs ── */
        .hero-glow {
          position: absolute; border-radius: 50%;
          pointer-events: none; z-index: 1;
          animation: glow-breathe 7s ease-in-out infinite;
        }

        /* ── CTA solid ── */
        .hero-cta-solid {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px; border-radius: 14px;
          border: none; cursor: pointer; text-decoration: none;
          font-family: 'Orbitron', sans-serif;
          font-weight: 800; font-size: 0.76rem;
          letter-spacing: 1.2px; text-transform: uppercase;
          transition: transform 0.25s ease, box-shadow 0.35s ease;
        }
        .hero-cta-solid:hover { transform: translateY(-3px); }

        /* ── CTA ghost ── */
        .hero-cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 32px; border-radius: 14px;
          font-size: 0.86rem; font-weight: 600;
          text-decoration: none; cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-cta-ghost:hover { transform: translateY(-2px); }

        /* ── Stat bar ── */
        .hero-stats {
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 1px;
          border-radius: 20px; overflow: hidden;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .hero-stat {
          display: flex; flex-direction: column; align-items: center;
          padding: 20px 34px; flex: 1; min-width: 135px;
          transition: background 0.25s ease; cursor: default;
        }
        .hero-stat:last-child { border-right: none !important; }

        /* ── Kill navbar border on hero ── */
        .tfc-navbar-wrap { border-bottom: none !important; box-shadow: none !important; }

        /* ── Bottom arc ── */
        .hero-arc {
          position: absolute; border-radius: 100%;
          z-index: 3; pointer-events: none;
          left: 50%; transform: translateX(-50%);
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .hero-ctas-row { flex-direction: column !important; width: 100% !important; }
          .hero-cta-solid, .hero-cta-ghost { width: 100% !important; justify-content: center !important; }
          .hero-sub-text { text-align: left !important; }
          .hero-stat { padding: 14px 18px !important; }
          .hero-stats { border-radius: 16px !important; }
        }
      `}</style>

      <UrgencyBanner />
      <Navbar />

      {/* ════════════════════ HERO ════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: "relative", overflow: "hidden",
          background: bg,
          minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {/* SVG waves */}
        <AnimatedWaves dark={dark} />

        {/* Grid */}
        <div className="hero-grid" />

        {/* Particles */}
        <Particles dark={dark} />

        {/* Glows */}
        <div className="hero-glow" style={{
          width: 700, height: 700,
          background: dark
            ? "radial-gradient(circle, rgba(122,63,209,0.22) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(122,63,209,0.10) 0%, transparent 70%)",
          top: -260, left: -200, filter: "blur(90px)",
        }} />
        <div className="hero-glow" style={{
          width: 500, height: 500,
          background: dark
            ? "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)",
          top: -160, right: -180, filter: "blur(100px)", animationDelay: "2.5s",
        }} />
        <div className="hero-glow" style={{
          width: 500, height: 350,
          background: dark
            ? "radial-gradient(circle, rgba(155,135,245,0.10) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(155,135,245,0.06) 0%, transparent 70%)",
          bottom: -80, left: "28%", filter: "blur(110px)", animationDelay: "4s",
        }} />

        {/* ── PARALLAX CONTENT ── */}
        <motion.div
          style={{
            y: heroY,
            opacity: heroOpacity,
            position: "relative", zIndex: 5,
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center",
            padding: "clamp(6rem, 10vw, 9rem) 6% clamp(4rem, 7vw, 6rem)",
            maxWidth: 920, margin: "0 auto", width: "100%",
          }}
        >
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
          >
            {/* Badge */}
            <motion.div
              variants={blurSlide}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "8px 22px", borderRadius: 999,
                background: pillBg, border: "1px solid " + pillBdr,
                color: accent,
                fontSize: "0.7rem", fontWeight: 700,
                letterSpacing: "1.8px", textTransform: "uppercase",
                marginBottom: "2rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--brand-orange, #f5a623)",
                boxShadow: "0 0 10px var(--brand-orange, #f5a623)",
                animation: "dot-pulse 2.2s ease infinite",
              }} />
              Canada's Premier Tech Conference
            </motion.div>

            {/* Logo */}
            <motion.div variants={blurSlide} style={{ marginBottom: "1.6rem" }}>
              <img
                src={dark
                  ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                  : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
                alt="The Tech Festival Canada"
                style={{
                  width: "100%", maxWidth: 520, height: "auto",
                  objectFit: "contain",
                  filter: dark
                    ? "drop-shadow(0 0 50px rgba(155,135,245,0.22))"
                    : "drop-shadow(0 10px 28px rgba(122,63,209,0.12))",
                }}
              />
            </motion.div>

            {/* ── HEADLINE ── */}
            <motion.h1
              variants={gentleFade}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(2.3rem, 5.5vw, 4.4rem)",
                fontWeight: 900, lineHeight: 1.08,
                marginBottom: "0.3rem",
                display: "flex", flexWrap: "wrap",
                justifyContent: "center", gap: "0.5rem",
                letterSpacing: "-0.5px",
              }}
            >
              {WORDS.map(function (word, i) {
                var sep = i < WORDS.length - 1;
                return (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    <motion.span
                      initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        type: "spring", bounce: 0.35,
                        duration: 1.3, delay: 0.65 + i * 0.15,
                      }}
                      style={{ display: "inline-block", color: wordColors[i] }}
                    >
                      {word}
                    </motion.span>
                    {sep && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.2, scale: 1 }}
                        transition={{ delay: 0.9 + i * 0.15, duration: 0.4 }}
                        style={{
                          display: "inline-block", color: accent,
                          fontWeight: 300, fontSize: "0.5em", lineHeight: 1,
                        }}
                      >
                        ·
                      </motion.span>
                    )}
                  </span>
                );
              })}
            </motion.h1>

            {/* Divider */}
            <motion.div
              variants={gentleFade}
              style={{
                width: 80, height: 2, borderRadius: 2,
                background: "linear-gradient(90deg, " + accent + ", var(--brand-orange, #f5a623))",
                margin: "1.2rem auto 1.8rem",
              }}
            />

            {/* Subtitle */}
            <motion.p
              variants={slowReveal}
              className="hero-sub-text"
              style={{
                fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
                lineHeight: 1.85, fontWeight: 400,
                maxWidth: 600, color: textMid,
                textAlign: "justify", hyphens: "auto",
                marginBottom: "2.6rem",
              }}
            >
              Canada's first-of-its-kind deal-making platform — where innovators,
              buyers, investors, and policymakers turn emerging technology into
              real partnerships, pilots, and contracts. One day. One venue.
              Unlimited momentum.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={gentleFade}
              className="hero-ctas-row"
              style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}
            >
              <motion.a
                href="/tickets"
                className="hero-cta-solid"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: dark ? textMain : "#0d0520",
                  color: dark ? "#0d0520" : "#ffffff",
                  boxShadow: dark
                    ? "0 6px 28px rgba(155,135,245,0.2)"
                    : "0 6px 28px rgba(13,5,32,0.18)",
                }}
                onMouseEnter={function (e) {
                  e.currentTarget.style.background = "linear-gradient(135deg, #7a3fd1, #f5a623)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={function (e) {
                  e.currentTarget.style.background = dark ? "#ffffff" : "#0d0520";
                  e.currentTarget.style.color = dark ? "#0d0520" : "#ffffff";
                }}
              >
                Get Your Tickets
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>

              <motion.a
                href="/speakers"
                className="hero-cta-ghost"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  border: "1.5px solid " + (dark ? "rgba(155,135,245,0.28)" : "rgba(122,63,209,0.25)"),
                  color: dark ? "rgba(200,185,255,0.85)" : "rgba(90,40,180,0.8)",
                  background: "transparent", borderRadius: 14,
                }}
                onMouseEnter={function (e) {
                  e.currentTarget.style.borderColor = dark ? "rgba(155,135,245,0.55)" : "rgba(122,63,209,0.55)";
                  e.currentTarget.style.background = dark ? "rgba(155,135,245,0.07)" : "rgba(122,63,209,0.06)";
                }}
                onMouseLeave={function (e) {
                  e.currentTarget.style.borderColor = dark ? "rgba(155,135,245,0.28)" : "rgba(122,63,209,0.25)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Partner With Us
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </motion.a>
            </motion.div>

            {/* Stat strip */}
            <motion.div
              variants={slowReveal}
              className="hero-stats"
              style={{ marginTop: "3.5rem", border: "1px solid " + cardBdr }}
            >
              {stats.map(function (s) {
                return (
                  <div
                    className="hero-stat"
                    key={s.label}
                    style={{ background: cardBg, borderRight: "1px solid " + cardBdr }}
                    onMouseEnter={function (e) {
                      e.currentTarget.style.background = dark ? "rgba(155,135,245,0.09)" : "rgba(122,63,209,0.07)";
                    }}
                    onMouseLeave={function (e) {
                      e.currentTarget.style.background = cardBg;
                    }}
                  >
                    <span style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: 900, fontSize: "1.08rem",
                      background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: 4,
                    }}>
                      {s.isText ? s.num : <AnimatedCounter target={s.num} suffix={s.suffix} />}
                    </span>
                    <span style={{
                      fontSize: "0.6rem", fontWeight: 700,
                      letterSpacing: "1px", textTransform: "uppercase",
                      color: textSoft,
                    }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            {/* Scroll cue */}
            <motion.button
              variants={slowReveal}
              onClick={scrollDown}
              whileHover={{ scale: 1.08 }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 8, marginTop: "3rem",
                border: "none", background: "none", cursor: "pointer",
                color: dark ? "rgba(155,135,245,0.38)" : "rgba(122,63,209,0.35)",
              }}
            >
              <svg width="22" height="34" viewBox="0 0 22 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="11" cy="10" r="2" fill="currentColor" style={{ animation: "wheel-bob 2s ease infinite" }} />
              </svg>
              <span style={{
                fontSize: "0.58rem", fontWeight: 700,
                letterSpacing: "1.6px", textTransform: "uppercase",
              }}>Scroll</span>
            </motion.button>

          </motion.div>
        </motion.div>

        {/* Bottom arc */}
        <div className="hero-arc" style={{ width: "140%", maxWidth: 1400, height: 180, background: bg, bottom: -90 }} />

        {/* Bottom line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1, zIndex: 4,
          background: "linear-gradient(90deg, transparent 0%, rgba(122,63,209,0.2) 30%, rgba(245,166,35,0.12) 70%, transparent 100%)",
        }} />

        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 100, zIndex: 4,
          background: "linear-gradient(to bottom, transparent, " + bg + ")",
          pointerEvents: "none",
        }} />
      </section>

      {/* ════════════════════ PILLARS ════════════════════ */}
      <section style={{ background: bg }}>
        <PillarShowcase dark={dark} />
      </section>

      {/* ════════════════════ ABOUT / FOOTER / MODALS ════════════════════ */}
      <div id="about-section">
        <AboutUs onWriteToUs={function () { setInquiryOpen(true); }} />
      </div>

      <Footer />

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
