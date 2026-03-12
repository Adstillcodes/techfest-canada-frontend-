import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
  var cardBg    = isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.04)";
  var border    = isDark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.18)";
  var textMain  = isDark ? "#ffffff"               : "#0f0520";
  var textMuted = isDark ? "rgba(200,180,255,0.65)" : "rgba(60,30,110,0.75)";
  var accent    = isDark ? "#b99eff"                : "#7a3fd1";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 900px) {
          .ft-row { grid-template-columns: 1fr !important; direction: ltr !important; gap: 28px !important; }
          .ft-hero-stats { flex-wrap: wrap !important; justify-content: center !important; gap: 10px !important; }
          .ft-hero-stats > * { flex: 1 1 140px !important; min-width: 130px !important; max-width: 180px !important; }
          .ft-bottom-cta-grid { grid-template-columns: 1fr !important; }
          .ft-img { min-height: 260px !important; }
        }
        @media (max-width: 540px) {
          .ft-hero-h1 { font-size: 1.5rem !important; line-height: 1.25 !important; }
          .ft-hero-stats { gap: 8px !important; }
          .ft-hero-stats > * { flex: 1 1 110px !important; min-width: 100px !important; padding: 10px 10px !important; }
          .ft-cta-row { flex-direction: column !important; align-items: stretch !important; }
          .ft-cta-row a { width: 100% !important; text-align: center !important; justify-content: center !important; }
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

      {/* ═══════════ SECTION 1 — The Conference (text left, image right) ═══════════ */}
      <ContentRow
        isDark={isDark} textMain={textMain} textMuted={textMuted} accent={accent} border={border}
        reverse={false}
        label="The Conference"
        title="Five tech pillars. Five applied sectors."
        titleGradient="Real-world impact."
        paragraphs={[
          "Our conference is built around five technology pillars — Artificial Intelligence, Quantum Computing, Cybersecurity, Robotics, and Sustainability — and the five applied sectors where they are being deployed: Energy, Healthcare, Defence, Financial Services, and Supply Chain.",
          "Every session is designed to unpack opportunities, challenges, and practical solutions you can take back to your organization. No filler panels. No recycled keynotes.",
        ]}
        image="/ft-panel.webp"
        imageAlt="Panel discussion at The Tech Festival Canada"
        cta={{ label: "Get Your Pass", href: "/tickets" }}
      />

      {/* ═══════════ SECTION 2 — The Audience (image left, text right) ═══════════ */}
      <ContentRow
        isDark={isDark} textMain={textMain} textMuted={textMuted} accent={accent} border={border}
        reverse={true}
        hasBg={true}
        label="Who Attends"
        title="Senior decision-makers from"
        titleGradient="enterprise and government."
        paragraphs={[
          "This is not a general tech conference. Expect a never-seen-before concentration of CxOs, VPs, directors, and program leads from enterprise, critical sectors, government, associations, media, and leading research institutions.",
          "If you are a solution provider, you will be in the same room as the people who sign procurement contracts. If you are a buyer, you will find the innovations that are actually ready to deploy.",
        ]}
        image="/ft-audience.webp"
        imageAlt="Engaged audience at The Tech Festival Canada"
        cta={{ label: "Get Your Pass", href: "/tickets" }}
      />

      {/* ═══════════ SECTION 3 — The Experience (text left, image right) ═══════════ */}
      <ContentRow
        isDark={isDark} textMain={textMain} textMuted={textMuted} accent={accent} border={border}
        reverse={false}
        label="The Experience"
        title="More than a conference."
        titleGradient="Five ways to engage."
        paragraphs={[
          "The Expo brings technology to life with demos and live conversations. The CxO Breakfast is an exclusive, invitation-only session for senior leaders. Awards Night celebrates the Tech Titans of Canada.",
          "The Gala Dinner deepens relationships in a premium setting. And the Consultation Clinic — in collaboration with government bodies and academic institutes — helps you find funding, partnerships, talent, and market-entry support.",
        ]}
        image="/ft-venue.webp"
        imageAlt="The Tech Festival Canada venue and stage"
        cta={{ label: "Partner With Us", href: "/sponsors" }}
      />

      {/* ═══════════ SECTION 4 — Why This Event (image left, text right) ═══════════ */}
      <ContentRow
        isDark={isDark} textMain={textMain} textMuted={textMuted} accent={accent} border={border}
        reverse={true}
        hasBg={true}
        label="Why This Event"
        title="Where pillars meet sectors and"
        titleGradient="real deals happen."
        paragraphs={[
          "You will see how each pillar translates into real use cases inside each sector — who is buying, what procurement looks like, and what it takes to implement successfully.",
          "The goal is simple: connect solution providers with decision-makers who need outcomes, so conversations move from interest to pilots to partnerships and contracts. One venue. Two days. Unlimited momentum.",
        ]}
        image="/ft-panel.webp"
        imageAlt="Speakers at The Tech Festival Canada"
        cta={{ label: "Get Your Pass", href: "/tickets" }}
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
              <motion.a href="/sponsors" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent",
                  border: "1.5px solid " + (isDark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.5)"),
                  color: isDark ? textMain : "#1a0a40",
                  padding: "14px 32px", borderRadius: 14,
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: "0.78rem", textDecoration: "none",
                }}
              >Partner With Us</motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTENT ROW — alternating text + image with CTA
   ═══════════════════════════════════════════════════════ */

function ContentRow(props) {
  var isDark = props.isDark;
  var textMain = props.textMain;
  var textMuted = props.textMuted;
  var accent = props.accent;
  var border = props.border;
  var reverse = props.reverse;
  var hasBg = props.hasBg;
  var ref = useRef(null);
  var isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{
      padding: "clamp(60px, 8vw, 100px) 5%",
      background: hasBg ? (isDark ? "rgba(122,63,209,0.04)" : "rgba(122,63,209,0.03)") : "transparent",
      borderTop: hasBg ? "1px solid " + border : "none",
      borderBottom: hasBg ? "1px solid " + border : "none",
    }}>
      <div className="ft-row" style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(32px, 5vw, 64px)",
        alignItems: "center",
        direction: reverse ? "rtl" : "ltr",
      }}>
        {/* TEXT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", bounce: 0.2, duration: 1.2 }}
          style={{ direction: "ltr" }}
        >
          {/* Label */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: isDark ? "rgba(122,63,209,0.10)" : "rgba(122,63,209,0.08)",
            border: "1px solid " + (isDark ? "rgba(122,63,209,0.25)" : "rgba(122,63,209,0.35)"),
            borderRadius: 999, padding: "5px 16px", marginBottom: 22,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f5a623", boxShadow: "0 0 6px #f5a623", display: "inline-block" }} />
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "#c4a8ff" : "#5a1fa8" }}>
              {props.label}
            </span>
          </div>

          {/* Heading */}
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)",
            fontWeight: 900, lineHeight: 1.25,
            marginBottom: 22, color: textMain,
          }}>
            {props.title}{" "}
            <span style={{
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>{props.titleGradient}</span>
          </h2>

          {/* Paragraphs */}
          {props.paragraphs.map(function (p, i) {
            return (
              <p key={i} style={{
                color: textMuted,
                lineHeight: 1.85,
                fontSize: "0.95rem",
                marginBottom: i < props.paragraphs.length - 1 ? 16 : 28,
                textAlign: "justify",
                hyphens: "auto",
              }}>{p}</p>
            );
          })}

          {/* CTA */}
          <motion.a
            href={props.cta.href}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 32px", borderRadius: 14,
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 800, fontSize: "0.76rem",
              letterSpacing: "0.5px",
              textDecoration: "none",
              transition: "all 0.25s ease",
              background: props.cta.label === "Get Your Pass"
                ? (isDark ? "#ffffff" : "#0d0520")
                : "transparent",
              color: props.cta.label === "Get Your Pass"
                ? (isDark ? "#0d0520" : "#ffffff")
                : (isDark ? "#ffffff" : "#0d0520"),
              border: props.cta.label === "Get Your Pass"
                ? "none"
                : "1.5px solid " + (isDark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.5)"),
              boxShadow: props.cta.label === "Get Your Pass"
                ? (isDark ? "0 4px 20px rgba(155,135,245,0.15)" : "0 4px 20px rgba(13,5,32,0.12)")
                : "none",
            }}
            onMouseEnter={function (e) {
              e.currentTarget.style.background = "linear-gradient(135deg, #7a3fd1, #f5a623)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "transparent";
            }}
            onMouseLeave={function (e) {
              if (props.cta.label === "Get Your Pass") {
                e.currentTarget.style.background = isDark ? "#ffffff" : "#0d0520";
                e.currentTarget.style.color = isDark ? "#0d0520" : "#ffffff";
                e.currentTarget.style.borderColor = "transparent";
              } else {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = isDark ? "#ffffff" : "#0d0520";
                e.currentTarget.style.borderColor = isDark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.5)";
              }
            }}
          >
            {props.cta.label}
            <span style={{ display: "inline-block", marginLeft: 4 }}>→</span>
          </motion.a>
        </motion.div>

        {/* IMAGE SIDE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", bounce: 0.15, duration: 1.3, delay: 0.15 }}
          style={{ direction: "ltr" }}
        >
          <div className="ft-img" style={{
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid " + (isDark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.12)"),
            minHeight: 360,
            position: "relative",
          }}>
            <img
              src={props.image}
              alt={props.imageAlt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                minHeight: 360,
              }}
            />
            {/* Subtle gradient overlay for dark mode readability */}
            <div style={{
              position: "absolute", inset: 0,
              background: isDark
                ? "linear-gradient(to top, rgba(7,3,15,0.3) 0%, transparent 40%)"
                : "linear-gradient(to top, rgba(244,240,255,0.15) 0%, transparent 40%)",
              pointerEvents: "none",
            }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
