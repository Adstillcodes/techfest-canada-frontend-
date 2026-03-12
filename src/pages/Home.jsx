import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import AboutUs from "../components/AboutUs";
import { useEffect, useState, useRef } from "react";
import InquiryModal from "../components/InquiryModal";
import CookieConsent from "../components/CookieConsent";
import PostPurchaseModal from "../components/PostPurchaseModal";
import OnboardingSurvey from "../components/OnboardingSurvey";
import { motion, useInView } from "framer-motion";
 
/* ═══════════════════════════════════════════════════════
   STAGGER VARIANTS
   ═══════════════════════════════════════════════════════ */
 
var containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.3 },
  },
};
 
var itemBlur = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 22 },
  visible: {
    opacity: 1, filter: "blur(0px)", y: 0,
    transition: { type: "spring", bounce: 0.3, duration: 1.5 },
  },
};
 
var itemSlow = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring", bounce: 0.2, duration: 1.8, delay: 0.08 },
  },
};
 
/* ═══════════════════════════════════════════════════════
   SCROLL-TRIGGERED TEXT REVEAL (dev21 TextEffect)
   Word-by-word blur + slide + scale
   ═══════════════════════════════════════════════════════ */
 
function TextReveal(props) {
  var text = props.text;
  var colors = props.colors || [];
  var style = props.style || {};
  var delay = props.delay || 0;
 
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-60px" });
 
  var words = text.split(" ");
 
  return (
    <motion.h2
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.14, delayChildren: delay },
        },
      }}
      style={{
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center",
        gap: "0.4em",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {words.map(function (word, i) {
        return (
          <motion.span
            key={i}
            variants={{
              hidden: {
                opacity: 0,
                y: 50,
                filter: "blur(16px)",
                scale: 0.8,
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                scale: 1,
                transition: {
                  type: "spring",
                  damping: 14,
                  stiffness: 100,
                  duration: 1,
                },
              },
            }}
            style={{
              display: "inline-block",
              color: colors[i] || "inherit",
              willChange: "transform, opacity, filter",
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.h2>
  );
}
 
/* ═══════════════════════════════════════════════════════
   KEYWORD MARQUEE — infinite CSS scroll
   ═══════════════════════════════════════════════════════ */
 
var KEYWORDS_A = [
  "ARTIFICIAL INTELLIGENCE", "FINTECH", "BLOCKCHAIN", "CYBERSECURITY",
  "CLOUD", "HEALTHCARE", "DEEP TECH", "SaaS", "QUANTUM", "ROBOTICS",
];
 
var KEYWORDS_B = [
  "MACHINE LEARNING", "WEB3", "BIOTECH", "ENTERPRISE", "IoT",
  "CLEAN ENERGY", "EDGE COMPUTING", "AUTONOMOUS", "AR / VR", "SPACE TECH",
];
 
function KeywordMarquee(props) {
  var words = props.words;
  var direction = props.direction || "left";
  var speed = props.speed || 45;
  var dark = props.dark;
  var doubled = words.concat(words);
  var animName = direction === "left" ? "marquee-left" : "marquee-right";
 
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap", width: "100%", pointerEvents: "none" }}>
      <div style={{
        display: "inline-flex",
        gap: "3rem",
        animation: animName + " " + speed + "s linear infinite",
        willChange: "transform",
      }}>
        {doubled.map(function (w, i) {
          return (
            <span key={i} style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "3.5px",
              color: dark ? "rgba(155,135,245,0.07)" : "rgba(122,63,209,0.06)",
              textTransform: "uppercase",
              flexShrink: 0,
            }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════ */
 
function AnimatedCounter(props) {
  var target = props.target;
  var suffix = props.suffix || "";
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-50px" });
  var s = useState(0);  var count = s[0]; var setCount = s[1];
  var s2 = useState(false); var done = s2[0]; var setDone = s2[1];
 
  useEffect(function () {
    if (!isInView || done) return;
    var num = parseInt(target);
    if (isNaN(num)) { setCount(target); setDone(true); return; }
    var steps = 35;
    var inc = num / steps;
    var step = 0;
    var t = setInterval(function () {
      step++;
      if (step >= steps) { setCount(num); setDone(true); clearInterval(t); }
      else { setCount(Math.round(inc * step)); }
    }, 1400 / steps);
    return function () { clearInterval(t); };
  }, [isInView, done, target]);
 
  return <span ref={ref}>{typeof count === "number" ? count + suffix : target}</span>;
}
 
/* ═══════════════════════════════════════════════════════
   SCROLL-TRIGGERED SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */
 
function DividerReveal(props) {
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
      style={{
        width: 80, height: 2, borderRadius: 2,
        background: "linear-gradient(90deg, " + props.accent + ", var(--brand-orange, #f5a623))",
        margin: "1.4rem auto 2.2rem",
        transformOrigin: "center",
      }}
    />
  );
}
 
function SubtitleReveal(props) {
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", bounce: 0.2, duration: 1.4, delay: 0.5 }}
      className="hero-sub"
      style={{
        fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
        lineHeight: 1.85, fontWeight: 400, maxWidth: 600,
        color: props.textMid,
        textAlign: "justify", hyphens: "auto",
        marginBottom: "2.6rem",
      }}
    >
      Canada's first-of-its-kind, deal-making platform where
      innovators, buyers, and policymakers turn emerging tech into real partnerships,
      pilots, and contracts, not just conversations. Expect a never-seen-before concentration of
      senior decision-makers from enterprise and critical sectors, alongside government,
      associations, media, and leading research institutions.
    </motion.p>
  );
}
 
function CTAReveal(props) {
  var dark = props.dark;
  var textMain = props.textMain;
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", bounce: 0.2, duration: 1.2, delay: 0.6 }}
      className="hero-ctas-wrap"
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
            ? "0 6px 28px rgba(155,135,245,0.2), 0 2px 8px rgba(0,0,0,0.2)"
            : "0 6px 28px rgba(13,5,32,0.18), 0 2px 8px rgba(0,0,0,0.08)",
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
        href="/sponsors"
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
  );
}
 
function StatsReveal(props) {
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.7 }}
      className="hero-stats"
      style={{ marginTop: "3.5rem", border: "1px solid " + props.cardBdr }}
    >
      {props.stats.map(function (s) {
        return (
          <div
            className="hero-stat"
            key={s.label}
            style={{ background: props.cardBg, borderRight: "1px solid " + props.cardBdr }}
            onMouseEnter={function (e) {
              e.currentTarget.style.background = props.dark ? "rgba(155,135,245,0.09)" : "rgba(122,63,209,0.07)";
            }}
            onMouseLeave={function (e) { e.currentTarget.style.background = props.cardBg; }}
          >
            <span style={{
              fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "1.08rem",
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", marginBottom: 4,
            }}>
              {s.isText ? s.num : <AnimatedCounter target={s.num} suffix={s.suffix} />}
            </span>
            <span style={{
              fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1px",
              textTransform: "uppercase", color: props.textSoft,
            }}>{s.label}</span>
          </div>
        );
      })}
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
 
  useEffect(function () {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () {
      setDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);
 
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
    var el = document.getElementById("hero-lower");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
 
  var bg       = dark ? "#06020f"                  : "#ffffff";
  var textMain = dark ? "#ffffff"                  : "#0d0520";
  var textMid  = dark ? "rgba(255,255,255,0.55)"   : "rgba(13,5,32,0.58)";
  var textSoft = dark ? "rgba(200,185,255,0.45)"   : "rgba(90,40,180,0.42)";
  var accent   = dark ? "#b99eff"                   : "#7a3fd1";
  var cardBg   = dark ? "rgba(155,135,245,0.04)"    : "rgba(122,63,209,0.025)";
  var cardBdr  = dark ? "rgba(155,135,245,0.12)"    : "rgba(122,63,209,0.12)";
 
  var stats = [
    { num: "500", suffix: "+", label: "Decision Makers" },
    { num: "5",   suffix: "",  label: "Tech Pillars" },
    { num: "27-28 Oct",         label: "2026", isText: true },
    { num: "The Carlu",        label: "Toronto, ON", isText: true },
  ];
 
  return (
    <>
      <style>{`
        /* ──── AURORA ──── */
        :root {
          --aurora-white: #ffffff; --aurora-black: #06020f;
          --aurora-transparent: transparent; --aurora-purple: #7a3fd1;
          --aurora-violet: #9b57e8; --aurora-lilac: #c4a0f5;
          --aurora-orange: #f5a623; --aurora-amber: #f7c15e;
        }
        @keyframes aurora-shift {
          from { background-position: 50% 50%, 50% 50%; }
          to   { background-position: 350% 50%, 350% 50%; }
        }
        .aurora-layer {
          position: absolute; inset: -10px; pointer-events: none;
          will-change: transform; background-size: 300% 200%;
          background-position: 50% 50%; filter: blur(10px); opacity: 0.4;
        }
        .aurora-layer--light {
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-white) 0%, var(--aurora-white) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-white) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          opacity: 0.35; filter: blur(12px);
          mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
        }
        .aurora-layer--light::after {
          content: ""; position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-white) 0%, var(--aurora-white) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-white) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          background-size: 200% 100%; background-attachment: fixed;
          animation: aurora-shift 60s linear infinite; mix-blend-mode: difference;
        }
        .aurora-layer--dark {
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-black) 0%, var(--aurora-black) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-black) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          opacity: 0.5; filter: blur(10px);
          mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
        }
        .aurora-layer--dark::after {
          content: ""; position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-black) 0%, var(--aurora-black) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-black) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          background-size: 200% 100%; background-attachment: fixed;
          animation: aurora-shift 60s linear infinite; mix-blend-mode: difference;
        }
 
        /* ──── GRID ──── */
        .hero-grid {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image:
            linear-gradient(rgba(122,63,209,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,63,209,0.04) 1px, transparent 1px);
          background-size: 68px 68px;
          mask-image: radial-gradient(ellipse 80% 65% at 50% 35%, black 15%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 65% at 50% 35%, black 15%, transparent 100%);
        }
        .hero-glow {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 1;
        }
 
        /* ──── MARQUEE ──── */
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
 
        /* ──── SCROLL CUE ──── */
        @keyframes wheel-scroll {
          0%   { transform: translateY(0); opacity: 1; }
          50%  { transform: translateY(6px); opacity: 0.3; }
          100% { transform: translateY(0); opacity: 1; }
        }
 
        /* ──── CTAs ──── */
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
        .hero-cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 32px; border-radius: 14px;
          font-size: 0.86rem; font-weight: 600;
          text-decoration: none; cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-cta-ghost:hover { transform: translateY(-2px); }
 
        /* ──── STATS ──── */
        .hero-stats {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 1px;
          border-radius: 20px; overflow: hidden;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        .hero-stat {
          display: flex; flex-direction: column; align-items: center;
          padding: 20px 34px; flex: 1; min-width: 135px;
          transition: background 0.25s ease; cursor: default;
        }
        .hero-stat:last-child { border-right: none !important; }
 
        .tfc-navbar-wrap { border-bottom: none !important; box-shadow: none !important; }
 
        /* ──── RESPONSIVE ──── */
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
 
      {/* ═══════════ HERO UPPER — Logo + Date/City ═══════════ */}
      <section style={{
        position: "relative", overflow: "hidden", background: bg,
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {/* Aurora */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
          <div className={dark ? "aurora-layer aurora-layer--dark" : "aurora-layer aurora-layer--light"} />
        </div>
 
        <div className="hero-grid" />
 
        <div className="hero-glow" style={{
          width: 720, height: 720,
          background: dark
            ? "radial-gradient(circle, rgba(122,63,209,0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(122,63,209,0.08) 0%, transparent 70%)",
          top: -270, left: -220, filter: "blur(90px)",
        }} />
        <div className="hero-glow" style={{
          width: 520, height: 520,
          background: dark
            ? "radial-gradient(circle, rgba(245,166,35,0.10) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)",
          top: -170, right: -200, filter: "blur(100px)",
        }} />
 
        {/* Marquee rows — very subtle behind everything */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          gap: "4.5rem",
          pointerEvents: "none", overflow: "hidden",
        }}>
          <KeywordMarquee words={KEYWORDS_A} direction="left" speed={50} dark={dark} />
          <KeywordMarquee words={KEYWORDS_B} direction="right" speed={55} dark={dark} />
          <KeywordMarquee words={KEYWORDS_A.slice().reverse()} direction="left" speed={45} dark={dark} />
          <KeywordMarquee words={KEYWORDS_B.slice().reverse()} direction="right" speed={60} dark={dark} />
        </div>
 
        {/* Centered content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            position: "relative", zIndex: 5,
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center",
            padding: "0 6%", maxWidth: 920, width: "100%",
          }}
        >
          {/* Logo */}
          <motion.div variants={itemBlur} style={{ marginBottom: "2.2rem" }}>
            <img
              src={dark
                ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
              alt="The Tech Festival Canada"
              style={{
                width: "100%", maxWidth: 580, height: "auto", objectFit: "contain",
                filter: dark
                  ? "drop-shadow(0 0 50px rgba(155,135,245,0.22))"
                  : "drop-shadow(0 10px 28px rgba(122,63,209,0.12))",
              }}
            />
          </motion.div>
        </motion.div>
 
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 120, zIndex: 4,
          background: "linear-gradient(to bottom, transparent, " + bg + ")",
          pointerEvents: "none",
        }} />
      </section>
 
      {/* ═══════════ HERO LOWER — MEET BUILD SCALE + CTAs ═══════════ */}
      <section id="hero-lower" style={{
        position: "relative", background: bg, overflow: "hidden",
        padding: "6rem 6% 5rem",
      }}>
        <div style={{
          maxWidth: 920, margin: "0 auto",
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
        }}>
          <TextReveal
            text="MEET BUILD SCALE"
            colors={[
              dark ? "#ffffff" : "#0d0520",
              accent,
              "var(--brand-orange, #f5a623)",
            ]}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
              fontWeight: 900, lineHeight: 1.08,
              letterSpacing: "-0.5px", marginBottom: "1rem",
            }}
          />
 
          <DividerReveal accent={accent} />
          <SubtitleReveal textMid={textMid} />
          <CTAReveal dark={dark} textMain={textMain} accent={accent} />
          <StatsReveal stats={stats} dark={dark} cardBg={cardBg} cardBdr={cardBdr} textSoft={textSoft} />
        </div>
      </section>
 
      {/* ═══════════ ABOUT / FOOTER / MODALS ═══════════ */}
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
