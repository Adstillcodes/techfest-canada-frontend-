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

/* ── SCAN-LINE CANVAS ── */

function ScanCanvas() {
  const canvasRef = useRef(null);

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
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    var DOT = 28;
    var DOT_R = 1.1;

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
          ctx.fillStyle = "rgba(160,100,255," + (0.12 + hash * 0.22) + ")";
          ctx.fill();
        }
      }

      var prog  = Math.sin(t * 0.5) * 0.5 + 0.5;
      var scanY = prog * H;
      var bw    = 55;

      var g = ctx.createLinearGradient(0, scanY - bw, 0, scanY + bw);
      g.addColorStop(0,    "rgba(220,60,60,0)");
      g.addColorStop(0.45, "rgba(220,60,60,0.16)");
      g.addColorStop(0.5,  "rgba(255,80,80,0.50)");
      g.addColorStop(0.55, "rgba(220,60,60,0.16)");
      g.addColorStop(1,    "rgba(220,60,60,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, scanY - bw, W, bw * 2);

      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(W, scanY);
      ctx.strokeStyle = "rgba(255,100,100,0.85)";
      ctx.lineWidth   = 1.5;
      ctx.shadowColor = "rgba(255,80,80,0.7)";
      ctx.shadowBlur  = 10;
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
        pointerEvents: "none", zIndex: 3,
        borderRadius: "inherit",
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
      fontSize: "clamp(1.5rem, 3.5vw, 2.7rem)",
      fontWeight: 900, lineHeight: 1.2,
      marginBottom: "1.4rem",
      display: "flex", flexWrap: "wrap", gap: "0.5rem",
      minHeight: "1.4em",
    }}>
      {WORDS.map(function(word, i) {
        var isDivider = word === "|";
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: i < shown ? 1 : 0,
              transform: i < shown ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.35s ease " + (i * 0.04) + "s, transform 0.35s ease " + (i * 0.04) + "s",
              color: isDivider
                ? "rgba(160,100,255,0.35)"
                : i === 2
                  ? "var(--brand-orange)"
                  : (isDark ? "#ffffff" : "#0f0520"),
              fontWeight: isDivider ? 300 : 900,
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
  var inquiryState        = useState(false);
  var inquiryOpen         = inquiryState[0];
  var setInquiryOpen      = inquiryState[1];

  var surveyState         = useState(false);
  var surveyOpen          = surveyState[0];
  var setSurveyOpen       = surveyState[1];

  var surveyNameState     = useState("");
  var surveyName          = surveyNameState[0];
  var setSurveyName       = surveyNameState[1];

  var purchaseState       = useState(false);
  var purchaseOpen        = purchaseState[0];
  var setPurchaseOpen     = purchaseState[1];

  var ticketTypeState     = useState("");
  var purchaseTicketType  = ticketTypeState[0];
  var setPurchaseTicketType = ticketTypeState[1];

  var darkState           = useState(false);
  var isDarkMode          = darkState[0];
  var setIsDarkMode       = darkState[1];

  var mouseState          = useState({ x: 0, y: 0 });
  var mouse               = mouseState[0];
  var setMouse            = mouseState[1];

  var subState            = useState(false);
  var subtitleVisible     = subState[0];
  var setSubtitleVisible  = subState[1];

  var ctaState            = useState(false);
  var ctaVisible          = ctaState[0];
  var setCtaVisible       = ctaState[1];

  var shownState          = useState(0);
  var shown               = shownState[0];
  var setShown            = shownState[1];

  var heroRef = useRef(null);

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
    var delay = shown === 0 ? 700 : 230;
    var t = setTimeout(function() { setShown(function(n) { return n + 1; }); }, delay);
    return function() { clearTimeout(t); };
  }, [shown]);

  // Staggered reveals
  useEffect(function() {
    var t1 = setTimeout(function() { setSubtitleVisible(true); }, 1800);
    var t2 = setTimeout(function() { setCtaVisible(true); }, 2200);
    return function() { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Mouse parallax
  var handleMouse = useCallback(function(e) {
    var el = heroRef.current;
    if (!el) return;
    var rect = el.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
      y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
    });
  }, []);

  useEffect(function() {
    window.addEventListener("mousemove", handleMouse);
    return function() { window.removeEventListener("mousemove", handleMouse); };
  }, [handleMouse]);

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

  var pxX = mouse.x * -5;
  var pxY = mouse.y * -3;

  return (
    <>
      <style>{`
        .hero-wrap {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #0a0613 0%, #150d27 55%, #0d0a1e 100%);
        }
        body:not(.dark-mode) .hero-wrap {
          background: linear-gradient(135deg, #f4f0ff 0%, #ede8ff 55%, #f8f4ff 100%);
        }
        .hero-orb {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none;
          opacity: 0; animation: h-orb-in 2s ease forwards;
        }
        @keyframes h-orb-in { to { opacity: 1; } }
        .hero-bg-grid {
          pointer-events: none; position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(122,63,209,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,63,209,0.045) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%);
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(155,135,245,0.10);
          border: 1px solid rgba(155,135,245,0.30);
          color: #9b87f5; padding: 6px 16px; border-radius: 999px;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; margin-bottom: 1.4rem;
          opacity: 0; animation: h-slide-up 0.6s ease 0.3s forwards;
        }
        body:not(.dark-mode) .hero-badge {
          background: rgba(122,63,209,0.07);
          border-color: rgba(122,63,209,0.22); color: #7a3fd1;
        }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--brand-orange);
          box-shadow: 0 0 7px var(--brand-orange);
          animation: badge-pulse 2s ease infinite; flex-shrink: 0;
        }
        @keyframes badge-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.4); opacity: 0.6; }
        }
        .hero-inner {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: center; gap: 4rem;
          padding: clamp(2rem,6vw,4rem) 5% clamp(2.5rem,6vw,5rem);
          max-width: 1400px; margin: 0 auto; min-height: 80vh;
        }
        .scan-host {
          position: relative; border-radius: 24px; overflow: hidden;
        }
        .neumorphic-btn {
          position: relative; overflow: hidden; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.10);
          background: linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%);
          padding: 14px 32px; color: #fff;
          font-family: 'Orbitron', sans-serif; font-weight: 800;
          font-size: 0.75rem; letter-spacing: 0.8px; text-transform: uppercase;
          cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 32px rgba(122,63,209,0.25);
          transition: box-shadow 0.3s, border-color 0.3s;
        }
        .neumorphic-btn:hover {
          box-shadow: 0 0 28px rgba(155,135,245,0.45);
          border-color: rgba(155,135,245,0.40);
        }
        .neumorphic-btn::after {
          content: ''; position: absolute; inset: 0; opacity: 0;
          transition: opacity 0.3s;
          background: linear-gradient(135deg, rgba(155,135,245,0.22) 0%, transparent 100%);
          border-radius: 999px;
        }
        .neumorphic-btn:hover::after { opacity: 1; }
        .hero-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px; margin-top: 18px;
          opacity: 0; animation: h-slide-up 0.7s ease 1.2s forwards;
        }
        .scroll-hint {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(155,135,245,0.55);
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 1.2px; text-transform: uppercase;
          opacity: 0; animation: h-fade-in 0.8s ease 3s forwards;
          margin-top: 2rem; cursor: pointer; border: none; background: none;
        }
        @keyframes h-fade-in { to { opacity: 1; } }
        .scroll-arrow { animation: bounce-down 1.6s ease infinite; }
        @keyframes bounce-down {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }
        @keyframes h-slide-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes h-slide-left {
          from { opacity: 0; transform: translateX(36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-visual-in {
          opacity: 0; animation: h-slide-left 0.9s ease 0.55s forwards;
        }
        @media (max-width: 920px) {
          .hero-inner {
            grid-template-columns: 1fr; text-align: center;
            gap: 2.5rem; min-height: auto;
          }
          .hero-badge  { margin-left: auto; margin-right: auto; }
          .hero-sub    { margin-left: auto !important; margin-right: auto !important; }
          .hero-ctas   { justify-content: center !important; }
          .scroll-hint { margin-left: auto; margin-right: auto; display: flex; }
          .hero-inner h1 { justify-content: center; }
        }
        @media (max-width: 600px) {
          .hero-ctas {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .hero-ctas a { width: 100% !important; justify-content: center !important; }
          .hero-sub { font-size: 0.85rem !important; }
        }
      `}</style>

      <UrgencyBanner />
      <Navbar />

      <section className="hero-wrap" ref={heroRef}>

        {/* Radial glows (doc 3 pattern) */}
        <div style={{
          position: "absolute", right: 0, top: 0, width: "50%", height: "50%", pointerEvents: "none",
          background: "radial-gradient(circle at 70% 30%, rgba(155,135,245,0.15) 0%, rgba(13,10,25,0) 60%)",
        }} />
        <div style={{
          position: "absolute", left: 0, top: 0, width: "50%", height: "50%",
          transform: "scaleX(-1)", pointerEvents: "none",
          background: "radial-gradient(circle at 70% 30%, rgba(155,135,245,0.15) 0%, rgba(13,10,25,0) 60%)",
        }} />

        <div className="hero-orb" style={{
          width: 580, height: 580,
          background: "radial-gradient(circle, rgba(122,63,209,0.28) 0%, transparent 70%)",
          top: -160, left: -160, animationDelay: "0.1s",
        }} />
        <div className="hero-orb" style={{
          width: 420, height: 420,
          background: "radial-gradient(circle, rgba(245,166,35,0.14) 0%, transparent 70%)",
          top: 40, right: -100, animationDelay: "0.4s",
        }} />
        <div className="hero-bg-grid" />

        <div className="hero-inner">

          {/* LEFT: TEXT */}
          <div>
            <div className="hero-badge">
              <span className="badge-dot" />
              Oct 28, 2026 · The Carlu, Toronto
            </div>

            <img
              src={isDarkMode
                ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
                : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
              alt="Tech Festival Canada"
              style={{
                width: "100%", maxWidth: 460, height: "auto",
                objectFit: "contain", display: "block", marginBottom: "1.4rem",
                opacity: 0, animation: "h-slide-up 0.7s ease 0.15s forwards",
                filter: isDarkMode ? "drop-shadow(0 0 28px rgba(160,100,255,0.28))" : "none",
              }}
            />

            <AnimatedHeadline isDark={isDarkMode} shown={shown} />

            <p
              className="hero-sub"
              style={{
                fontSize: "clamp(0.88rem,1.4vw,1.06rem)",
                color: isDarkMode ? "rgba(255,255,255,0.58)" : "rgba(15,5,32,0.60)",
                lineHeight: 1.78, fontWeight: 400,
                maxWidth: 480, marginBottom: "2.2rem",
                opacity: subtitleVisible ? 1 : 0,
                transform: subtitleVisible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.65s ease, transform 0.65s ease",
              }}
            >
              Canada's first-of-its-kind deal-making platform — where innovators,
              buyers, investors, and policymakers turn emerging tech into real
              partnerships, pilots, and contracts. Not just conversations.
            </p>

            <div
              className="hero-ctas"
              style={{
                display: "flex", gap: "1rem", flexWrap: "wrap",
                opacity: ctaVisible ? 1 : 0,
                transform: ctaVisible ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              <a href="/tickets" className="neumorphic-btn">
                ✦ Get Your Tickets
              </a>
              <a
                href="/speakers"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  color: isDarkMode ? "rgba(255,255,255,0.65)" : "rgba(15,5,32,0.65)",
                  fontSize: "0.88rem", fontWeight: 500, textDecoration: "none",
                  transition: "color 0.2s", padding: "14px 8px",
                }}
              >
                Partner With Us
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </a>
            </div>

            <button className="scroll-hint" onClick={scrollToAbout}>
              Scroll to explore
              <svg className="scroll-arrow" width="18" height="18" viewBox="0 0 22 22" fill="none">
                <path d="M11 5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 12L11 17L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* RIGHT: SCAN VISUAL */}
          <div className="hero-visual-in">
            <div style={{
              transform: "translate(" + pxX + "px, " + pxY + "px)",
              transition: "transform 0.12s linear",
              willChange: "transform",
            }}>
              <div className="scan-host">
                <ScanCanvas />
                <EventCountdown isDark={isDarkMode} />
              </div>
            </div>

            <div className="hero-stats">
              {[
                { val: "500+",    label: "Decision Makers" },
                { val: "5",       label: "Tech Pillars" },
                { val: "Oct '26", label: "Toronto" },
              ].map(function(s) {
                return (
                  <div key={s.label} style={{
                    background: isDarkMode ? "rgba(155,135,245,0.06)" : "rgba(122,63,209,0.05)",
                    border: "1px solid " + (isDarkMode ? "rgba(155,135,245,0.16)" : "rgba(122,63,209,0.14)"),
                    borderRadius: 14, padding: "12px 8px", textAlign: "center",
                  }}>
                    <div style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "1.15rem", fontWeight: 900,
                      background: "linear-gradient(135deg, #9b87f5, #f5a623)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>{s.val}</div>
                    <div style={{
                      fontSize: "0.58rem", fontWeight: 700, letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: isDarkMode ? "rgba(200,180,255,0.45)" : "rgba(122,63,209,0.50)",
                      marginTop: 4,
                    }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      <div id="about-section">
        <AboutUs onWriteToUs={function() { setInquiryOpen(true); }} />
      </div>

      <Footer />

      <InquiryModal  isOpen={inquiryOpen}  onClose={function() { setInquiryOpen(false); }} />
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
