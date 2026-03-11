import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UrgencyBanner from "../components/UrgencyBanner";
import AboutUs from "../components/AboutUs";
import { useEffect, useState, useRef } from "react";
import InquiryModal from "../components/InquiryModal";
import CookieConsent from "../components/CookieConsent";
import PostPurchaseModal from "../components/PostPurchaseModal";
import OnboardingSurvey from "../components/OnboardingSurvey";

var WORDS = ["MEET", "|", "BUILD", "|", "SCALE"];

function AnimatedHeadline(props) {
  var shown  = props.shown;
  var isDark = props.isDark;
  return (
    <h1 style={{
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
      fontWeight: 900, lineHeight: 1.1,
      marginBottom: "1.8rem",
      display: "flex", flexWrap: "wrap",
      justifyContent: "center", gap: "0.55rem",
      letterSpacing: "-0.5px",
    }}>
      {WORDS.map(function(word, i) {
        var div = word === "|";
        return (
          <span key={i} style={{
            display: "inline-block",
            opacity: i < shown ? 1 : 0,
            transform: i < shown ? "translateY(0) scale(1)" : "translateY(24px) scale(0.95)",
            transition: "opacity 0.5s cubic-bezier(.16,1,.3,1) " + (i*0.09) + "s, transform 0.5s cubic-bezier(.16,1,.3,1) " + (i*0.09) + "s",
            color: div ? "rgba(122,63,209,0.22)" :
                   i === 2 ? "var(--brand-orange)" :
                   isDark ? "#fff" : "#0d0520",
            fontWeight: div ? 200 : 900,
            fontSize: div ? "0.55em" : undefined,
          }}>{word}</span>
        );
      })}
    </h1>
  );
}

export default function Home() {
  var s1  = useState(false);  var inquiryOpen=s1[0];         var setInquiryOpen=s1[1];
  var s2  = useState(false);  var surveyOpen=s2[0];          var setSurveyOpen=s2[1];
  var s3  = useState("");     var surveyName=s3[0];          var setSurveyName=s3[1];
  var s4  = useState(false);  var purchaseOpen=s4[0];        var setPurchaseOpen=s4[1];
  var s5  = useState("");     var purchaseTicketType=s5[0];  var setPurchaseTicketType=s5[1];
  var s6  = useState(false);  var dark=s6[0];                var setDark=s6[1];
  var s7  = useState(false);  var subVis=s7[0];              var setSubVis=s7[1];
  var s8  = useState(false);  var ctaVis=s8[0];              var setCtaVis=s8[1];
  var s9  = useState(false);  var statsVis=s9[0];            var setStatsVis=s9[1];
  var s10 = useState(0);      var shown=s10[0];              var setShown=s10[1];

  useEffect(function() {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function() {
      setDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function() { obs.disconnect(); };
  }, []);

  useEffect(function() {
    if (shown >= WORDS.length) return;
    var t = setTimeout(function() { setShown(function(n){return n+1;}); }, shown===0 ? 400 : 180);
    return function() { clearTimeout(t); };
  }, [shown]);

  useEffect(function() {
    var t1 = setTimeout(function(){setSubVis(true);},  1400);
    var t2 = setTimeout(function(){setCtaVis(true);},  1800);
    var t3 = setTimeout(function(){setStatsVis(true);},2200);
    return function(){clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  }, []);

  useEffect(function() {
    function h(e){ setSurveyName(e.detail&&e.detail.name?e.detail.name:""); setSurveyOpen(true); }
    window.addEventListener("showSurvey", h);
    return function(){ window.removeEventListener("showSurvey", h); };
  }, []);

  useEffect(function() {
    function h(e){ setPurchaseTicketType(e.detail&&e.detail.ticketType?e.detail.ticketType:"Delegate Pass"); setPurchaseOpen(true); }
    window.addEventListener("purchaseComplete", h);
    return function(){ window.removeEventListener("purchaseComplete", h); };
  }, []);

  function scrollDown() {
    var el = document.getElementById("about-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  /* ── light bg tokens ── */
  var bg       = dark ? "#06020f"        : "#ffffff";
  var textMain = dark ? "#ffffff"        : "#0d0520";
  var textMid  = dark ? "rgba(255,255,255,0.55)" : "rgba(13,5,32,0.58)";
  var pillBg   = dark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.06)";
  var pillBdr  = dark ? "rgba(122,63,209,0.22)" : "rgba(122,63,209,0.18)";

  return (
    <>
      <style>{`
        /* ─── hero shell ─── */
        .h-wrap {
          position: relative;
          overflow: hidden;
        }

        /* ─── noise texture overlay ─── */
        .h-wrap::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          opacity: 0.018;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          pointer-events: none;
        }

        /* ─── soft radial glows ─── */
        .h-glow {
          position: absolute; border-radius: 50%;
          filter: blur(110px); pointer-events: none;
          opacity: 0; animation: g-in 2s ease forwards;
        }
        @keyframes g-in { to { opacity: 1; } }

        /* ─── grid lines ─── */
        .h-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(122,63,209,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,63,209,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 75% 70% at 50% 40%, black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 40%, black 20%, transparent 100%);
        }

        /* ─── content container ─── */
        .h-inner {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: clamp(5rem,9vw,8rem) 6% clamp(5rem,9vw,8rem);
          max-width: 860px; margin: 0 auto;
        }

        /* ─── badge ─── */
        .h-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 18px; border-radius: 999px;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 1.6px;
          text-transform: uppercase; margin-bottom: 2rem;
          opacity: 0; animation: h-up 0.7s cubic-bezier(.16,1,.3,1) 0.1s forwards;
        }
        .h-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--brand-orange);
          box-shadow: 0 0 8px var(--brand-orange);
          animation: d-pulse 2.2s ease infinite;
        }
        @keyframes d-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.6); opacity: 0.5; }
        }

        /* ─── logo ─── */
        .h-logo {
          opacity: 0; animation: h-up 0.8s cubic-bezier(.16,1,.3,1) 0.25s forwards;
          margin-bottom: 1.8rem;
        }

        /* ─── sub ─── */
        .h-sub {
          font-size: clamp(1rem,1.7vw,1.18rem);
          line-height: 1.82; font-weight: 400;
          max-width: 580px;
          text-align: justify; hyphens: auto;
          margin-bottom: 2.8rem;
        }

        /* ─── primary CTA ─── */
        .h-cta-primary {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 38px; border-radius: 999px; border: none;
          background: linear-gradient(135deg, #7a3fd1 0%, #9b57e8 50%, #f5a623 140%);
          background-size: 200% 200%; background-position: 0% 50%;
          color: #fff; font-family: 'Orbitron', sans-serif;
          font-weight: 800; font-size: 0.8rem; letter-spacing: 1px;
          text-transform: uppercase; cursor: pointer; text-decoration: none;
          box-shadow: 0 8px 30px rgba(122,63,209,0.35), 0 2px 8px rgba(0,0,0,0.15);
          transition: background-position 0.5s ease, box-shadow 0.3s ease, transform 0.2s ease;
        }
        .h-cta-primary:hover {
          background-position: 100% 50%;
          box-shadow: 0 12px 45px rgba(122,63,209,0.50), 0 2px 8px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }
        .h-cta-primary::after {
          content: ''; position: absolute; inset: 0; border-radius: 999px;
          background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.3s;
        }
        .h-cta-primary:hover::after { opacity: 1; }

        /* ─── secondary CTA ─── */
        .h-cta-secondary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 15px 32px; border-radius: 999px;
          border: 1.5px solid rgba(122,63,209,0.28);
          background: transparent;
          font-size: 0.88rem; font-weight: 500;
          text-decoration: none;
          transition: border-color 0.25s, background 0.25s, color 0.25s;
        }
        .h-cta-secondary:hover {
          border-color: rgba(122,63,209,0.55);
          background: rgba(122,63,209,0.06);
        }
        body.dark-mode .h-cta-secondary { border-color: rgba(155,135,245,0.28); }
        body.dark-mode .h-cta-secondary:hover { border-color: rgba(155,135,245,0.55); background: rgba(155,135,245,0.08); }

        /* ─── stat strip ─── */
        .h-stats {
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 1px;
          margin-top: 4rem;
          border: 1px solid rgba(122,63,209,0.14);
          border-radius: 20px; overflow: hidden;
        }
        body.dark-mode .h-stats { border-color: rgba(155,135,245,0.12); }
        .h-stat {
          display: flex; flex-direction: column; align-items: center;
          padding: 18px 32px; flex: 1; min-width: 130px;
          background: rgba(122,63,209,0.03);
          border-right: 1px solid rgba(122,63,209,0.10);
          transition: background 0.2s;
        }
        .h-stat:last-child { border-right: none; }
        .h-stat:hover { background: rgba(122,63,209,0.07); }
        body.dark-mode .h-stat { background: rgba(155,135,245,0.03); border-right-color: rgba(155,135,245,0.08); }
        body.dark-mode .h-stat:hover { background: rgba(155,135,245,0.08); }

        /* ─── bottom divider ─── */
        .h-divider {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(122,63,209,0.20) 30%, rgba(245,166,35,0.15) 70%, transparent 100%);
        }

        /* ─── keyframes ─── */
        @keyframes h-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ─── responsive ─── */
        @media (max-width: 640px) {
          .h-ctas { flex-direction: column !important; width: 100% !important; }
          .h-cta-primary, .h-cta-secondary { width: 100% !important; justify-content: center !important; }
          .h-sub { text-align: left; }
          .h-stat { padding: 14px 18px; }
          .h-stats { border-radius: 16px; }
        }
      `}</style>

      <UrgencyBanner />
      <Navbar />

      {/* ════ HERO ════ */}
      <section
        className="h-wrap"
        style={{ background: bg, minHeight: "90vh", display: "flex", alignItems: "center" }}
      >
        {/* Subtle grid */}
        <div className="h-grid" />

        {/* Ambient glow — purple top-left */}
        <div className="h-glow" style={{
          width: 700, height: 700,
          background: dark
            ? "radial-gradient(circle, rgba(122,63,209,0.30) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(122,63,209,0.12) 0%, transparent 70%)",
          top: -250, left: -200, animationDelay: "0s",
        }} />
        {/* Warm glow — orange top-right */}
        <div className="h-glow" style={{
          width: 500, height: 500,
          background: dark
            ? "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(245,166,35,0.10) 0%, transparent 70%)",
          top: -150, right: -180, animationDelay: "0.4s",
        }} />
        {/* Cool glow — bottom center */}
        <div className="h-glow" style={{
          width: 600, height: 400,
          background: dark
            ? "radial-gradient(circle, rgba(155,135,245,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(155,135,245,0.08) 0%, transparent 70%)",
          bottom: -100, left: "25%", animationDelay: "0.7s",
        }} />

        {/* ── CENTERED CONTENT ── */}
        <div className="h-inner" style={{ width: "100%" }}>

          {/* Badge */}
          <div
            className="h-badge"
            style={{ background: pillBg, border: "1px solid " + pillBdr, color: dark ? "#b99eff" : "#7a3fd1" }}
          >
            <span className="h-dot" />
            Canada's Premier Tech Conference
          </div>

          {/* Logo */}
          <img
            className="h-logo"
            src={dark
              ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp"
              : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
            alt="The Tech Festival Canada"
            style={{
              width: "100%", maxWidth: 500, height: "auto", objectFit: "contain",
              filter: dark
                ? "drop-shadow(0 0 40px rgba(155,135,245,0.25))"
                : "drop-shadow(0 8px 24px rgba(122,63,209,0.14))",
            }}
          />

          {/* Headline */}
          <AnimatedHeadline isDark={dark} shown={shown} />

          {/* Sub */}
          <p
            className="h-sub"
            style={{
              color: textMid,
              opacity: subVis ? 1 : 0,
              transform: subVis ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            Canada's first-of-its-kind deal-making platform — where innovators,
            buyers, investors, and policymakers turn emerging technology into
            real partnerships, pilots, and contracts. One day. One venue.
            Unlimited momentum.
          </p>

          {/* CTAs */}
          <div
            className="h-ctas"
            style={{
              display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center",
              opacity: ctaVis ? 1 : 0,
              transform: ctaVis ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <a href="/tickets" className="h-cta-primary">
              Get Your Tickets →
            </a>
            <a
              href="/speakers"
              className="h-cta-secondary"
              style={{ color: dark ? "rgba(200,185,255,0.80)" : "rgba(90,40,180,0.78)" }}
            >
              Partner With Us
            </a>
          </div>

          {/* Stat strip */}
          <div
            className="h-stats"
            style={{
              opacity: statsVis ? 1 : 0,
              transform: statsVis ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {[
              { num: "500+",        sub: "Decision Makers" },
              { num: "5",           sub: "Tech Pillars"    },
              { num: "Oct 28",      sub: "2026"            },
              { num: "The Carlu",   sub: "Toronto, ON"     },
            ].map(function(s) {
              return (
                <div className="h-stat" key={s.sub}>
                  <span style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 900, fontSize: "1.05rem",
                    background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text", marginBottom: 3,
                  }}>{s.num}</span>
                  <span style={{
                    fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.9px",
                    textTransform: "uppercase",
                    color: dark ? "rgba(200,185,255,0.45)" : "rgba(90,40,180,0.45)",
                  }}>{s.sub}</span>
                </div>
              );
            })}
          </div>

          {/* Scroll cue */}
          <button
            onClick={scrollDown}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              marginTop: "3rem", border: "none", background: "none", cursor: "pointer",
              color: dark ? "rgba(155,135,245,0.38)" : "rgba(122,63,209,0.35)",
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "1.4px",
              textTransform: "uppercase",
              opacity: 0, animation: "h-up 0.8s ease 3.5s forwards",
            }}
          >
            <span>Scroll</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: "b-down 1.8s ease infinite" }}>
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>

        </div>

        <div className="h-divider" />

        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80, zIndex: 3,
          background: "linear-gradient(to bottom, transparent, " + bg + ")",
          pointerEvents: "none",
        }} />

      </section>

      <style>{`
        @keyframes b-down {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }
      `}</style>

      <div id="about-section">
        <AboutUs onWriteToUs={function(){ setInquiryOpen(true); }} />
      </div>
      <Footer />
      <InquiryModal isOpen={inquiryOpen} onClose={function(){ setInquiryOpen(false); }} />
      <CookieConsent />
      <PostPurchaseModal
        isOpen={purchaseOpen}
        onClose={function(){ setPurchaseOpen(false); }}
        ticketType={purchaseTicketType}
      />
      <OnboardingSurvey
        isOpen={surveyOpen}
        onClose={function(){ setSurveyOpen(false); window.location.reload(); }}
        userName={surveyName}
      />
    </>
  );
}
