import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InquiryModal from "../components/InquiryModal";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
 
/* ═══════════════════════════════════════════════════════
   PACKAGE DATA — from spreadsheet
   ═══════════════════════════════════════════════════════ */
 
var FEATURED = [
  {
    name: "Platinum Partner",
    price: "$24,999",
    spots: "Limited",
    tagline: "Position your brand as the face of The Tech Festival Canada.",
    color: "#b99eff",
    benefits: [
      "4 Booth Spaces (10ft × 10ft)",
      "2 Curated Conference Sessions",
      "15 Delegate Passes",
      "15 VIP Lounge Access passes",
      "10 scheduled 1:1 Meetings",
      "2 Award Presenting Opportunities",
      "Opening Ceremony Guest of Honour",
      "Press Release & Media Interview",
      "Double Spread in e-Show Directory",
      "Full Page Delegate & Visitor Bag Insert",
      "4 EDM Spotlights",
      "Large LED Screen Booth Wall & Signage",
      "Product Demo slot",
      "Live Podcast Recording",
      "Website Showcase (50 words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "Gold Partner",
    price: "$19,999",
    spots: "Limited",
    tagline: "Highlight your commitment to driving innovation at scale.",
    color: "#f5a623",
    benefits: [
      "3 Booth Spaces (10ft × 10ft)",
      "1 Curated Conference Session",
      "8 Delegate Passes",
      "8 VIP Lounge Access passes",
      "7 scheduled 1:1 Meetings",
      "1 Award Presenting Opportunity",
      "Opening Ceremony Guest of Honour",
      "Press Release & Media Interview",
      "Full Page in e-Show Directory",
      "Full Page Delegate & Visitor Bag Insert",
      "3 EDM Spotlights",
      "Medium LED Screen Booth Wall & Signage",
      "Product Demo slot",
      "Live Podcast Recording",
      "Website Showcase (50 words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "Silver Partner",
    price: "$14,999",
    spots: "Limited",
    tagline: "Elevate your presence among Canada's top tech decision-makers.",
    color: "#c0c0c0",
    benefits: [
      "2 Booth Spaces (10ft × 10ft)",
      "6 Delegate Passes",
      "5 VIP Lounge Access passes",
      "3 scheduled 1:1 Meetings",
      "Press Release & Media Interview",
      "Full Page in e-Show Directory",
      "Full Page Delegate & Visitor Bag Insert",
      "3 EDM Spotlights",
      "Small LED Screen Booth Wall & Signage",
      "Product Demo slot",
      "Live Podcast Recording",
      "Website Showcase (50 words)",
      "Post Event Social Media Video",
    ],
  },
  {
    name: "Bronze Partner",
    price: "$9,999",
    spots: "Available",
    tagline: "Get in the room with the buyers and decision-makers who matter.",
    color: "#cd7f32",
    benefits: [
      "1 Booth Space (10ft × 10ft)",
      "4 Delegate Passes",
      "3 VIP Lounge Access passes",
      "2 scheduled 1:1 Meetings",
      "Press Release & Media Interview",
      "Half Page in e-Show Directory",
      "Full Page Delegate & Visitor Bag Insert",
      "1 EDM Spotlight",
      "Thumbnail LED Screen & Signage",
      "Product Demo slot",
      "Live Podcast Recording",
      "Website Showcase (50 words)",
      "Post Event Social Media Video",
    ],
  },
];
 
var SPECIALTY = [
  {
    name: "Delegate Kit Partner",
    price: "$4,999",
    spots: "1",
    benefits: ["1 Booth Space", "2 Delegate Passes", "1 EDM Spotlight", "Thumbnail Signage", "Live Podcast Recording", "Website Showcase", "Post Event Video"],
  },
  {
    name: "Lanyard & Badge Partner",
    price: "$4,999",
    spots: "1",
    benefits: ["1 Booth Space", "2 Delegate Passes", "1 EDM Spotlight", "Thumbnail Signage", "Live Podcast Recording", "Website Showcase", "Post Event Video"],
  },
  {
    name: "Luncheon Partner",
    price: "$14,999",
    spots: "2",
    benefits: ["1 Booth Space", "2 Delegate Passes", "1 EDM Spotlight", "Thumbnail Signage", "Live Podcast Recording", "Website Showcase", "Post Event Video"],
  },
  {
    name: "CxO Breakfast Partner",
    price: "$9,999",
    spots: "2",
    benefits: ["1 Booth Space", "2 Delegate Passes", "1 EDM Spotlight", "Thumbnail Signage", "Live Podcast Recording", "Website Showcase", "Post Event Video"],
  },
  {
    name: "Gala Dinner Partner",
    price: "$19,999",
    spots: "1",
    benefits: ["1 Booth Space", "2 Delegate Passes", "1 EDM Spotlight", "Thumbnail Signage", "Live Podcast Recording", "Website Showcase", "Post Event Video"],
  },
  {
    name: "WiFi Partner",
    price: "$2,499",
    spots: "1",
    benefits: ["2 Delegate Passes", "1 EDM Spotlight", "Thumbnail Signage", "Live Podcast Recording", "Website Showcase", "Post Event Video"],
  },
  {
    name: "Registration Partner",
    price: "$4,999",
    spots: "1",
    benefits: ["1 Booth Space", "2 Delegate Passes", "1 EDM Spotlight", "Thumbnail Signage", "Live Podcast Recording", "Website Showcase", "Post Event Video"],
  },
  {
    name: "Visitor Bag Partner",
    price: "$4,999",
    spots: "1",
    benefits: ["1 Booth Space", "2 Delegate Passes", "Full Page Visitor Bag Insert", "1 EDM Spotlight", "Thumbnail Signage", "Live Podcast Recording", "Website Showcase", "Post Event Video"],
  },
  {
    name: "Custom Category Sponsor",
    price: "$7,499",
    spots: "10",
    benefits: ["1 Booth Space", "2 Delegate Passes", "2 scheduled 1:1 Meetings", "3 VIP Lounge Access passes", "Full Page Delegate Bag Insert", "Half Page e-Show Directory", "Press Release & Media Interview", "1 EDM Spotlight", "Thumbnail Signage", "Live Podcast Recording", "Website Showcase", "Post Event Video"],
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
 
  var bg = dark ? "#06020f" : "#ffffff";
  var textMain = dark ? "#ffffff" : "#0d0520";
  var textMid = dark ? "rgba(255,255,255,0.60)" : "rgba(13,5,32,0.62)";
  var textSoft = dark ? "rgba(200,185,255,0.40)" : "rgba(90,40,180,0.40)";
  var cardBg = dark ? "rgba(155,135,245,0.06)" : "rgba(122,63,209,0.03)";
  var cardBdr = dark ? "rgba(155,135,245,0.12)" : "rgba(122,63,209,0.10)";
  var accent = dark ? "#b99eff" : "#7a3fd1";
 
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
        .pkg-card {
          border-radius: 24px; padding: 36px 32px;
          display: flex; flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .pkg-card:hover { transform: translateY(-6px); }
        .spec-card {
          border-radius: 20px; padding: 28px 24px;
          display: flex; flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .spec-card:hover { transform: translateY(-4px); }
        @media (max-width: 768px) {
          .pkg-grid { grid-template-columns: 1fr !important; }
          .spec-grid { grid-template-columns: 1fr !important; }
          .sponsor-hero { min-height: auto; padding-top: 5rem; padding-bottom: 4rem; }
          .sponsor-hero-stats { flex-direction: column !important; }
        }
        @media (min-width: 769px) and (max-width: 1100px) {
          .pkg-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
 
      <Navbar />
 
      {/* ═══════════ HERO ═══════════ */}
      <section className="sponsor-hero" style={{ background: bg }}>
        {/* Grid */}
        <div className="sponsor-hero-grid" />
 
        {/* Glows */}
        <div className="sponsor-hero-glow" style={{
          width: 650, height: 650,
          background: dark
            ? "radial-gradient(circle, rgba(122,63,209,0.22) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(122,63,209,0.10) 0%, transparent 70%)",
          top: -200, left: -150, filter: "blur(90px)",
        }} />
        <div className="sponsor-hero-glow" style={{
          width: 500, height: 500,
          background: dark
            ? "radial-gradient(circle, rgba(245,166,35,0.14) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)",
          top: -100, right: -180, filter: "blur(100px)", animationDelay: "3s",
        }} />
        <div className="sponsor-hero-glow" style={{
          width: 400, height: 300,
          background: dark
            ? "radial-gradient(circle, rgba(155,135,245,0.10) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(155,135,245,0.06) 0%, transparent 70%)",
          bottom: -60, left: "30%", filter: "blur(100px)", animationDelay: "5s",
        }} />
 
        {/* Content */}
        <div style={{
          position: "relative", zIndex: 5,
          maxWidth: 900, margin: "0 auto",
          padding: "clamp(5rem, 10vw, 8rem) 6%",
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
        }}>
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ type: "spring", bounce: 0.3, duration: 1.4, delay: 0.1 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 20px", borderRadius: 999,
              background: dark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.06)",
              border: "1px solid " + (dark ? "rgba(122,63,209,0.22)" : "rgba(122,63,209,0.18)"),
              marginBottom: 28,
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--brand-orange, #f5a623)",
              boxShadow: "0 0 8px var(--brand-orange, #f5a623)",
            }} />
            <span style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.65rem", fontWeight: 800,
              letterSpacing: "2px", textTransform: "uppercase",
              color: accent,
            }}>TFC 2026 Sponsorship</span>
          </motion.div>
 
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.25, duration: 1.5, delay: 0.25 }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
              fontWeight: 900, lineHeight: 1.08,
              letterSpacing: "-0.5px",
              marginBottom: 10,
            }}
          >
            <span style={{ color: textMain }}>Partner With Us </span>
            <span style={{
              background: "linear-gradient(135deg, var(--brand-purple, #7a3fd1), var(--brand-orange, #f5a623))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>To Lead The Future</span>
          </motion.h1>
 
          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            style={{
              width: 70, height: 2, borderRadius: 2,
              background: "linear-gradient(90deg, " + accent + ", var(--brand-orange, #f5a623))",
              margin: "18px auto 24px",
              transformOrigin: "center",
            }}
          />
 
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1.4, delay: 0.45 }}
            style={{
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
              lineHeight: 1.85, color: textMid,
              maxWidth: 600, marginBottom: 36,
              textAlign: "justify", hyphens: "auto",
            }}
          >
            The Tech Festival Canada is the ultimate platform for companies to showcase
            their leadership in emerging technologies. Our sponsorship packages provide
            unparalleled branding, networking, and thought-leadership opportunities,
            helping your company stay ahead in a competitive market.
          </motion.p>
 
          {/* CTA + Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1.2, delay: 0.6 }}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 32,
            }}
          >
            <button
              onClick={function () { setInquiryOpen(true); }}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.78rem", fontWeight: 800,
                letterSpacing: "1px", textTransform: "uppercase",
                padding: "17px 42px", borderRadius: 14,
                border: "none", cursor: "pointer",
                background: dark ? "#ffffff" : "#0d0520",
                color: dark ? "#0d0520" : "#ffffff",
                boxShadow: dark
                  ? "0 6px 28px rgba(155,135,245,0.2)"
                  : "0 6px 28px rgba(13,5,32,0.18)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={function (e) {
                e.currentTarget.style.background = "linear-gradient(135deg, #7a3fd1, #f5a623)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={function (e) {
                e.currentTarget.style.background = dark ? "#ffffff" : "#0d0520";
                e.currentTarget.style.color = dark ? "#0d0520" : "#ffffff";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Write to Us
              <span style={{ marginLeft: 10, display: "inline-block" }}>→</span>
            </button>
 
            {/* Stat pills */}
            <div className="sponsor-hero-stats" style={{
              display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
            }}>
              {[
                { num: "13", label: "Packages" },
                { num: "500+", label: "Decision Makers" },
                { num: "27-28 Oct", label: "2026" },
              ].map(function (s) {
                return (
                  <div key={s.label} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 22px", borderRadius: 14,
                    background: cardBg,
                    border: "1px solid " + cardBdr,
                  }}>
                    <span style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "0.88rem", fontWeight: 900,
                      background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>{s.num}</span>
                    <span style={{
                      fontSize: "0.62rem", fontWeight: 700,
                      letterSpacing: "0.8px", textTransform: "uppercase",
                      color: textSoft,
                    }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
 
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 100, zIndex: 4, pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent, " + bg + ")",
        }} />
      </section>
 
      {/* ═══════════ FEATURED PACKAGES ═══════════ */}
      <section style={{ background: bg, padding: "5rem 6% 3rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <RevealHeader
            eyebrow="Sponsorship Tiers"
            title="Partnership Packages"
            subtitle="From title sponsorship to category-specific partnerships — choose the level of visibility that matches your ambitions."
            textMain={textMain} textMid={textMid} textSoft={textSoft} accent={accent}
          />
 
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20, marginTop: "3rem",
          }} className="pkg-grid">
            {FEATURED.map(function (pkg) {
              return <PackageCard key={pkg.name} pkg={pkg} dark={dark} textMain={textMain} textMid={textMid} />;
            })}
          </div>
        </div>
      </section>
 
      {/* ═══════════ SPECIALTY PACKAGES ═══════════ */}
      <section style={{ background: bg, padding: "3rem 6% 5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <RevealHeader
            eyebrow="Specialty Partnerships"
            title="Category-Specific Opportunities"
            subtitle="Targeted visibility tied to key event touchpoints — from delegate kits to gala dinners."
            textMain={textMain} textMid={textMid} textSoft={textSoft} accent={accent}
          />
 
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16, marginTop: "2.5rem",
          }} className="spec-grid">
            {SPECIALTY.map(function (pkg) {
              return <SpecialtyCard key={pkg.name} pkg={pkg} dark={dark} textMain={textMain} textMid={textMid} />;
            })}
          </div>
        </div>
      </section>
 
      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section style={{ background: bg, padding: "0 6% 5rem" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          background: "linear-gradient(135deg, rgba(122,63,209,0.12), rgba(245,166,35,0.08))",
          border: "1px solid " + cardBdr,
          borderRadius: 28,
          padding: "clamp(2.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            fontWeight: 900, color: textMain, marginBottom: 12,
          }}>Ready to Partner?</p>
          <p style={{
            fontSize: "0.95rem", lineHeight: 1.7,
            color: textMid, maxWidth: 500, margin: "0 auto 28px",
          }}>
            Get in touch to discuss a custom package tailored to your goals,
            or secure one of our standard partnerships today.
          </p>
          <button
            onClick={function () { setInquiryOpen(true); }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.78rem", fontWeight: 800,
              letterSpacing: "1px", textTransform: "uppercase",
              padding: "16px 38px", borderRadius: 14,
              border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
              color: "#ffffff",
              boxShadow: "0 6px 28px rgba(122,63,209,0.3)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Write to Us
          </button>
        </div>
      </section>
 
      <Footer />
      <InquiryModal isOpen={inquiryOpen} onClose={function () { setInquiryOpen(false); }} />
    </>
  );
}
 
/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
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
      <p style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "0.68rem", fontWeight: 800,
        letterSpacing: "2.5px", textTransform: "uppercase",
        color: props.textSoft, marginBottom: 12,
      }}>{props.eyebrow}</p>
      <h2 style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
        fontWeight: 900, color: props.textMain, marginBottom: 16,
      }}>{props.title}</h2>
      <div style={{
        width: 60, height: 2, borderRadius: 2,
        background: "linear-gradient(90deg, " + props.accent + ", var(--brand-orange, #f5a623))",
        margin: "0 auto 20px",
      }} />
      <p style={{
        fontSize: "0.95rem", lineHeight: 1.8,
        color: props.textMid, maxWidth: 600, margin: "0 auto",
      }}>{props.subtitle}</p>
    </motion.div>
  );
}
 
function PackageCard(props) {
  var pkg = props.pkg;
  var dark = props.dark;
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-40px" });
 
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", bounce: 0.2, duration: 1 }}
      className="pkg-card"
      style={{
        background: dark ? "rgba(155,135,245,0.06)" : "rgba(122,63,209,0.03)",
        border: "1px solid " + (dark ? "rgba(155,135,245,0.14)" : "rgba(122,63,209,0.10)"),
        boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(122,63,209,0.06)",
      }}
    >
      <div style={{
        width: 40, height: 4, borderRadius: 4,
        background: pkg.color, marginBottom: 18,
        boxShadow: "0 0 12px " + pkg.color + "60",
      }} />
      <h3 style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "1.1rem", fontWeight: 900,
        color: props.textMain, marginBottom: 4,
      }}>{pkg.name}</h3>
      <p style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "1.5rem", fontWeight: 900,
        color: pkg.color, marginBottom: 6,
      }}>{pkg.price}</p>
      <p style={{
        fontSize: "0.68rem", fontWeight: 700,
        letterSpacing: "1px", textTransform: "uppercase",
        color: props.textMid, marginBottom: 14, opacity: 0.7,
      }}>{pkg.spots} spots</p>
      <p style={{
        fontSize: "0.88rem", lineHeight: 1.6,
        color: props.textMid, marginBottom: 22,
        fontWeight: 500, fontStyle: "italic",
      }}>{pkg.tagline}</p>
      <div style={{
        height: 1,
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        marginBottom: 18,
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {pkg.benefits.map(function (b, i) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: pkg.color, flexShrink: 0,
                marginTop: 7, opacity: 0.7,
              }} />
              <span style={{ fontSize: "0.82rem", lineHeight: 1.55, color: props.textMid }}>{b}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
 
function SpecialtyCard(props) {
  var pkg = props.pkg;
  var dark = props.dark;
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-30px" });
 
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", bounce: 0.2, duration: 0.9 }}
      className="spec-card"
      style={{
        background: dark ? "rgba(155,135,245,0.05)" : "rgba(122,63,209,0.02)",
        border: "1px solid " + (dark ? "rgba(155,135,245,0.10)" : "rgba(122,63,209,0.08)"),
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <h4 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "0.88rem", fontWeight: 800,
          color: props.textMain, lineHeight: 1.3,
        }}>{pkg.name}</h4>
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "0.7rem", fontWeight: 800,
          color: "var(--brand-orange, #f5a623)",
          whiteSpace: "nowrap", marginLeft: 8,
        }}>{pkg.spots} spot{pkg.spots !== "1" ? "s" : ""}</span>
      </div>
      <p style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "1.2rem", fontWeight: 900,
        background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text", marginBottom: 16,
      }}>{pkg.price}</p>
      <div style={{
        height: 1,
        background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
        marginBottom: 14,
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {pkg.benefits.map(function (b, i) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{
                width: 4, height: 4, borderRadius: "50%",
                background: dark ? "rgba(155,135,245,0.4)" : "rgba(122,63,209,0.3)",
                flexShrink: 0, marginTop: 7,
              }} />
              <span style={{ fontSize: "0.8rem", lineHeight: 1.5, color: props.textMid }}>{b}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
 
