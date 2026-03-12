import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ── DATA ─────────────────────────────────────────────────────────────────────

var PILLARS = [
  { title: "Artificial Intelligence & Generative AI", icon: "🤖", color: "#7a3fd1", desc: "From automation to decision intelligence, we focus on where AI is delivering measurable impact, what it takes to deploy responsibly, and how to move from pilots to enterprise scale." },
  { title: "Quantum Computing", icon: "⚛️", color: "#a855f7", desc: "Understand what is real today, what is coming next, and how to prepare for quantum readiness across security, optimization, and next generation computing." },
  { title: "Sustainability & Climate Tech", icon: "🌿", color: "#22c55e", desc: "Learn how technology is helping organizations cut emissions, improve efficiency, modernize infrastructure, and meet compliance and reporting expectations." },
  { title: "Cybersecurity & Digital Trust", icon: "🔐", color: "#f5a623", desc: "Go beyond tools and talk about trust, resilience, and modern security programs that protect data, operations, and critical systems." },
  { title: "Robotics & Intelligent Infrastructure", icon: "🦾", color: "#06b6d4", desc: "Explore robotics, automation, and connected systems that raise productivity, improve safety, and modernize operations across industries." },
];

var SECTORS = [
  { label: "Energy & Utilities", icon: "⚡", color: "#f5a623" },
  { label: "Healthcare & Life Sciences", icon: "🏥", color: "#ec4899" },
  { label: "Defence & National Security", icon: "🛡️", color: "#7a3fd1" },
  { label: "Financial Services & Insurance", icon: "🏦", color: "#22c55e" },
  { label: "Supply Chain, Manufacturing & Infrastructure", icon: "🏭", color: "#06b6d4" },
];

var FORMATS = [
  { title: "The Expo", icon: "🏛️", color: "#7a3fd1", desc: "Companies from across Canada and around the world showcase products, platforms, and solutions. Expect demos, live conversations with builders, and a front-row view of what is being deployed now." },
  { title: "Awards Night", icon: "🏆", color: "#f5a623", desc: "Celebrating the Tech Titans of Canada. We recognize the innovators, builders, researchers, and leaders who are shaping the future." },
  { title: "CxO Breakfast", icon: "☕", color: "#a855f7", desc: "An exclusive invitation-only breakfast for CxOs and senior leaders. Strategic conversations, peer connections, and deal-making." },
  { title: "Gala Dinner", icon: "🥂", color: "#22c55e", desc: "A premium evening to deepen relationships with speakers, exhibitors, partners, and senior attendees." },
  { title: "Consultation Clinic", icon: "💡", color: "#06b6d4", desc: "Whether you're looking for funding, partnerships, talent, or market entry — you'll find credible direction and next steps." },
];

// ── COUNTER ──────────────────────────────────────────────────────────────────

function Counter(props) {
  var to = props.to;
  var suffix = props.suffix || "";
  var s = useState(0); var val = s[0]; var setVal = s[1];
  var ref = useRef(null);
  var inView = useInView(ref, { once: true });
  useEffect(function () {
    if (!inView) return;
    var start = 0;
    var step = Math.ceil(to / 40);
    var id = setInterval(function () {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(start);
    }, 30);
    return function () { clearInterval(id); };
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── SECTION LABEL ────────────────────────────────────────────────────────────

function SectionLabel(props) {
  var label = props.label;
  var isDark = props.isDark;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: isDark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.08)",
        border: "1px solid " + (isDark ? "rgba(122,63,209,0.25)" : "rgba(122,63,209,0.35)"),
        borderRadius: 999, padding: "5px 16px", marginBottom: 24,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f5a623", boxShadow: "0 0 6px #f5a623", display: "inline-block" }} />
      <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "#c4a8ff" : "#5a1fa8" }}>
        {label}
      </span>
    </motion.div>
  );
}

// ── VISUAL BLOCK — icon grid used as "image" side ────────────────────────────

function IconGrid(props) {
  var items = props.items;
  var isDark = props.isDark;
  var cols = props.cols || 2;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(" + cols + ", 1fr)",
      gap: 14,
      width: "100%",
    }}>
      {items.map(function (item, i) {
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.05)",
              border: "1px solid " + (isDark ? "rgba(255,255,255,0.07)" : "rgba(122,63,209,0.15)"),
              borderRadius: 18,
              padding: "22px 18px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {item.color && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, " + item.color + ", transparent)",
              }} />
            )}
            <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{item.icon}</div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.68rem", fontWeight: 700,
              color: isDark ? "rgba(255,255,255,0.85)" : "#0f0520",
              lineHeight: 1.35,
            }}>{item.title || item.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── ALTERNATING ROW ──────────────────────────────────────────────────────────

function AlternatingRow(props) {
  var isDark = props.isDark;
  var textMain = props.textMain;
  var textMuted = props.textMuted;
  var reverse = props.reverse;
  var label = props.label;
  var heading = props.heading;
  var headingGradient = props.headingGradient;
  var body = props.body;
  var visual = props.visual;
  var border = props.border;
  var hasBg = props.hasBg;

  return (
    <section style={{
      padding: "80px 5%",
      background: hasBg ? (isDark ? "rgba(122,63,209,0.04)" : "rgba(122,63,209,0.03)") : "transparent",
      borderTop: hasBg ? "1px solid " + border : "none",
      borderBottom: hasBg ? "1px solid " + border : "none",
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(32px, 5vw, 64px)",
        alignItems: "center",
        direction: reverse ? "rtl" : "ltr",
      }} className="ft-two-col">
        {/* Text side */}
        <div style={{ direction: "ltr" }}>
          <SectionLabel label={label} isDark={isDark} />

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: 20,
              color: textMain,
            }}
          >
            {heading}{" "}
            {headingGradient && (
              <span style={{
                background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{headingGradient}</span>
            )}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            {typeof body === "string" ? (
              <p style={{ color: textMuted, lineHeight: 1.85, fontSize: "0.95rem" }}>{body}</p>
            ) : body}
          </motion.div>
        </div>

        {/* Visual side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{ direction: "ltr" }}
        >
          {visual}
        </motion.div>
      </div>
    </section>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function FirstTimers() {
  var s1 = useState(true); var isDark = s1[0]; var setIsDark = s1[1];
  var heroRef = useRef(null);
  var scrollData = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  var heroY = useTransform(scrollData.scrollYProgress, [0, 1], ["0%", "30%"]);
  var heroOpacity = useTransform(scrollData.scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(function () {
    setIsDark(document.body.classList.contains("dark-mode"));
    var observer = new MutationObserver(function () {
      setIsDark(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { observer.disconnect(); };
  }, []);

  var bg        = isDark ? "#07030f"               : "#f4f0ff";
  var cardBg    = isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.07)";
  var border    = isDark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.25)";
  var textMain  = isDark ? "#ffffff"               : "#0f0520";
  var textMuted = isDark ? "rgba(200,180,255,0.65)" : "rgba(60,30,110,0.75)";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 900px) {
          .ft-two-col { grid-template-columns: 1fr !important; direction: ltr !important; gap: 28px !important; }
          .ft-section { padding: 56px 5% !important; }
          .ft-hero-stats { flex-wrap: wrap !important; justify-content: center !important; gap: 10px !important; }
          .ft-hero-stats > * { flex: 1 1 140px !important; min-width: 130px !important; max-width: 180px !important; }
          .ft-bottom-cta-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .ft-hero-h1 { font-size: 1.5rem !important; line-height: 1.25 !important; }
          .ft-hero-stats { gap: 8px !important; }
          .ft-hero-stats > * { flex: 1 1 110px !important; min-width: 100px !important; padding: 10px 10px !important; }
          .ft-cta-row { flex-direction: column !important; align-items: stretch !important; }
          .ft-cta-row a { width: 100% !important; text-align: center !important; justify-content: center !important; }
          .ft-section { padding: 44px 4% !important; }
          .ft-bottom-cta-grid { min-height: auto !important; }
        }
        @media (max-width: 380px) {
          .ft-hero-h1 { font-size: 1.25rem !important; }
        }
      `}</style>
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroRef} style={{
        position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", paddingTop: "clamp(80px, 15vw, 130px)", paddingBottom: "clamp(40px, 8vw, 80px)",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: isDark
            ? "linear-gradient(rgba(122,63,209,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(122,63,209,0.06) 1px, transparent 1px)"
            : "linear-gradient(rgba(122,63,209,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(122,63,209,0.10) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,63,209,0.15), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.10), transparent 70%)", pointerEvents: "none" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", padding: "0 5%", maxWidth: 900, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(122,63,209,0.12)", border: "1px solid rgba(122,63,209,0.30)", borderRadius: 999, padding: "6px 18px", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5a623", boxShadow: "0 0 8px #f5a623", display: "inline-block" }} />
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "#c4a8ff" : "#5a1fa8" }}>First Timers Guide</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="ft-hero-h1" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            Welcome to{" "}
            <span style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>The Tech Festival Canada</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
            style={{ fontSize: "1.05rem", color: textMuted, lineHeight: 1.8, maxWidth: 680, margin: "0 auto 40px" }}>
            If this is your first time, here is what to expect and how to get the most value from the experience. This is built for outcomes: clearer decisions, faster partnerships, and real momentum after the event.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="ft-hero-stats" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { val: 500, suffix: "+", label: "Decision Makers" },
              { val: 5, suffix: "", label: "Tech Pillars" },
              { val: 5, suffix: "", label: "Applied Sectors" },
              { val: 2, suffix: " Days", label: "27-28 Oct, 2026" },
            ].map(function (s, i) {
              return (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                  style={{ background: "rgba(122,63,209,0.10)", border: "1px solid rgba(122,63,209,0.20)", borderRadius: 14, padding: "14px 24px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", fontWeight: 900, color: "#f5a623" }}>
                    <Counter to={s.val} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: "0.7rem", color: textMuted, letterSpacing: "0.8px", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ 1. THE CONFERENCE — text left, visual right ═══════════ */}
      <AlternatingRow
        isDark={isDark} textMain={textMain} textMuted={textMuted} border={border}
        reverse={false}
        label="The Conference"
        heading="Curated around"
        headingGradient="real-world impact"
        body="Our conference is curated around five tech pillars and the real-world sectors where they are being adopted. Every session is designed to unpack opportunities, challenges, and practical solutions you can take back to your organization."
        visual={<IconGrid items={PILLARS} isDark={isDark} cols={2} />}
      />

      {/* ═══════════ 2. APPLIED SECTORS — visual left, text right ═══════════ */}
      <AlternatingRow
        isDark={isDark} textMain={textMain} textMuted={textMuted} border={border}
        reverse={true}
        hasBg={true}
        label="Applied Sectors"
        heading="Where the demand is urgent &"
        headingGradient="budgets are real"
        body="We bring these conversations into the sectors where deployment decisions are being made right now — energy, healthcare, defence, financial services, and supply chain."
        visual={<IconGrid items={SECTORS} isDark={isDark} cols={2} />}
      />

      {/* ═══════════ 3. WHERE THEY CONNECT — text left, visual right ═══════════ */}
      <AlternatingRow
        isDark={isDark} textMain={textMain} textMuted={textMuted} border={border}
        reverse={false}
        label="Where Pillars Meet Sectors"
        heading="This is where the"
        headingGradient="magic happens"
        body={(
          <div>
            <p style={{ color: textMuted, lineHeight: 1.85, fontSize: "0.95rem", marginBottom: 18 }}>
              You will see how each pillar translates into real use cases inside each sector — who is buying, what procurement looks like, and what it takes to implement successfully.
            </p>
            <p style={{ color: textMuted, lineHeight: 1.85, fontSize: "0.95rem" }}>
              The goal is to connect solution providers with decision makers who need outcomes, so conversations can move from interest to pilots to partnerships and contracts.
            </p>
          </div>
        )}
        visual={(
          <div style={{
            background: isDark ? "rgba(122,63,209,0.06)" : "rgba(122,63,209,0.04)",
            border: "1px solid " + (isDark ? "rgba(122,63,209,0.18)" : "rgba(122,63,209,0.20)"),
            borderRadius: 22,
            padding: "32px 28px",
          }}>
            {PILLARS.map(function (p, i) {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 0",
                    borderBottom: i < PILLARS.length - 1 ? "1px solid " + (isDark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.10)") : "none",
                  }}
                >
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <span style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "0.72rem", fontWeight: 800,
                      color: p.color,
                    }}>{p.title}</span>
                    <span style={{
                      display: "block", fontSize: "0.78rem",
                      color: textMuted, lineHeight: 1.5, marginTop: 2,
                    }}>{p.desc}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      />

      {/* ═══════════ 4. EVENT FORMATS — visual left, text right ═══════════ */}
      <AlternatingRow
        isDark={isDark} textMain={textMain} textMuted={textMuted} border={border}
        reverse={true}
        hasBg={true}
        label="What's On"
        heading="Five ways to"
        headingGradient="engage"
        body={(
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {FORMATS.map(function (f, i) {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 14,
                    padding: "14px 18px",
                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.04)",
                    border: "1px solid " + (isDark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.12)"),
                    borderLeft: "3px solid " + f.color,
                    borderRadius: 14,
                  }}
                >
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <span style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "0.75rem", fontWeight: 800,
                      color: f.color, display: "block", marginBottom: 4,
                    }}>{f.title}</span>
                    <span style={{
                      fontSize: "0.82rem", color: textMuted, lineHeight: 1.6,
                    }}>{f.desc}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        visual={(
          <div style={{
            position: "relative",
            background: isDark ? "#120a22" : "#ede8f7",
            borderRadius: 22,
            padding: "48px",
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: 340, overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", width: "60%", height: "60%", borderRadius: "50%",
              background: isDark
                ? "radial-gradient(circle, rgba(122,63,209,0.18) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(122,63,209,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, position: "relative", zIndex: 1 }}>
              {FORMATS.map(function (f, i) {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      width: 70, height: 70,
                      borderRadius: 18,
                      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(122,63,209,0.08)",
                      border: "1px solid " + (isDark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.15)"),
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.8rem",
                    }}
                  >{f.icon}</motion.div>
                );
              })}
            </div>
          </div>
        )}
      />

      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section style={{ padding: "80px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="ft-bottom-cta-grid"
          style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 0, borderRadius: 28, overflow: "hidden",
            border: "1px solid " + border,
            background: cardBg, minHeight: 380,
          }}
        >
          <div style={{
            position: "relative",
            background: isDark ? "#120a22" : "#ede8f7",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", minHeight: 280,
          }}>
            <img
              src={isDark ? "/Tech_Festival_Canada_Logo_Dark_Transparent.webp" : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"}
              alt="The Tech Festival Canada"
              style={{
                width: "65%", maxWidth: 280, height: "auto", objectFit: "contain",
                filter: isDark ? "drop-shadow(0 0 40px rgba(122,63,209,0.25))" : "drop-shadow(0 8px 24px rgba(122,63,209,0.12))",
              }}
            />
            <div style={{
              position: "absolute", width: "70%", height: "70%", borderRadius: "50%",
              background: isDark ? "radial-gradient(circle, rgba(122,63,209,0.15) 0%, transparent 70%)" : "radial-gradient(circle, rgba(122,63,209,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
          </div>

          <div style={{ padding: "clamp(32px, 5vw, 56px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: 16, color: textMain,
            }}>
              Ready to{" "}
              <span style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>show up prepared?</span>
            </h2>
            <p style={{ color: textMuted, lineHeight: 1.85, fontSize: "0.95rem", marginBottom: 32, maxWidth: 440 }}>
              Secure your seat at The Carlu, Toronto on October 27–28, 2026. Spaces are limited — this is not a conference you attend passively.
            </p>
            <div className="ft-cta-row" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <motion.a href="/tickets" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: isDark ? "#ffffff" : "#0d0520",
                  color: isDark ? "#0d0520" : "#ffffff",
                  padding: "14px 32px", borderRadius: 14,
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.78rem",
                  textDecoration: "none", letterSpacing: "0.5px", transition: "all 0.25s ease",
                }}
                onMouseEnter={function (e) { e.currentTarget.style.background = "linear-gradient(135deg, #7a3fd1, #f5a623)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={function (e) { e.currentTarget.style.background = isDark ? "#ffffff" : "#0d0520"; e.currentTarget.style.color = isDark ? "#0d0520" : "#ffffff"; }}
              >Get Your Tickets</motion.a>
              <motion.a href="/speakers" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent",
                  border: "1.5px solid " + (isDark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.5)"),
                  color: isDark ? textMain : "#1a0a40",
                  padding: "14px 32px", borderRadius: 14,
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: "0.78rem", textDecoration: "none",
                }}
              >View Speakers →</motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
