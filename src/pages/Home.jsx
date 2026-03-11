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
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════ */

var containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

var itemBlur = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 24,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 1.5,
    },
  },
};

var itemFade = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.25, duration: 1.2 },
  },
};

var itemSlow = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.2, duration: 1.8, delay: 0.1 },
  },
};

var scaleUp = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

/* ═══════════════════════════════════════════════════════
   HEADLINE WORDS
   ═══════════════════════════════════════════════════════ */
var WORDS = ["MEET", "BUILD", "SCALE"];

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER — counts up on scroll into view
   ═══════════════════════════════════════════════════════ */
function AnimatedCounter(props) {
  var target = props.target;
  var suffix = props.suffix || "";
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-50px" });
  var s = useState(0);
  var count = s[0];
  var setCount = s[1];
  var s2 = useState(false);
  var done = s2[0];
  var setDone = s2[1];

  useEffect(function () {
    if (!isInView || done) return;
    var num = parseInt(target);
    if (isNaN(num)) { setCount(target); setDone(true); return; }
    var steps = 35;
    var inc = num / steps;
    var step = 0;
    var t = setInterval(function () {
      step++;
      if (step >= steps) {
        setCount(num);
        setDone(true);
        clearInterval(t);
      } else {
        setCount(Math.round(inc * step));
      }
    }, 1400 / steps);
    return function () { clearInterval(t); };
  }, [isInView, done, target]);

  return (
    <span ref={ref}>
      {typeof count === "number" ? count + suffix : target}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   FLOATING PARTICLES (CSS-only, no canvas)
   ═══════════════════════════════════════════════════════ */
function FloatingParticles(props) {
  var dark = props.dark;
  var dots = [];
  for (var i = 0; i < 24; i++) {
    dots.push({
      id: i,
      left: (Math.sin(i * 2.39) * 0.5 + 0.5) * 100,
      top: (Math.cos(i * 1.73) * 0.5 + 0.5) * 100,
      size: 1.5 + (i % 5) * 0.6,
      delay: (i * 0.4) % 8,
      dur: 7 + (i % 6) * 2,
      opacity: 0.12 + (i % 4) * 0.08,
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
              background: dark
                ? "rgba(155,135,245," + d.opacity + ")"
                : "rgba(122,63,209," + d.opacity + ")",
              animation: "particle-drift " + d.dur + "s ease-in-out " + d.delay + "s infinite alternate",
            }}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PILLAR TAGS — scroll-revealed section
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
  var isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateX: 8, scale: 0.94, y: 50 }}
      animate={isInView ? { opacity: 1, rotateX: 0, scale: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 80, damping: 20, duration: 1.2 }}
      style={{
        perspective: "1200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        padding: "5rem 6% 4rem",
        textAlign: "center",
      }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{
          fontSize: "0.66rem",
          fontWeight: 700,
          letterSpacing: "2.2px",
          textTransform: "uppercase",
          color: dark ? "rgba(200,185,255,0.4)" : "rgba(90,40,180,0.4)",
        }}
      >
        Five Technology Pillars
      </motion.p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", maxWidth: 740 }}>
        {PILLARS.map(function (p, i) {
          return (
            <motion.span
              key={p.name}
              initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
              animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
              transition={{
                type: "spring",
                bounce: 0.3,
                duration: 1.2,
                delay: 0.35 + i * 0.09,
              }}
              whileHover={{ y: -3, scale: 1.04 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 26px",
                borderRadius: "14px",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.4px",
                background: "rgba(" + p.hue + ",0.08)",
                border: "1px solid rgba(" + p.hue + ",0.2)",
                color: "rgb(" + p.hue + ")",
                cursor: "default",
                transition: "box-shadow 0.3s ease",
              }}
            >
              {p.name}
            </motion.span>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.9 }}
        style={{
          fontSize: "clamp(0.95rem, 1.4vw, 1.08rem)",
          lineHeight: 1.82,
          color: dark ? "rgba(255,255,255,0.55)" : "rgba(13,5,32,0.58)",
          maxWidth: 560,
          textAlign: "center",
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

  /* ── parallax scroll ── */
  var heroRef = useRef(null);
  var scrollData = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  var scrollY = scrollData.scrollYProgress;
  var heroY = useTransform(scrollY, [0, 1], [0, -120]);
  var heroOpacity = useTransform(scrollY, [0, 0.6], [1, 0]);
  var heroScale = useTransform(scrollY, [0, 0.7], [1, 0.97]);

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

  /* ── theme tokens ── */
  var bg       = dark ? "#06020f"                  : "#ffffff";
  var textMain = dark ? "#ffffff"                  : "#0d0520";
  var textMid  = dark ? "rgba(255,255,255,0.55)"   : "rgba(13,5,32,0.58)";
  var textSoft = dark ? "rgba(200,185,255,0.45)"   : "rgba(90,40,180,0.42)";
  var accent   = dark ? "#b99eff"                   : "#7a3fd1";
  var pillBg   = dark ? "rgba(122,63,209,0.10)"     : "rgba(122,63,209,0.06)";
  var pillBdr  = dark ? "rgba(122,63,209,0.22)"     : "rgba(122,63,209,0.18)";
  var cardBg   = dark ? "rgba(155,135,245,0.04)"    : "rgba(122,63,209,0.025)";
  var cardBdr  = dark ? "rgba(155,135,245,0.12)"    : "rgba(122,63,209,0.12)";

  /* ── stat data ── */
  var stats = [
    { num: "500", suffix: "+", label: "Decision Makers" },
    { num: "5",   suffix: "",  label: "Tech Pillars" },
    { num: "Oct 28",           label: "2026", isText: true },
    { num: "The Carlu",        label: "Toronto, ON", isText: true },
  ];

  return (
    <>
      {/* ═══ GLOBAL STYLES ═══ */}
      <style>{`
        /* ── Particle float (no canvas) ── */
        @keyframes particle-drift {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(14px, -20px) scale(1.4); }
        }

        /* ── Glow pulse ── */
        @keyframes glow-breathe {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }

        /* ── Badge dot ── */
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.8); opacity: 0.4; }
        }

        /* ── Scroll cue ── */
        @keyframes scroll-nudge {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }

        /* ── Line draw ── */
        @keyframes line-draw {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* ── Mouse wheel pulse ── */
        @keyframes wheel-scroll {
          0%   { transform: translateY(0); opacity: 1; }
          50%  { transform: translateY(6px); opacity: 0.3; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* ── Grid overlay ── */
        .hero-grid {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image:
            linear-gradient(rgba(122,63,209,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,63,209,0.04) 1px, transparent 1px);
          background-size: 68px 68px;
          mask-image: radial-gradient(ellipse 80% 65% at 50% 35%, black 15%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 65% at 50% 35%, black 15%, transparent 100%);
        }

        /* ── Radial glow blobs ── */
        .hero-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: glow-breathe 7s ease-in-out infinite;
        }

        /* ── CTA hover states ── */
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
        .hero-cta-solid:hover {
          transform: translateY(-3px);
        }

        .hero-cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 32px; border-radius: 14px;
          font-size: 0.86rem; font-weight: 600;
          text-decoration: none; cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-cta-ghost:hover {
          transform: translateY(-2px);
        }

        /* ── Stat strip ── */
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
          transition: background 0.25s ease;
          cursor: default;
        }
        .hero-stat:last-child { border-right: none !important; }

        /* ── Navbar border override ── */
        .tfc-navbar-wrap { border-bottom: none !important; box-shadow: none !important; }

        /* ── Radial bottom arc (Doc 4 style) ── */
        .hero-arc {
          position: absolute;
          left: 50%; bottom: -2px;
          transform: translateX(-50%);
          border-radius: 100%;
          z-index: 3;
          pointer-events: none;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .hero-ctas-wrap { flex-direction: column !important; width: 100% !important; }
          .hero-cta-solid, .hero-cta-ghost { width: 100% !important; justify-content: center !important; }
          .hero-sub { text-align: left !important; }
          .hero-stat { padding: 14px 18px !important; }
          .hero-stats { border-radius: 16px !important; }
        }
      `}</style>

      <UrgencyBanner />
      <Navbar />

      {/* ════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          overflow: "hidden",
          background: bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Grid overlay */}
        <div className="hero-grid" />

        {/* Floating particles */}
        <FloatingParticles dark={dark} />

        {/* Ambient glow — purple top-left */}
        <div className="hero-glow" style={{
          width: 720, height: 720,
          background: dark
            ? "radial-gradient(circle, rgba(122,63,209,0.22) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(122,63,209,0.10) 0%, transparent 70%)",
          top: -270, left: -220,
          filter: "blur(90px)",
        }} />
        {/* Warm glow — orange top-right */}
        <div className="hero-glow" style={{
          width: 520, height: 520,
          background: dark
            ? "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)",
          top: -170, right: -200,
          filter: "blur(100px)",
          animationDelay: "2.5s",
        }} />
        {/* Cool glow — bottom */}
        <div className="hero-glow" style={{
          width: 550, height: 380,
          background: dark
            ? "radial-gradient(circle, rgba(155,135,245,0.10) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(155,135,245,0.06) 0%, transparent 70%)",
          bottom: -90, left: "28%",
          filter: "blur(110px)",
          animationDelay: "4.5s",
        }} />

        {/* ── PARALLAX-WRAPPED CONTENT ── */}
        <motion.div
          style={{
            y: heroY,
            opacity: heroOpacity,
            scale: heroScale,
            position: "relative",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "clamp(6rem, 10vw, 9rem) 6% clamp(4rem, 7vw, 6rem)",
            maxWidth: 920,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* ── STAGGER CONTAINER ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Eyebrow badge */}
            <motion.div
              variants={itemBlur}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 22px",
                borderRadius: 999,
                background: pillBg,
                border: "1px solid " + pillBdr,
                color: accent,
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "1.8px",
                textTransform: "uppercase",
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
            <motion.div variants={itemBlur} style={{ marginBottom: "1.6rem" }}>
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
                    ? "drop-shadow(0 0 50px rgba(155,135,245,0.22))"
                    : "drop-shadow(0 10px 28px rgba(122,63,209,0.12))",
                }}
              />
            </motion.div>

            {/* Headline: MEET · BUILD · SCALE */}
            <motion.h1
              variants={itemFade}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(2.3rem, 5.5vw, 4.4rem)",
                fontWeight: 900,
                lineHeight: 1.08,
                marginBottom: "0.4rem",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.55rem",
                letterSpacing: "-0.5px",
              }}
            >
              {WORDS.map(function (word, i) {
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 28, scale: 0.92, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{
                      type: "spring",
                      bounce: 0.35,
                      duration: 1.4,
                      delay: 0.7 + i * 0.16,
                    }}
                    style={{
                      display: "inline-block",
                      background: i === 0
                        ? "linear-gradient(135deg, " + (dark ? "#fff" : "#0d0520") + " 30%, " + accent + ")"
                        : i === 1
                        ? "linear-gradient(135deg, " + accent + ", #9b57e8)"
                        : "linear-gradient(135deg, var(--brand-orange, #f5a623), #f7c15e)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {word}
                  </motion.span>
                );
              })}

              {/* Interpunct separators */}
              <style>{`
                .hero-headline-dots {
                  display: flex; align-items: center; gap: 0.55rem;
                }
              `}</style>
            </motion.h1>

            {/* Decorative divider */}
            <motion.div
              variants={itemFade}
              style={{
                width: 80,
                height: 2,
                borderRadius: 2,
                background: "linear-gradient(90deg, " + accent + ", var(--brand-orange, #f5a623))",
                margin: "1.2rem auto 1.8rem",
                transformOrigin: "center",
              }}
            />

            {/* Subtitle */}
            <motion.p
              variants={itemSlow}
              className="hero-sub"
              style={{
                fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
                lineHeight: 1.85,
                fontWeight: 400,
                maxWidth: 600,
                color: textMid,
                textAlign: "justify",
                hyphens: "auto",
                marginBottom: "2.6rem",
              }}
            >
              Canada's first-of-its-kind deal-making platform — where innovators,
              buyers, investors, and policymakers turn emerging technology into
              real partnerships, pilots, and contracts. One day. One venue.
              Unlimited momentum.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemFade}
              className="hero-ctas-wrap"
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {/* Solid CTA */}
              <motion.a
                href="/tickets"
                className="hero-cta-solid"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: dark ? textMain : "#0d0520",
                  color: dark ? "#0d0520" : "#ffffff",
                  boxShadow: dark
                    ? "0 6px 28px rgba(155,135,245,0.2), 0 2px 8px rgba(0,0,0,0.2)"
                    : "0 6px 28px rgba(13,5,32,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                }}
                onMouseEnter={function (e) {
                  e.currentTarget.style.background = "linear-gradient(135deg, #7a3fd1, #f5a623)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={function (e) {
                  e.currentTarget.style.background = dark ? textMain : "#0d0520";
                  e.currentTarget.style.color = dark ? "#0d0520" : "#ffffff";
                }}
              >
                Get Your Tickets
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>

              {/* Ghost CTA */}
              <motion.a
                href="/speakers"
                className="hero-cta-ghost"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  border: "1.5px solid " + (dark ? "rgba(155,135,245,0.28)" : "rgba(122,63,209,0.25)"),
                  color: dark ? "rgba(200,185,255,0.85)" : "rgba(90,40,180,0.8)",
                  background: "transparent",
                  borderRadius: 14,
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
              variants={scaleUp}
              className="hero-stats"
              style={{
                marginTop: "3.5rem",
                border: "1px solid " + cardBdr,
              }}
            >
              {stats.map(function (s) {
                return (
                  <div
                    className="hero-stat"
                    key={s.label}
                    style={{
                      background: cardBg,
                      borderRight: "1px solid " + cardBdr,
                    }}
                    onMouseEnter={function (e) {
                      e.currentTarget.style.background = dark
                        ? "rgba(155,135,245,0.09)"
                        : "rgba(122,63,209,0.07)";
                    }}
                    onMouseLeave={function (e) {
                      e.currentTarget.style.background = cardBg;
                    }}
                  >
                    <span style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: 900,
                      fontSize: "1.08rem",
                      background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: 4,
                    }}>
                      {s.isText ? s.num : (
                        <AnimatedCounter target={s.num} suffix={s.suffix} />
                      )}
                    </span>
                    <span style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: textSoft,
                    }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            {/* Scroll cue — animated mouse wheel */}
            <motion.button
              variants={itemSlow}
              onClick={scrollDown}
              whileHover={{ scale: 1.08 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                marginTop: "3rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                color: dark ? "rgba(155,135,245,0.38)" : "rgba(122,63,209,0.35)",
              }}
            >
              <svg
                width="22" height="34" viewBox="0 0 22 34" fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1" y="1" width="20" height="32" rx="10"
                  stroke="currentColor" strokeWidth="1.5" />
                <circle cx="11" cy="10" r="2" fill="currentColor"
                  style={{ animation: "wheel-scroll 2s ease infinite" }} />
              </svg>
              <span style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "1.6px",
                textTransform: "uppercase",
              }}>
                Scroll
              </span>
            </motion.button>

          </motion.div>
        </motion.div>

        {/* ── Radial bottom arc (Doc 4 style) ── */}
        <div
          className="hero-arc"
          style={{
            width: "140%",
            maxWidth: 1400,
            height: 180,
            background: bg,
            bottom: -90,
          }}
        />

        {/* Bottom divider line */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 1,
          zIndex: 4,
          background: "linear-gradient(90deg, transparent 0%, rgba(122,63,209,0.2) 30%, rgba(245,166,35,0.12) 70%, transparent 100%)",
        }} />

        {/* Bottom fade */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 100,
          zIndex: 4,
          background: "linear-gradient(to bottom, transparent, " + bg + ")",
          pointerEvents: "none",
        }} />
      </section>

      {/* ════════════════════════════════════════════
          PILLAR SHOWCASE — scroll-revealed section
          ════════════════════════════════════════════ */}
      <section style={{ background: bg }}>
        <PillarShowcase dark={dark} />
      </section>

      {/* ════════════════════════════════════════════
          ABOUT / FOOTER / MODALS
          ════════════════════════════════════════════ */}
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
