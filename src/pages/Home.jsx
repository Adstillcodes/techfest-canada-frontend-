import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import AboutUs from "../components/AboutUs";
import { useEffect, useState, useRef, useCallback } from "react";
import InquiryModal from "../components/InquiryModal";
import CookieConsent from "../components/CookieConsent";
import PostPurchaseModal from "../components/PostPurchaseModal";
import OnboardingSurvey from "../components/OnboardingSurvey";

/* ── FULL-WIDTH SCAN CANVAS (background layer) ── */
function ScanCanvas() {
  var canvasRef = useRef(null);

  useEffect(function() {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var raf = null;
    var W = 0;
    var H = 0;
    var start = null;

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    var DOT = 40;
    var DOT_R = 1.0;

    function draw(ts) {
      if (!start) start = ts;
      var t = (ts - start) / 1000;
      ctx.clearRect(0, 0, W, H);

      for (var x = DOT / 2; x < W; x += DOT) {
        for (var y = DOT / 2; y < H; y += DOT) {
          var nx = x / W;
          var ny = y / H;
          var hash = Math.abs(Math.sin(nx * 127.1 + ny * 311.7) * 43758.5 % 1);
          ctx.beginPath();
          ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(155,135,245," + (0.08 + hash * 0.14) + ")";
          ctx.fill();
        }
      }

      var prog  = Math.sin(t * 0.4) * 0.5 + 0.5;
      var scanY = prog * H;
      var bw    = 80;

      var g = ctx.createLinearGradient(0, scanY - bw, 0, scanY + bw);
      g.addColorStop(0,    "rgba(155,135,245,0)");
      g.addColorStop(0.45, "rgba(155,135,245,0.06)");
      g.addColorStop(0.5,  "rgba(155,135,245,0.18)");
      g.addColorStop(0.55, "rgba(155,135,245,0.06)");
      g.addColorStop(1,    "rgba(155,135,245,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, scanY - bw, W, bw * 2);

      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(W, scanY);
      ctx.strokeStyle = "rgba(155,135,245,0.35)";
      ctx.lineWidth   = 1;
      ctx.shadowColor = "rgba(155,135,245,0.5)";
      ctx.shadowBlur  = 8;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return function() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 1,
      }}
    />
  );
}

/* ── WORD-BY-WORD HEADLINE ── */
var WORDS = ["MEET", "|", "BUILD", "|", "SCALE"];

function AnimatedHeadline(props) {
  var isDark = props.isDark;
  var shown  = props.shown;

  return (
    <h1 style={{
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "clamp(2rem, 5vw, 4rem)",
      fontWeight: 900, lineHeight: 1.15,
      marginBottom: "1.6rem",
      display: "flex", flexWrap: "wrap",
      justifyContent: "center", gap: "0.6rem",
    }}>
      {WORDS.map(function(word, i) {
        var isDivider = word === "|";
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: i < shown ? 1 : 0,
              transform: i < shown ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.4s ease " + (i * 0.08) + "s, transform 0.4s ease " + (i * 0.08) + "s",
              color: isDivider
                ? "rgba(155,135,245,0.30)"
                : i === 2
                  ? "var(--brand-orange)"
                  : (isDark ? "#ffffff" : "#0f0520"),
              fontWeight: isDivider ? 200 : 900,
              fontSize: isDivider ? "0.6em" : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </h1>
  );
}

/* ── MAIN PAGE ── */
export default function Home() {
  var s1 = useState(false);   var inquiryOpen = s1[0];        var setInquiryOpen = s1[1];
  var s2 = useState(false);   var surveyOpen = s2[0];         var setSurveyOpen = s2[1];
  var s3 = useState("");      var surveyName = s3[0];         var setSurveyName = s3[1];
  var s4 = useState(false);   var purchaseOpen = s4[0];       var setPurchaseOpen = s4[1];
  var s5 = useState("");      var purchaseTicketType = s5[0]; var setPurchaseTicketType = s5[1];
  var s6 = useState(false);   var isDarkMode = s6[0];         var setIsDarkMode = s6[1];
  var s7 = useState(false);   var subVis = s7[0];             var setSubVis = s7[1];
  var s8 = useState(false);   var ctaVis = s8[0];             var setCtaVis = s8[1];
  var s9 = useState(false);   var statsVis = s9[0];           var setStatsVis = s9[1];
  var s10 = useState(0);      var shown = s10[0];             var setShown = s10[1];

  // Dark mode
  useEffect(function() {
    setIsDarkMode(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function() {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function() { obs.disconnect(); };
  }, []);

  // Word reveal
  useEffect(function() {
    if (shown >= WORDS.length) return;
    var delay = shown === 0 ? 500 : 200;
    var t = setTimeout(function() { setShown(function(n) { return n + 1; }); }, delay);
    return function() { clearTimeout(t); };
  }, [shown]);

  // Staggered reveals
  useEffect(function() {
    var t1 = setTimeout(function() { setSubVis(true); },   1600);
    var t2 = setTimeout(function() { setCtaVis(true); },   2000);
    var t3 = setTimeout(function() { setStatsVis(true); }, 2400);
    return function() { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Events
  useEffect(function() {
    function h(e) {
      setSurveyName(e.detail && e.detail.name ? e.detail.name : "");
      setSurveyOpen(true);
    }
    window.addEventListener("showSurvey", h);
    return function() { window.removeEventListener("showSurvey", h); };
  }, []);

  useEffect(function() {
    function h(e) {
      setPurchaseTicketType(e.detail && e.detail.ticketType ? e.detail.ticketType : "Delegate Pass");
      setPurchaseOpen(true);
    }
    window.addEventListener("purchaseComplete", h);
    return function() { window.removeEventListener("purchaseComplete", h); };
  }, []);

  function scrollToAbout() {
    var el = document.getElementById("about-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  var dark = isDarkMode;

  return (
    <>
      <style>{`
        /* ── hero wrap ── */
        .hero-wrap {
          position: relative; overflow: hidden;
          background: linear-gradient(160deg, #07030f 0%, #100820 50%, #0a0518 100%);
        }
        body:not(.dark-mode) .hero-wrap {
          background: linear-gradient(160deg, #f6f2ff 0%, #ede6ff 50%, #f2eeff 100%);
        }

        /* ── ambient orbs ── */
        .h-orb {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
          opacity: 0; animation: h-orb-in 2.4s ease forwards;
        }
        @keyframes h-orb-in { to { opacity: 1; } }

        /* ── center content ── */
        .hero-center {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: clamp(5rem,10vw,8rem) 5% clamp(4rem,8vw,7rem);
          max-width: 900px; margin: 0 auto;
        }

        /* ── badge ── */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(155,135,245,0.10);
          border: 1px solid rgba(155,135,245,0.28);
          color: #9b87f5; padding: 7px 18px; border-radius: 999px;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 1.8px;
          text-transform: uppercase; margin-bottom: 2rem;
          opacity: 0; animation: h-up 0.7s ease 0.2s forwards;
        }
        body:not(.dark-mode) .hero-badge { color: #7a3fd1; background: rgba(122,63,209,0.07); border-color: rgba(122,63,209,0.20); }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--brand-orange); box-shadow: 0 0 8px var(--brand-orange);
          animation: b-pulse 2s ease infinite; flex-shrink: 0;
        }
        @keyframes b-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.5); opacity: 0.55; }
        }

        /* ── logo ── */
        .hero-logo {
          opacity: 0; animation: h-up 0.8s ease 0.35s forwards;
          margin-bottom: 2rem;
        }

        /* ── sub text ── */
        .hero-sub {
          font-size: clamp(1rem, 1.8vw, 1.2rem);
          line-height: 1.8; font-weight: 400;
          max-width: 620px; text-align: justify;
          hyphens: auto;
          margin-bottom: 2.8rem;
        }

        /* ── neumorphic CTA button ── */
        .neumorphic-btn {
          position: relative; overflow: hidden; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: linear-gradient(180deg, rgba(122,63,209,0.85) 0%, rgba(90,30,170,0.90) 100%);
          padding: 16px 36px; color: #fff;
          font-family: 'Orbitron', sans-serif; font-weight: 800;
          font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase;
          cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 10px;
          box-shadow: 0 8px 40px rgba(122,63,209,0.40), 0 2px 8px rgba(0,0,0,0.3);
          transition: box-shadow 0.3s, transform 0.2s;
        }
        .neumorphic-btn:hover {
          box-shadow: 0 12px 50px rgba(155,135,245,0.55), 0 2px 8px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }
        .neumorphic-btn::after {
          content: ''; position: absolute; inset: 0; opacity: 0;
          transition: opacity 0.3s;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          border-radius: 999px;
        }
        .neumorphic-btn:hover::after { opacity: 1; }

        .outline-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 16px 36px; border-radius: 999px;
          border: 1.5px solid rgba(155,135,245,0.30);
          color: rgba(155,135,245,0.85); background: transparent;
          font-size: 0.88rem; font-weight: 500; text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        body:not(.dark-mode) .outline-btn {
          border-color: rgba(122,63,209,0.25); color: rgba(122,63,209,0.80);
        }
        .outline-btn:hover { border-color: rgba(155,135,245,0.6); color: #9b87f5; }

        /* ── stat chips ── */
        .hero-stats {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;
          margin-top: 4rem;
        }
        .stat-chip {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 20px; border-radius: 999px;
          border: 1px solid rgba(155,135,245,0.18);
          background: rgba(155,135,245,0.06);
        }
        body:not(.dark-mode) .stat-chip {
          border-color: rgba(122,63,209,0.14); background: rgba(122,63,209,0.04);
        }

        /* ── divider line ── */
        .hero-divider {
          width: 100%; height: 1px; margin-top: 5rem;
          background: linear-gradient(90deg, transparent, rgba(155,135,245,0.25), rgba(245,166,35,0.15), rgba(155,135,245,0.25), transparent);
        }

        /* ── scroll hint ── */
        .scroll-hint {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(155,135,245,0.45); font-size: 0.68rem;
          font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
          cursor: pointer; border: none; background: none;
          margin-top: 2rem;
          opacity: 0; animation: h-fade 0.8s ease 3.2s forwards;
        }
        @keyframes h-fade { to { opacity: 1; } }
        .scroll-arrow { animation: b-down 1.6s ease infinite; }
        @keyframes b-down {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }

        /* ── keyframes ── */
        @keyframes h-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── mobile ── */
        @media (max-width: 600px) {
          .hero-ctas { flex-direction: column !important; width: 100%; }
          .hero-ctas a { width: 100% !important; justify-content: center !important; }
          .hero-sub { text-align: left; font-size: 0.92rem !important; }
          .stat-chip { font-size: 0.78rem; }
        }
      `}</style>

      <UrgencyBanner />
      <Navbar />

      <section className="hero-wrap">

        {/* Scan canvas — full background */}
        <ScanCanvas />

        {/* Ambient orbs */}
        <div className="h-orb" style={{
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(122,63,209,0.22) 0%, transparent 70%)",
          top: -200, left: -200, animationDelay: "0s",
        }} />
        <div className="h-orb" style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)",
          top: -100, right: -180, animationDelay: "0.3s",
        }} />
        <div className="h-orb" style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(155,135,245,0.14) 0%, transparent 70%)",
          bottom: -80, left: "35%", animationDelay: "0.6s",
        }} />

        {/* ── CENTERED CONTENT ── */}
        <div className="hero-center">

          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-dot" />
            Oct 28, 2026 · The Carlu, Toronto
          </div>

          {/* Logo */}
          <img
            className="hero-logo"
            src={dark
              ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
              : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
            alt="Tech Festival Canada"
            style={{
              width: "100%", maxWidth: 520, height: "auto",
              objectFit: "contain",
              filter: dark ? "drop-shadow(0 0 40px rgba(155,135,245,0.30))" : "none",
            }}
          />

          {/* Word-by-word headline */}
          <AnimatedHeadline isDark={dark} shown={shown} />

          {/* Subtitle — justified */}
          <p
            className="hero-sub"
            style={{
              color: dark ? "rgba(255,255,255,0.55)" : "rgba(15,5,32,0.58)",
              opacity: subVis ? 1 : 0,
              transform: subVis ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            Canada's first-of-its-kind deal-making platform — where innovators,
            buyers, investors, and policymakers turn emerging tech into real
            partnerships, pilots, and contracts. Expect a never-seen-before
            concentration of senior decision-makers from enterprise, government,
            associations, media, and leading research institutions.
          </p>

          {/* CTAs */}
          <div
            className="hero-ctas"
            style={{
              display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center",
              opacity: ctaVis ? 1 : 0,
              transform: ctaVis ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <a href="/tickets" className="neumorphic-btn">
              ✦ Get Your Tickets
            </a>
            <a href="/speakers" className="outline-btn">
              Partner With Us
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </a>
          </div>

          {/* Scroll hint */}
          <button className="scroll-hint" onClick={scrollToAbout}>
            Scroll to explore
            <svg className="scroll-arrow" width="16" height="16" viewBox="0 0 22 22" fill="none">
              <path d="M11 5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 12L11 17L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Stats chips */}
          <div
            className="hero-stats"
            style={{
              opacity: statsVis ? 1 : 0,
              transform: statsVis ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            {[
              { val: "500+",       label: "Decision Makers",   icon: "👥" },
              { val: "5",          label: "Tech Pillars",      icon: "🔬" },
              { val: "1 Day",      label: "Oct 28, 2026",      icon: "📅" },
              { val: "The Carlu",  label: "Toronto, Canada",   icon: "📍" },
            ].map(function(s) {
              return (
                <div className="stat-chip" key={s.label}>
                  <span style={{ fontSize: "1rem" }}>{s.icon}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                      fontSize: "0.85rem",
                      background: "linear-gradient(135deg, #9b87f5, #f5a623)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>{s.val}</div>
                    <div style={{
                      fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      color: dark ? "rgba(200,185,255,0.45)" : "rgba(122,63,209,0.50)",
                    }}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom gradient fade into about section */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
          background: dark
            ? "linear-gradient(to bottom, transparent, #07030f)"
            : "linear-gradient(to bottom, transparent, #f6f2ff)",
          pointerEvents: "none", zIndex: 2,
        }} />

      </section>

      <div id="about-section">
        <AboutUs onWriteToUs={function() { setInquiryOpen(true); }} />
      </div>

      <Footer />

      <InquiryModal isOpen={inquiryOpen} onClose={function() { setInquiryOpen(false); }} />
      <CookieConsent />
      <PostPurchaseModal
        isOpen={purchaseOpen}
        onClose={function() { setPurchaseOpen(false); }}
        ticketType={purchaseTicketType}
      />
      <OnboardingSurvey
        isOpen={surveyOpen}
        onClose={function() { setSurveyOpen(false); window.location.reload(); }}
        userName={surveyName}
      />
    </>
  );
}
