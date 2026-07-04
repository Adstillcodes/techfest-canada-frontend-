import { motion } from "framer-motion";

/* Small promo card for the India Startup Pavilion.
   Placed inline on the exhibit page — clicking opens the
   dedicated /exhibit/india-pavilion route in a new tab. */

export default function PavilionCard({ isDark, textMain, textMuted, border, cardBg }) {
  return (
    <section style={{
      padding: "clamp(3rem, 6vw, 5rem) 5%",
      background: isDark ? "rgba(122,63,209,0.03)" : "rgba(122,63,209,0.02)",
      borderTop: "1px solid " + border,
      borderBottom: "1px solid " + border,
    }}>
      <style>{`
        .pavilion-card {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 32px;
          align-items: center;
        }
        .pavilion-card-btn {
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .pavilion-card {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            text-align: left !important;
          }
          .pavilion-card-btn {
            width: 100% !important;
            justify-content: center !important;
            white-space: normal !important;
          }
          .pavilion-card-title {
            font-size: 1.4rem !important;
            line-height: 1.2 !important;
          }
          .pavilion-card-badges {
            gap: 8px !important;
          }
          .pavilion-card-desc {
            font-size: 0.92rem !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.a
          href="/exhibit/india-pavilion"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -3 }}
          className="pavilion-card"
          style={{
            background: cardBg,
            border: "1px solid " + border,
            borderRadius: 24,
            padding: "clamp(24px, 4vw, 44px)",
            textDecoration: "none",
            transition: "border-color 0.3s, box-shadow 0.3s",
            boxShadow: isDark ? "0 4px 32px rgba(122,63,209,0.08)" : "0 4px 24px rgba(122,63,209,0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(245,166,35,0.4)";
            e.currentTarget.style.boxShadow = isDark
              ? "0 8px 40px rgba(122,63,209,0.20)"
              : "0 8px 32px rgba(122,63,209,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = border;
            e.currentTarget.style.boxShadow = isDark
              ? "0 4px 32px rgba(122,63,209,0.08)"
              : "0 4px 24px rgba(122,63,209,0.05)";
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="pavilion-card-badges" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
              <span style={{
                display: "inline-block",
                background: "rgba(245,166,35,0.12)",
                border: "1px solid rgba(245,166,35,0.35)",
                color: "#f5a623",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1.2px",
                textTransform: "uppercase", padding: "5px 12px", borderRadius: 999,
                whiteSpace: "nowrap",
              }}>
                Endorsed by Consulate of India
              </span>
              <span style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1px",
                textTransform: "uppercase", color: textMuted,
                whiteSpace: "nowrap",
              }}>
                Deadline Sept 30, 2026
              </span>
            </div>

            <h2 className="pavilion-card-title" style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 900,
              color: textMain, lineHeight: 1.15, margin: "0 0 14px",
              wordBreak: "break-word",
            }}>
              India Startup Pavilion —{" "}
              <span style={{
                background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>Subsidised Booths</span>
            </h2>

            <p className="pavilion-card-desc" style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "1rem", color: textMuted,
              lineHeight: 1.7, margin: 0, maxWidth: 640,
            }}>
              Indian-incorporated startups can apply to exhibit inside a dedicated India Country Pavilion, with booth costs subsidised by the Consulate General of India, Toronto. Booths from just <strong style={{ color: "#f5a623" }}>CAD $499</strong>. Rolling approvals — limited spots.
            </p>
          </div>

          <div className="pavilion-card-btn" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "16px 28px",
            borderRadius: 14,
            background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
            color: "#fff",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "0.72rem", fontWeight: 800,
            letterSpacing: "1px", textTransform: "uppercase",
            flexShrink: 0,
            boxShadow: "0 4px 20px rgba(122,63,209,0.3)",
            textAlign: "center",
          }}>
            Start Application
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
