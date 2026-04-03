import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SponsorMarquee from "../components/SponsorMarquee";
import NewsletterBar from "../components/NewsletterBar";

/* ═══════════════════════════════════════════════════════
   ANIMATION VARIANTS (copied from Home.jsx)
   ═══════════════════════════════════════════════════════ */

var containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};

var itemBlur = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 22 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { type: "spring", bounce: 0.3, duration: 1.5 } },
};

var wordVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(16px)", scale: 0.8 },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { type: "spring", damping: 14, stiffness: 100, duration: 1 } },
};

/* ═══════════════════════════════════════════════════════
   REUSABLE COMPONENTS (same as Home.jsx)
   ═══════════════════════════════════════════════════════ */

function TextReveal({ text, colors, style, delay }) {
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.h2 ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: delay || 0 } } }}
      style={Object.assign({ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "0.18em", flexWrap: "nowrap" }, style || {})}
    >
      {text.split(" ").map(function (word, i) {
        return <motion.span key={i} variants={wordVariants} style={{ display: "inline-block", color: (colors && colors[i]) || "inherit", willChange: "transform, opacity, filter" }}>{word}</motion.span>;
      })}
    </motion.h2>
  );
}

function DividerReveal({ accent }) {
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ scaleX: 0, opacity: 0 }} animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
      style={{ width: 120, height: 3, borderRadius: 2, background: "linear-gradient(90deg, " + accent + ", var(--brand-orange, #f5a623))", margin: "2rem auto 2.5rem", transformOrigin: "center" }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   AWARD DATA
   ═══════════════════════════════════════════════════════ */

var PILLARS = ["Artificial Intelligence", "Quantum Computing", "Robotics", "CleanTech & Sustainability", "Cybersecurity"];
var SECTORS = ["Healthcare & Life Sciences", "Manufacturing, Supply Chain & Infrastructure", "Defence, National Security & Public Safety", "Energy & Utilities", "Banking, Financial Services & Insurance"];

var ALL_CATEGORIES = [];
var n = 1;
PILLARS.forEach(function (p) {
  SECTORS.forEach(function (s) {
    ALL_CATEGORIES.push({ num: n, name: "The Catalyst Award for " + p + " in " + s, pillar: p, sector: s });
    n++;
  });
});

var SPECIAL_AWARDS = [
  { num: 26, name: "The Catalyst Lifetime Achievement Award", desc: "Sustained and transformative contribution to Canada's technology ecosystem over a distinguished career." },
  { num: 27, name: "The Catalyst Rising Innovator Award", desc: "A Canadian startup demonstrating a breakthrough application of TTFC technology pillars." },
  { num: 28, name: "The Catalyst Cross-Border Impact Award", desc: "A Canada-international collaboration driving measurable technology adoption across borders." },
];

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

export default function Awards() {
  var s1 = useState(false); var dark = s1[0]; var setDark = s1[1];
  var s2 = useState(null); var expandedRow = s2[0]; var setExpandedRow = s2[1];
  var s3 = useState("all"); var activePillar = s3[0]; var setActivePillar = s3[1];

  useEffect(function () {
    var update = function () { setDark(document.body.classList.contains("dark-mode")); };
    update();
    var obs = new MutationObserver(update);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);

  var bg       = dark ? "#06020f"                : "#ffffff";
  var textMain = dark ? "#ffffff"                : "#0d0520";
  var textMid  = dark ? "rgba(255,255,255,0.75)" : "rgba(13,5,32,0.78)";
  var textSoft = dark ? "rgba(200,185,255,0.35)" : "rgba(13,5,32,0.28)";
  var accent   = dark ? "#b99eff"                : "#7a3fd1";
  var cardBg   = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  var cardBdr  = dark ? "rgba(155,135,245,0.14)" : "rgba(122,63,209,0.12)";
  var heroOverlay = dark ? "rgba(6,2,15,0.70)" : "rgba(244,240,255,0.50)";

  var filtered = activePillar === "all" ? ALL_CATEGORIES : ALL_CATEGORIES.filter(function (a) { return a.pillar === activePillar; });

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, overflowX: "hidden", width: "100%", position: "relative" }}>
      <style>{`
        @media (max-width: 900px) {
          .awards-hero-layout { flex-direction: column !important; text-align: center !important; align-items: center !important; }
          .awards-hero-left, .awards-hero-right { text-align: center !important; align-items: center !important; }
          .awards-feature-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .awards-hero-ctas { flex-direction: column !important; width: 100% !important; }
          .awards-hero-ctas a { width: 100% !important; justify-content: center !important; }
          .awards-filter-row { flex-wrap: wrap !important; justify-content: center !important; }
        }
      `}</style>

      <Navbar />

      {/* ════════════════════════════════════════════════════════
         SECTION 1 — HERO (100vh, bold split text)
         ════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative", overflow: "hidden", background: bg,
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: heroOverlay, zIndex: 1 }} />

        {/* Subtle grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(122,63,209,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(122,63,209,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)" }} />

        {/* Trophy watermark — behind text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "clamp(260px, 28vw, 400px)", zIndex: 1, pointerEvents: "none" }}>
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <img src="/awards-trophy-single.png" alt="" style={{ width: "100%", height: "auto", opacity: dark ? 0.18 : 0.10, filter: "drop-shadow(0 20px 60px rgba(122,63,209,0.3))" }} />
          </motion.div>
        </motion.div>

        {/* Hero content */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible"
          style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: 1400, margin: "0 auto", padding: "clamp(8rem,16vw,12rem) 5% clamp(4rem,8vw,6rem)" }}
        >
          {/* Badge */}
          <motion.div variants={itemBlur} style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span style={{ display: "inline-block", background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.40)", color: "#f5a623", fontFamily: "'Orbitron',sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 20px", borderRadius: 999 }}>
              Nominations Open July 2026
            </span>
          </motion.div>

          {/* Split headline */}
          <div className="awards-hero-layout" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>

            {/* Left */}
            <motion.div variants={itemBlur} className="awards-hero-left" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <TextReveal text="YOU HAVE" colors={[textMain, textMain]}
                style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(3rem,9vw,7.5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-2px", marginBottom: 0 }} />
              <TextReveal text="EARNED" colors={[accent]} delay={0.2}
                style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(3rem,9vw,7.5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-2px" }} />

              <motion.p variants={itemBlur} style={{ fontSize: "clamp(0.9rem,1.4vw,1.05rem)", color: textMid, lineHeight: 1.75, maxWidth: 400, marginTop: 32, fontFamily: "inherit" }}>
                The hard work is done. Now let Canada know about it.
              </motion.p>

              <motion.div variants={itemBlur} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, color: textSoft, fontFamily: "'Orbitron',sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                Awards Night — October 26, 2026
              </motion.div>
            </motion.div>

            {/* Right */}
            <motion.div variants={itemBlur} className="awards-hero-right" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
              <TextReveal text="THIS" colors={[textMain]} delay={0.15}
                style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(3rem,9vw,7.5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-2px" }} />
              <TextReveal text="MOMENT." colors={["var(--brand-orange, #f5a623)"]} delay={0.3}
                style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(3rem,9vw,7.5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-2px" }} />

              <motion.a href="#awards-list" variants={itemBlur}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10, marginTop: 32,
                  padding: "16px 40px", borderRadius: 14,
                  background: "linear-gradient(135deg, #7a3fd1, #f5a623)", color: "#fff", textDecoration: "none",
                  fontFamily: "'Orbitron',sans-serif", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase",
                }}
              >
                Explore Awards
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </motion.a>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div variants={itemBlur} style={{ textAlign: "center", marginTop: "clamp(3rem,6vw,5rem)" }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <span style={{ color: textSoft, fontSize: "0.6rem", fontFamily: "'Orbitron',sans-serif", letterSpacing: "3px" }}>(SCROLL)</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, zIndex: 6, background: "linear-gradient(to bottom, transparent, " + bg + ")", pointerEvents: "none" }} />
      </section>

      {/* ════════════════════════════════════════════════════════
         SECTION 2 — TAGLINE STRIP
         ════════════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 5%", background: bg }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <DividerReveal accent={accent} />
          <ScrollP textMid={textMid}>
            Winning changes things. It opens doors, builds credibility, and gives your team something to rally around. Whether this is your first recognition or a global enterprise adding to a legacy, earned recognition tells the market that what you're doing is working.
          </ScrollP>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         SECTION 3 — "OWN YOUR INDUSTRY" FEATURE
         ════════════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 5%", background: dark ? "rgba(28,16,52,0.4)" : "#f9f9fb", borderTop: "1px solid " + cardBdr, borderBottom: "1px solid " + cardBdr }}>
        <div className="awards-feature-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,5rem)", alignItems: "center" }}>

          {/* Left — headline */}
          <div>
            <TextReveal text="own your" colors={[textMain, textMain]}
              style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-1px", justifyContent: "flex-start" }} />
            <TextReveal text="Industry" colors={["var(--brand-orange, #f5a623)"]} delay={0.15}
              style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-1px", justifyContent: "flex-start" }} />
            <ScrollP textMid={textMid} align="left" maxW={480}>
              You set the standard. Our jury confirms it. The companies, teams, and individuals who win earn more than a trophy — they earn a story the market trusts, partners respect, and teams are proud to tell.
            </ScrollP>
          </div>

          {/* Right — featured award card */}
          <ScrollCard dark={dark} textMain={textMain} textMid={textMid} textSoft={textSoft} accent={accent} cardBg={cardBg} cardBdr={cardBdr} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         SECTION 4 — TROPHIES BANNER (scroll container)
         ════════════════════════════════════════════════════════ */}
      <ScrollBanner bg={bg} />

      {/* ════════════════════════════════════════════════════════
         SECTION 5 — AWARD CATEGORIES LIST
         ════════════════════════════════════════════════════════ */}
      <section id="awards-list" style={{ background: dark ? "#0a0618" : "#faf8ff", borderTop: "1px solid " + cardBdr, borderBottom: "1px solid " + cardBdr }}>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(3rem,6vw,5rem) 5% 0" }}>
          <TextReveal text="Discover Our Awards" colors={[textMain, textMain, accent]}
            style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, marginBottom: "0.5rem" }} />
          <DividerReveal accent={accent} />

          {/* Pillar filters */}
          <div className="awards-filter-row" style={{ display: "flex", gap: 8, marginBottom: 8, overflowX: "auto", paddingBottom: 16 }}>
            {[{ key: "all", label: "All 25" }].concat(PILLARS.map(function (p) {
              return { key: p, label: p.length > 18 ? p.split(" ")[0] : p };
            })).map(function (f) {
              var active = activePillar === f.key;
              return (
                <button key={f.key} onClick={function () { setActivePillar(f.key); setExpandedRow(null); }}
                  style={{
                    border: "1px solid " + (active ? "rgba(245,166,35,0.40)" : "transparent"),
                    background: active ? "rgba(245,166,35,0.12)" : "transparent",
                    color: active ? "#f5a623" : textSoft,
                    fontFamily: "'Orbitron',sans-serif", fontSize: "0.6rem", fontWeight: 700,
                    letterSpacing: "0.5px", textTransform: "uppercase",
                    padding: "8px 16px", borderRadius: 999, cursor: "pointer",
                    whiteSpace: "nowrap", transition: "all 0.2s ease",
                  }}
                >{f.label}</button>
              );
            })}
          </div>
        </div>

        {/* Numbered list rows */}
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {filtered.map(function (award) {
            return <AwardListRow key={award.num} award={award} dark={dark} textMain={textMain} textMid={textMid} textSoft={textSoft} cardBdr={cardBdr} isOpen={expandedRow === award.num} onToggle={function () { setExpandedRow(expandedRow === award.num ? null : award.num); }} />;
          })}
        </div>

        {/* Special awards */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(2rem,4vw,4rem) 5%" }}>
          <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "#f5a623", marginBottom: 16 }}>Special Recognition</p>
          {SPECIAL_AWARDS.map(function (award) {
            return <AwardListRow key={award.num} award={award} dark={dark} textMain={textMain} textMid={textMid} textSoft={textSoft} cardBdr={cardBdr} isOpen={expandedRow === award.num} onToggle={function () { setExpandedRow(expandedRow === award.num ? null : award.num); }} />;
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         SECTION 6 — JUDGING & TIMELINE
         ════════════════════════════════════════════════════════ */}
      <section style={{ padding: "clamp(4rem,8vw,7rem) 5%", background: bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Judging */}
          <ScrollReveal>
            <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: textSoft, marginBottom: 12 }}>Evaluation</p>
            <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 900, color: textMain, marginBottom: 28 }}>How Winners Are Chosen</h3>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div style={{ display: "flex", borderRadius: 16, overflow: "hidden", border: "1px solid " + cardBdr }}>
              {[
                { label: "Innovation", val: "25%" },
                { label: "Impact", val: "30%" },
                { label: "Scale", val: "20%" },
                { label: "Canadian", val: "15%" },
                { label: "Execution", val: "10%" },
              ].map(function (c, i) {
                return (
                  <div key={c.label} style={{
                    flex: 1, padding: "clamp(16px,2.5vw,28px) clamp(8px,1.5vw,18px)", textAlign: "center",
                    background: bg, borderRight: i < 4 ? "1px solid " + cardBdr : "none",
                  }}>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.2rem,2.2vw,1.8rem)", fontWeight: 900, color: "#f5a623", marginBottom: 4 }}>{c.val}</div>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(0.5rem,0.8vw,0.62rem)", fontWeight: 700, color: textSoft, letterSpacing: "0.5px", textTransform: "uppercase" }}>{c.label}</div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Timeline */}
          <ScrollReveal delay={0.15}>
            <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 900, color: textMain, marginTop: "clamp(4rem,7vw,6rem)", marginBottom: 32, textAlign: "center" }}>Road to Awards Night</h3>
          </ScrollReveal>

          <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: 5, left: 0, right: 0, height: 2, background: dark ? "linear-gradient(90deg, rgba(185,158,255,0.12), rgba(245,166,35,0.20))" : "linear-gradient(90deg, rgba(122,63,209,0.08), rgba(245,166,35,0.12))" }} />

            {[
              { d: "Jun", l: "Framework" },
              { d: "Jul–Aug", l: "Nominations" },
              { d: "Sep", l: "Screening" },
              { d: "Oct 6", l: "Shortlist" },
              { d: "Oct 15", l: "Sealed" },
              { d: "Oct 26", l: "Awards Night", highlight: true },
            ].map(function (t, i) {
              return (
                <ScrollReveal key={t.d} delay={i * 0.06}>
                  <div style={{ textAlign: "center", position: "relative", zIndex: 2, minWidth: 70 }}>
                    <div style={{
                      width: t.highlight ? 14 : 8, height: t.highlight ? 14 : 8, borderRadius: "50%",
                      background: t.highlight ? "#f5a623" : (dark ? "rgba(185,158,255,0.25)" : "rgba(122,63,209,0.15)"),
                      margin: t.highlight ? "-3px auto 10px" : "0 auto 10px",
                      boxShadow: t.highlight ? "0 0 14px rgba(245,166,35,0.40)" : "none",
                    }} />
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.52rem", fontWeight: 800, color: t.highlight ? "#f5a623" : textSoft, letterSpacing: "1px", marginBottom: 3 }}>{t.d}</div>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, color: textMain, lineHeight: 1.3 }}>{t.l}</div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
         SECTION 7 — CTA
         ════════════════════════════════════════════════════════ */}
      <section style={{ padding: "clamp(4rem,8vw,7rem) 5%", background: dark ? "rgba(28,16,52,0.3)" : "#f9f9fb", borderTop: "1px solid " + cardBdr }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <ScrollReveal>
            <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: textSoft, marginBottom: 16 }}>Free to nominate</p>
            <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: textMain, lineHeight: 1.05, marginBottom: 20 }}>
              Ready to be <span style={{ color: "#f5a623" }}>recognised?</span>
            </h2>
            <p style={{ fontSize: "1rem", color: textMid, lineHeight: 1.8, maxWidth: 480, margin: "0 auto 32px" }}>
              Nominations are free. Self-nominations and third-party nominations are both welcome. The portal opens July 1, 2026.
            </p>
            <div className="awards-hero-ctas" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a href="/tickets" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 14, background: "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#fff", textDecoration: "none", fontFamily: "'Orbitron',sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}
              >Get Your Pass</motion.a>
              <motion.a href="/sponsor#compare-packages" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 14, border: "1.5px solid " + cardBdr, color: textMain, textDecoration: "none", background: "transparent", fontFamily: "'Orbitron',sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}
              >Partner With Us</motion.a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <NewsletterBar dark={dark} />
      <SponsorMarquee dark={dark} />
      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function ScrollP({ children, textMid, align, maxW }) {
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.p ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", bounce: 0.2, duration: 1.4, delay: 0.3 }}
      style={{ fontSize: "clamp(1rem,1.6vw,1.15rem)", color: textMid, lineHeight: 1.85, textAlign: align || "center", maxWidth: maxW || 700, margin: align === "left" ? "1.5rem 0 0" : "0 auto" }}
    >{children}</motion.p>
  );
}

function ScrollReveal({ children, delay }) {
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: delay || 0, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

function ScrollBanner({ bg }) {
  var containerRef = useRef(null);
  var scrollData = useScroll({ target: containerRef });
  var scale = useTransform(scrollData.scrollYProgress, [0, 1], [1.08, 1]);
  var rotate = useTransform(scrollData.scrollYProgress, [0, 1], [6, 0]);
  var opacity = useTransform(scrollData.scrollYProgress, [0, 0.3, 1], [0.3, 1, 1]);

  return (
    <div ref={containerRef} style={{ height: "50rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "2rem 5%", background: bg }}>
      <motion.div style={{ scale: scale, rotateX: rotate, opacity: opacity, maxWidth: 1000, width: "100%", perspective: "1000px",
        borderRadius: 24, overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <img src="/awards-trophies.png" alt="The Catalyst Award Trophies" style={{ width: "100%", height: "auto", display: "block" }} />
      </motion.div>
    </div>
  );
}

function ScrollCard({ dark, textMain, textMid, textSoft, accent, cardBg, cardBdr }) {
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ type: "spring", bounce: 0.3, duration: 1.2 }}
      style={{ background: cardBg, border: "1px solid " + cardBdr, borderRadius: 20, padding: "clamp(24px,4vw,40px)", transition: "border-color 0.3s ease" }}
      onMouseEnter={function (e) { e.currentTarget.style.borderColor = "#f5a623"; }}
      onMouseLeave={function (e) { e.currentTarget.style.borderColor = cardBdr; }}
    >
      <span style={{ display: "inline-block", background: "rgba(245,166,35,0.15)", color: "#f5a623", fontFamily: "'Orbitron',sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", padding: "5px 14px", borderRadius: 999, marginBottom: 20 }}>Nominations Open July 2026</span>

      <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: "clamp(1rem,2vw,1.3rem)", color: textMain, marginBottom: 10, lineHeight: 1.3 }}>
        The Catalyst Awards
      </h3>
      <p style={{ fontSize: "0.95rem", color: textMid, lineHeight: 1.75, marginBottom: 20 }}>
        Honouring the pioneers transforming industries through technology. 25 core categories across the 5×5 pillar-sector matrix, plus 3 special recognition awards.
      </p>

      <a href="#awards-list" style={{ color: "#f5a623", fontFamily: "'Orbitron',sans-serif", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", letterSpacing: "1px", display: "inline-flex", alignItems: "center", gap: 6 }}>
        View all categories
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </a>

      <div style={{ height: 1, background: cardBdr, margin: "20px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.82rem", color: textMid }}>Awards Night</span>
        <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#f5a623" }}>October 26, 2026</span>
      </div>
    </motion.div>
  );
}

function AwardListRow({ award, dark, textMain, textMid, textSoft, cardBdr, isOpen, onToggle }) {
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: (award.num % 5) * 0.03 }}
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", gap: "clamp(14px,2.5vw,28px)",
        padding: "clamp(16px,2.5vw,24px) clamp(16px,3vw,32px)",
        borderBottom: "1px solid " + cardBdr,
        cursor: "pointer", transition: "background 0.25s ease",
        background: isOpen ? (dark ? "rgba(245,166,35,0.08)" : "rgba(245,166,35,0.04)") : "transparent",
      }}
      onMouseEnter={function (e) { if (!isOpen) e.currentTarget.style.background = dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)"; }}
      onMouseLeave={function (e) { if (!isOpen) e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(0.62rem,1.1vw,0.78rem)", fontWeight: 800, color: isOpen ? "#f5a623" : textSoft, minWidth: 32, transition: "color 0.25s ease" }}>
        {award.num < 10 ? "0" + award.num : award.num}
      </span>

      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(0.72rem,1.5vw,1.05rem)", fontWeight: 800, color: textMain, lineHeight: 1.35 }}>
          {award.name}
        </div>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.25 }}
            style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {award.desc ? (
              <p style={{ fontSize: "0.85rem", color: textMid, lineHeight: 1.7, margin: 0 }}>{award.desc}</p>
            ) : (
              <>
                <span style={{ fontSize: "0.68rem", padding: "4px 12px", borderRadius: 6, background: dark ? "rgba(185,158,255,0.10)" : "rgba(122,63,209,0.06)", color: dark ? "#b99eff" : "#7a3fd1", fontWeight: 700, fontFamily: "'Orbitron',sans-serif" }}>{award.pillar}</span>
                <span style={{ fontSize: "0.68rem", padding: "4px 12px", borderRadius: 6, background: "rgba(245,166,35,0.10)", color: "#f5a623", fontWeight: 700, fontFamily: "'Orbitron',sans-serif" }}>{award.sector}</span>
              </>
            )}
          </motion.div>
        )}
      </div>

      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "#f5a623" : textSoft} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, transition: "transform 0.25s ease, stroke 0.25s ease", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
        <path d="M9 18l6-6-6-6" />
      </svg>
    </motion.div>
  );
}
