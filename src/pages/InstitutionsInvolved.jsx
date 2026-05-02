import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ═══════════════════════════════════════════════════════════
   LOGO MARQUEE — same pattern as SpeakerMarquee
   Pulls from Sanity CMS via the "institution" type.
   For now renders placeholders until CMS is populated.
   ═══════════════════════════════════════════════════════════ */
function LogoMarquee({ dark, title, direction }) {
  var dir = direction || "left";
  var placeholders = Array.from({ length: 12 }, function (_, i) { return i; });
  var borderCol = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  var logoBg = dark ? "rgba(255,255,255,0.04)" : "rgba(122,63,209,0.03)";
  var textDim = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";

  return (
    <div style={{ overflow: "hidden", padding: "0 0", borderTop: "1px solid " + borderCol, borderBottom: "1px solid " + borderCol }}>
      {title && (
        <div style={{ textAlign: "center", padding: "24px 0 0" }}>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.25)" : "rgba(13,5,32,0.30)" }}>{title}</span>
        </div>
      )}
      <div style={{ position: "relative", height: 90, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 32, animation: dir === "left" ? "marqueeLeft 40s linear infinite" : "marqueeRight 40s linear infinite", width: "max-content" }}>
          {[...placeholders, ...placeholders].map(function (_, i) {
            return (
              <div key={i} style={{ width: 140, height: 56, borderRadius: 10, background: logoBg, border: "1px solid " + borderCol, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.45rem", fontWeight: 700, letterSpacing: "1px", color: textDim, textTransform: "uppercase" }}>Logo</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED SECTION WRAPPER
   ═══════════════════════════════════════════════════════════ */
function FadeInSection({ children, delay }) {
  var ref = useRef(null);
  var inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay || 0, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CATEGORY SECTIONS
   ═══════════════════════════════════════════════════════════ */
var CATEGORIES = [
  {
    title: "Government Partners",
    subtitle: "Federal, provincial, and municipal bodies supporting innovation and trade in Canada.",
    icon: "🏛️",
  },
  {
    title: "Industry Associations",
    subtitle: "National associations and alliances across technology, cybersecurity, and critical infrastructure.",
    icon: "🤝",
  },
  {
    title: "Academic & Research Institutions",
    subtitle: "Leading universities, research labs, and innovation centres driving deep tech in Canada.",
    icon: "🎓",
  },
  {
    title: "Corporate & Enterprise Partners",
    subtitle: "Enterprise technology companies, hyperscalers, and systems integrators powering the ecosystem.",
    icon: "🏢",
  },
  {
    title: "Startup & Ecosystem Partners",
    subtitle: "Accelerators, incubators, and ecosystem builders nurturing Canada's next generation of startups.",
    icon: "🚀",
  },
  {
    title: "International Trade Bodies",
    subtitle: "Foreign trade commissions, consulates, and international chambers supporting cross-border tech collaboration.",
    icon: "🌍",
  },
];

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function InstitutionsInvolved() {
  var s = useState(false); var dark = s[0]; var setDark = s[1];
  useEffect(function () {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () { setDark(document.body.classList.contains("dark-mode")); });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);

  var bg = dark ? "#06020f" : "#ffffff";
  var textMain = dark ? "#ffffff" : "#0d0520";
  var textMuted = dark ? "rgba(255,255,255,0.55)" : "rgba(13,5,32,0.55)";
  var textDim = dark ? "rgba(255,255,255,0.25)" : "rgba(13,5,32,0.25)";
  var accent = dark ? "#b99eff" : "#7a3fd1";
  var orange = dark ? "#f5a623" : "#d98a14";
  var borderCol = dark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.10)";
  var sectionBg = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  var cardBg = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
  var cardBorder = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  var placeholderBg = dark ? "rgba(255,255,255,0.04)" : "rgba(122,63,209,0.04)";
  var placeholderBorder = dark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.08)";
  var placeholderText = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";

  return (
    <>
      <style>{"\
        @keyframes marqueeLeft {\
          0% { transform: translateX(0); }\
          100% { transform: translateX(-50%); }\
        }\
        @keyframes marqueeRight {\
          0% { transform: translateX(-50%); }\
          100% { transform: translateX(0); }\
        }\
      "}</style>

      <Navbar />
      <div style={{ minHeight: "100vh", background: bg, color: textMain }}>

        {/* ─── HERO ─── */}
        <section style={{
          position: "relative",
          padding: "clamp(120px, 16vw, 160px) 5% clamp(50px, 8vw, 80px)",
          background: dark
            ? "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(122,63,209,0.12) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(122,63,209,0.06) 0%, transparent 70%)",
        }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: orange, marginBottom: 18 }}>THE TECH FESTIVAL CANADA 2026</div>
              <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 20 }}>
                Institutions<br /><span style={{ background: "linear-gradient(135deg, " + accent + ", " + orange + ")", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Involved</span>
              </h1>
              <p style={{ fontSize: "1rem", color: textMuted, lineHeight: 1.75, maxWidth: 620, margin: "0 auto" }}>
                The Tech Festival Canada is supported by a growing network of government bodies, industry associations, academic institutions, enterprise partners, and international trade organisations. Together, we're building Canada's definitive technology platform.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── MARQUEE ROW 1 ─── */}
        <LogoMarquee dark={dark} title="Our Partners & Supporters" direction="left" />

        {/* ─── STATS ROW ─── */}
        <FadeInSection delay={0.1}>
          <section style={{ padding: "48px 5%", maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(2rem, 6vw, 5rem)", flexWrap: "wrap" }}>
              {[
                { val: "25+", label: "Partners" },
                { val: "6", label: "Categories" },
                { val: "10+", label: "Countries" },
                { val: "5", label: "Tech Pillars" },
              ].map(function (s) {
                return (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, background: "linear-gradient(135deg, " + accent + ", " + orange + ")", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.val}</div>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: textDim, marginTop: 4 }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </FadeInSection>

        {/* ─── CATEGORY SECTIONS WITH 3×3 GRIDS ─── */}
        <section style={{ padding: "0 5% 80px", maxWidth: 1100, margin: "0 auto" }}>
          {CATEGORIES.map(function (cat, catIdx) {
            return (
              <FadeInSection key={cat.title} delay={catIdx * 0.08}>
                <div style={{ marginBottom: 56 }}>
                  {/* Category header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                    <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.3px", margin: 0 }}>{cat.title}</h2>
                  </div>
                  <p style={{ fontSize: "0.88rem", color: textMuted, lineHeight: 1.6, marginBottom: 24, maxWidth: 600 }}>{cat.subtitle}</p>

                  {/* 3×3 Logo grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                    {Array.from({ length: 9 }, function (_, i) {
                      return (
                        <motion.div
                          key={cat.title + "-" + i}
                          whileHover={{ scale: 1.03, borderColor: accent }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          style={{
                            aspectRatio: "16/9",
                            borderRadius: 14,
                            background: placeholderBg,
                            border: "1.5px solid " + placeholderBorder,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "default",
                            transition: "border-color 0.2s ease",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={placeholderText} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.4rem", fontWeight: 700, letterSpacing: "1.5px", color: placeholderText, textTransform: "uppercase" }}>Coming Soon</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </FadeInSection>
            );
          })}
        </section>

        {/* ─── MARQUEE ROW 2 ─── */}
        <LogoMarquee dark={dark} title="And many more joining" direction="right" />

        {/* ─── CTA SECTION ─── */}
        <FadeInSection delay={0.1}>
          <section style={{ padding: "80px 5%", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <div style={{
              padding: "clamp(32px, 5vw, 56px)",
              borderRadius: 20,
              background: dark
                ? "linear-gradient(135deg, rgba(122,63,209,0.10), rgba(245,166,35,0.05))"
                : "linear-gradient(135deg, rgba(122,63,209,0.06), rgba(245,166,35,0.03))",
              border: "1px solid " + borderCol,
            }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: orange, marginBottom: 14 }}>WANT TO BE LISTED?</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: 16 }}>
                Become an Institutional<br /><span style={{ color: orange }}>Partner</span>
              </h2>
              <p style={{ fontSize: "0.92rem", color: textMuted, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
                Whether you're a government body, association, academic institution, or enterprise — there's a partnership model that fits. Let's build Canada's tech future together.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/sponsor" style={{
                  display: "inline-flex", alignItems: "center", padding: "12px 28px", borderRadius: 999,
                  background: "linear-gradient(135deg, #7a3fd1, #f5a623)", color: "#fff",
                  fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800,
                  letterSpacing: "1.2px", textTransform: "uppercase", textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(122,63,209,0.3)", transition: "transform 0.2s",
                }}
                  onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; }}
                >View Partnerships</a>
                <a href="mailto:sales@thetechfestival.com" style={{
                  display: "inline-flex", alignItems: "center", padding: "12px 28px", borderRadius: 999,
                  background: "transparent", color: accent,
                  fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem", fontWeight: 800,
                  letterSpacing: "1.2px", textTransform: "uppercase", textDecoration: "none",
                  border: "2px solid " + accent, transition: "all 0.2s",
                }}
                  onMouseEnter={function (e) { e.currentTarget.style.background = accent; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={function (e) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = accent; }}
                >Contact Us</a>
              </div>
            </div>
          </section>
        </FadeInSection>

        <Footer />
      </div>
    </>
  );
}
