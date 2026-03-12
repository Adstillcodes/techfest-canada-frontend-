import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FirstTimers() {
  var s1 = useState(true); var isDark = s1[0]; var setIsDark = s1[1];
  var heroRef = useRef(null);
  var scrollData = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  var heroY = useTransform(scrollData.scrollYProgress, [0, 1], ["0%", "30%"]);
  var heroOpacity = useTransform(scrollData.scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(function () {
    setIsDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () {
      setIsDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);

  var bg        = isDark ? "#07030f"                : "#f4f0ff";
  var cardBg    = isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.04)";
  var border    = isDark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.18)";
  var textMain  = isDark ? "#ffffff"                : "#0f0520";
  var textMuted = isDark ? "rgba(200,180,255,0.65)" : "rgba(60,30,110,0.75)";
  var accent    = isDark ? "#b99eff"                 : "#7a3fd1";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 900px) {
          .ft-row { grid-template-columns: 1fr !important; direction: ltr !important; gap: 28px !important; }
          .ft-bottom-cta-grid { grid-template-columns: 1fr !important; }
          .ft-img { min-height: 260px !important; }
        }
        @media (max-width: 540px) {
          .ft-hero-h1 { font-size: 1.5rem !important; line-height: 1.25 !important; }
          .ft-cta-row { flex-direction: column !important; align-items: stretch !important; }
          .ft-cta-row a { width: 100% !important; text-align: center !important; justify-content: center !important; }
          .ft-bottom-cta-grid { min-height: auto !important; }
        }
        @media (max-width: 380px) { .ft-hero-h1 { font-size: 1.25rem !important; } }

        /* ──── AURORA ──── */
        :root {
          --aurora-white: #ffffff;
          --aurora-black: #06020f;
          --aurora-transparent: transparent;
          --aurora-purple: #7a3fd1;
          --aurora-violet: #9b57e8;
          --aurora-lilac: #c4a0f5;
          --aurora-orange: #f5a623;
          --aurora-amber: #f7c15e;
        }
        @keyframes ft-aurora {
          from { background-position: 50% 50%, 50% 50%; }
          to   { background-position: 350% 50%, 350% 50%; }
        }
        .ft-aurora-layer {
          position: absolute; inset: -10px; pointer-events: none;
          will-change: transform;
          background-size: 300%, 200%;
          background-position: 50% 50%;
          filter: blur(10px);
          opacity: 0.50;
        }
        .ft-aurora-layer--dark {
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-black) 0%, var(--aurora-black) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-black) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          mask-image: radial-gradient(ellipse at 100% 0%, black 10%, var(--aurora-transparent) 70%);
          -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 10%, var(--aurora-transparent) 70%);
        }
        .ft-aurora-layer--dark::after {
          content: ""; position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-black) 0%, var(--aurora-black) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-black) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          background-size: 200%, 100%;
          background-attachment: fixed;
          animation: ft-aurora 60s linear infinite;
          mix-blend-mode: difference;
        }
        .ft-aurora-layer--light {
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-white) 0%, var(--aurora-white) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-white) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          opacity: 0.35; filter: blur(12px);
          mask-image: radial-gradient(ellipse at 100% 0%, black 10%, var(--aurora-transparent) 70%);
          -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 10%, var(--aurora-transparent) 70%);
        }
        .ft-aurora-layer--light::after {
          content: ""; position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-white) 0%, var(--aurora-white) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-white) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          background-size: 200%, 100%;
          background-attachment: fixed;
          animation: ft-aurora 60s linear infinite;
          mix-blend-mode: difference;
        }
      `}</style>

      <Navbar />

      {/* ═══════════ HERO — Aurora Background ═══════════ */}
      <section ref={heroRef} style={{
        position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", minHeight: "100vh",
        background: isDark ? "#06020f" : "#f4f0ff",
      }}>
        {/* Aurora layer */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <div className={isDark ? "ft-aurora-layer ft-aurora-layer--dark" : "ft-aurora-layer ft-aurora-layer--light"} />
        </div>

        {/* Radial mask for depth */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: isDark
            ? "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, #06020f 100%)"
            : "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, #f4f0ff 100%)",
        }} />

        {/* Content */}
        <motion.div style={{
          y: heroY, opacity: heroOpacity,
          position: "relative", zIndex: 10,
          textAlign: "center", padding: "0 5%",
          maxWidth: 900, margin: "0 auto",
          paddingTop: "clamp(80px, 12vw, 120px)",
          paddingBottom: "clamp(40px, 8vw, 80px)",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}
          >
            {/* Heading */}
            <h1 className="ft-hero-h1" style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)",
              fontWeight: 900, lineHeight: 1.08,
              marginBottom: 24, letterSpacing: "-0.5px",
            }}>
              Welcome to{" "}
              <span style={{
                background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>The Tech Festival Canada</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: "clamp(0.95rem, 1.6vw, 1.12rem)",
              color: textMuted, lineHeight: 1.85,
              maxWidth: 660, marginBottom: 40,
            }}>
              If this is your first time, here is what to expect and how to get the most value from the experience. This is built for outcomes: clearer decisions, faster partnerships, and real momentum after the event.
            </p>

            {/* Scroll cue */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              style={{ marginTop: 48, color: textMuted, fontSize: "0.7rem", textAlign: "center", opacity: 0.6 }}
            >
              <div style={{ fontSize: "1.1rem" }}>↓</div>
              <div style={{ letterSpacing: "1.5px", marginTop: 4, fontFamily: "'Orbitron', sans-serif", fontSize: "0.55rem", fontWeight: 700 }}>SCROLL</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ ROW 1 — THE CONFERENCE (text left, image right) ═══════════ */}
      <ContentRow isDark={isDark} textMain={textMain} textMuted={textMuted} accent={accent} border={border}
        reverse={false}
        image="/ft-conference.jpg" imageAlt="Keynote presentation showing five tech pillars and applied sectors"
        cta={{ label: "Get Your Pass", href: "/tickets" }}
      >
        <h2 style={headingStyle(textMain)}>
          The <GradientSpan>Conference</GradientSpan>
        </h2>
        <p style={paraStyle(textMuted)}>
          Our conference is curated around five tech pillars and the real world sectors where they are being adopted. Every session is designed to unpack opportunities, challenges, and practical solutions you can take back to your organization.
        </p>

        <SubHeading textMain={textMain}>5 Tech Pillars</SubHeading>
        <ListBlock textMain={textMain} items={[
          "Artificial Intelligence and Generative AI",
          "Quantum Computing",
          "Sustainability and Climate Tech",
          "Cybersecurity and Digital Trust",
          "Robotics and Intelligent Infrastructure",
        ]} />

        <SubHeading textMain={textMain}>5 Applied Sectors</SubHeading>
        <p style={paraStyle(textMuted)}>
          We bring these conversations into the sectors where the demand is urgent and budgets are real:
        </p>
        <ListBlock textMain={textMain} items={[
          "Energy and Utilities",
          "Healthcare and Life Sciences",
          "Defence and National Security",
          "Financial Services and Insurance",
          "Supply Chain, Manufacturing, and Critical Infrastructure",
        ]} />

        <SubHeading textMain={textMain}>Where Pillars Meet Sectors</SubHeading>
        <p style={paraStyle(textMuted)}>
          This is where the magic happens. You will see how each pillar translates into real use cases inside each sector, who is buying, what procurement looks like, and what it takes to implement successfully. The goal is to connect solution providers with decision makers who need outcomes, so conversations can move from interest to pilots to partnerships and contracts.
        </p>
      </ContentRow>

      {/* ═══════════ ROW 2 — THE EXPO (image left, text right) ═══════════ */}
      <ContentRow isDark={isDark} textMain={textMain} textMuted={textMuted} accent={accent} border={border}
        reverse={true} hasBg={true}
        image="/ft-expo.jpg" imageAlt="The Tech Festival Canada expo and networking floor"
        cta={{ label: "Partner With Us", href: "/sponsor" }}
      >
        <h2 style={headingStyle(textMain)}>
          The <GradientSpan>Expo</GradientSpan>
        </h2>
        <p style={paraStyle(textMuted)}>
          The Expo is where technology comes alive. Companies from across Canada and around the world showcase products, platforms, and solutions. Expect demos, live conversations with builders, and a front row view of what is being deployed now, not someday.
        </p>
      </ContentRow>

      {/* ═══════════ ROW 3 — AWARDS NIGHT (text left, image right) ═══════════ */}
      <ContentRow isDark={isDark} textMain={textMain} textMuted={textMuted} accent={accent} border={border}
        reverse={false}
        image="/ft-awards.jpg" imageAlt="Canada Tech Titans Awards Night ceremony"
        cta={{ label: "Get Your Pass", href: "/tickets" }}
      >
        <h2 style={headingStyle(textMain)}>
          Awards <GradientSpan>Night</GradientSpan>
        </h2>
        <p style={paraStyle(textMuted)}>
          Our Awards Night celebrates the Tech Titans of Canada. We recognize the innovators, builders, researchers, and leaders who are shaping the future and delivering real impact across the country.
        </p>
      </ContentRow>

      {/* ═══════════ ROW 4 — CxO BREAKFAST (image left, text right) ═══════════ */}
      <ContentRow isDark={isDark} textMain={textMain} textMuted={textMuted} accent={accent} border={border}
        reverse={true} hasBg={true}
        image="/ft-breakfast.jpg" imageAlt="CxO Breakfast with senior leaders"
        cta={{ label: "Get Your Pass", href: "/tickets" }}
      >
        <h2 style={headingStyle(textMain)}>
          CxO <GradientSpan>Breakfast</GradientSpan>
        </h2>
        <p style={paraStyle(textMuted)}>
          An exclusive invitation only breakfast for CxOs and senior leaders. This is where business happens in a quieter, higher trust setting. Think strategic conversations, peer connections, and deal making over breakfast.
        </p>
      </ContentRow>

      {/* ═══════════ ROW 5 — GALA DINNER (text left, image right) ═══════════ */}
      <ContentRow isDark={isDark} textMain={textMain} textMuted={textMuted} accent={accent} border={border}
        reverse={false}
        image="/ft-gala.jpg" imageAlt="Gala Dinner and Networking Reception"
        cta={{ label: "Get Your Pass", href: "/tickets" }}
      >
        <h2 style={headingStyle(textMain)}>
          Gala Dinner and <GradientSpan>Networking Reception</GradientSpan>
        </h2>
        <p style={paraStyle(textMuted)}>
          A premium evening to deepen relationships with speakers, exhibitors, partners, and senior attendees. If you want stronger connections, this is where they form.
        </p>
      </ContentRow>

      {/* ═══════════ ROW 6 — CONSULTATION CLINIC (image left, text right) ═══════════ */}
      <ContentRow isDark={isDark} textMain={textMain} textMuted={textMuted} accent={accent} border={border}
        reverse={true} hasBg={true}
        image="/ft-clinic.jpg" imageAlt="Consultation Clinic at The Tech Festival Canada"
        cta={{ label: "Partner With Us", href: "/sponsor" }}
      >
        <h2 style={headingStyle(textMain)}>
          Consultation <GradientSpan>Clinic</GradientSpan>
        </h2>
        <p style={paraStyle(textMuted)}>
          In collaboration with government bodies, associations, and academic institutes, our Consultation Clinic helps you move forward with clarity. Whether you are looking for guidance on funding, programs, partnerships, talent, standards, research support, or market entry, you will find credible direction and next steps.
        </p>
      </ContentRow>

      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section style={{ padding: "80px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="ft-bottom-cta-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderRadius: 28, overflow: "hidden", border: "1px solid " + border, background: cardBg, minHeight: 380 }}
        >
          <div style={{ position: "relative", background: isDark ? "#120a22" : "#ede8f7", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", minHeight: 280 }}>
            <img src={isDark ? "/Tech_Festival_Canada_Logo_Dark_Transparent.png" : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"} alt="The Tech Festival Canada"
              style={{ width: "65%", maxWidth: 280, height: "auto", objectFit: "contain", filter: isDark ? "drop-shadow(0 0 40px rgba(122,63,209,0.25))" : "drop-shadow(0 8px 24px rgba(122,63,209,0.12))" }} />
            <div style={{ position: "absolute", width: "70%", height: "70%", borderRadius: "50%", background: isDark ? "radial-gradient(circle, rgba(122,63,209,0.15) 0%, transparent 70%)" : "radial-gradient(circle, rgba(122,63,209,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          </div>
          <div style={{ padding: "clamp(32px, 5vw, 56px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: 16, color: textMain }}>
              Ready to{" "}<GradientSpan>show up prepared?</GradientSpan>
            </h2>
            <p style={{ color: textMuted, lineHeight: 1.85, fontSize: "0.95rem", marginBottom: 32, maxWidth: 440 }}>
              Secure your seat at The Carlu, Toronto on October 27–28, 2026. Spaces are limited — this is not a conference you attend passively.
            </p>
            <div className="ft-cta-row" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <motion.a href="/tickets" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: isDark ? "#ffffff" : "#0d0520", color: isDark ? "#0d0520" : "#ffffff", padding: "14px 32px", borderRadius: 14, fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.78rem", textDecoration: "none", letterSpacing: "0.5px", transition: "all 0.25s ease" }}
                onMouseEnter={function (e) { e.currentTarget.style.background = "linear-gradient(135deg, #7a3fd1, #f5a623)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={function (e) { e.currentTarget.style.background = isDark ? "#ffffff" : "#0d0520"; e.currentTarget.style.color = isDark ? "#0d0520" : "#ffffff"; }}
              >Get Your Tickets</motion.a>
              <motion.a href="/sponsor" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "1.5px solid " + (isDark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.5)"), color: isDark ? textMain : "#1a0a40", padding: "14px 32px", borderRadius: 14, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: "0.78rem", textDecoration: "none" }}
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
   SHARED HELPERS
   ═══════════════════════════════════════════════════════ */

function headingStyle(textMain) {
  return {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)",
    fontWeight: 900, lineHeight: 1.25,
    marginBottom: 20, color: textMain,
  };
}

function paraStyle(textMuted) {
  return {
    color: textMuted, lineHeight: 1.85, fontSize: "0.95rem",
    marginBottom: 18, textAlign: "justify", hyphens: "auto",
  };
}

function GradientSpan(props) {
  return (
    <span style={{
      background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    }}>{props.children}</span>
  );
}

function SubHeading(props) {
  return (
    <p style={{
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "0.82rem", fontWeight: 800,
      color: props.textMain, marginBottom: 10, marginTop: 24,
    }}>{props.children}</p>
  );
}

function ListBlock(props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
      {props.items.map(function (item) {
        return (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--brand-orange, #f5a623)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: props.textMain }}>{item}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTENT ROW — alternating text + image
   ═══════════════════════════════════════════════════════ */

function ContentRow(props) {
  var isDark = props.isDark;
  var textMain = props.textMain;
  var textMuted = props.textMuted;
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
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "clamp(32px, 5vw, 64px)", alignItems: "center",
        direction: reverse ? "rtl" : "ltr",
      }}>
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", bounce: 0.2, duration: 1.2 }}
          style={{ direction: "ltr" }}
        >
          {props.children}

          <motion.a
            href={props.cta.href}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 32px", borderRadius: 14, marginTop: 10,
              fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.76rem",
              letterSpacing: "0.5px", textDecoration: "none", transition: "all 0.25s ease",
              background: props.cta.label === "Get Your Pass" ? (isDark ? "#ffffff" : "#0d0520") : "transparent",
              color: props.cta.label === "Get Your Pass" ? (isDark ? "#0d0520" : "#ffffff") : (isDark ? "#ffffff" : "#0d0520"),
              border: props.cta.label === "Get Your Pass" ? "none" : "1.5px solid " + (isDark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.5)"),
            }}
            onMouseEnter={function (e) { e.currentTarget.style.background = "linear-gradient(135deg, #7a3fd1, #f5a623)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "transparent"; }}
            onMouseLeave={function (e) {
              if (props.cta.label === "Get Your Pass") { e.currentTarget.style.background = isDark ? "#ffffff" : "#0d0520"; e.currentTarget.style.color = isDark ? "#0d0520" : "#ffffff"; }
              else { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = isDark ? "#ffffff" : "#0d0520"; e.currentTarget.style.borderColor = isDark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.5)"; }
            }}
          >{props.cta.label} →</motion.a>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", bounce: 0.15, duration: 1.3, delay: 0.15 }}
          style={{ direction: "ltr" }}
        >
          <div className="ft-img" style={{
            borderRadius: 22, overflow: "hidden",
            border: "1px solid " + (isDark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.12)"),
            minHeight: 360, position: "relative",
          }}>
            <img src={props.image} alt={props.imageAlt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 360 }} />
            <div style={{
              position: "absolute", inset: 0,
              background: isDark ? "linear-gradient(to top, rgba(7,3,15,0.3) 0%, transparent 40%)" : "linear-gradient(to top, rgba(244,240,255,0.15) 0%, transparent 40%)",
              pointerEvents: "none",
            }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
