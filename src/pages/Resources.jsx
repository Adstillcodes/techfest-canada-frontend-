import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ── DATA ─────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    id: "ai",
    title: "Artificial Intelligence & Generative AI",
    short: "AI",
    icon: "🤖",
    color: "#7a3fd1",
    glow: "rgba(122,63,209,0.4)",
    description:
      "From automation to decision intelligence, we focus on where AI is delivering measurable impact, what it takes to deploy responsibly, and how to move from pilots to enterprise scale.",
  },
  {
    id: "quantum",
    title: "Quantum Computing",
    short: "QUANTUM",
    icon: "⚛️",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.4)",
    description:
      "Understand what is real today, what is coming next, and how to prepare for quantum readiness across security, optimization, and next generation computing.",
  },
  {
    id: "sustainability",
    title: "Sustainability & Climate Tech",
    short: "SUSTAIN",
    icon: "🌿",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.4)",
    description:
      "Learn how technology is helping organizations cut emissions, improve efficiency, modernize infrastructure, and meet compliance and reporting expectations while staying competitive.",
  },
  {
    id: "cyber",
    title: "Cybersecurity & Digital Trust",
    short: "CYBER",
    icon: "🔐",
    color: "#f5a623",
    glow: "rgba(245,166,35,0.4)",
    description:
      "Go beyond tools and talk about trust, resilience, and modern security programs that protect data, operations, and critical systems in a rapidly changing threat landscape.",
  },
  {
    id: "robotics",
    title: "Robotics & Intelligent Infrastructure",
    short: "ROBOTICS",
    icon: "🦾",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.4)",
    description:
      "Explore robotics, automation, and connected systems that raise productivity, improve safety, and modernize operations across industries.",
  },
];

const SECTORS = [
  { label: "Energy & Utilities",                      icon: "⚡", color: "#f5a623" },
  { label: "Healthcare & Life Sciences",              icon: "🏥", color: "#ec4899" },
  { label: "Defence & National Security",             icon: "🛡️", color: "#7a3fd1" },
  { label: "Financial Services & Insurance",          icon: "🏦", color: "#22c55e" },
  { label: "Supply Chain, Manufacturing & Infrastructure", icon: "🏭", color: "#06b6d4" },
];

const FORMATS = [
  {
    title: "The Expo",
    icon: "🏛️",
    color: "#7a3fd1",
    description:
      "Technology comes alive. Companies from across Canada and around the world showcase products, platforms, and solutions. Expect demos, live conversations with builders, and a front row view of what is being deployed now — not someday.",
  },
  {
    title: "Awards Night",
    icon: "🏆",
    color: "#f5a623",
    description:
      "Celebrating the Tech Titans of Canada. We recognize the innovators, builders, researchers, and leaders who are shaping the future and delivering real impact across the country.",
  },
  {
    title: "CxO Breakfast",
    icon: "☕",
    color: "#a855f7",
    description:
      "An exclusive invitation-only breakfast for CxOs and senior leaders. This is where business happens in a quieter, higher-trust setting. Think strategic conversations, peer connections, and deal-making over breakfast.",
  },
  {
    title: "Gala Dinner & Networking Reception",
    icon: "🥂",
    color: "#22c55e",
    description:
      "A premium evening to deepen relationships with speakers, exhibitors, partners, and senior attendees. If you want stronger connections, this is where they form.",
  },
  {
    title: "Consultation Clinic",
    icon: "💡",
    color: "#06b6d4",
    description:
      "In collaboration with government bodies, associations, and academic institutes, our Consultation Clinic helps you move forward with clarity. Whether you're looking for funding, programs, partnerships, talent, standards, research support, or market entry — you'll find credible direction and next steps.",
  },
];

// ── ANIMATED COUNTER ─────────────────────────────────────────────────────────

function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 40);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(start);
    }, 30);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── PILLAR CARD ──────────────────────────────────────────────────────────────

function PillarCard({ pillar, index, isActive, onClick, isDark = true }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${pillar.color}22, ${pillar.color}11)`
          : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${isActive ? pillar.color : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        padding: "20px 22px",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s",
      }}
    >
      {isActive && (
        <motion.div
          layoutId="pillarGlow"
          style={{
            position: "absolute", inset: 0, borderRadius: 20,
            background: `radial-gradient(ellipse at 30% 50%, ${pillar.glow}, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: "1.5rem" }}>{pillar.icon}</span>
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "0.65rem", fontWeight: 800,
          letterSpacing: "1.5px", textTransform: "uppercase",
          color: isActive ? pillar.color : (isDark ? "rgba(255,255,255,0.4)" : "rgba(20,5,60,0.4)"),
          transition: "color 0.3s",
        }}>
          {pillar.short}
        </span>
      </div>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "0.82rem", fontWeight: 700,
        color: isActive ? (isDark ? "#ffffff" : "#0f0520") : (isDark ? "rgba(255,255,255,0.7)" : "rgba(20,5,60,0.75)"),
        lineHeight: 1.4, transition: "color 0.3s",
      }}>
        {pillar.title}
      </div>
    </motion.button>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function FirstTimers() {
  const [activePillar, setActivePillar] = useState(0);
  const [activeFormat, setActiveFormat] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    setIsDark(document.body.classList.contains("dark-mode"));
    const observer = new MutationObserver(() =>
      setIsDark(document.body.classList.contains("dark-mode"))
    );
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const bg       = isDark ? "#07030f"              : "#f4f0ff";
  const cardBg   = isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.07)";
  const border   = isDark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.25)";
  const textMain = isDark ? "#ffffff"              : "#0f0520";
  const textMuted= isDark ? "rgba(200,180,255,0.65)": "rgba(60,30,110,0.75)";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <style>{`
        /* ── FIRST TIMERS MOBILE ── */
        @media (max-width: 900px) {
          .ft-two-col { grid-template-columns: 1fr !important; gap: 24px !important; }
          .ft-five-col { grid-template-columns: repeat(2, 1fr) !important; }
          .ft-sticky { position: static !important; top: auto !important; }
          .ft-hero-stats { flex-direction: row !important; flex-wrap: wrap !important; justify-content: center !important; }
          .ft-hero-stats > * { min-width: 120px !important; flex: 1 1 120px !important; }
          .ft-sector-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ft-format-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ft-connector-tabs { flex-wrap: wrap !important; gap: 6px !important; }
          .ft-pillar-list { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .ft-section { padding: 60px 5% !important; }
        }
        @media (max-width: 540px) {
          .ft-five-col { grid-template-columns: 1fr !important; }
          .ft-format-grid { grid-template-columns: 1fr 1fr !important; }
          .ft-hero-h1 { font-size: 1.6rem !important; }
          .ft-hero-stats { gap: 8px !important; }
          .ft-hero-stats > * { min-width: 100px !important; padding: 10px 12px !important; }
          .ft-pillar-list { grid-template-columns: 1fr !important; }
          .ft-sector-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ft-cta-row { flex-direction: column !important; }
          .ft-cta-row a, .ft-cta-row button { width: 100% !important; text-align: center !important; }
        }
      `}</style>
      <Navbar />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          position: "relative", minHeight: "85vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", paddingTop: 100,
        }}
      >
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: isDark ? `linear-gradient(rgba(122,63,209,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(122,63,209,0.06) 1px, transparent 1px)` : `linear-gradient(rgba(122,63,209,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(122,63,209,0.10) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

        {/* Orbs */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,63,209,0.15), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.10), transparent 70%)", pointerEvents: "none" }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", padding: "0 5%", maxWidth: 900, margin: "0 auto" }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(122,63,209,0.12)", border: "1px solid rgba(122,63,209,0.30)",
              borderRadius: 999, padding: "6px 18px", marginBottom: 28,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5a623", boxShadow: "0 0 8px #f5a623", display: "inline-block" }} />
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "#c4a8ff" : "#5a1fa8" }}>
              First Timers Guide
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="ft-hero-h1" style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 900, lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Welcome to{" "}
            <span style={{
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              The Tech Festival Canada
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            style={{ fontSize: "1.05rem", color: textMuted, lineHeight: 1.8, maxWidth: 680, margin: "0 auto 40px" }}
          >
            If this is your first time, here is what to expect and how to get the most value from the experience. This is built for outcomes: clearer decisions, faster partnerships, and real momentum after the event.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="ft-hero-stats" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            {[
              { val: 500, suffix: "+", label: "Decision Makers" },
              { val: 5, suffix: "", label: "Tech Pillars" },
              { val: 5, suffix: "", label: "Applied Sectors" },
              { val: 1, suffix: " Day", label: "Oct 28, 2026" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{
                  background: "rgba(122,63,209,0.10)", border: "1px solid rgba(122,63,209,0.20)",
                  borderRadius: 14, padding: "14px 24px", textAlign: "center",
                }}
              >
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", fontWeight: 900, color: "#f5a623" }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: "0.7rem", color: textMuted, letterSpacing: "0.8px", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: textMuted, fontSize: "0.7rem", textAlign: "center" }}
        >
          <div>↓</div>
          <div style={{ letterSpacing: "1px", marginTop: 4 }}>SCROLL</div>
        </motion.div>
      </section>

      {/* ── THE CONFERENCE ── */}
      <section className="ft-section" style={{ padding: "100px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="The Conference" isDark={isDark} />

        <div className="ft-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          {/* Left: intro + pillar list */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}
            >
              Curated around<br />
              <span style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                real-world impact
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ color: textMuted, lineHeight: 1.8, marginBottom: 32 }}
            >
              Our conference is curated around five tech pillars and the real-world sectors where they are being adopted. Every session is designed to unpack opportunities, challenges, and practical solutions you can take back to your organization.
            </motion.p>

            <div className="ft-pillar-list" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PILLARS.map((p, i) => (
                <PillarCard
                  key={p.id} pillar={p} index={i}
                  isActive={activePillar === i}
                  onClick={() => setActivePillar(i)}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          {/* Right: detail panel */}
          <div className="ft-sticky" style={{ position: "sticky", top: 120 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: `linear-gradient(135deg, ${PILLARS[activePillar].color}18, ${PILLARS[activePillar].color}08)`,
                  border: `1.5px solid ${PILLARS[activePillar].color}55`,
                  borderRadius: 28, padding: "40px",
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Glow */}
                <div style={{
                  position: "absolute", top: -60, right: -60,
                  width: 280, height: 280, borderRadius: "50%",
                  background: `radial-gradient(circle, ${PILLARS[activePillar].glow}, transparent 70%)`,
                  pointerEvents: "none",
                }} />

                <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>{PILLARS[activePillar].icon}</div>

                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.65rem", fontWeight: 800,
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  color: PILLARS[activePillar].color, marginBottom: 12,
                }}>
                  Tech Pillar {activePillar + 1} of 5
                </div>

                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "1.3rem", fontWeight: 900,
                  marginBottom: 20, lineHeight: 1.3,
                }}>
                  {PILLARS[activePillar].title}
                </h3>

                <p style={{ color: textMuted, lineHeight: 1.8, fontSize: "0.95rem" }}>
                  {PILLARS[activePillar].description}
                </p>

                {/* Pillar dots nav */}
                <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
                  {PILLARS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePillar(i)}
                      style={{
                        width: activePillar === i ? 24 : 8,
                        height: 8, borderRadius: 99,
                        background: activePillar === i ? PILLARS[activePillar].color : "rgba(255,255,255,0.15)",
                        border: "none", cursor: "pointer",
                        transition: "all 0.3s",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── APPLIED SECTORS ── */}
      <section className="ft-section" style={{ padding: "80px 5%", background: isDark ? "rgba(122,63,209,0.04)" : "rgba(122,63,209,0.04)", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel label="Applied Sectors" isDark={isDark} />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: 16, textAlign: "center" }}
          >
            Where the demand is urgent &{" "}
            <span style={{ background: "linear-gradient(135deg, #f5a623, #7a3fd1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              budgets are real
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: textMuted, textAlign: "center", maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.8 }}
          >
            We bring these conversations into the sectors where deployment decisions are being made right now.
          </motion.p>

          <div className="ft-sector-grid ft-five-col" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {SECTORS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{
                  background: cardBg, border: `1.5px solid ${border}`,
                  borderRadius: 20, padding: "28px 20px", textAlign: "center",
                  cursor: "default", position: "relative", overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${s.color}, transparent)`,
                  borderRadius: "20px 20px 0 0",
                }} />
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>{s.icon}</div>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.72rem", fontWeight: 700,
                  color: isDark ? textMain : "#1a0a40", lineHeight: 1.4,
                }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHERE PILLARS MEET SECTORS ── */}
      <section className="ft-section" style={{ padding: "100px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="Where Pillars Meet Sectors" isDark={isDark} />

        <div className="ft-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}
            >
              This is where the{" "}
              <span style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                magic happens
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ color: textMuted, lineHeight: 1.9, fontSize: "0.98rem", marginBottom: 28 }}
            >
              You will see how each pillar translates into real use cases inside each sector — who is buying, what procurement looks like, and what it takes to implement successfully.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              style={{ color: textMuted, lineHeight: 1.9, fontSize: "0.98rem" }}
            >
              The goal is to connect solution providers with decision makers who need outcomes, so conversations can move from interest to pilots to partnerships and contracts.
            </motion.p>
          </div>

          {/* Interactive Pillar → Sector connector */}
          <PillarSectorConnector PILLARS={PILLARS} SECTORS={SECTORS} isDark={isDark} textMuted={textMuted} textMain={textMain} />
        </div>
      </section>

      {/* ── EVENT FORMATS ── */}
      <section className="ft-section" style={{ padding: "80px 5%", background: isDark ? "rgba(122,63,209,0.04)" : "rgba(122,63,209,0.04)", borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel label="What's On" isDark={isDark} />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: 12, textAlign: "center" }}
          >
            Five ways to{" "}
            <span style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              engage
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ color: textMuted, textAlign: "center", marginBottom: 48, maxWidth: 500, margin: "0 auto 48px" }}
          >
            Click on any format to learn more about what to expect.
          </motion.p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
            {FORMATS.map((f, i) => (
              <motion.button
                key={f.title}
                onClick={() => setActiveFormat(activeFormat === i ? null : i)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                style={{
                  background: activeFormat === i
                    ? `linear-gradient(135deg, ${f.color}22, ${f.color}10)`
                    : (isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.06)"),
                  border: `1.5px solid ${activeFormat === i ? f.color : border}`,
                  borderRadius: 20, padding: "20px 12px", cursor: "pointer",
                  textAlign: "center", transition: "all 0.3s",
                  position: "relative", overflow: "hidden",
                }}
              >
                {activeFormat === i && (
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 20,
                    background: `radial-gradient(ellipse at 50% 0%, ${f.color}30, transparent 70%)`,
                    pointerEvents: "none",
                  }} />
                )}
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>{f.icon}</div>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.68rem", fontWeight: 800,
                  color: activeFormat === i ? f.color : (isDark ? textMain : "#1a0a40"),
                  lineHeight: 1.35, transition: "color 0.3s",
                  wordBreak: "break-word",
                }}>
                  {f.title}
                </div>
                <div style={{
                  marginTop: 10, fontSize: "0.65rem",
                  color: activeFormat === i ? f.color : (isDark ? textMuted : "rgba(60,30,110,0.6)"),
                  transition: "color 0.3s",
                }}>
                  {activeFormat === i ? "▲ Close" : "▼ Learn more"}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Expanded description */}
          <AnimatePresence>
            {activeFormat !== null && (
              <motion.div
                key={activeFormat}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${FORMATS[activeFormat].color}15, ${FORMATS[activeFormat].color}08)`,
                  border: `1.5px solid ${FORMATS[activeFormat].color}44`,
                  borderRadius: 20, padding: "32px 40px",
                  display: "flex", alignItems: "flex-start", gap: 20,
                }}>
                  <span style={{ fontSize: "2.5rem", flexShrink: 0 }}>{FORMATS[activeFormat].icon}</span>
                  <div>
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: FORMATS[activeFormat].color, marginBottom: 12 }}>
                      {FORMATS[activeFormat].title}
                    </h3>
                    <p style={{ color: textMuted, lineHeight: 1.9, maxWidth: 700 }}>
                      {FORMATS[activeFormat].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: "100px 5%", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 700, margin: "0 auto" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", fontWeight: 900, marginBottom: 16 }}>
            Ready to{" "}
            <span style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              show up prepared?
            </span>
          </h2>
          <p style={{ color: textMuted, lineHeight: 1.8, marginBottom: 36, fontSize: "1rem" }}>
            Secure your seat at The Carlu, Toronto on October 28, 2026. Spaces are limited — this is not a conference you attend passively.
          </p>
          <div className="ft-cta-row" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a
              href="/tickets"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                color: "white", padding: "15px 36px", borderRadius: 14,
                fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
                fontSize: "0.85rem", textDecoration: "none",
                letterSpacing: "0.5px",
              }}
            >
              ✦ Get Your Tickets
            </motion.a>
            <motion.a
              href="/speakers"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent",
                border: `1.5px solid ${isDark ? "rgba(122,63,209,0.5)" : "rgba(122,63,209,0.6)"}`,
                color: isDark ? textMain : "#1a0a40", padding: "15px 36px", borderRadius: 14,
                fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                fontSize: "0.85rem", textDecoration: "none",
              }}
            >
              View Speakers →
            </motion.a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}


const USE_CASES = {
  ai: [
    { sector: "Healthcare & Life Sciences",              case: "AI diagnostics & clinical decision support deployed at hospital networks" },
    { sector: "Financial Services & Insurance",         case: "Real-time fraud detection & AI-driven underwriting at scale" },
    { sector: "Defence & National Security",            case: "Autonomous threat detection and intelligence analysis systems" },
    { sector: "Energy & Utilities",                     case: "Predictive grid maintenance and energy demand forecasting" },
    { sector: "Supply Chain, Manufacturing & Infrastructure", case: "Computer vision QA and intelligent logistics routing" },
  ],
  quantum: [
    { sector: "Financial Services & Insurance",         case: "Portfolio optimization and quantum-safe cryptography for banks" },
    { sector: "Healthcare & Life Sciences",              case: "Drug discovery acceleration through molecular simulation" },
    { sector: "Defence & National Security",            case: "Quantum-secure communications and encryption migration" },
    { sector: "Energy & Utilities",                     case: "Grid optimization and materials science for battery development" },
    { sector: "Supply Chain, Manufacturing & Infrastructure", case: "Route optimization and quantum logistics for complex supply chains" },
  ],
  sustainability: [
    { sector: "Energy & Utilities",                     case: "Smart grid management and renewable energy integration platforms" },
    { sector: "Supply Chain, Manufacturing & Infrastructure", case: "Carbon tracking, circular economy platforms, green manufacturing" },
    { sector: "Healthcare & Life Sciences",              case: "Sustainable hospital operations and green pharma supply chains" },
    { sector: "Financial Services & Insurance",         case: "ESG reporting tools, green bonds, and climate risk modelling" },
    { sector: "Defence & National Security",            case: "Sustainable military logistics and energy-resilient base infrastructure" },
  ],
  cyber: [
    { sector: "Defence & National Security",            case: "Critical infrastructure protection and national cyber resilience" },
    { sector: "Financial Services & Insurance",         case: "Zero-trust banking architecture and cyber insurance underwriting" },
    { sector: "Healthcare & Life Sciences",              case: "Medical device security and patient data protection at scale" },
    { sector: "Energy & Utilities",                     case: "OT/IT convergence security for power grids and pipelines" },
    { sector: "Supply Chain, Manufacturing & Infrastructure", case: "Supply chain attack prevention and secure industrial IoT" },
  ],
  robotics: [
    { sector: "Supply Chain, Manufacturing & Infrastructure", case: "Autonomous warehousing, robotic assembly, and smart factories" },
    { sector: "Healthcare & Life Sciences",              case: "Surgical robotics, hospital automation, and rehab exoskeletons" },
    { sector: "Defence & National Security",            case: "Autonomous drones, bomb disposal robots, and logistics automation" },
    { sector: "Energy & Utilities",                     case: "Robotic inspection of pipelines, wind turbines, and power infrastructure" },
    { sector: "Financial Services & Insurance",         case: "Process automation, robotic document processing, and compliance bots" },
  ],
};

function PillarSectorConnector({ PILLARS, SECTORS, isDark, textMuted, textMain }) {
  const [selected, setSelected] = useState(0);
  const pillar = PILLARS[selected];
  const cases = USE_CASES[pillar.id] || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      style={{ width: "100%" }}
    >
      {/* Pillar selector tabs */}
      <div className="ft-connector-tabs" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {PILLARS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setSelected(i)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 12px", borderRadius: 99, cursor: "pointer",
              background: selected === i ? `${p.color}22` : "transparent",
              border: `1.5px solid ${selected === i ? p.color : isDark ? "rgba(255,255,255,0.12)" : "rgba(122,63,209,0.20)"}`,
              color: selected === i ? p.color : (isDark ? "rgba(255,255,255,0.5)" : "rgba(60,30,110,0.55)"),
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.5px",
              textTransform: "uppercase", transition: "all 0.25s",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>{p.icon}</span>
            {p.short}
          </button>
        ))}
      </div>

      {/* Heading */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(122,63,209,0.15)"}` }}>
            <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{pillar.icon}</div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: "0.75rem",
              fontWeight: 800, color: pillar.color, letterSpacing: "0.5px", marginBottom: 4,
            }}>
              {pillar.title}
            </div>
            <div style={{ fontSize: "0.8rem", color: textMuted, lineHeight: 1.6 }}>
              {pillar.description}
            </div>
          </div>

          {/* Sector use-cases */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cases.map((c, i) => {
              const sector = SECTORS.find(s => s.label === c.sector);
              return (
                <motion.div
                  key={c.sector}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.05)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(122,63,209,0.18)"}`,
                    borderLeft: `3px solid ${pillar.color}`,
                    borderRadius: 12, padding: "12px 14px",
                  }}
                >
                  <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 1 }}>{sector?.icon}</span>
                  <div>
                    <div style={{
                      fontSize: "0.72rem", fontWeight: 700,
                      color: isDark ? "rgba(255,255,255,0.85)" : "#1a0a40",
                      marginBottom: 3, fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.3px",
                    }}>
                      {c.sector}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: textMuted, lineHeight: 1.6 }}>
                      {c.case}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ── SECTION LABEL ─────────────────────────────────────────────────────────────

function SectionLabel({ label, isDark = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: isDark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.08)",
        border: `1px solid ${isDark ? "rgba(122,63,209,0.25)" : "rgba(122,63,209,0.35)"}`,
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
