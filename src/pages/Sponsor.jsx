import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SponsorInquiryModal from "../components/SponsorInquiryModal";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   PACKAGE DATA — from spreadsheet
   ═══════════════════════════════════════════════════════ */

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

      {/* ═══════════ COMPARISON TABLE ═══════════ */}
      <section style={{ background: bg, padding: "5rem 6% 5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <RevealHeader
            eyebrow="Sponsorship Tiers"
            title="Compare Packages"
            subtitle="Every benefit at a glance — pick the partnership level that matches your ambitions."
            textMain={textMain} textMid={textMid} textSoft={textSoft} accent={accent}
          />

          {/* Table — no overflow:hidden wrapper so sticky works */}
          <div style={{ marginTop: "2.5rem", overflowX: "auto" }}>
            <table style={{
              width: "100%", minWidth: 860,
              borderCollapse: "separate",
              borderSpacing: 0,
              tableLayout: "fixed",
            }}>
              {/* ── STICKY HEADER — sticks below navbar (80px) ── */}
              <thead>
                <tr>
                  <th style={{
                    position: "sticky", top: 80, zIndex: 20,
                    background: dark ? "#0d0620" : "#f4f0ff",
                    padding: "22px 24px",
                    textAlign: "left",
                    borderBottom: "2px solid " + cardBdr,
                    width: "28%",
                    boxShadow: "0 2px 12px " + (dark ? "rgba(0,0,0,0.5)" : "rgba(122,63,209,0.06)"),
                  }}>
                    <span style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "0.78rem", fontWeight: 800,
                      letterSpacing: "1.5px", textTransform: "uppercase",
                      color: textSoft,
                    }}>Benefit</span>
                  </th>
                  {TIERS.map(function (tier) {
                    return (
                      <th key={tier.name} style={{
                        position: "sticky", top: 80, zIndex: 20,
                        background: dark ? "#0d0620" : "#f4f0ff",
                        padding: "20px 16px",
                        textAlign: "center",
                        borderBottom: "2px solid " + cardBdr,
                        borderLeft: "1px solid " + cardBdr,
                        width: "18%",
                        boxShadow: "0 2px 12px " + (dark ? "rgba(0,0,0,0.5)" : "rgba(122,63,209,0.06)"),
                      }}>
                        <div style={{
                          width: 32, height: 4, borderRadius: 4,
                          background: tier.color,
                          margin: "0 auto 12px",
                          boxShadow: "0 0 14px " + tier.color + "60",
                        }} />
                        <span style={{
                          fontFamily: "'Orbitron', sans-serif",
                          fontSize: "0.88rem", fontWeight: 900,
                          color: textMain, display: "block",
                        }}>{tier.name}</span>
                        <span style={{
                          fontFamily: "'Orbitron', sans-serif",
                          fontSize: "1.15rem", fontWeight: 900,
                          color: tier.color, display: "block",
                          marginTop: 5,
                        }}>{tier.price}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* ── BODY ── */}
              <tbody>
                {ROWS.map(function (row, ri) {
                  var isGroup = row.group;
                  if (isGroup) {
                    return (
                      <tr key={ri}>
                        <td colSpan={TIERS.length + 1} style={{
                          padding: "20px 24px 12px",
                          background: dark ? "rgba(122,63,209,0.08)" : "rgba(122,63,209,0.04)",
                          borderTop: ri > 0 ? "2px solid " + cardBdr : "none",
                        }}>
                          <span style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: "0.72rem", fontWeight: 800,
                            letterSpacing: "2.5px", textTransform: "uppercase",
                            color: accent,
                          }}>{row.group}</span>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={ri} style={{
                      background: ri % 2 === 0
                        ? "transparent"
                        : (dark ? "rgba(155,135,245,0.03)" : "rgba(122,63,209,0.018)"),
                    }}
                    onMouseEnter={function (e) {
                      e.currentTarget.style.background = dark
                        ? "rgba(155,135,245,0.07)"
                        : "rgba(122,63,209,0.04)";
                    }}
                    onMouseLeave={function (e) {
                      e.currentTarget.style.background = ri % 2 === 0
                        ? "transparent"
                        : (dark ? "rgba(155,135,245,0.03)" : "rgba(122,63,209,0.018)");
                    }}
                    >
                      <td style={{
                        padding: "16px 24px",
                        fontSize: "0.95rem", fontWeight: 500,
                        color: dark ? "rgba(255,255,255,0.78)" : "rgba(13,5,32,0.72)",
                        borderTop: "1px solid " + (dark ? "rgba(155,135,245,0.07)" : "rgba(122,63,209,0.06)"),
                        lineHeight: 1.4,
                      }}>{row.label}</td>
                      {row.values.map(function (val, vi) {
                        return (
                          <td key={vi} style={{
                            padding: "16px 14px",
                            textAlign: "center",
                            borderTop: "1px solid " + (dark ? "rgba(155,135,245,0.07)" : "rgba(122,63,209,0.06)"),
                            borderLeft: "1px solid " + (dark ? "rgba(155,135,245,0.07)" : "rgba(122,63,209,0.06)"),
                            fontSize: "0.92rem",
                          }}>
                            {val === true ? (
                              <span style={{ color: "#4ade80", fontSize: "1.3rem", fontWeight: 700 }}>✓</span>
                            ) : val === false ? (
                              <span style={{ color: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)", fontSize: "1rem" }}>—</span>
                            ) : (
                              <span style={{
                                fontWeight: 700,
                                fontSize: "0.92rem",
                                color: dark ? "rgba(255,255,255,0.88)" : "#0d0520",
                              }}>{val}</span>
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
      <SponsorInquiryModal isOpen={inquiryOpen} onClose={function () { setInquiryOpen(false); }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPARISON TABLE DATA
   ═══════════════════════════════════════════════════════ */

var TIERS = [
  { name: "Platinum", price: "$24,999", color: "#b99eff" },
  { name: "Gold",     price: "$19,999", color: "#f5a623" },
  { name: "Silver",   price: "$14,999", color: "#c0c0c0" },
  { name: "Bronze",   price: "$9,999",  color: "#cd7f32" },
];

// true = ✓, false = —, string = specific value
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
