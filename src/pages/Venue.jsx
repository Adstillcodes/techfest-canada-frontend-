import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";

const AMENITIES = [
  { icon: "🏊", label: "Indoor Pool", desc: "Heated year-round" },
  { icon: "💆", label: "Spa & Wellness", desc: "Full service spa" },
  { icon: "🍽️", label: "Fine Dining", desc: "Harbour 60 restaurant" },
  { icon: "🏋️", label: "Fitness Centre", desc: "State-of-the-art gym" },
  { icon: "🅿️", label: "Valet Parking", desc: "On-site parking" },
  { icon: "📶", label: "High-Speed WiFi", desc: "Throughout the venue" },
  { icon: "✈️", label: "Airport Access", desc: "15 min to Pearson" },
  { icon: "🚇", label: "Transit Link", desc: "Union Station nearby" },
];

const SPACES = [
  { name: "Grand Ballroom", capacity: "1,200+", area: "12,000 sq ft", use: "Main Conference & Exhibition", icon: "🏛️" },
  { name: "Harbour View Hall", capacity: "600", area: "6,500 sq ft", use: "Keynote & Plenary Sessions", icon: "🌊" },
  { name: "Lakeside Boardrooms", capacity: "30–80", area: "800–2,400 sq ft", use: "CxO Breakfasts & Roundtables", icon: "📋" },
  { name: "Waterfront Terrace", capacity: "400", area: "Outdoor", use: "Networking & Gala Dinner", icon: "🌅" },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=85",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=85",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85",
];

function FadeIn({ children, delay = 0, y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
    >{children}</motion.div>
  );
}

export default function Venue() {
  var s1 = useState(false); var dark = s1[0]; var setDark = s1[1];
  var s2 = useState(0);     var activeImg = s2[0]; var setActiveImg = s2[1];
  var heroRef = useRef(null);
  var { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  var heroY   = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  var heroOp  = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(function () {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () { setDark(document.body.classList.contains("dark-mode")); });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);

  useEffect(function () {
    var t = setInterval(function () { setActiveImg(function (i) { return (i + 1) % IMAGES.length; }); }, 4000);
    return function () { clearInterval(t); };
  }, []);

  var bg       = dark ? "#06020f" : "#faf9ff";
  var textMain = dark ? "#ffffff" : "#0d0520";
  var textMid  = dark ? "rgba(220,210,255,0.80)" : "rgba(13,5,32,0.65)";
  var cardBg   = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  var cardBdr  = dark ? "rgba(155,135,245,0.15)" : "rgba(122,63,209,0.12)";
  var accent   = dark ? "#b99eff" : "#7a3fd1";

  return (
    <div style={{ background: bg, color: textMain, minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <style>{`
        @keyframes shimmerSlide { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulseGlow { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
        .venue-img-dot { width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;transition:all 0.3s ease; }
        .amenity-card:hover { transform:translateY(-6px) !important; }
        .space-card:hover { transform:translateY(-4px) !important; }
        @media(max-width:640px){ .venue-bento-grid{display:none !important;} .mobile-gallery-strip{display:block !important;} 
          .venue-stats-row { flex-direction:column !important; gap:12px !important; }
          .spaces-grid { grid-template-columns:1fr !important; }
          .amenities-grid { grid-template-columns:repeat(2,1fr) !important; }
          .gallery-thumbs { gap:8px !important; }
        }
        @media(min-width:641px) and (max-width:1024px){
          .spaces-grid { grid-template-columns:repeat(2,1fr) !important; }
          .amenities-grid { grid-template-columns:repeat(4,1fr) !important; }
        }
      `}</style>

      {/* ══════ HERO ══════ */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Parallax bg image */}
        <motion.div style={{ position: "absolute", inset: "-10%", y: heroY, zIndex: 0 }}>
          <AnimatePresence mode="sync">
            {IMAGES.map(function (src, i) {
              return i === activeImg ? (
                <motion.img key={src} src={src} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              ) : null;
            })}
          </AnimatePresence>
          {/* Overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,2,15,0.55) 0%, rgba(6,2,15,0.35) 40%, rgba(6,2,15,0.75) 100%)" }} />
        </motion.div>

        {/* Hero content */}
        <motion.div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "0 5%", maxWidth: 860, opacity: heroOp }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, padding: "6px 20px", marginBottom: 24, fontSize: "0.65rem", fontFamily: "'Orbitron',sans-serif", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#ffffff" }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5a623", boxShadow: "0 0 8px #f5a623", display: "inline-block", animation: "pulseGlow 2s ease-in-out infinite" }} />
            TFC 2026 · Official Venue
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
            style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2.2rem,6vw,4.5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-1px", color: "#ffffff", marginBottom: 16, textShadow: "0 4px 40px rgba(0,0,0,0.4)" }}
          >
            The Westin<br />
            <span style={{ background: "linear-gradient(90deg,#b99eff,#f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Harbour Castle</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            style={{ fontSize: "clamp(1rem,2vw,1.15rem)", color: "rgba(255,255,255,0.82)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 36px" }}
          >
            Toronto's most iconic waterfront hotel. Where Canada's tech leaders will converge on 27–28 October 2026.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.7 }}
            className="venue-stats-row"
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            {[
              { num: "977", label: "Rooms" },
              { num: "40+", label: "Floors" },
              { num: "Lake Ontario", label: "Waterfront" },
            ].map(function (s) {
              return (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.20)", borderRadius: 16, padding: "14px 28px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.3rem", fontWeight: 900, color: "#ffffff", marginBottom: 2 }}>{s.num}</div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>{s.label}</div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Image dots */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 6 }}>
          {IMAGES.map(function (_, i) {
            return <button key={i} className="venue-img-dot" onClick={function () { setActiveImg(i); }}
              style={{ background: i === activeImg ? "#f5a623" : "rgba(255,255,255,0.40)", transform: i === activeImg ? "scale(1.4)" : "scale(1)" }} />;
          })}
        </div>

        {/* Scroll hint */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", fontFamily: "'Orbitron',sans-serif", letterSpacing: "2px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
        >
          <span>SCROLL</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </motion.div>
      </section>

      {/* ══════ INTRO STRIP ══════ */}
      <section style={{ background: dark ? "#06020f" : "#0d0520", padding: "3.5rem 6%", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,63,209,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <FadeIn>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 900, color: "#ffffff", marginBottom: 8 }}>
                1 Harbour Square, Toronto
              </div>
              <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.5px" }}>
                Ontario, Canada · M5J 1A6
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="https://maps.google.com/?q=Westin+Harbour+Castle+Toronto" target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#ffffff", textDecoration: "none", fontFamily: "'Orbitron',sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.2s ease" }}
                onMouseEnter={function (e) { e.currentTarget.style.background = "rgba(122,63,209,0.25)"; }}
                onMouseLeave={function (e) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Get Directions
              </a>
              <a href="https://www.marriott.com/en-us/hotels/yyzwh-the-westin-harbour-castle-toronto/overview/" target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#ffffff", textDecoration: "none", fontFamily: "'Orbitron',sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}
              >Book a Room →</a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════ GALLERY GRID ══════ */}
      <section style={{ background: bg, padding: "6rem 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: accent, marginBottom: 12 }}>The Setting</p>
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.5rem)", fontWeight: 900, color: textMain, marginBottom: 16 }}>A Landmark on the Waterfront</h2>
              <div style={{ width: 50, height: 3, borderRadius: 3, background: "linear-gradient(90deg,#7a3fd1,#f5a623)", margin: "0 auto" }} />
            </div>
          </FadeIn>

          {/* Main gallery — bento grid */}
          <FadeIn delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gridTemplateRows: "280px 280px", gap: 12 }}>
              <div style={{ gridColumn: "1/8", gridRow: "1/2", borderRadius: 20, overflow: "hidden", position: "relative" }}>
                <img src={IMAGES[0]} alt="Westin Harbour Castle" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                  onMouseEnter={function (e) { e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={function (e) { e.currentTarget.style.transform = "scale(1)"; }} />
                <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", borderRadius: 8, padding: "6px 12px", fontFamily: "'Orbitron',sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1px", color: "#fff", textTransform: "uppercase" }}>Exterior View</div>
              </div>
              <div style={{ gridColumn: "8/13", gridRow: "1/2", borderRadius: 20, overflow: "hidden", position: "relative" }}>
                <img src={IMAGES[1]} alt="Hotel interior" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                  onMouseEnter={function (e) { e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={function (e) { e.currentTarget.style.transform = "scale(1)"; }} />
                <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", borderRadius: 8, padding: "6px 12px", fontFamily: "'Orbitron',sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1px", color: "#fff", textTransform: "uppercase" }}>Grand Lobby</div>
              </div>
              <div style={{ gridColumn: "1/5", gridRow: "2/3", borderRadius: 20, overflow: "hidden", position: "relative" }}>
                <img src={IMAGES[2]} alt="Pool" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                  onMouseEnter={function (e) { e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={function (e) { e.currentTarget.style.transform = "scale(1)"; }} />
                <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", borderRadius: 8, padding: "6px 12px", fontFamily: "'Orbitron',sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1px", color: "#fff", textTransform: "uppercase" }}>Wellness</div>
              </div>
              <div style={{ gridColumn: "5/9", gridRow: "2/3", borderRadius: 20, overflow: "hidden", position: "relative" }}>
                <img src={IMAGES[3]} alt="Rooms" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                  onMouseEnter={function (e) { e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={function (e) { e.currentTarget.style.transform = "scale(1)"; }} />
                <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", borderRadius: 8, padding: "6px 12px", fontFamily: "'Orbitron',sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1px", color: "#fff", textTransform: "uppercase" }}>Suites</div>
              </div>
              <div style={{ gridColumn: "9/13", gridRow: "2/3", borderRadius: 20, overflow: "hidden", position: "relative" }}>
                <img src={IMAGES[4]} alt="Conference" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                  onMouseEnter={function (e) { e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={function (e) { e.currentTarget.style.transform = "scale(1)"; }} />
                <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", borderRadius: 8, padding: "6px 12px", fontFamily: "'Orbitron',sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1px", color: "#fff", textTransform: "uppercase" }}>Conference</div>
              </div>
            </div>
          </FadeIn>

          {/* Mobile gallery — horizontal scroll */}
          <div style={{ display: "none" }} className="mobile-gallery-strip">
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12 }}>
              {IMAGES.map(function (src, i) {
                return <img key={i} src={src} alt="" style={{ width: 260, height: 180, objectFit: "cover", borderRadius: 16, flexShrink: 0 }} />;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ EVENT SPACES ══════ */}
      <section style={{ background: dark ? "rgba(122,63,209,0.05)" : "rgba(122,63,209,0.03)", borderTop: "1px solid " + cardBdr, borderBottom: "1px solid " + cardBdr, padding: "6rem 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: accent, marginBottom: 12 }}>Event Infrastructure</p>
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.5rem)", fontWeight: 900, color: textMain, marginBottom: 16 }}>World-Class Event Spaces</h2>
              <div style={{ width: 50, height: 3, borderRadius: 3, background: "linear-gradient(90deg,#7a3fd1,#f5a623)", margin: "0 auto 20px" }} />
              <p style={{ fontSize: "0.95rem", color: textMid, maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>Over 60,000 sq ft of flexible event space — purpose-built for the scale and ambition of TFC 2026.</p>
            </div>
          </FadeIn>

          <div className="spaces-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {SPACES.map(function (space, i) {
              return (
                <FadeIn key={space.name} delay={i * 0.1}>
                  <div className="space-card" style={{ background: cardBg, border: "1px solid " + cardBdr, borderRadius: 22, padding: "28px 22px", transition: "transform 0.3s ease, box-shadow 0.3s ease", boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(122,63,209,0.06)", cursor: "default", height: "100%" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 16 }}>{space.icon}</div>
                    <div style={{ width: 36, height: 3, borderRadius: 3, background: "linear-gradient(90deg,#7a3fd1,#f5a623)", marginBottom: 16 }} />
                    <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.82rem", fontWeight: 900, color: textMain, marginBottom: 10, lineHeight: 1.3 }}>{space.name}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.68rem", color: accent, fontWeight: 700 }}>👥</span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: textMain }}>{space.capacity}</span>
                        <span style={{ fontSize: "0.72rem", color: textMid }}>capacity</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.68rem", color: accent, fontWeight: 700 }}>📐</span>
                        <span style={{ fontSize: "0.82rem", color: textMid }}>{space.area}</span>
                      </div>
                    </div>
                    <div style={{ background: dark ? "rgba(122,63,209,0.12)" : "rgba(122,63,209,0.07)", border: "1px solid " + (dark ? "rgba(122,63,209,0.25)" : "rgba(122,63,209,0.15)"), borderRadius: 8, padding: "7px 12px", fontSize: "0.72rem", fontWeight: 600, color: accent, lineHeight: 1.4 }}>{space.use}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════ AMENITIES ══════ */}
      <section style={{ background: bg, padding: "6rem 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: accent, marginBottom: 12 }}>Hotel Features</p>
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.5rem)", fontWeight: 900, color: textMain }}>Everything You Need</h2>
              <div style={{ width: 50, height: 3, borderRadius: 3, background: "linear-gradient(90deg,#7a3fd1,#f5a623)", margin: "16px auto 0" }} />
            </div>
          </FadeIn>

          <div className="amenities-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {AMENITIES.map(function (a, i) {
              return (
                <FadeIn key={a.label} delay={i * 0.07}>
                  <div className="amenity-card" style={{ background: cardBg, border: "1px solid " + cardBdr, borderRadius: 18, padding: "24px 20px", textAlign: "center", transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "default", boxShadow: dark ? "none" : "0 2px 16px rgba(122,63,209,0.05)" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: 12, animation: "floatUp 3s ease-in-out infinite", animationDelay: (i * 0.3) + "s" }}>{a.icon}</div>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.72rem", fontWeight: 800, color: textMain, marginBottom: 4 }}>{a.label}</div>
                    <div style={{ fontSize: "0.75rem", color: textMid }}>{a.desc}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════ LOCATION CARD ══════ */}
      <section style={{ background: dark ? "rgba(122,63,209,0.04)" : "rgba(122,63,209,0.03)", borderTop: "1px solid " + cardBdr, padding: "6rem 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,400px),1fr))", gap: 40, alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: accent, marginBottom: 16 }}>Getting Here</p>
                <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 900, color: textMain, marginBottom: 20, lineHeight: 1.2 }}>Right in the Heart of Toronto</h2>
                <p style={{ fontSize: "0.95rem", color: textMid, lineHeight: 1.9, marginBottom: 28 }}>
                  Situated on the iconic Toronto waterfront, The Westin Harbour Castle is steps from the CN Tower, Union Station, and the city's financial district — the perfect backdrop for Canada's most important tech gathering.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                  {[
                    { icon: "🚇", text: "Union Station — 10 min walk" },
                    { icon: "✈️", text: "Toronto Pearson Airport — 30 min drive" },
                    { icon: "🏙️", text: "Financial District — 5 min walk" },
                    { icon: "🗼", text: "CN Tower & Rogers Centre — 15 min walk" },
                  ].map(function (item) {
                    return (
                      <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: cardBg, border: "1px solid " + cardBdr, borderRadius: 12 }}>
                        <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                        <span style={{ fontSize: "0.88rem", color: textMain, fontWeight: 500 }}>{item.text}</span>
                      </div>
                    );
                  })}
                </div>
                <a href="https://maps.google.com/?q=Westin+Harbour+Castle+Toronto" target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#ffffff", textDecoration: "none", fontFamily: "'Orbitron',sans-serif", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}
                >
                  Open in Maps →
                </a>
              </div>

              {/* Map embed */}
              <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid " + cardBdr, boxShadow: dark ? "0 12px 48px rgba(0,0,0,0.5)" : "0 12px 48px rgba(122,63,209,0.10)", position: "relative", aspectRatio: "1/1" }}>
                <iframe
                  title="Westin Harbour Castle Toronto"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.9!2d-79.3732!3d43.6403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb2b9c01d5c1%3A0x8e9c4f3a5e6d7b8c!2sThe%20Westin%20Harbour%20Castle%2C%20Toronto!5e0!3m2!1sen!2sca!4v1700000000000"
                  style={{ width: "100%", height: "100%", border: "none", display: "block", filter: dark ? "invert(90%) hue-rotate(180deg)" : "none" }}
                  allowFullScreen
                  loading="lazy"
                />
                <div style={{ position: "absolute", top: 16, left: 16, background: "linear-gradient(135deg,#7a3fd1,#f5a623)", borderRadius: 10, padding: "8px 14px", fontFamily: "'Orbitron',sans-serif", fontSize: "0.6rem", fontWeight: 800, color: "#fff", letterSpacing: "1px", textTransform: "uppercase" }}>
                  📍 TFC 2026
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ BOTTOM CTA ══════ */}
      <section style={{ background: bg, padding: "0 5% 6rem" }}>
        <FadeIn>
          <div style={{ maxWidth: 900, margin: "0 auto", background: "linear-gradient(135deg, rgba(122,63,209,0.10), rgba(245,166,35,0.07))", border: "1px solid " + cardBdr, borderRadius: 28, padding: "clamp(2.5rem,5vw,4rem)", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,63,209,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ fontSize: "2.5rem", marginBottom: 20, animation: "floatUp 3s ease-in-out infinite" }}>🏨</div>
            <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.3rem,3vw,1.9rem)", fontWeight: 900, color: textMain, marginBottom: 12 }}>Secure Your Stay</h2>
            <p style={{ fontSize: "0.95rem", color: textMid, lineHeight: 1.8, maxWidth: 480, margin: "0 auto 28px" }}>
              Limited rooms available at the TFC 2026 event rate. Book early to stay at the venue and be at the heart of it all.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://www.marriott.com/en-us/hotels/yyzwh-the-westin-harbour-castle-toronto/overview/" target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: dark ? "#ffffff" : "#0d0520", color: dark ? "#0d0520" : "#ffffff", textDecoration: "none", fontFamily: "'Orbitron',sans-serif", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.2s ease" }}
                onMouseEnter={function (e) { e.currentTarget.style.background = "linear-gradient(135deg,#7a3fd1,#f5a623)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={function (e) { e.currentTarget.style.background = dark ? "#ffffff" : "#0d0520"; e.currentTarget.style.color = dark ? "#0d0520" : "#ffffff"; }}
              >Book at Westin →</a>
              <a href="/tickets"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "1.5px solid " + cardBdr, color: textMain, textDecoration: "none", fontFamily: "'Orbitron',sans-serif", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", transition: "all 0.2s ease" }}
                onMouseEnter={function (e) { e.currentTarget.style.borderColor = "#7a3fd1"; e.currentTarget.style.color = "#7a3fd1"; }}
                onMouseLeave={function (e) { e.currentTarget.style.borderColor = cardBdr; e.currentTarget.style.color = textMain; }}
              >Get Your Pass</a>
            </div>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
}
