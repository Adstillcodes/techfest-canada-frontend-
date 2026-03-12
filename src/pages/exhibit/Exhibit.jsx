import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BOOTH_TIERS = [
  {
    id: "single",
    title: "Single Booth",
    specs: "10 ft x 10 ft",
    price: "$2,499",
    tagline: "A smart, strategic entry into the market.",
    description: "The Single Booth is ideal for companies that want focused visibility and high value face time without overextending budget. It is perfect for startups, emerging tech companies, niche solution providers, consultancies, and first time exhibitors looking to establish a presence in a serious business environment.\n\nThis format gives you the opportunity to introduce your brand, showcase your solution, meet prospects, and start meaningful conversations with buyers, partners, and ecosystem stakeholders. For companies looking to test the market, build awareness, and create a strong first impression, this is an efficient and high impact starting point.",
    whyItWorks: [
      "Strong brand presence at an accessible investment level",
      "Ideal for first time exhibitors and emerging companies",
      "Perfect for lead generation, networking, and market validation",
      "A sharp entry point into Canada’s innovation ecosystem"
    ],
    // Rename your first 4 images (the smallest booths) to match these names in your public folder
    images: ["/booths/single-1.png", "/booths/single-2.png", "/booths/single-3.png", "/booths/single-4.png"]
  },
  {
    id: "double",
    title: "Double Booth",
    specs: "20 ft x 10 ft",
    price: "$4,499",
    tagline: "More space. More visibility. More commercial opportunity.",
    description: "The Double Booth is built for companies that want to move beyond presence and start making a statement. With added space comes greater flexibility to showcase multiple products, create a stronger visual brand experience, host more conversations, and engage visitors with greater confidence.\n\nThis option is ideal for growth stage companies, established SMEs, international brands entering Canada, and solution providers with broader offerings to present. It allows your team to create a more polished, immersive environment that draws traffic, supports demonstrations, and increases the time visitors spend with your brand.",
    whyItWorks: [
      "Delivers stronger visibility on the exhibition floor",
      "Creates room for demos, displays, and deeper engagement",
      "Ideal for companies with multiple products or services",
      "Positions your brand as established, credible, and growth ready"
    ],
    // Rename your next 4 images (the 2-unit booths)
    images: ["/booths/double-1.png", "/booths/double-2.png", "/booths/double-3.png", "/booths/double-4.png"]
  },
  {
    id: "triple",
    title: "Triple Booth",
    specs: "30 ft x 10 ft",
    price: "$5,999",
    tagline: "For brands that want to be noticed, remembered, and taken seriously.",
    description: "The Triple Booth is for exhibitors with bigger ambitions and a stronger market story to tell. It gives you the space to create a real destination on the floor rather than just a booth. This is where your brand begins to command attention.\n\nIdeal for larger technology companies, multi solution providers, innovation clusters, country pavilions, scaleups, and businesses with aggressive growth objectives, the Triple Booth enables a more dynamic presence. You can create dedicated areas for demonstrations, discussions, meetings, and brand storytelling while comfortably managing higher footfall and a larger on site team.\n\nIf your objective is to stand apart from the crowd and present your company as a serious market leader, this is where that begins.",
    whyItWorks: [
      "Builds a commanding and credible show floor presence",
      "Excellent for live demonstrations and multi zone interaction",
      "Supports stronger traffic flow and richer visitor engagement",
      "Ideal for brands looking to signal scale, depth, and leadership"
    ],
    // Rename your next 4 images (the 3-unit booths)
    images: ["/booths/triple-1.png", "/booths/triple-2.png", "/booths/triple-3.png", "/booths/triple-4.png"]
  },
  {
    id: "quadruple",
    title: "Quadruple Booth",
    specs: "40 ft x 10 ft",
    price: "$7,499",
    tagline: "Maximum presence for brands that intend to lead the room.",
    description: "The Quadruple Booth is our flagship exhibition option for companies that want scale, authority, and visibility that cannot be ignored. This is for major brands, strategic partners, global companies, ecosystem leaders, and organizations ready to own a significant share of attention at The Tech Festival Canada.\n\nWith a large footprint, your team can build a premium brand environment with the space to host meetings, run immersive demonstrations, showcase multiple solutions, create hospitality moments, and engage high value attendees at volume. It allows your company to move beyond exhibiting and into commanding a presence.\n\nIf you are launching in a major way, building strategic partnerships, attracting enterprise buyers, or reinforcing leadership in your category, the Quadruple Booth gives you the stage to do it with impact.",
    whyItWorks: [
      "Delivers the strongest visual and commercial presence",
      "Ideal for enterprises, anchor exhibitors, and strategic brands",
      "Enables premium experiences, larger teams, and stronger engagement",
      "Best choice for companies looking to dominate attention and drive momentum"
    ],
    // Rename your final 4 images (the largest 4-unit island/backwall booths)
    images: ["/booths/quad-1.png", "/booths/quad-2.png", "/booths/quad-3.png", "/booths/quad-4.png"]
  }
];

export default function Exhibit() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.body.classList.contains("dark-mode"));
    const obs = new MutationObserver(() => {
      setIsDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const bg        = isDark ? "#07030f"                : "#f4f0ff";
  const textMain  = isDark ? "#ffffff"                : "#0f0520";
  const textMuted = isDark ? "rgba(200,180,255,0.8)"  : "rgba(60,30,110,0.85)";
  const cardBg    = isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.04)";
  const border    = isDark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.18)";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 900px) {
          .exhibit-row { grid-template-columns: 1fr !important; gap: 40px !important; }
          .bottom-cta-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .cta-row { flex-direction: column !important; align-items: stretch !important; }
          .cta-row a { width: 100% !important; text-align: center !important; justify-content: center !important; }
          .image-grid { grid-template-columns: 1fr !important; }
        }
        
        /* AURORA BACKGROUND */
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
        @keyframes aurora-flow {
          from { background-position: 50% 50%, 50% 50%; }
          to   { background-position: 350% 50%, 350% 50%; }
        }
        .aurora-layer {
          position: absolute; inset: -10px; pointer-events: none;
          will-change: transform; background-size: 300%, 200%;
          background-position: 50% 50%; filter: blur(10px); opacity: 0.50;
        }
        .aurora-layer--dark {
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-black) 0%, var(--aurora-black) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-black) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          mask-image: radial-gradient(ellipse at 100% 0%, black 10%, var(--aurora-transparent) 70%);
          -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 10%, var(--aurora-transparent) 70%);
        }
        .aurora-layer--dark::after {
          content: ""; position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-black) 0%, var(--aurora-black) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-black) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          background-size: 200%, 100%; background-attachment: fixed;
          animation: aurora-flow 60s linear infinite; mix-blend-mode: difference;
        }
        .aurora-layer--light {
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-white) 0%, var(--aurora-white) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-white) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          opacity: 0.35; filter: blur(12px);
          mask-image: radial-gradient(ellipse at 100% 0%, black 10%, var(--aurora-transparent) 70%);
          -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 10%, var(--aurora-transparent) 70%);
        }
        .aurora-layer--light::after {
          content: ""; position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(100deg, var(--aurora-white) 0%, var(--aurora-white) 7%, var(--aurora-transparent) 10%, var(--aurora-transparent) 12%, var(--aurora-white) 16%),
            repeating-linear-gradient(100deg, var(--aurora-purple) 10%, var(--aurora-lilac) 15%, var(--aurora-orange) 20%, var(--aurora-amber) 25%, var(--aurora-violet) 30%);
          background-size: 200%, 100%; background-attachment: fixed;
          animation: aurora-flow 60s linear infinite; mix-blend-mode: difference;
        }
      `}</style>

      <Navbar />

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section style={{
        position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", minHeight: "75vh", background: isDark ? "#06020f" : "#f4f0ff",
      }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <div className={isDark ? "aurora-layer aurora-layer--dark" : "aurora-layer aurora-layer--light"} />
        </div>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: isDark
            ? "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, #06020f 100%)"
            : "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, #f4f0ff 100%)",
        }} />

        <motion.div style={{
          position: "relative", zIndex: 10, textAlign: "center", padding: "0 5%",
          maxWidth: 900, margin: "0 auto", paddingTop: "clamp(120px, 15vw, 160px)", paddingBottom: "80px",
        }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        >
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(3rem, 7vw, 5rem)",
            fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.5px",
          }}>
            Exhibit{" "}
            <span style={{
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>With Us</span>
          </h1>
          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)", color: textMuted, lineHeight: 1.7,
            maxWidth: 780, margin: "0 auto", fontWeight: 500
          }}>
            Put your brand at the centre of Canada’s most important technology conversations.
          </p>
        </motion.div>
      </section>

      {/* ═══════════ INTRO TEXT ═══════════ */}
      <section style={{ padding: "80px 5%", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: "1.1rem", color: textMuted, lineHeight: 1.8, textAlign: "justify" }}>
          <p>
            The Tech Festival Canada is where innovation meets influence. It is where technology companies, founders, investors, enterprises, policymakers, industry leaders, public sector stakeholders, and solution buyers come together to discover what is next and decide who they want to work with.
          </p>
          <p>
            Exhibiting here is not just about taking space on a show floor. It is about claiming visibility in front of a high value audience that matters. It is about creating direct conversations, building market credibility, launching solutions, generating qualified leads, and positioning your company as a serious player in the future of technology.
          </p>
          <p>
            Whether you are entering the market, scaling your reach, launching a new solution, or strengthening enterprise relationships, The Tech Festival Canada gives you the platform to be seen, remembered, and engaged. From ambitious startups to global brands, our booth options are designed to match your growth stage, commercial goals, and branding ambition.
          </p>
        </div>
      </section>

      {/* ═══════════ BOOTH TIERS ═══════════ */}
      <div style={{ paddingBottom: "80px" }}>
        {BOOTH_TIERS.map((tier, index) => (
          <BoothRow 
            key={tier.id} 
            tier={tier} 
            isDark={isDark} 
            textMain={textMain} 
            textMuted={textMuted} 
            border={border} 
            cardBg={cardBg}
            index={index}
          />
        ))}
      </div>

      {/* ═══════════ CLOSING ARGUMENT ═══════════ */}
      <section style={{ padding: "60px 5% 100px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", fontWeight: 900, marginBottom: 16, color: textMain }}>
            Why Exhibit at <GradientSpan>The Tech Festival Canada</GradientSpan>
          </h2>
          <p style={{ fontSize: "1.1rem", color: textMain, fontWeight: 700, marginBottom: 16 }}>
            Because the right audience changes everything.
          </p>
          <p style={{ fontSize: "1.05rem", color: textMuted, lineHeight: 1.8, textAlign: "justify" }}>
            At The Tech Festival Canada, your booth is more than a branded space. It becomes a live business development platform where conversations turn into opportunities. You gain access to an ecosystem of decision makers, innovators, buyers, investors, policymakers, founders, and industry influencers who are actively exploring technologies, partnerships, and future focused solutions. This is where brands come to accelerate visibility, build authority, open doors, and create commercial outcomes.
          </p>
        </div>

        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", fontWeight: 900, marginBottom: 24, color: textMain }}>
            Choose Your <GradientSpan>Presence</GradientSpan>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Single Booth", desc: "for focused visibility and smart market entry" },
              { label: "Double Booth", desc: "for stronger presence and greater engagement" },
              { label: "Triple Booth", desc: "for brands ready to create serious impact" },
              { label: "Quadruple Booth", desc: "for companies that want to lead from the front" }
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", background: cardBg, borderRadius: 12, border: `1px solid ${border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5a623", flexShrink: 0 }} />
                <div style={{ fontSize: "1.05rem" }}>
                  <span style={{ fontWeight: 700, color: textMain }}>{item.label}</span>
                  <span style={{ color: textMuted }}> {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", fontWeight: 900, marginBottom: 16, color: textMain }}>
            Secure Your <GradientSpan>Booth</GradientSpan>
          </h2>
          <p style={{ fontSize: "1.05rem", color: textMuted, lineHeight: 1.8, textAlign: "justify" }}>
            Prime exhibition spaces are limited and high visibility locations will be allocated on a first come first served basis. If your company is ready to be seen by the right audience, build strategic relationships, and stand out at one of Canada’s most ambitious technology platforms, now is the time to reserve your space.
          </p>
        </div>
      </section>

      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section style={{ padding: "0 5% 120px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="bottom-cta-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderRadius: 28, overflow: "hidden", border: `1px solid ${border}`, background: cardBg, minHeight: 400 }}
        >
          <div style={{ position: "relative", background: isDark ? "#120a22" : "#ede8f7", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", minHeight: 300 }}>
            <img src={isDark ? "/Tech_Festival_Canada_Logo_Dark_Transparent.png" : "/Tech_Festival_Canada_Logo_Light_Transparent.webp"} alt="The Tech Festival Canada"
              style={{ width: "65%", maxWidth: 300, height: "auto", objectFit: "contain", filter: isDark ? "drop-shadow(0 0 40px rgba(122,63,209,0.25))" : "drop-shadow(0 8px 24px rgba(122,63,209,0.12))" }} />
            <div style={{ position: "absolute", width: "70%", height: "70%", borderRadius: "50%", background: isDark ? "radial-gradient(circle, rgba(122,63,209,0.15) 0%, transparent 70%)" : "radial-gradient(circle, rgba(122,63,209,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          </div>
          <div style={{ padding: "clamp(40px, 6vw, 64px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: 20, color: textMain }}>
              Ready to <GradientSpan>secure your space?</GradientSpan>
            </h2>
            <p style={{ color: textMuted, lineHeight: 1.7, fontSize: "1.1rem", marginBottom: 36, maxWidth: 480 }}>
              Join the ecosystem of innovators and leaders. Partner with us or secure your delegate pass today.
            </p>
            <div className="cta-row" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <motion.a href="/sponsor" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: isDark ? "#ffffff" : "#0d0520", color: isDark ? "#0d0520" : "#ffffff", padding: "16px 36px", borderRadius: 14, fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.9rem", textDecoration: "none", letterSpacing: "0.5px", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #7a3fd1, #f5a623)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? "#ffffff" : "#0d0520"; e.currentTarget.style.color = isDark ? "#0d0520" : "#ffffff"; }}
              >Partner With Us</motion.a>
              <motion.a href="/tickets" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: `1.5px solid ${isDark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.5)"}`, color: isDark ? textMain : "#1a0a40", padding: "16px 36px", borderRadius: 14, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}
              >Buy Tickets</motion.a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BOOTH ROW COMPONENT
   ═══════════════════════════════════════════════════════ */

function BoothRow({ tier, isDark, textMain, textMuted, border, cardBg, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasBg = index % 2 === 0;

  return (
    <section ref={ref} style={{
      padding: "clamp(60px, 8vw, 100px) 5%",
      background: hasBg ? (isDark ? "rgba(122,63,209,0.03)" : "rgba(122,63,209,0.02)") : "transparent",
      borderTop: hasBg ? `1px solid ${border}` : "none",
      borderBottom: hasBg ? `1px solid ${border}` : "none",
    }}>
      <div className="exhibit-row" style={{
        maxWidth: 1300, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "clamp(40px, 6vw, 80px)", alignItems: "start",
      }}>
        
        {/* LEFT: IMAGE GRID */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ type: "spring", bounce: 0.2, duration: 1.2 }}
        >
          <div className="image-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16,
          }}>
            {tier.images.map((imgSrc, i) => (
              <div key={i} style={{
                borderRadius: 16, overflow: "hidden", aspectRatio: "4/3",
                border: `1px solid ${border}`, background: cardBg,
                position: "relative"
              }}>
                {/* Fallback styling in case images are missing before you rename them */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: textMuted, fontSize: "0.8rem", opacity: 0.5 }}>Image {i+1}</div>
                <img src={imgSrc} alt={`${tier.title} setup ${i+1}`} style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative", zIndex: 2 }} 
                  onError={(e) => e.target.style.display = 'none'} // Hides broken image icon if path is wrong
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", bounce: 0.2, duration: 1.2, delay: 0.2 }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 900, color: textMain, lineHeight: 1.1 }}>
              {tier.title}
            </h2>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "monospace", fontSize: "1.1rem", color: textMuted, marginBottom: 4 }}>{tier.specs}</div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: isDark ? "#f5a623" : "#d98a14" }}>{tier.price}</div>
            </div>
          </div>

          <p style={{ fontSize: "1.2rem", fontWeight: 700, color: textMain, marginBottom: 24, lineHeight: 1.5 }}>
            {tier.tagline}
          </p>

          <div style={{ fontSize: "1.05rem", color: textMuted, lineHeight: 1.7, marginBottom: 32, textAlign: "justify", whiteSpace: "pre-line" }}>
            {tier.description}
          </div>

          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: "24px 32px" }}>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: textMain, marginBottom: 20 }}>
              Why this works
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {tier.whyItWorks.map((point, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5a623", flexShrink: 0, marginTop: 8 }} />
                  <span style={{ fontSize: "1rem", color: textMuted, lineHeight: 1.5 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
          
          <motion.a href="/sponsor" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-block", textAlign: "center", marginTop: 32, padding: "16px 32px", borderRadius: 12,
              fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.95rem", letterSpacing: "1px", textTransform: "uppercase",
              background: "linear-gradient(135deg, #7a3fd1, #f5a623)", color: "#ffffff", textDecoration: "none"
            }}
          >
            Inquire Now
          </motion.a>

        </motion.div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════════════════════ */

function GradientSpan({ children }) {
  return (
    <span style={{
      background: "linear-gradient(135deg, #7a3fd1, #f5a623)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    }}>{children}</span>
  );
}
