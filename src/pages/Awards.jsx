import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

var PILLARS = [
  { name: "Artificial Intelligence", short: "AI", icon: "🧠", color: "#b99eff" },
  { name: "Quantum Computing", short: "Quantum", icon: "⚛️", color: "#7dd3fc" },
  { name: "Robotics", short: "Robotics", icon: "🤖", color: "#f5a623" },
  { name: "CleanTech & Sustainability", short: "CleanTech", icon: "🌿", color: "#4ade80" },
  { name: "Cybersecurity", short: "Cyber", icon: "🔒", color: "#f472b6" },
];

var SECTORS = [
  { name: "Healthcare & Life Sciences", short: "Healthcare", icon: "❤️" },
  { name: "Manufacturing, Supply Chain & Infrastructure", short: "Manufacturing", icon: "⚙️" },
  { name: "Defence, National Security & Public Safety", short: "Defence", icon: "🛡️" },
  { name: "Energy & Utilities", short: "Energy", icon: "⚡" },
  { name: "Banking, Financial Services & Insurance", short: "BFSI", icon: "🏦" },
];

var SPECIAL_AWARDS = [
  {
    name: "The Catalyst Lifetime Achievement Award",
    description: "Recognising an individual's sustained and transformative contribution to Canada's technology ecosystem over a distinguished career.",
    icon: "🏆", color: "#f5a623",
    note: "By invitation or internal committee nomination only.",
  },
  {
    name: "The Catalyst Rising Innovator Award",
    description: "Celebrating a Canadian startup (incorporated within the last 5 years) demonstrating a breakthrough application of one or more TTFC technology pillars to an industry challenge.",
    icon: "🚀", color: "#b99eff",
    note: "Open to startups incorporated in Canada within the last 5 years.",
  },
  {
    name: "The Catalyst Cross-Border Impact Award",
    description: "Honouring a Canada-international collaboration that has driven measurable technology adoption, knowledge transfer, or commercial impact across borders.",
    icon: "🌍", color: "#7dd3fc",
    note: "Both Canadian and international parties must co-submit.",
  },
];

var CRITERIA = [
  { name: "Innovation", weight: "25%", desc: "Novelty and originality of the technology application; uniqueness of approach compared to existing solutions." },
  { name: "Measurable Impact", weight: "30%", desc: "Quantifiable outcomes achieved — cost reduction, efficiency gains, revenue growth, risk mitigation." },
  { name: "Scalability", weight: "20%", desc: "Potential for the solution to be scaled across geographies, organisations, or adjacent sectors." },
  { name: "Canadian Relevance", weight: "15%", desc: "Contribution to Canada's technology ecosystem, talent development, and economic growth." },
  { name: "Execution Excellence", weight: "10%", desc: "Quality of implementation, team capability, stakeholder engagement, and project management." },
];

var TIMELINE = [
  { phase: "Phase 1", activity: "Framework Finalisation & Jury Recruitment", date: "June 1–30, 2026" },
  { phase: "Phase 2", activity: "Nominations Open", date: "July 1 – Aug 31, 2026" },
  { phase: "Phase 3", activity: "Screening & Eligibility", date: "Sep 1–14, 2026" },
  { phase: "Phase 4", activity: "Jury Evaluation & Scoring", date: "Sep 15–30, 2026" },
  { phase: "Phase 5", activity: "Top 5 Shortlist Announced", date: "October 6, 2026" },
  { phase: "Phase 6", activity: "Winners Sealed by Jury", date: "October 15, 2026" },
  { phase: "Phase 7", activity: "Awards Night — Live Reveal", date: "October 26, 2026" },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function FadeIn({ children, delay, y }) {
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: y || 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: delay || 0, ease: [0.215, 0.61, 0.355, 1] }}
    >{children}</motion.div>
  );
}

function GradientText({ children }) {
  return <span style={{ background: "linear-gradient(135deg, #b99eff, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{children}</span>;
}

function SectionLabel({ text, color }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color || "#f5a623", boxShadow: "0 0 8px " + (color || "#f5a623") + "60" }} />
      <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: color || "#f5a623" }}>{text}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

export default function Awards() {
  var s1 = useState(false); var dark = s1[0]; var setDark = s1[1];
  var s2 = useState(null); var activeCell = s2[0]; var setActiveCell = s2[1];

  useEffect(function () {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () { setDark(document.body.classList.contains("dark-mode")); });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);

  var bg = dark ? "#06020f" : "#ffffff";
  var textMain = dark ? "#ffffff" : "#0d0520";
  var textMid = dark ? "rgba(220,210,255,0.78)" : "rgba(13,5,32,0.62)";
  var textSoft = dark ? "rgba(200,185,255,0.40)" : "rgba(13,5,32,0.35)";
  var cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(122,63,209,0.03)";
  var cardBdr = dark ? "rgba(155,135,245,0.15)" : "rgba(122,63,209,0.10)";
  var accent = dark ? "#b99eff" : "#7a3fd1";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes awards-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes awards-glow { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
        @keyframes awards-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes awards-pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(1.8);opacity:0} }

        .awards-hero { position:relative; overflow:hidden; min-height:100vh; display:flex; align-items:center; justify-content:center; }
        .awards-matrix-grid { display:grid; grid-template-columns:180px repeat(5,1fr); gap:0; }
        .awards-matrix-cell { padding:14px 10px; text-align:center; cursor:pointer; transition:all 0.3s ease; position:relative; }
        .awards-matrix-cell:hover { z-index:2; }
        .awards-special-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .awards-criteria-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; }
        .awards-timeline { position:relative; }

        @media(max-width:1024px) {
          .awards-matrix-grid { grid-template-columns:120px repeat(5,1fr); }
          .awards-criteria-grid { grid-template-columns:repeat(3,1fr); }
        }
        @media(max-width:768px) {
          .awards-matrix-grid { display:none !important; }
          .awards-matrix-mobile { display:block !important; }
          .awards-special-grid { grid-template-columns:1fr !important; }
          .awards-criteria-grid { grid-template-columns:1fr !important; }
          .awards-hero-content { flex-direction:column !important; text-align:center !important; }
          .awards-hero-img { max-width:300px !important; margin:0 auto !important; }
          .awards-stats-row { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:500px) {
          .awards-stats-row { grid-template-columns:1fr !important; }
        }
        .awards-matrix-mobile { display:none; }
      `}} />

      <Navbar />

      {/* ═══════ HERO ═══════ */}
      <section className="awards-hero" style={{ background: bg }}>
        {/* Orbs */}
        <div style={{ position: "absolute", width: 700, height: 700, top: -200, left: -200, borderRadius: "50%", background: "radial-gradient(circle, rgba(185,158,255,0.15) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none", animation: "awards-glow 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 500, height: 500, bottom: -100, right: -150, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.10) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none", animation: "awards-glow 8s ease-in-out infinite 2s" }} />

        {/* Grid pattern */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(122,63,209,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(122,63,209,0.04) 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 100%)" }} />

        <div className="awards-hero-content" style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "clamp(7rem,14vw,10rem) 5% clamp(4rem,8vw,6rem)", display: "flex", alignItems: "center", gap: "clamp(3rem,5vw,5rem)" }}>

          {/* Left — Text */}
          <div style={{ flex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
              <SectionLabel text="Awards Night · October 26, 2026" />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }}
              style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-1px", marginBottom: 20 }}>
              The <GradientText>Catalyst</GradientText><br />Awards
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              style={{ fontSize: "clamp(1rem,1.6vw,1.2rem)", color: textMid, lineHeight: 1.8, maxWidth: 520, marginBottom: 36, textAlign: "justify" }}>
              Honouring the pioneers transforming industries through technology. 28 awards across 25 core categories and 3 special recognition awards — celebrating excellence at the intersection of technology and industry.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.7 }}
              style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#categories" style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 32px", borderRadius: 14,
                background: "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#fff", textDecoration: "none",
                fontFamily: "'Orbitron',sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase",
              }}>Explore Categories</a>
              <a href="#nominate" style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 32px", borderRadius: 14,
                border: "1.5px solid " + cardBdr, color: textMain, textDecoration: "none", background: "transparent",
                fontFamily: "'Orbitron',sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase",
              }}>Nominate</a>
            </motion.div>
          </div>

          {/* Right — Trophy */}
          <motion.div className="awards-hero-img"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
            style={{ flex: "0 0 auto", maxWidth: 420, position: "relative" }}>
            <div style={{ position: "relative", animation: "awards-float 5s ease-in-out infinite" }}>
              <img src="/awards-trophy-single.png" alt="The Catalyst Award Trophy" style={{ width: "100%", height: "auto", filter: "drop-shadow(0 20px 60px rgba(122,63,209,0.3))", borderRadius: 20 }} />
              {/* Pulse ring */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "60%", height: "60%", borderRadius: "50%", border: "2px solid rgba(185,158,255,0.20)", animation: "awards-pulse-ring 3s ease-out infinite" }} />
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, transparent, " + bg + ")", pointerEvents: "none", zIndex: 5 }} />
      </section>

      {/* ═══════ STATS ═══════ */}
      <section style={{ background: dark ? "#0a0618" : "#f8f5ff", borderTop: "1px solid " + cardBdr, borderBottom: "1px solid " + cardBdr }}>
        <div className="awards-stats-row" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1 }}>
          {[
            { val: "28", label: "Total Awards" },
            { val: "25", label: "Core Categories" },
            { val: "5×5", label: "Pillar × Sector Matrix" },
            { val: "3", label: "Special Recognition" },
          ].map(function (s) {
            return (
              <div key={s.label} style={{ padding: "clamp(24px,4vw,40px) 20px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 900, color: textMain, marginBottom: 6 }}>{s.val}</div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: textSoft }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════ PHILOSOPHY ═══════ */}
      <section style={{ padding: "clamp(4rem,8vw,7rem) 5%", maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel text="Philosophy" color={accent} />
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: textMain, marginBottom: 20, lineHeight: 1.15 }}>
            Why <GradientText>"Catalyst"</GradientText>?
          </h2>
          <p style={{ fontSize: "1.05rem", color: textMid, lineHeight: 1.85, marginBottom: 24, textAlign: "justify" }}>
            A catalyst accelerates transformation without being consumed by it. The name reflects the core thesis of TTFC: that technology is the catalyst transforming every industry. Recipients of The Catalyst Award are pioneers who have taken advanced technology from concept to measurable real-world impact.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Technology × Industry", desc: "Every award recognises technology applied to a specific industry, never technology in isolation." },
              { label: "Evidence-Based", desc: "Winners are selected on measurable outcomes, not aspirational claims." },
              { label: "Canadian Centrality", desc: "The awards spotlight Canada's role in global technology leadership." },
              { label: "Integrity & Independence", desc: "Jury deliberations are confidential. Sponsorship does not influence outcomes." },
            ].map(function (p) {
              return (
                <div key={p.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5a623", flexShrink: 0, marginTop: 9 }} />
                  <div>
                    <span style={{ fontWeight: 700, color: textMain }}>{p.label}:</span>{" "}
                    <span style={{ color: textMid }}>{p.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </section>

      {/* ═══════ 5×5 MATRIX ═══════ */}
      <section id="categories" style={{ padding: "clamp(4rem,8vw,6rem) 5%", background: dark ? "rgba(122,63,209,0.03)" : "rgba(122,63,209,0.02)", borderTop: "1px solid " + cardBdr, borderBottom: "1px solid " + cardBdr }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <SectionLabel text="25 Core Categories" />
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: textMain, marginBottom: 12 }}>
                The 5×5 <GradientText>Matrix</GradientText>
              </h2>
              <p style={{ fontSize: "0.95rem", color: textMid, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>Each award sits at a unique intersection of one Technology Pillar and one Applied Industry Sector. Tap any cell to see the full award name.</p>
            </div>
          </FadeIn>

          {/* Desktop Matrix */}
          <FadeIn delay={0.15}>
            <div className="awards-matrix-grid" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid " + cardBdr }}>
              {/* Header row */}
              <div style={{ padding: 16, background: dark ? "rgba(6,2,15,0.95)" : "#f0ecff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: textSoft }}>Pillar → Sector ↓</span>
              </div>
              {PILLARS.map(function (p) {
                return (
                  <div key={p.name} style={{ padding: "16px 8px", background: dark ? "rgba(6,2,15,0.95)" : "#f0ecff", textAlign: "center", borderLeft: "1px solid " + cardBdr }}>
                    <div style={{ fontSize: "1.2rem", marginBottom: 4 }}>{p.icon}</div>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.6rem", fontWeight: 800, color: p.color, letterSpacing: "0.5px" }}>{p.short}</div>
                  </div>
                );
              })}

              {/* Data rows */}
              {SECTORS.map(function (sector, si) {
                return [
                  <div key={"s" + si} style={{ padding: "14px 12px", background: si % 2 === 0 ? cardBg : "transparent", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid " + cardBdr }}>
                    <span style={{ fontSize: "1rem" }}>{sector.icon}</span>
                    <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 700, color: textMain, lineHeight: 1.3 }}>{sector.short}</span>
                  </div>
                ].concat(PILLARS.map(function (pillar, pi) {
                  var cellKey = si + "-" + pi;
                  var isActive = activeCell === cellKey;
                  var awardName = "The Catalyst Award for " + pillar.name + " in " + sector.name;
                  var num = si * 5 + pi + 1;
                  return (
                    <div key={cellKey} className="awards-matrix-cell"
                      onClick={function () { setActiveCell(isActive ? null : cellKey); }}
                      style={{
                        background: isActive ? (dark ? "rgba(122,63,209,0.20)" : "rgba(122,63,209,0.10)") : (si % 2 === 0 ? cardBg : "transparent"),
                        borderTop: "1px solid " + cardBdr, borderLeft: "1px solid " + cardBdr,
                        transition: "all 0.25s ease",
                      }}
                      onMouseEnter={function (e) { if (!isActive) e.currentTarget.style.background = dark ? "rgba(122,63,209,0.12)" : "rgba(122,63,209,0.06)"; }}
                      onMouseLeave={function (e) { if (!isActive) e.currentTarget.style.background = si % 2 === 0 ? cardBg : "transparent"; }}
                    >
                      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.72rem", fontWeight: 900, color: pillar.color, opacity: isActive ? 1 : 0.5, transition: "opacity 0.2s ease" }}>
                        {num < 10 ? "0" + num : num}
                      </div>
                      {isActive && (
                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{
                          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                          background: dark ? "#1a1030" : "#ffffff", border: "1px solid " + cardBdr,
                          borderRadius: 12, padding: "12px 16px", width: 240, zIndex: 20,
                          boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 8px 32px rgba(122,63,209,0.12)",
                          textAlign: "left",
                        }}>
                          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: textMain, lineHeight: 1.4 }}>{awardName}</div>
                        </motion.div>
                      )}
                    </div>
                  );
                }));
              })}
            </div>
          </FadeIn>

          {/* Mobile: list view */}
          <div className="awards-matrix-mobile" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PILLARS.map(function (pillar) {
              return (
                <div key={pillar.name} style={{ background: cardBg, border: "1px solid " + cardBdr, borderRadius: 16, padding: "20px", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: "1.4rem" }}>{pillar.icon}</span>
                    <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.82rem", fontWeight: 900, color: pillar.color }}>{pillar.name}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {SECTORS.map(function (sector) {
                      return (
                        <div key={sector.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: dark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.03)", borderRadius: 8, fontSize: "0.78rem", color: textMid }}>
                          <span>{sector.icon}</span>
                          <span>{sector.short}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ SPECIAL AWARDS ═══════ */}
      <section style={{ padding: "clamp(4rem,8vw,7rem) 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <SectionLabel text="Special Recognition" color="#f5a623" />
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: textMain, marginBottom: 12 }}>
                Anchor <GradientText>Moments</GradientText>
              </h2>
              <p style={{ fontSize: "0.95rem", color: textMid, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>Three Special Recognition Awards celebrate contributions that transcend a single technology-industry intersection.</p>
            </div>
          </FadeIn>

          <div className="awards-special-grid">
            {SPECIAL_AWARDS.map(function (award, i) {
              return (
                <FadeIn key={award.name} delay={i * 0.12}>
                  <div style={{
                    background: cardBg, border: "1px solid " + cardBdr, borderRadius: 24, padding: "36px 28px",
                    display: "flex", flexDirection: "column", height: "100%",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                    onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(122,63,209,0.15)"; }}
                    onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ fontSize: "2.4rem", marginBottom: 16 }}>{award.icon}</div>
                    <div style={{ width: 40, height: 3, borderRadius: 3, background: award.color, marginBottom: 16, boxShadow: "0 0 12px " + award.color + "40" }} />
                    <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.88rem", fontWeight: 900, color: textMain, marginBottom: 12, lineHeight: 1.3 }}>{award.name}</h3>
                    <p style={{ fontSize: "0.88rem", color: textMid, lineHeight: 1.7, flex: 1, marginBottom: 16 }}>{award.description}</p>
                    <div style={{ padding: "10px 14px", background: dark ? "rgba(122,63,209,0.08)" : "rgba(122,63,209,0.04)", border: "1px solid " + cardBdr, borderRadius: 10, fontSize: "0.72rem", color: textSoft, fontWeight: 600 }}>{award.note}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ TROPHY IMAGE BANNER ═══════ */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(3rem,6vw,5rem) 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", borderRadius: 28, overflow: "hidden", position: "relative" }}>
          <img src="/awards-trophies.png" alt="The Catalyst Award Trophies" style={{ width: "100%", height: "auto", display: "block", borderRadius: 28 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, " + bg + " 0%, transparent 40%, transparent 60%, " + bg + " 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, " + bg + " 0%, transparent 20%, transparent 80%, " + bg + " 100%)", pointerEvents: "none" }} />
        </div>
      </section>

      {/* ═══════ JUDGING CRITERIA ═══════ */}
      <section style={{ padding: "clamp(4rem,8vw,6rem) 5%", background: dark ? "rgba(122,63,209,0.03)" : "rgba(122,63,209,0.02)", borderTop: "1px solid " + cardBdr, borderBottom: "1px solid " + cardBdr }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <SectionLabel text="Evaluation Framework" color={accent} />
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: textMain, marginBottom: 12 }}>
                How Winners Are <GradientText>Chosen</GradientText>
              </h2>
              <p style={{ fontSize: "0.95rem", color: textMid, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>Every nomination is independently scored by a minimum of 3 jury members using this rubric.</p>
            </div>
          </FadeIn>

          <div className="awards-criteria-grid">
            {CRITERIA.map(function (c, i) {
              return (
                <FadeIn key={c.name} delay={i * 0.08}>
                  <div style={{ background: cardBg, border: "1px solid " + cardBdr, borderRadius: 20, padding: "28px 22px", textAlign: "center", height: "100%" }}>
                    <div style={{
                      fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 900, marginBottom: 8,
                      background: "linear-gradient(135deg, #b99eff, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>{c.weight}</div>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.72rem", fontWeight: 800, color: textMain, marginBottom: 10, letterSpacing: "0.5px" }}>{c.name}</div>
                    <p style={{ fontSize: "0.78rem", color: textMid, lineHeight: 1.6 }}>{c.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ TIMELINE ═══════ */}
      <section style={{ padding: "clamp(4rem,8vw,7rem) 5%" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <SectionLabel text="Execution Timeline" />
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: textMain }}>
                Road to <GradientText>Awards Night</GradientText>
              </h2>
            </div>
          </FadeIn>

          <div className="awards-timeline" style={{ position: "relative", paddingLeft: 32 }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: dark ? "linear-gradient(to bottom, rgba(185,158,255,0.30), rgba(245,166,35,0.30))" : "linear-gradient(to bottom, rgba(122,63,209,0.20), rgba(245,166,35,0.20))" }} />

            {TIMELINE.map(function (t, i) {
              var isLast = i === TIMELINE.length - 1;
              return (
                <FadeIn key={t.phase} delay={i * 0.08}>
                  <div style={{ position: "relative", paddingBottom: isLast ? 0 : 32, paddingLeft: 28 }}>
                    {/* Dot */}
                    <div style={{
                      position: "absolute", left: -32, top: 4, width: isLast ? 18 : 12, height: isLast ? 18 : 12,
                      borderRadius: "50%", background: isLast ? "#f5a623" : (dark ? "rgba(185,158,255,0.40)" : "rgba(122,63,209,0.30)"),
                      border: isLast ? "3px solid rgba(245,166,35,0.30)" : "none",
                      boxShadow: isLast ? "0 0 16px rgba(245,166,35,0.40)" : "none",
                      marginLeft: isLast ? -3 : 0, marginTop: isLast ? -3 : 0,
                    }} />

                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: isLast ? "#f5a623" : textSoft, marginBottom: 4 }}>{t.phase}</div>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: isLast ? "1rem" : "0.88rem", fontWeight: 800, color: textMain, marginBottom: 4 }}>{t.activity}</div>
                    <div style={{ fontSize: "0.82rem", color: textMid }}>{t.date}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ NOMINATE CTA ═══════ */}
      <section id="nominate" style={{ padding: "0 5% clamp(4rem,8vw,7rem)" }}>
        <FadeIn>
          <div style={{
            maxWidth: 900, margin: "0 auto", background: "linear-gradient(135deg, rgba(122,63,209,0.12), rgba(245,166,35,0.08))",
            border: "1px solid " + cardBdr, borderRadius: 28, padding: "clamp(2.5rem,5vw,4rem)", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,63,209,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ fontSize: "2.4rem", marginBottom: 16 }}>🏆</div>
            <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 900, color: textMain, marginBottom: 16 }}>
              Nominations Open <GradientText>July 2026</GradientText>
            </h2>
            <p style={{ fontSize: "0.95rem", color: textMid, lineHeight: 1.8, maxWidth: 500, margin: "0 auto 28px" }}>
              Nominations are free of charge. Self-nominations and third-party nominations are both welcome. The nomination portal will open on July 1, 2026.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/tickets" style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 34px", borderRadius: 12,
                background: dark ? "#ffffff" : "#0d0520", color: dark ? "#0d0520" : "#ffffff", textDecoration: "none",
                fontFamily: "'Orbitron',sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase",
              }}>Get Your Pass</a>
              <a href="/sponsor" style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 34px", borderRadius: 12,
                border: "1.5px solid " + cardBdr, color: textMain, textDecoration: "none", background: "transparent",
                fontFamily: "'Orbitron',sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase",
              }}>Partner With Us</a>
            </div>

            <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {["Free Nominations", "10 Nominees Per Category", "Top 5 Shortlisted", "Winner + Finalist Awarded"].map(function (tag) {
                return <span key={tag} style={{ padding: "6px 14px", borderRadius: 999, background: dark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.06)", border: "1px solid " + cardBdr, fontSize: "0.68rem", fontWeight: 600, color: textMid }}>{tag}</span>;
              })}
            </div>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
}
