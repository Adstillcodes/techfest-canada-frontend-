import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SponsorInquiryModal from "../components/SponsorInquiryModal";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   COMPARISON TABLE DATA (Platinum → Bronze)
   ═══════════════════════════════════════════════════════ */

var TIERS = [
  { name: "Platinum", price: "$24,999", color: "#b99eff" },
  { name: "Gold",     price: "$19,999", color: "#f5a623" },
  { name: "Silver",   price: "$14,999", color: "#c0c0c0" },
  { name: "Bronze",   price: "$9,999",  color: "#cd7f32" },
];

var ROWS = [
  { group: "Exhibit & Presence" },
  { label: "Booth Space (10ft × 10ft)",         values: ["4", "3", "2", "1"] },
  { label: "Curated Conference Sessions",        values: ["2", "1", false, false] },
  { label: "Delegate Passes",                    values: ["15", "8", "6", "4"] },
  { label: "VIP Lounge Access",                  values: ["15", "8", "5", "3"] },
  { label: "1:1 Curated Meetings",               values: ["10", "7", "3", "2"] },
  { group: "Branding & Visibility" },
  { label: "LED Screen Booth Wall",              values: ["Large", "Medium", "Small", "Thumbnail"] },
  { label: "Branded Signage",                    values: ["Large", "Medium", "Small", "Thumbnail"] },
  { label: "e-Show Directory",                   values: ["Double Spread", "Full Page", "Full Page", "Half Page"] },
  { label: "Delegate Bag Insert",                values: ["Full Page", "Full Page", "Full Page", "Full Page"] },
  { label: "Visitor Bag Insert",                 values: ["Full Page", "Full Page", "Full Page", "Full Page"] },
  { label: "EDM Spotlights",                     values: ["4", "3", "3", "1"] },
  { group: "Thought Leadership" },
  { label: "Award Presenting Opportunity",       values: ["2", "1", false, false] },
  { label: "Opening Ceremony Guest of Honour",   values: [true, true, false, false] },
  { label: "Press Release & Media Interview",    values: [true, true, true, true] },
  { label: "Product Demo",                       values: [true, true, true, true] },
  { label: "Live Podcast Recording",             values: [true, true, true, true] },
  { group: "Digital & Post-Event" },
  { label: "Website Showcase (50 Words)",        values: [true, true, true, true] },
  { label: "Post Event Social Media Video",      values: [true, true, true, true] },
];

/* ═══════════════════════════════════════════════════════
   ADDITIONAL PACKAGES (non-comparison cards)
   ═══════════════════════════════════════════════════════ */

var ADDITIONAL_PACKAGES = [
  {
    name: "Delegate Kit Partner",
    price: "$4,999",
    icon: "🎒",
    description: "Your brand in every delegate's hands — logo and insert included in all delegate kits distributed at registration.",
    highlights: [
      "1 Booth Space (10ft × 10ft)",
      "2 Delegate Passes",
      "1 EDM Spotlight",
      "Thumbnail LED Screen & Branded Signage",
      "Live Podcast Recording",
      "Website Showcase (50 Words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "Lanyard & Badge Partner",
    price: "$4,999",
    icon: "🪪",
    description: "Maximum visibility — your brand worn by every attendee throughout the entire event.",
    highlights: [
      "1 Booth Space (10ft × 10ft)",
      "2 Delegate Passes",
      "1 EDM Spotlight",
      "Thumbnail LED Screen & Branded Signage",
      "Product Demo",
      "Live Podcast Recording",
      "Website Showcase (50 Words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "Luncheon Partner",
    price: "$14,999",
    icon: "🍽️",
    description: "Own the luncheon experience — branded as the exclusive host of the midday networking session attended by all delegates.",
    highlights: [
      "1 Booth Space (10ft × 10ft)",
      "2 Delegate Passes",
      "1 EDM Spotlight",
      "Thumbnail LED Screen & Branded Signage",
      "Product Demo",
      "Live Podcast Recording",
      "Website Showcase (50 Words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "CxO Breakfast Partner",
    price: "$9,999",
    icon: "☕",
    description: "Exclusive access to the highest-trust setting at the festival — an invitation-only breakfast for C-Suite and senior executives.",
    highlights: [
      "1 Booth Space (10ft × 10ft)",
      "2 Delegate Passes",
      "1 EDM Spotlight",
      "Thumbnail LED Screen & Branded Signage",
      "Live Podcast Recording",
      "Website Showcase (50 Words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "Gala Dinner Partner",
    price: "$19,999",
    icon: "🥂",
    description: "Be the name behind the most prestigious evening of the festival — a premium dinner and networking reception for senior leaders.",
    highlights: [
      "1 Booth Space (10ft × 10ft)",
      "2 Delegate Passes",
      "1 EDM Spotlight",
      "Thumbnail LED Screen & Branded Signage",
      "Product Demo",
      "Live Podcast Recording",
      "Website Showcase (50 Words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "WiFi Partner",
    price: "$2,499",
    icon: "📶",
    description: "Your brand on every screen, every device — logo featured on the event WiFi splash page accessed by all attendees.",
    highlights: [
      "1 Booth Space (10ft × 10ft)",
      "2 Delegate Passes",
      "1 EDM Spotlight",
      "Thumbnail LED Screen & Branded Signage",
      "Live Podcast Recording",
      "Website Showcase (50 Words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "Registration Partner",
    price: "$4,999",
    icon: "📋",
    description: "First impressions start here — your brand is front and centre at the registration desk, the first touchpoint for every attendee.",
    highlights: [
      "1 Booth Space (10ft × 10ft)",
      "2 Delegate Passes",
      "1 EDM Spotlight",
      "Thumbnail LED Screen & Branded Signage",
      "Product Demo",
      "Live Podcast Recording",
      "Website Showcase (50 Words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "Visitor Bag Partner",
    price: "$4,999",
    icon: "🛍️",
    description: "Your materials in every visitor bag — reach the broader audience beyond delegates with your branded content.",
    highlights: [
      "1 Booth Space (10ft × 10ft)",
      "2 Delegate Passes",
      "1 EDM Spotlight",
      "Thumbnail LED Screen & Branded Signage",
      "Live Podcast Recording",
      "Website Showcase (50 Words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "Custom Category Sponsor",
    price: "$7,499",
    icon: "⭐",
    description: "A bespoke naming opportunity — sponsor a specific category, zone, or experience that aligns with your brand identity.",
    highlights: [
      "1 Booth Space (10ft × 10ft)",
      "2 Delegate Passes",
      "Delegate Bag Insert: Full Page",
      "e-Show Directory: Half Page",
      "1 EDM Spotlight",
      "1:1 Curated Meetings (×2)",
      "VIP Lounge Access (×3)",
      "Press Release & Media Interview",
      "Thumbnail LED Screen & Branded Signage",
      "Product Demo",
      "Live Podcast Recording",
      "Website Showcase (50 Words)",
      "Post Event Social Media Video",
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   SPONSOR PAGE
   ═══════════════════════════════════════════════════════ */

export default function Sponsor() {
  var s1 = useState(false); var dark = s1[0]; var setDark = s1[1];
  var s2 = useState(false); var inquiryOpen = s2[0]; var setInquiryOpen = s2[1];

  useEffect(function () {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () {
      setDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);

  var bg      = dark ? "#06020f" : "#ffffff";
  var textMain = dark ? "#ffffff" : "#0d0520";
  var textMid  = dark ? "rgba(255,255,255,0.60)" : "rgba(13,5,32,0.62)";
  var textSoft = dark ? "rgba(200,185,255,0.40)" : "rgba(90,40,180,0.40)";
  var cardBg   = dark ? "rgba(155,135,245,0.06)" : "rgba(122,63,209,0.03)";
  var cardBdr  = dark ? "rgba(155,135,245,0.12)" : "rgba(122,63,209,0.10)";
  var accent   = dark ? "#b99eff" : "#7a3fd1";

  return (
    <>
      <style>{`
        @keyframes sponsor-glow-breathe {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .sponsor-hero {
          position: relative; overflow: hidden;
          min-height: 80vh;
          display: flex; align-items: center; justify-content: center;
        }
        .sponsor-hero-grid {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image:
            linear-gradient(rgba(122,63,209,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,63,209,0.04) 1px, transparent 1px);
          background-size: 68px 68px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 10%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 10%, transparent 100%);
        }
        .sponsor-hero-glow {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 1;
          animation: sponsor-glow-breathe 8s ease-in-out infinite;
        }

        /* ── DESKTOP TABLE ── */
        .sp-desktop-table { display: block; }
        .sp-mobile-cards  { display: none; }

        /* ── MOBILE CARDS ── */
        @media (max-width: 768px) {
          .sp-desktop-table { display: none !important; }
          .sp-mobile-cards  { display: block !important; }
          .sponsor-hero { min-height: auto; padding-top: 5rem; padding-bottom: 4rem; }
          .sponsor-hero-stats { flex-direction: column !important; }
          .additional-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1100px) {
          .pkg-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .additional-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── TIER TAB STRIP ── */
        .tier-tabs {
          display: flex; gap: 0;
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(122,63,209,0.18);
          margin-bottom: 24px;
        }
        .tier-tab {
          flex: 1; padding: 12px 8px;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.65rem; font-weight: 800;
          text-align: center; cursor: pointer;
          border: none; background: transparent;
          transition: all 0.2s ease;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* ── BENEFIT LIST CARD ── */
        .benefit-row {
          display: flex; align-items: flex-start;
          gap: 12px; padding: 13px 0;
          border-bottom: 1px solid rgba(122,63,209,0.08);
        }
        .benefit-row:last-child { border-bottom: none; }
        .benefit-label { font-size: 0.88rem; font-weight: 500; flex: 1; line-height: 1.4; }
        .benefit-value { font-size: 0.88rem; font-weight: 700; text-align: right; flex-shrink: 0; }

        /* ── ADDITIONAL PACKAGE CARDS ── */
        .add-card {
          border-radius: 20px;
          padding: 28px 24px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .add-card:hover { transform: translateY(-4px); }
        .add-highlight-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 7px 0;
          border-bottom: 1px solid rgba(122,63,209,0.07);
          font-size: 0.86rem;
        }
        .add-highlight-item:last-child { border-bottom: none; }
      `}</style>

      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="sponsor-hero" style={{ background: bg }}>
        <div className="sponsor-hero-grid" />
        <div className="sponsor-hero-glow" style={{
          width: 650, height: 650,
          background: dark ? "radial-gradient(circle, rgba(122,63,209,0.22) 0%, transparent 70%)" : "radial-gradient(circle, rgba(122,63,209,0.10) 0%, transparent 70%)",
          top: -200, left: -150, filter: "blur(90px)",
        }} />
        <div className="sponsor-hero-glow" style={{
          width: 500, height: 500,
          background: dark ? "radial-gradient(circle, rgba(245,166,35,0.14) 0%, transparent 70%)" : "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)",
          top: -100, right: -180, filter: "blur(100px)", animationDelay: "3s",
        }} />

        <div style={{
          position: "relative", zIndex: 5,
          maxWidth: 900, margin: "0 auto",
          padding: "clamp(5rem, 10vw, 8rem) 6%",
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.25, duration: 1.5, delay: 0.25 }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
              fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.5px", marginBottom: 10,
            }}
          >
            <span style={{ color: textMain }}>Partner With Us </span>
            <span style={{
              background: "linear-gradient(135deg, var(--brand-purple, #7a3fd1), var(--brand-orange, #f5a623))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>To Lead The Future</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            style={{
              width: 70, height: 2, borderRadius: 2,
              background: "linear-gradient(90deg, " + accent + ", var(--brand-orange, #f5a623))",
              margin: "18px auto 24px", transformOrigin: "center",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1.4, delay: 0.45 }}
            style={{
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", lineHeight: 1.85,
              color: textMid, maxWidth: 600, marginBottom: 36,
              textAlign: "justify", hyphens: "auto",
            }}
          >
            The Tech Festival Canada is the ultimate platform for companies to showcase
            their leadership in emerging technologies. Our sponsorship packages provide
            unparalleled branding, networking, and thought-leadership opportunities,
            helping your company stay ahead in a competitive market.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1.2, delay: 0.6 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}
          >
            <button
              onClick={function () { setInquiryOpen(true); }}
              style={{
                fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", fontWeight: 800,
                letterSpacing: "1px", textTransform: "uppercase",
                padding: "17px 42px", borderRadius: 14, border: "none", cursor: "pointer",
                background: dark ? "#ffffff" : "#0d0520", color: dark ? "#0d0520" : "#ffffff",
                boxShadow: dark ? "0 6px 28px rgba(155,135,245,0.2)" : "0 6px 28px rgba(13,5,32,0.18)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={function (e) { e.currentTarget.style.background = "linear-gradient(135deg, #7a3fd1, #f5a623)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={function (e) { e.currentTarget.style.background = dark ? "#ffffff" : "#0d0520"; e.currentTarget.style.color = dark ? "#0d0520" : "#ffffff"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Write to Us <span style={{ marginLeft: 10 }}>→</span>
            </button>

            <div className="sponsor-hero-stats" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { num: "13", label: "Packages" },
                { num: "500+", label: "Decision Makers" },
                { num: "27-28 Oct", label: "2026" },
              ].map(function (s) {
                return (
                  <div key={s.label} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 22px", borderRadius: 14, background: cardBg, border: "1px solid " + cardBdr,
                  }}>
                    <span style={{
                      fontFamily: "'Orbitron', sans-serif", fontSize: "0.88rem", fontWeight: 900,
                      background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>{s.num}</span>
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: textSoft }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 100, zIndex: 4, pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent, " + bg + ")",
        }} />
      </section>

      {/* ═══════════ COMPARISON TABLE ═══════════ */}
      <ComparisonTable
        dark={dark} bg={bg} textMain={textMain} textMid={textMid}
        textSoft={textSoft} accent={accent} cardBg={cardBg} cardBdr={cardBdr}
        onInquiry={function () { setInquiryOpen(true); }}
      />

      {/* ═══════════ ADDITIONAL PACKAGES ═══════════ */}
      <AdditionalPackages
        dark={dark} bg={bg} textMain={textMain} textMid={textMid}
        textSoft={textSoft} accent={accent} cardBg={cardBg} cardBdr={cardBdr}
        onInquiry={function () { setInquiryOpen(true); }}
      />

      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section style={{ background: bg, padding: "0 6% 5rem" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          background: "linear-gradient(135deg, rgba(122,63,209,0.12), rgba(245,166,35,0.08))",
          border: "1px solid " + cardBdr, borderRadius: 28,
          padding: "clamp(2.5rem, 5vw, 4rem)", textAlign: "center",
        }}>
          <p style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: 900, color: textMain, marginBottom: 12,
          }}>Ready to Partner?</p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: textMid, maxWidth: 500, margin: "0 auto 28px" }}>
            Get in touch to discuss a custom package tailored to your goals, or secure one of our standard partnerships today.
          </p>
          <button
            onClick={function () { setInquiryOpen(true); }}
            style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", fontWeight: 800,
              letterSpacing: "1px", textTransform: "uppercase", padding: "16px 38px", borderRadius: 14,
              border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)", color: "#ffffff",
              boxShadow: "0 6px 28px rgba(122,63,209,0.3)", transition: "transform 0.2s ease",
            }}
            onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; }}
          >Write to Us</button>
        </div>
      </section>

      <Footer />
      <SponsorInquiryModal isOpen={inquiryOpen} onClose={function () { setInquiryOpen(false); }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPARISON TABLE — desktop table + mobile cards
   ═══════════════════════════════════════════════════════ */

function ComparisonTable(props) {
  var dark = props.dark;
  var bg = props.bg;
  var textMain = props.textMain;
  var textMid = props.textMid;
  var textSoft = props.textSoft;
  var accent = props.accent;
  var cardBdr = props.cardBdr;
  var cardBg = props.cardBg;

  var sectionRef = useRef(null);
  var theadRef = useRef(null);
  var s1 = useState(false); var showBar = s1[0]; var setShowBar = s1[1];
  var s2 = useState(0); var activeTier = s2[0]; var setActiveTier = s2[1];

  useEffect(function () {
    function onScroll() {
      var section = sectionRef.current;
      var thead = theadRef.current;
      if (!section || !thead) return;
      var sectionRect = section.getBoundingClientRect();
      var theadRect = thead.getBoundingClientRect();
      setShowBar(theadRect.bottom < 80 && sectionRect.bottom > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return function () { window.removeEventListener("scroll", onScroll); };
  }, []);

  var barBg = dark ? "rgba(10,5,24,0.95)" : "rgba(248,246,255,0.97)";

  // Flatten rows (no group headers) for mobile benefit list
  var benefitRows = ROWS.filter(function (r) { return !r.group; });
  var groupedRows = ROWS;

  return (
    <>
      {/* ── FIXED FLOATING TIER BAR (desktop only) ── */}
      <div className="sp-desktop-table" style={{
        position: "fixed", top: 80, left: 0, right: 0, zIndex: 900,
        transform: showBar ? "translateY(0)" : "translateY(-100%)",
        opacity: showBar ? 1 : 0,
        transition: "transform 0.3s ease, opacity 0.25s ease",
        pointerEvents: showBar ? "auto" : "none",
        padding: "0 6%",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "28% repeat(4, 1fr)",
            background: barBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid " + cardBdr,
            boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.6)" : "0 4px 24px rgba(122,63,209,0.08)",
          }}>
            <div style={{ padding: "16px 24px", display: "flex", alignItems: "center" }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: textSoft }}>Benefit</span>
            </div>
            {TIERS.map(function (tier) {
              return (
                <div key={tier.name} style={{
                  padding: "14px 12px", textAlign: "center",
                  borderLeft: "1px solid " + cardBdr,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                }}>
                  <div style={{ width: 24, height: 3, borderRadius: 3, background: tier.color, boxShadow: "0 0 10px " + tier.color + "50", marginBottom: 4 }} />
                  <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", fontWeight: 900, color: textMain }}>{tier.name}</span>
                  <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.95rem", fontWeight: 900, color: tier.color }}>{tier.price}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── TABLE SECTION ── */}
      <section ref={sectionRef} style={{ background: bg, padding: "5rem 6% 5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <RevealHeader
            eyebrow="Sponsorship Tiers" title="Compare Packages"
            subtitle="Every benefit at a glance — pick the partnership level that matches your ambitions."
            textMain={textMain} textMid={textMid} textSoft={textSoft} accent={accent}
          />

          {/* ─── DESKTOP TABLE ─── */}
          <div className="sp-desktop-table" style={{ marginTop: "2.5rem", overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 860, borderCollapse: "separate", borderSpacing: 0, tableLayout: "fixed" }}>
              <thead ref={theadRef} style={{ visibility: showBar ? "hidden" : "visible", opacity: showBar ? 0 : 1, transition: "opacity 0.2s ease" }}>
                <tr>
                  <th style={{ background: dark ? "#0d0620" : "#f4f0ff", padding: "22px 24px", textAlign: "left", borderBottom: "2px solid " + cardBdr, width: "28%" }}>
                    <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: textSoft }}>Benefit</span>
                  </th>
                  {TIERS.map(function (tier) {
                    return (
                      <th key={tier.name} style={{ background: dark ? "#0d0620" : "#f4f0ff", padding: "20px 16px", textAlign: "center", borderBottom: "2px solid " + cardBdr, borderLeft: "1px solid " + cardBdr, width: "18%" }}>
                        <div style={{ width: 32, height: 4, borderRadius: 4, background: tier.color, margin: "0 auto 12px", boxShadow: "0 0 14px " + tier.color + "60" }} />
                        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.88rem", fontWeight: 900, color: textMain, display: "block" }}>{tier.name}</span>
                        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.15rem", fontWeight: 900, color: tier.color, display: "block", marginTop: 5 }}>{tier.price}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {groupedRows.map(function (row, ri) {
                  if (row.group) {
                    return (
                      <tr key={ri}>
                        <td colSpan={TIERS.length + 1} style={{
                          padding: "20px 24px 12px",
                          background: dark ? "rgba(122,63,209,0.08)" : "rgba(122,63,209,0.04)",
                          borderTop: ri > 0 ? "2px solid " + cardBdr : "none",
                        }}>
                          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: accent }}>{row.group}</span>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={ri}
                      style={{ background: ri % 2 === 0 ? "transparent" : (dark ? "rgba(155,135,245,0.03)" : "rgba(122,63,209,0.018)") }}
                      onMouseEnter={function (e) { e.currentTarget.style.background = dark ? "rgba(155,135,245,0.07)" : "rgba(122,63,209,0.04)"; }}
                      onMouseLeave={function (e) { e.currentTarget.style.background = ri % 2 === 0 ? "transparent" : (dark ? "rgba(155,135,245,0.03)" : "rgba(122,63,209,0.018)"); }}
                    >
                      <td style={{ padding: "16px 24px", fontSize: "0.95rem", fontWeight: 500, color: dark ? "rgba(255,255,255,0.78)" : "rgba(13,5,32,0.72)", borderTop: "1px solid " + (dark ? "rgba(155,135,245,0.07)" : "rgba(122,63,209,0.06)"), lineHeight: 1.4 }}>{row.label}</td>
                      {row.values.map(function (val, vi) {
                        return (
                          <td key={vi} style={{ padding: "16px 14px", textAlign: "center", borderTop: "1px solid " + (dark ? "rgba(155,135,245,0.07)" : "rgba(122,63,209,0.06)"), borderLeft: "1px solid " + (dark ? "rgba(155,135,245,0.07)" : "rgba(122,63,209,0.06)"), fontSize: "0.92rem" }}>
                            {val === true ? (
                              <span style={{ color: "#4ade80", fontSize: "1.3rem", fontWeight: 700 }}>✓</span>
                            ) : val === false ? (
                              <span style={{ color: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)", fontSize: "1rem" }}>—</span>
                            ) : (
                              <span style={{ fontWeight: 700, fontSize: "0.92rem", color: dark ? "rgba(255,255,255,0.88)" : "#0d0520" }}>{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ─── MOBILE CARDS ─── */}
          <div className="sp-mobile-cards" style={{ marginTop: "2rem" }}>
            {/* Tier selector tabs */}
            <div className="tier-tabs">
              {TIERS.map(function (tier, i) {
                var isActive = activeTier === i;
                return (
                  <button
                    key={tier.name}
                    className="tier-tab"
                    onClick={function () { setActiveTier(i); }}
                    style={{
                      background: isActive ? tier.color : "transparent",
                      color: isActive ? "#fff" : (dark ? "rgba(255,255,255,0.5)" : "rgba(13,5,32,0.45)"),
                      borderRight: i < TIERS.length - 1 ? "1px solid rgba(122,63,209,0.18)" : "none",
                    }}
                  >
                    {tier.name}
                  </button>
                );
              })}
            </div>

            {/* Active tier card */}
            {TIERS.map(function (tier, ti) {
              if (activeTier !== ti) return null;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: cardBg, border: "1px solid " + cardBdr,
                    borderRadius: 20, padding: "24px 20px",
                  }}
                >
                  {/* Tier header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                      <div style={{ width: 32, height: 4, borderRadius: 4, background: tier.color, boxShadow: "0 0 12px " + tier.color + "70", marginBottom: 8 }} />
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.1rem", fontWeight: 900, color: textMain }}>{tier.name} Partner</div>
                    </div>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.5rem", fontWeight: 900, color: tier.color }}>{tier.price}</div>
                  </div>

                  {/* Group sections */}
                  {(function () {
                    var sections = [];
                    var currentGroup = null;
                    var currentItems = [];
                    groupedRows.forEach(function (row, ri) {
                      if (row.group) {
                        if (currentGroup) sections.push({ group: currentGroup, items: currentItems });
                        currentGroup = row.group;
                        currentItems = [];
                      } else {
                        currentItems.push(row);
                      }
                    });
                    if (currentGroup) sections.push({ group: currentGroup, items: currentItems });
                    return sections.map(function (section) {
                      return (
                        <div key={section.group} style={{ marginBottom: 20 }}>
                          <div style={{
                            fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem",
                            fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase",
                            color: accent, marginBottom: 10, paddingBottom: 8,
                            borderBottom: "1px solid " + (dark ? "rgba(122,63,209,0.2)" : "rgba(122,63,209,0.15)"),
                          }}>{section.group}</div>
                          {section.items.map(function (row) {
                            var val = row.values[ti];
                            return (
                              <div key={row.label} className="benefit-row">
                                <span className="benefit-label" style={{ color: dark ? "rgba(255,255,255,0.75)" : "rgba(13,5,32,0.70)" }}>{row.label}</span>
                                <span className="benefit-value" style={{ color: val === false ? (dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)") : (val === true ? "#4ade80" : textMain) }}>
                                  {val === true ? "✓" : val === false ? "—" : val}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    });
                  })()}

                  {/* CTA */}
                  <button
                    onClick={props.onInquiry}
                    style={{
                      width: "100%", marginTop: 8,
                      fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", fontWeight: 800,
                      letterSpacing: "0.8px", textTransform: "uppercase",
                      padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
                      background: "linear-gradient(135deg, #7a3fd1, #f5a623)", color: "#fff",
                    }}
                  >Enquire About {tier.name} →</button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   ADDITIONAL PACKAGES SECTION
   ═══════════════════════════════════════════════════════ */

function AdditionalPackages(props) {
  var dark = props.dark;
  var bg = props.bg;
  var textMain = props.textMain;
  var textMid = props.textMid;
  var textSoft = props.textSoft;
  var accent = props.accent;
  var cardBg = props.cardBg;
  var cardBdr = props.cardBdr;

  var sectionBg = dark ? "rgba(122,63,209,0.04)" : "rgba(122,63,209,0.025)";

  return (
    <section style={{
      background: sectionBg, borderTop: "1px solid " + cardBdr,
      borderBottom: "1px solid " + cardBdr, padding: "5rem 6%",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <RevealHeader
          eyebrow="Event Partnerships"
          title="Category Partnerships"
          subtitle="Own a specific moment at the festival. These partnerships tie your brand to a named experience and come with core visibility and activation benefits."
          textMain={textMain} textMid={textMid} textSoft={textSoft} accent={accent}
        />

        <div
          className="additional-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20, marginTop: "2.5rem",
          }}
        >
          {ADDITIONAL_PACKAGES.map(function (pkg, i) {
            return (
              <AdditionalCard
                key={pkg.name}
                pkg={pkg}
                dark={dark}
                textMain={textMain}
                textMid={textMid}
                accent={accent}
                cardBg={cardBg}
                cardBdr={cardBdr}
                delay={i * 0.06}
                onInquiry={props.onInquiry}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AdditionalCard(props) {
  var pkg = props.pkg;
  var dark = props.dark;
  var textMain = props.textMain;
  var textMid = props.textMid;
  var accent = props.accent;
  var cardBg = props.cardBg;
  var cardBdr = props.cardBdr;

  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", bounce: 0.2, duration: 1.1, delay: props.delay }}
      className="add-card"
      style={{
        background: cardBg,
        border: "1px solid " + cardBdr,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: "1.6rem" }}>{pkg.icon}</span>
          <span style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: "1rem", fontWeight: 900,
            background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>{pkg.price}</span>
        </div>
        <div style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", fontWeight: 900,
          color: textMain, marginBottom: 8, lineHeight: 1.3,
        }}>{pkg.name}</div>
        <p style={{ fontSize: "0.82rem", color: textMid, lineHeight: 1.65, margin: 0 }}>{pkg.description}</p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, " + accent + "40, transparent)", marginBottom: 16 }} />

      {/* Highlights */}
      <div style={{ marginBottom: 20 }}>
        {pkg.highlights.map(function (item) {
          return (
            <div key={item} className="add-highlight-item" style={{ color: dark ? "rgba(255,255,255,0.72)" : "rgba(13,5,32,0.68)" }}>
              <span style={{ color: "#4ade80", fontSize: "0.8rem", flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: "0.83rem", lineHeight: 1.4 }}>{item}</span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={props.onInquiry}
        style={{
          width: "100%", padding: "11px", borderRadius: 10,
          fontFamily: "'Orbitron', sans-serif", fontSize: "0.68rem", fontWeight: 800,
          letterSpacing: "0.5px", textTransform: "uppercase",
          border: "1.5px solid " + (dark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.35)"),
          background: "transparent",
          color: dark ? "rgba(200,185,255,0.85)" : "#7a3fd1",
          cursor: "pointer", transition: "all 0.2s ease",
        }}
        onMouseEnter={function (e) { e.currentTarget.style.background = "linear-gradient(135deg, #7a3fd1, #f5a623)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "transparent"; }}
        onMouseLeave={function (e) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark ? "rgba(200,185,255,0.85)" : "#7a3fd1"; e.currentTarget.style.borderColor = dark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.35)"; }}
      >Enquire →</button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════════════════════ */

function RevealHeader(props) {
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", bounce: 0.2, duration: 1.2 }}
      style={{ textAlign: "center", marginBottom: "1rem" }}
    >
      <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: props.textSoft, marginBottom: 12 }}>{props.eyebrow}</p>
      <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", fontWeight: 900, color: props.textMain, marginBottom: 16 }}>{props.title}</h2>
      <div style={{ width: 60, height: 2, borderRadius: 2, background: "linear-gradient(90deg, " + props.accent + ", var(--brand-orange, #f5a623))", margin: "0 auto 20px" }} />
      <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: props.textMid, maxWidth: 600, margin: "0 auto" }}>{props.subtitle}</p>
    </motion.div>
  );
}
