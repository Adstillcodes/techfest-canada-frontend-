import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

var PILLARS = ["Artificial Intelligence", "Quantum Computing", "Robotics", "CleanTech & Sustainability", "Cybersecurity"];
var SECTORS = ["Healthcare & Life Sciences", "Manufacturing, Supply Chain & Infrastructure", "Defence, National Security & Public Safety", "Energy & Utilities", "Banking, Financial Services & Insurance"];

var ALL_AWARDS = [];
var num = 1;
PILLARS.forEach(function (p) {
  SECTORS.forEach(function (s) {
    ALL_AWARDS.push({ num: num, pillar: p, sector: s, name: "The Catalyst Award for " + p + " in " + s });
    num++;
  });
});

var SPECIAL_AWARDS = [
  { num: 26, name: "The Catalyst Lifetime Achievement Award", desc: "Sustained and transformative contribution to Canada's technology ecosystem over a distinguished career." },
  { num: 27, name: "The Catalyst Rising Innovator Award", desc: "A Canadian startup demonstrating a breakthrough application of TTFC technology pillars to an industry challenge." },
  { num: 28, name: "The Catalyst Cross-Border Impact Award", desc: "A Canada-international collaboration driving measurable technology adoption and commercial impact across borders." },
];

var CRITERIA = [
  { name: "Innovation", weight: 25 },
  { name: "Measurable Impact", weight: 30 },
  { name: "Scalability", weight: 20 },
  { name: "Canadian Relevance", weight: 15 },
  { name: "Execution", weight: 10 },
];

var TIMELINE = [
  { date: "Jun 2026", label: "Framework & Jury" },
  { date: "Jul–Aug", label: "Nominations Open" },
  { date: "Sep 1–14", label: "Screening" },
  { date: "Sep 15–30", label: "Jury Scoring" },
  { date: "Oct 6", label: "Shortlist Announced" },
  { date: "Oct 15", label: "Winners Sealed" },
  { date: "Oct 26", label: "Awards Night" },
];

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL COMPONENTS
   ═══════════════════════════════════════════════════════ */

function RevealLeft({ children, delay }) {
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, delay: delay || 0, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

function RevealRight({ children, delay }) {
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, delay: delay || 0, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

function RevealUp({ children, delay }) {
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: delay || 0, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTAINER SCROLL (adapted from aceternity, no tailwind)
   ═══════════════════════════════════════════════════════ */

function ContainerScroll({ titleComponent, children }) {
  var containerRef = useRef(null);
  var scrollData = useScroll({ target: containerRef });
  var s1 = useState(false); var isMobile = s1[0]; var setIsMobile = s1[1];

  useEffect(function () {
    function check() { setIsMobile(window.innerWidth <= 768); }
    check();
    window.addEventListener("resize", check);
    return function () { window.removeEventListener("resize", check); };
  }, []);

  var scaleDims = isMobile ? [0.7, 0.9] : [1.05, 1];
  var rotate = useTransform(scrollData.scrollYProgress, [0, 1], [20, 0]);
  var scale = useTransform(scrollData.scrollYProgress, [0, 1], scaleDims);
  var translate = useTransform(scrollData.scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} style={{ height: isMobile ? "50rem" : "70rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: isMobile ? "0.5rem" : "5rem" }}>
      <div style={{ padding: isMobile ? "2.5rem 0" : "5rem 0", width: "100%", position: "relative", perspective: "1000px" }}>
        <motion.div style={{ translateY: translate, maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          {titleComponent}
        </motion.div>
        <motion.div style={{
          rotateX: rotate, scale: scale,
          maxWidth: 960, margin: "-3rem auto 0", width: "100%",
          borderRadius: 24, overflow: "hidden",
          boxShadow: "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a",
        }}>
          <div style={{ width: "100%", overflow: "hidden", borderRadius: 20 }}>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AWARD LIST ROW
   ═══════════════════════════════════════════════════════ */

function AwardRow({ award, dark, textMain, textMid, cardBdr, isExpanded, onToggle }) {
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (award.num % 5) * 0.04 }}
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", gap: "clamp(16px,3vw,32px)",
        padding: "clamp(18px,3vw,28px) clamp(16px,3vw,32px)",
        borderBottom: "1px solid " + cardBdr,
        cursor: "pointer",
        transition: "background 0.3s ease",
        background: isExpanded ? (dark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.04)") : "transparent",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={function (e) { if (!isExpanded) e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.02)"; }}
      onMouseLeave={function (e) { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
    >
      {/* Number */}
      <span style={{
        fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(0.65rem,1.2vw,0.82rem)",
        fontWeight: 800, color: isExpanded ? "#f5a623" : (dark ? "rgba(200,185,255,0.30)" : "rgba(13,5,32,0.25)"),
        minWidth: 36, transition: "color 0.3s ease",
      }}>
        {award.num < 10 ? "0" + award.num : award.num}
      </span>

      {/* Name */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Orbitron',sans-serif",
          fontSize: "clamp(0.78rem,1.8vw,1.15rem)",
          fontWeight: 800, color: textMain, lineHeight: 1.3,
          transition: "color 0.3s ease",
        }}>
          {award.name}
        </div>
        {isExpanded && award.desc && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            style={{ fontSize: "0.88rem", color: textMid, lineHeight: 1.7, marginTop: 10 }}
          >{award.desc}</motion.p>
        )}
        {isExpanded && !award.desc && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}
          >
            <span style={{ fontSize: "0.72rem", padding: "4px 12px", borderRadius: 6, background: dark ? "rgba(185,158,255,0.12)" : "rgba(122,63,209,0.08)", color: dark ? "#b99eff" : "#7a3fd1", fontWeight: 700 }}>{award.pillar}</span>
            <span style={{ fontSize: "0.72rem", padding: "4px 12px", borderRadius: 6, background: dark ? "rgba(245,166,35,0.12)" : "rgba(245,166,35,0.08)", color: "#f5a623", fontWeight: 700 }}>{award.sector}</span>
          </motion.div>
        )}
      </div>

      {/* Arrow */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isExpanded ? "#f5a623" : (dark ? "rgba(255,255,255,0.20)" : "rgba(13,5,32,0.20)")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, transition: "transform 0.3s ease, stroke 0.3s ease", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>
        <path d="M9 18l6-6-6-6" />
      </svg>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

export default function Awards() {
  var s1 = useState(false); var dark = s1[0]; var setDark = s1[1];
  var s2 = useState(null); var expanded = s2[0]; var setExpanded = s2[1];
  var s3 = useState("all"); var filterPillar = s3[0]; var setFilterPillar = s3[1];

  useEffect(function () {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () { setDark(document.body.classList.contains("dark-mode")); });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);

  var bg = dark ? "#06020f" : "#ffffff";
  var textMain = dark ? "#ffffff" : "#0d0520";
  var textMid = dark ? "rgba(220,210,255,0.72)" : "rgba(13,5,32,0.58)";
  var textSoft = dark ? "rgba(200,185,255,0.35)" : "rgba(13,5,32,0.28)";
  var cardBdr = dark ? "rgba(155,135,245,0.12)" : "rgba(122,63,209,0.08)";
  var accent = dark ? "#b99eff" : "#7a3fd1";

  var filtered = filterPillar === "all" ? ALL_AWARDS : ALL_AWARDS.filter(function (a) { return a.pillar === filterPillar; });

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .awards-hero-text { font-family:'Orbitron',sans-serif; font-weight:900; text-transform:uppercase; line-height:0.92; letter-spacing:-0.03em; }
        .awards-filter-btn { border:none; cursor:pointer; font-family:'Orbitron',sans-serif; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; transition:all 0.25s ease; }
        @media(max-width:768px) {
          .awards-hero-split { flex-direction:column !important; text-align:center !important; }
          .awards-hero-left, .awards-hero-right { text-align:center !important; align-items:center !important; }
          .awards-hero-right { justify-content:center !important; }
          .awards-hero-trophy { max-width:280px !important; }
          .awards-criteria-row { flex-direction:column !important; }
          .awards-timeline-row { flex-direction:column !important; gap:16px !important; }
          .awards-filter-wrap { flex-wrap:wrap !important; justify-content:center !important; }
        }
      `}} />

      <Navbar />

      {/* ═══════ HERO — BIG BOLD SPLIT TEXT ═══════ */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center", background: bg }}>
        {/* Subtle grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(122,63,209,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(122,63,209,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)" }} />

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 1400, margin: "0 auto", padding: "clamp(8rem,16vw,12rem) 5% clamp(4rem,8vw,6rem)" }}>

          <div className="awards-hero-split" style={{ display: "flex", alignItems: "center", gap: "clamp(2rem,4vw,4rem)" }}>

            {/* Left text block */}
            <div className="awards-hero-left" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
                <h1 className="awards-hero-text" style={{ fontSize: "clamp(3.5rem,10vw,8rem)", color: textMain, marginBottom: 0 }}>
                  YOU HAVE
                </h1>
                <h1 className="awards-hero-text" style={{ fontSize: "clamp(3.5rem,10vw,8rem)", color: textMain }}>
                  EARNED
                </h1>
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
                style={{ fontSize: "clamp(0.88rem,1.4vw,1.05rem)", color: textMid, lineHeight: 1.7, maxWidth: 380, marginTop: 28 }}>
                The hard work is done. Now let Canada know about it.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}
                style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textSoft} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: textSoft }}>October 26, 2026</span>
              </motion.div>
            </div>

            {/* Center trophy */}
            <motion.div className="awards-hero-trophy"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: "0 0 auto", maxWidth: 360, position: "relative" }}>
              <img src="/awards-trophy-single.png" alt="The Catalyst Award" style={{
                width: "100%", height: "auto",
                filter: dark ? "drop-shadow(0 24px 64px rgba(122,63,209,0.25))" : "drop-shadow(0 24px 64px rgba(0,0,0,0.12))",
                borderRadius: 16,
              }} />
            </motion.div>

            {/* Right text block */}
            <div className="awards-hero-right" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
              <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
                <h1 className="awards-hero-text" style={{ fontSize: "clamp(3.5rem,10vw,8rem)", color: textMain }}>
                  THIS
                </h1>
                <h1 className="awards-hero-text" style={{ fontSize: "clamp(3.5rem,10vw,8rem)", background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  MOMENT.
                </h1>
              </motion.div>

              <motion.a href="#categories" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 12, marginTop: 28,
                  padding: "16px 36px", borderRadius: 14,
                  background: "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#fff", textDecoration: "none",
                  fontFamily: "'Orbitron',sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase",
                }}>
                Explore Awards
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </motion.a>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            style={{ position: "absolute", bottom: "clamp(2rem,4vw,4rem)", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: textSoft }}>(SCROLL)</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ SCROLL CONTAINER — TROPHIES IMAGE ═══════ */}
      <ContainerScroll
        titleComponent={
          <div>
            <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: textSoft, marginBottom: 16 }}>The Catalyst Awards</p>
            <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.8rem,4vw,3.5rem)", fontWeight: 900, color: textMain, lineHeight: 1.1 }}>
              28 Awards. One Stage.<br />
              <span style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Infinite Impact.</span>
            </h2>
          </div>
        }
      >
        <img src="/awards-trophies.png" alt="The Catalyst Award Trophies" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
      </ContainerScroll>

      {/* ═══════ PHILOSOPHY — LEFT/RIGHT STAGGER ═══════ */}
      <section style={{ padding: "clamp(4rem,8vw,8rem) 5%", maxWidth: 900, margin: "0 auto" }}>
        <RevealLeft>
          <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: textSoft, marginBottom: 16 }}>Philosophy</p>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, color: textMain, lineHeight: 1.1, marginBottom: 28 }}>
            A catalyst accelerates transformation.
          </h2>
        </RevealLeft>

        <RevealRight delay={0.15}>
          <p style={{ fontSize: "1.05rem", color: textMid, lineHeight: 1.85, textAlign: "justify", marginBottom: 32 }}>
            Recipients of The Catalyst Award are pioneers who have taken advanced technology from concept to measurable real-world impact. Every award recognises technology applied to a specific industry — never technology in isolation. Winners are selected on evidence, not aspiration.
          </p>
        </RevealRight>

        <RevealLeft delay={0.2}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: cardBdr, borderRadius: 16, overflow: "hidden" }}>
            {[
              { val: "25", label: "Core Categories" },
              { val: "3", label: "Special Awards" },
              { val: "5×5", label: "Pillar × Sector" },
              { val: "Free", label: "Nominations" },
            ].map(function (s) {
              return (
                <div key={s.label} style={{ padding: "clamp(20px,3vw,36px)", background: bg, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 900, color: textMain, marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: textSoft }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </RevealLeft>
      </section>

      {/* ═══════ AWARD CATEGORIES LIST ═══════ */}
      <section id="categories" style={{ background: dark ? "#0a0618" : "#faf8ff", borderTop: "1px solid " + cardBdr, borderBottom: "1px solid " + cardBdr }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(3rem,6vw,5rem) 5% 0" }}>

          <RevealUp>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: textSoft, marginBottom: 12 }}>25 Core Categories</p>
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: textMain }}>
                Discover Our Awards
              </h2>
            </div>
          </RevealUp>

          {/* Pillar filter tabs */}
          <div className="awards-filter-wrap" style={{ display: "flex", gap: 8, marginBottom: 0, padding: "0 0 20px", overflowX: "auto" }}>
            {[{ key: "all", label: "All" }].concat(PILLARS.map(function (p) { return { key: p, label: p.replace(" & Sustainability", "").replace("Computing", "") }; })).map(function (f) {
              var active = filterPillar === f.key;
              return (
                <button key={f.key} className="awards-filter-btn"
                  onClick={function () { setFilterPillar(f.key); setExpanded(null); }}
                  style={{
                    padding: "8px 18px", borderRadius: 999, fontSize: "0.62rem",
                    background: active ? (dark ? "rgba(185,158,255,0.20)" : "rgba(122,63,209,0.12)") : "transparent",
                    color: active ? (dark ? "#b99eff" : "#7a3fd1") : textSoft,
                    border: "1px solid " + (active ? (dark ? "rgba(185,158,255,0.30)" : "rgba(122,63,209,0.20)") : "transparent"),
                    whiteSpace: "nowrap",
                  }}
                >{f.label}</button>
              );
            })}
          </div>
        </div>

        {/* Award rows */}
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {filtered.map(function (award) {
            return (
              <AwardRow key={award.num} award={award} dark={dark} textMain={textMain} textMid={textMid} cardBdr={cardBdr}
                isExpanded={expanded === award.num}
                onToggle={function () { setExpanded(expanded === award.num ? null : award.num); }}
              />
            );
          })}
        </div>

        {/* Special Awards */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(3rem,6vw,5rem) 5%" }}>
          <RevealUp>
            <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "#f5a623", marginBottom: 20 }}>Special Recognition</p>
          </RevealUp>
          {SPECIAL_AWARDS.map(function (award) {
            return (
              <AwardRow key={award.num} award={award} dark={dark} textMain={textMain} textMid={textMid} cardBdr={cardBdr}
                isExpanded={expanded === award.num}
                onToggle={function () { setExpanded(expanded === award.num ? null : award.num); }}
              />
            );
          })}
        </div>
      </section>

      {/* ═══════ JUDGING — STAGGERED LEFT/RIGHT ═══════ */}
      <section style={{ padding: "clamp(4rem,8vw,7rem) 5%", maxWidth: 900, margin: "0 auto" }}>
        <RevealLeft>
          <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: textSoft, marginBottom: 12 }}>Evaluation</p>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: textMain, marginBottom: 32 }}>
            How Winners Are Chosen
          </h2>
        </RevealLeft>

        <div className="awards-criteria-row" style={{ display: "flex", gap: 0, borderRadius: 16, overflow: "hidden", border: "1px solid " + cardBdr }}>
          {CRITERIA.map(function (c, i) {
            return (
              <RevealUp key={c.name} delay={i * 0.08}>
                <div style={{
                  padding: "clamp(20px,3vw,32px) clamp(14px,2vw,22px)", textAlign: "center",
                  borderRight: i < CRITERIA.length - 1 ? "1px solid " + cardBdr : "none",
                  background: bg,
                }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 900, color: "#f5a623", marginBottom: 6 }}>{c.weight}%</div>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.62rem", fontWeight: 800, color: textMain, letterSpacing: "0.5px", marginBottom: 0 }}>{c.name}</div>
                </div>
              </RevealUp>
            );
          })}
        </div>
      </section>

      {/* ═══════ TIMELINE ═══════ */}
      <section style={{ padding: "clamp(3rem,6vw,5rem) 5%", background: dark ? "#0a0618" : "#faf8ff", borderTop: "1px solid " + cardBdr, borderBottom: "1px solid " + cardBdr }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <RevealRight>
            <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: textSoft, marginBottom: 12, textAlign: "center" }}>Timeline</p>
            <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: textMain, marginBottom: 40, textAlign: "center" }}>
              Road to Awards Night
            </h2>
          </RevealRight>

          <div className="awards-timeline-row" style={{ display: "flex", gap: 0, position: "relative" }}>
            {/* Horizontal line */}
            <div style={{ position: "absolute", top: 8, left: 0, right: 0, height: 2, background: dark ? "linear-gradient(90deg, rgba(185,158,255,0.15), rgba(245,166,35,0.25))" : "linear-gradient(90deg, rgba(122,63,209,0.10), rgba(245,166,35,0.15))", zIndex: 0 }} />

            {TIMELINE.map(function (t, i) {
              var isLast = i === TIMELINE.length - 1;
              return (
                <RevealUp key={t.date} delay={i * 0.08}>
                  <div style={{ flex: 1, position: "relative", zIndex: 1, textAlign: "center", minWidth: 100, padding: "0 8px" }}>
                    <div style={{
                      width: isLast ? 16 : 10, height: isLast ? 16 : 10, borderRadius: "50%",
                      background: isLast ? "#f5a623" : (dark ? "rgba(185,158,255,0.30)" : "rgba(122,63,209,0.20)"),
                      margin: isLast ? "-3px auto 12px" : "0 auto 12px",
                      boxShadow: isLast ? "0 0 16px rgba(245,166,35,0.40)" : "none",
                    }} />
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.55rem", fontWeight: 800, color: isLast ? "#f5a623" : textSoft, letterSpacing: "1px", marginBottom: 4 }}>{t.date}</div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: textMain, lineHeight: 1.3 }}>{t.label}</div>
                  </div>
                </RevealUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ NOMINATE CTA ═══════ */}
      <section style={{ padding: "clamp(5rem,10vw,8rem) 5%" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <RevealUp>
            <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: textSoft, marginBottom: 16 }}>Nominations open July 2026</p>
            <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: textMain, lineHeight: 1.05, marginBottom: 20 }}>
              Ready to be<br />
              <span style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>recognised?</span>
            </h2>
            <p style={{ fontSize: "1rem", color: textMid, lineHeight: 1.8, maxWidth: 500, margin: "0 auto 36px" }}>
              Nominations are free. Self-nominations and third-party nominations are both welcome.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/tickets" style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 14,
                background: "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#fff", textDecoration: "none",
                fontFamily: "'Orbitron',sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase",
              }}>Get Your Pass</a>
              <a href="/sponsor" style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 14,
                border: "1.5px solid " + cardBdr, color: textMain, textDecoration: "none", background: "transparent",
                fontFamily: "'Orbitron',sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase",
              }}>Partner With Us</a>
            </div>
          </RevealUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
