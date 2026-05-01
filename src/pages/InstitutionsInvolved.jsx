import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InstitutionMarquee from "../components/InstitutionMarquee";


const PLACEHOLDER_COUNT = 9;

export default function InstitutionsInvolved() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const syncTheme = () => setIsDark(document.body.classList.contains("dark-mode"));
    syncTheme();

    const obs = new MutationObserver(syncTheme);
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  const bg = isDark ? "#06020f" : "#f8f7fc";
  const textMain = isDark ? "#ffffff" : "#0d0520";
  const textMuted = isDark ? "rgba(200,180,255,0.75)" : "rgba(13,5,32,0.68)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder = isDark ? "rgba(155,135,245,0.16)" : "rgba(122,63,209,0.14)";
  const accent = isDark ? "#b99eff" : "#7a3fd1";
  const badgeBg = isDark ? "rgba(185,158,255,0.18)" : "rgba(122,63,209,0.10)";

  return (
    <div
      style={{
        background: bg,
        color: textMain,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        .institutions-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .institutions-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 600px) {
          .institutions-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Navbar />

      <main style={{ flex: 1 }}>
        <section
          style={{
            padding: "130px 5% 80px",
            textAlign: "center",
            background: isDark
              ? "radial-gradient(ellipse 75% 50% at 50% 0%, rgba(122,63,209,0.16) 0%, transparent 70%)"
              : "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(122,63,209,0.08) 0%, transparent 70%)",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.74rem",
              fontWeight: 800,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: accent,
              marginBottom: "1.1rem",
            }}
          >
            Partners Network
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}
          >
            Institutions Involved
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            style={{
              maxWidth: 700,
              margin: "0 auto",
              fontSize: "1.02rem",
              lineHeight: 1.8,
              color: textMuted,
            }}
          >
            This space showcases institutional collaborators across academia, government,
            and ecosystem partners driving the festival forward.
          </motion.p>
        </section>

        <InstitutionMarquee dark={isDark} title="Institution logos marquee" />

        <section style={{ padding: "72px 5% 86px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "clamp(1.2rem, 2.6vw, 2rem)",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  margin: 0,
                }}
              >
                Institution Logo Directory
              </h2>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.4rem 0.8rem",
                  borderRadius: 999,
                  background: badgeBg,
                  border: "1px solid " + cardBorder,
                  color: accent,
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                3 x 3 Placeholder Grid
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              style={{
                color: textMuted,
                marginBottom: "1.75rem",
                lineHeight: 1.7,
                maxWidth: 780,
              }}
            >
              Logo blocks are intentionally blank so your CMS team can fill each slot with final assets.
            </motion.p>

            <div className="institutions-grid">
              {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  style={{
                    minHeight: 128,
                    borderRadius: 14,
                    background: cardBg,
                    border: "1px solid " + cardBorder,
                    boxShadow: isDark ? "none" : "0 8px 24px rgba(17,17,17,0.06)",
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
