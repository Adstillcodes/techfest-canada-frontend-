import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import { Mic, Users, Calendar, Award, ChevronRight, X, Search, ChevronDown,
         Sparkles, Zap, Shield, Cpu, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { client, urlFor } from "../utils/sanity";
import SpeakerMarquee from "../components/SpeakerMarquee";

const STATS = [
  { icon: <Users size={18} />, value: "1000+", label: "Attendees" },
  { icon: <Mic size={18} />, value: "50+", label: "Speakers" },
  { icon: <Calendar size={18} />, value: "2", label: "Days" },
  { icon: <Award size={18} />, value: "5", label: "Tech Pillars Covered" },
];

// ─── Pillar & Sector maps (identical structure to AgendaPage) ─────
// Each entry includes a `keywords` array that is matched against
// speaker.name + speaker.title + speaker.company + speaker.bio.
// Add more synonyms here at any time — new speakers will pick them up
// automatically without any other code changes.

const PILLAR_MAP = {
  ai: {
    label: "AI / ML", icon: Sparkles, color: "#b99eff", light: "#7a3fd1",
    keywords: [
      "ai", "artificial intelligence", "machine learning", "ml", "deep learning",
      "llm", "large language model", "generative ai", "generative", "neural",
      "nlp", "natural language", "computer vision", "data science", "algorithm",
      "foundation model", "gpt", "agentic", "automation", "predictive",
      "recommendation", "intelligent", "cognitive",
    ],
  },
  quantum: {
    label: "Quantum", icon: Zap, color: "#56b3f5", light: "#1878c2",
    keywords: [
      "quantum", "qubit", "superposition", "entanglement",
      "quantum computing", "quantum cryptography", "quantum sensing",
      "quantum communication", "quantum hardware",
    ],
  },
  cybersecurity: {
    label: "Cybersecurity", icon: Shield, color: "#f57eb3", light: "#c2287a",
    keywords: [
      "cybersecurity", "cyber security", "cyber", "infosec", "security",
      "threat", "zero trust", "penetration testing", "vulnerability",
      "soc", "ciso", "cso", "identity", "authentication", "encryption",
      "ransomware", "malware", "devsecops", "compliance", "privacy",
      "data protection", "incident response", "forensics", "risk management",
      "cloud security", "network security", "endpoint",
    ],
  },
  robotics: {
    label: "Robotics", icon: Cpu, color: "#f5a623", light: "#c4780a",
    keywords: [
      "robotics", "robot", "autonomous", "cobot", "drone", "uav", "uav",
      "humanoid", "physical ai", "mechatronics", "automation hardware",
      "actuator", "embedded systems", "computer vision robotics",
    ],
  },
  climate: {
    label: "Climate Tech", icon: Leaf, color: "#3fd19c", light: "#1a9e70",
    keywords: [
      "climate", "sustainability", "sustainable", "green", "renewable",
      "carbon", "net zero", "net-zero", "esg", "clean energy", "cleantech",
      "emissions", "solar", "wind", "environmental", "decarbonization",
      "circular economy", "biodiversity", "clean tech", "climate tech",
    ],
  },
};

const SECTOR_MAP = {
  fintech: {
    label: "Financial Services", short: "FIN",
    keywords: [
      "fintech", "finance", "financial", "banking", "bank", "insurance",
      "payments", "investment", "capital markets", "trading", "wealth",
      "asset management", "hedge fund", "venture capital", "private equity",
      "blockchain", "crypto", "defi", "regtech", "insurtech", "mortgage",
      "credit", "lending", "treasury",
    ],
  },
  healthcare: {
    label: "Healthcare & Life Sci", short: "HLT",
    keywords: [
      "healthcare", "health", "medical", "hospital", "clinical", "pharma",
      "pharmaceutical", "biotech", "life sciences", "drug", "patient",
      "diagnosis", "surgery", "genomics", "medtech", "telemedicine",
      "therapeutics", "pathology", "radiology", "nursing", "health system",
      "public health", "mental health", "oncology",
    ],
  },
  energy: {
    label: "Energy & Infrastructure", short: "ENR",
    keywords: [
      "energy", "power", "grid", "utility", "oil", "gas", "petroleum",
      "electrification", "energy storage", "battery", "infrastructure",
      "pipeline", "transmission", "nuclear", "hydro", "clean power",
      "smart grid", "microgrid",
    ],
  },
  manufacturing: {
    label: "Manufacturing & Supply", short: "MFG",
    keywords: [
      "manufacturing", "supply chain", "logistics", "production", "factory",
      "industrial", "automotive", "aerospace", "assembly", "warehouse",
      "inventory", "procurement", "materials", "operations", "lean",
      "quality control", "industry 4.0", "smart factory", "fabrication",
    ],
  },
  public: {
    label: "Public Sector & Defence", short: "DEF",
    keywords: [
      "defence", "defense", "government", "public sector", "military",
      "nato", "national security", "border", "emergency", "federal",
      "municipal", "policy", "regulation", "intelligence", "geopolitics",
      "arctic", "sovereignty", "armed forces", "law enforcement",
      "public safety", "civil service", "crown", "ministry",
    ],
  },
};

// ─── Keyword matcher ──────────────────────────────────────────────
// Builds a single lowercase blob from all available speaker fields,
// then checks if any of the supplied keywords appear in that blob.
// Works on any speaker added to Sanity in the future — no extra config needed.
function speakerMatchesKeywords(speaker, keywords) {
  const blob = [
    speaker.name    ?? "",
    speaker.title   ?? "",
    speaker.company ?? "",
    speaker.bio     ?? "",
    // add extra Sanity fields here if you add them later (e.g. speaker.tags)
  ].join(" ").toLowerCase();

  return keywords.some((kw) => blob.includes(kw.toLowerCase()));
}

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ─── Filter Dropdown (identical logic to AgendaPage) ─────────────
function FilterDropdown({ label, value, options, onSelect, dark, accent, border, inactiveText }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const selected = value ? options[value] : null;

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(v => !v)}
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.52rem 1rem", borderRadius: "10px",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em",
          cursor: "pointer",
          border: `2px solid ${selected ? accent : border}`,
          background: selected ? `${accent}18` : (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"),
          color: selected ? accent : inactiveText,
          transition: "all 0.15s", whiteSpace: "nowrap",
        }}>
        {selected
          ? <><span style={{ opacity: 0.5 }}>{label}:</span>&nbsp;{selected.label}</>
          : label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          style={{ display: "flex", alignItems: "center" }}>
          <ChevronDown size={13} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0,
              minWidth: "230px", borderRadius: "12px", zIndex: 9999,
              background: dark ? "#130a2a" : "#fff",
              border: `1.5px solid ${border}`,
              boxShadow: dark ? "0 16px 48px rgba(0,0,0,0.7)" : "0 8px 32px rgba(0,0,0,0.16)",
              overflow: "hidden",
            }}>
            {selected && (
              <button
                onClick={() => { onSelect(null); setOpen(false); }}
                style={{
                  width: "100%", textAlign: "left", padding: "0.62rem 1rem",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em",
                  cursor: "pointer", background: "none", border: "none",
                  borderBottom: `1px solid ${border}`,
                  color: dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.35)",
                  display: "flex", alignItems: "center", gap: "0.4rem",
                }}>
                <X size={11} /> CLEAR SELECTION
              </button>
            )}
            {Object.entries(options).map(([key, opt]) => {
              const isActive = value === key;
              const Icon = opt.icon;
              const iconColor = dark ? (opt.color ?? accent) : (opt.light ?? accent);
              return (
                <button
                  key={key}
                  onClick={() => { onSelect(isActive ? null : key); setOpen(false); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "0.7rem 1rem",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.04em",
                    cursor: "pointer",
                    background: isActive ? `${accent}18` : "none",
                    border: "none",
                    color: isActive ? accent : (dark ? "rgba(255,255,255,0.82)" : "rgba(13,5,32,0.78)"),
                    display: "flex", alignItems: "center", gap: "0.55rem",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isActive ? `${accent}18` : "none"; }}>
                  {Icon && <Icon size={13} style={{ color: iconColor, flexShrink: 0 }} />}
                  {opt.label}
                  {isActive && <span style={{ marginLeft: "auto", opacity: 0.55 }}>✓</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Speakers() {
  const [isDark, setIsDark] = useState(true);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activePillar, setActivePillar] = useState(null);
  const [activeSector, setActiveSector] = useState(null);

  useEffect(() => {
    const sync = () => setIsDark(document.body.classList.contains("dark-mode"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "speaker"] | order(order asc) {
          _id,
          name,
          title,
          company,
          bio,
          linkedin,
          image
        }`
      )
      .then((data) => { setSpeakers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // ── Filtered list: text search + pillar keyword match + sector keyword match
  const filtered = useMemo(() => {
    return speakers.filter((s) => {
      // 1. Text search
      if (search.trim()) {
        const q = search.toLowerCase();
        const textMatch =
          s.name?.toLowerCase().includes(q) ||
          s.title?.toLowerCase().includes(q) ||
          s.company?.toLowerCase().includes(q) ||
          s.bio?.toLowerCase().includes(q);
        if (!textMatch) return false;
      }

      // 2. Tech pillar filter — keyword scan across all speaker fields
      if (activePillar) {
        const pillarKeywords = PILLAR_MAP[activePillar]?.keywords ?? [];
        if (!speakerMatchesKeywords(s, pillarKeywords)) return false;
      }

      // 3. Sector filter — keyword scan across all speaker fields
      if (activeSector) {
        const sectorKeywords = SECTOR_MAP[activeSector]?.keywords ?? [];
        if (!speakerMatchesKeywords(s, sectorKeywords)) return false;
      }

      return true;
    });
  }, [speakers, search, activePillar, activeSector]);

  const hasFilters = !!(activePillar || activeSector || search.trim());

  const bg     = isDark ? "#06020f"                     : "#ffffff";
  const text   = isDark ? "#f0eaff"                     : "#0d0520";
  const sub    = isDark ? "rgba(200,185,255,0.55)"       : "rgba(13,5,32,0.50)";
  const card   = isDark ? "rgba(255,255,255,0.04)"       : "rgba(122,63,209,0.04)";
  const border = isDark ? "rgba(155,135,245,0.12)"       : "rgba(122,63,209,0.10)";
  const purple = "#9b87f5";
  const accent = isDark ? "#b99eff"                     : "#7a3fd1";
  const inactiveText = isDark ? "rgba(255,255,255,0.70)" : "rgba(13,5,32,0.55)";
  const fp = { dark: isDark, accent, border, inactiveText };

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ paddingTop: 120, paddingBottom: 60, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: isDark
            ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(155,135,245,0.18) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(122,63,209,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            display: "inline-block", border: `1px solid ${border}`, borderRadius: 999,
            padding: "6px 18px", fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "2px", textTransform: "uppercase", color: purple,
            marginBottom: 24, fontFamily: "'Orbitron', sans-serif",
          }}>
            TTFC 2026 Speaker Lineup
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 6vw, 3.4rem)", fontWeight: 800,
            fontFamily: "'Orbitron', sans-serif", letterSpacing: "-0.02em",
            lineHeight: 1.15, marginBottom: 20,
          }}>
            Meet Our <span style={{ color: purple }}>Speakers</span>
          </h1>
          <p style={{ fontSize: "1rem", color: sub, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Industry leaders, innovators, and pioneers shaping the future of technology in Canada and beyond.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 32 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: purple, marginBottom: 4 }}>
                  {s.icon}
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Orbitron', sans-serif" }}>{s.value}</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: sub, textTransform: "uppercase", letterSpacing: "1.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR (same structure as AgendaPage) ── */}
      <div style={{
        position: "sticky", top: 64, zIndex: 50,
        background: isDark ? "rgba(6,2,15,0.97)" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${border}`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0.8rem 1.5rem 0.85rem" }}>

          {/* ROW 1: Search + clear */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            {/* Search input */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1rem", borderRadius: "10px",
              background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
              border: `1.5px solid ${border}`,
              flex: "1 1 160px",
            }}>
              <Search size={14} style={{ color: inactiveText, flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH SPEAKERS"
                style={{
                  background: "transparent", border: "none", outline: "none",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.05em",
                  color: text, width: "100%",
                }} />
              {search && (
                <button onClick={() => setSearch("")}
                  style={{ lineHeight: 0, background: "none", border: "none", cursor: "pointer", color: inactiveText, flexShrink: 0 }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Clear all */}
            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActivePillar(null); setActiveSector(null); setSearch(""); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.34rem",
                    padding: "0.5rem 1rem", borderRadius: "10px",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em",
                    cursor: "pointer",
                    border: `1.5px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)"}`,
                    background: "transparent", color: inactiveText,
                  }}>
                  <X size={12} /> CLEAR ALL
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ROW 2: Pillar + Sector dropdowns */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.55rem", flexWrap: "wrap" }}>
            <FilterDropdown
              label="TECH PILLAR"
              value={activePillar}
              options={PILLAR_MAP}
              onSelect={setActivePillar}
              {...fp}
            />
            <FilterDropdown
              label="SECTOR"
              value={activeSector}
              options={SECTOR_MAP}
              onSelect={setActiveSector}
              {...fp}
            />
            {/* Result count when filters active */}
            {hasFilters && (
              <span style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.06em",
                color: isDark ? "rgba(255,255,255,0.38)" : "rgba(13,5,32,0.34)",
                marginLeft: "0.25rem",
              }}>
                {filtered.length} speaker{filtered.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>

        </div>
      </div>

      {/* ── SPEAKER GRID ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: sub, padding: 80 }}>Loading speakers…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: sub, padding: 80 }}>
            <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 12 }}>
              No speakers match your filters.
            </p>
            <button
              onClick={() => { setSearch(""); setActivePillar(null); setActiveSector(null); }}
              style={{
                fontFamily: "'Orbitron', sans-serif", fontSize: "0.68rem", fontWeight: 700,
                letterSpacing: "0.04em", color: accent, textDecoration: "underline",
                cursor: "pointer", background: "none", border: "none",
              }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 28,
          }}>
            {filtered.map((speaker) => (
              <SpeakerCard
                key={speaker._id}
                speaker={speaker}
                isDark={isDark}
                card={card}
                border={border}
                text={text}
                sub={sub}
                purple={purple}
              />
            ))}
          </div>
        )}

        {/* More coming soon */}
        {!loading && (
          <div style={{
            marginTop: 60, padding: "40px 32px", borderRadius: 20,
            border: "1px solid rgba(155,135,245,0.25)",
            background: "linear-gradient(135deg, rgba(155,135,245,0.13) 0%, rgba(245,166,35,0.07) 100%)",
            textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(155,135,245,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>🎤</div>
            <div style={{
              fontWeight: 800, fontSize: "clamp(1rem, 3vw, 1.3rem)", marginBottom: 8,
              fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.04em",
              color: isDark ? "#f0eaff" : "#0d0520",
            }}>
              More Speakers Coming Soon
            </div>
            <div style={{ fontSize: "0.85rem", color: sub, maxWidth: 420, margin: "0 auto" }}>
              We're finalizing our lineup. Check back regularly for updates.
            </div>
          </div>
        )}
      </section>

      {/* ── WHERE SPEAKERS WORK ── */}
      <SpeakerMarquee dark={isDark} title="Where our speakers work at" />

      {/* ── ADVISORY COUNCIL ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <div style={{
          padding: "48px 40px", borderRadius: 20, border: `1px solid ${border}`,
          background: card, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,135,245,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            display: "inline-block", border: `1px solid ${border}`, borderRadius: 999,
            padding: "5px 16px", fontSize: "0.6rem", fontWeight: 700,
            letterSpacing: "2px", textTransform: "uppercase", color: purple,
            marginBottom: 20, fontFamily: "'Orbitron', sans-serif",
          }}>
            Coming Soon
          </div>
          <h2 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, fontFamily: "'Orbitron', sans-serif", marginBottom: 12 }}>
            Advisory Council
          </h2>
          <p style={{ fontSize: "0.9rem", color: sub, maxWidth: 500, margin: "0 auto" }}>
            Our distinguished advisory council will be announced soon. Industry veterans and thought leaders guiding TTFC's vision.
          </p>
        </div>
      </section>

      {/* ── APPLY TO SPEAK ── */}
      <ApplyToSpeak isDark={isDark} border={border} purple={purple} sub={sub} />

      <Footer />
    </div>
  );
}

/* ── SPEAKER CARD (unchanged) ── */
function SpeakerCard({ speaker, isDark, card, border, text, sub, purple }) {
  const [hovered, setHovered] = React.useState(false);
  const imageUrl = speaker.image ? urlFor(speaker.image).width(500).height(500).url() : null;

  return (
    <div
      style={{
        borderRadius: 20, overflow: "hidden", position: "relative",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 0 0 1.5px #9b87f5, 0 20px 60px rgba(155,135,245,0.30), 0 8px 24px rgba(0,0,0,0.25)"
          : `0 0 0 1px ${border}, 0 4px 20px rgba(0,0,0,0.18)`,
        background: isDark ? "#0e0520" : "#f5f0ff",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "absolute", inset: -1, borderRadius: 21, zIndex: 0,
        background: hovered
          ? "linear-gradient(135deg, #9b87f5 0%, #f5a623 50%, #9b87f5 100%)"
          : "transparent",
        opacity: hovered ? 0.5 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }} />

      <Link to={`/speakers/${speaker._id}`} style={{ display: "block", textDecoration: "none", position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", paddingTop: "108%", overflow: "hidden", background: isDark ? "#1a0a3e" : "#ede9ff" }}>
          {imageUrl ? (
            <img
              src={imageUrl} alt={speaker.name}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center top",
                transition: "transform 0.6s ease, filter 0.4s ease",
                transform: hovered ? "scale(1.06)" : "scale(1)",
                filter: hovered ? "brightness(1.1) saturate(1.1)" : "brightness(0.95) saturate(1.05)",
              }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: purple, opacity: 0.3 }}>
              <Mic size={56} />
            </div>
          )}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
            background: "linear-gradient(to top, rgba(10,3,26,0.92) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
            background: "rgba(155,135,245,0.92)", backdropFilter: "blur(6px)",
            color: "#fff", fontSize: "0.68rem", fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700, letterSpacing: "1.2px", padding: "6px 16px", borderRadius: 999,
            opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease, transform 0.3s ease",
            whiteSpace: "nowrap", textTransform: "uppercase",
          }}>
            View Profile →
          </div>
        </div>
      </Link>

      <div style={{ padding: "16px 16px 14px", position: "relative", zIndex: 1 }}>
        <Link to={`/speakers/${speaker._id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{
            fontSize: "0.82rem", fontWeight: 800,
            color: isDark ? "#4ade80" : "#6d28d9",
            marginBottom: 4, fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "0.04em", lineHeight: 1.3,
          }}>
            {speaker.name}
          </div>
          <div style={{
            fontSize: "0.7rem", fontWeight: 600,
            color: isDark ? "rgba(220,210,255,0.75)" : "rgba(60,20,120,0.70)",
            marginBottom: 6, fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "0.02em", lineHeight: 1.4,
          }}>
            {speaker.title}
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: isDark ? "rgba(155,135,245,0.12)" : "rgba(122,63,209,0.10)",
            border: `1px solid ${isDark ? "rgba(155,135,245,0.22)" : "rgba(122,63,209,0.18)"}`,
            borderRadius: 999, padding: "3px 10px", marginBottom: 12,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#9b87f5", flexShrink: 0 }} />
            <span style={{
              fontSize: "0.68rem", fontWeight: 700, fontFamily: "'Orbitron', sans-serif",
              color: isDark ? "#c8b9ff" : "#5a1fa8", letterSpacing: "0.5px", textTransform: "uppercase",
            }}>
              {speaker.company}
            </span>
          </div>
        </Link>

        {speaker.linkedin && (
          <a
            href={speaker.linkedin} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "9px 0", borderRadius: 10,
              background: "#0A66C2", color: "#fff", fontSize: "0.72rem",
              fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
              letterSpacing: "0.5px", textDecoration: "none",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#004182"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#0A66C2"; }}
          >
            <LinkedInIcon />
            View on LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}

/* ── APPLY TO SPEAK (unchanged) ── */
function ApplyToSpeak({ isDark, border, purple, sub }) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", title: "", industry: "", experience: "", linkedin: "" });
  const [status, setStatus] = React.useState("idle");

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setStatus("loading");
    try {
      await emailjs.send(
        "service_gy3fvru",
        "template_ufqzzep",
        {
          to_email: "baldeep@thetechfestival.com",
          from_name: form.name,
          from_email: form.email,
          message: `[Speaker Application]\nName: ${form.name}\nEmail: ${form.email}\nTitle: ${form.title}\nIndustry: ${form.industry}\nExperience: ${form.experience}\nLinkedIn: ${form.linkedin}`,
        },
        "gZgYZtLCXPVgUsVj_"
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const text = isDark ? "#f0eaff" : "#0d0520";
  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.06)";

  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
      <div style={{
        padding: "48px 40px", borderRadius: 20, border: `1px solid ${border}`,
        background: isDark ? "rgba(155,135,245,0.06)" : "rgba(122,63,209,0.04)",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, fontFamily: "'Orbitron', sans-serif", marginBottom: 12, color: text }}>
          Apply to Speak at TTFC 2026
        </h2>
        <p style={{ fontSize: "0.9rem", color: sub, maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7 }}>
          Share your expertise with 1000+ attendees. We're looking for forward-thinking leaders in AI, cybersecurity, fintech, and beyond.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "12px 36px", borderRadius: 999, background: "transparent",
            color: purple, fontWeight: 700, fontSize: "0.82rem",
            fontFamily: "'Orbitron', sans-serif", letterSpacing: "1.5px",
            textTransform: "uppercase", border: `2px solid ${purple}`,
            cursor: "pointer", transition: "background 0.2s ease, color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = purple; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = purple; }}
        >
          Apply Now →
        </button>
      </div>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }} onClick={() => setOpen(false)}>
          <div style={{
            background: isDark ? "#110828" : "#fff",
            borderRadius: 16, padding: 36, maxWidth: 480, width: "100%",
            border: `1px solid ${border}`, position: "relative",
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: sub }}>
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, marginBottom: 20, color: text }}>Apply to Speak</h3>

            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: purple }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>✓</div>
                <p style={{ fontWeight: 600 }}>Application submitted! We'll be in touch.</p>
              </div>
            ) : (
              <>
                {[
                  { key: "name",       label: "Full Name",           placeholder: "Jane Smith" },
                  { key: "email",      label: "Email",               placeholder: "jane@company.com", type: "email" },
                  { key: "title",      label: "Job Title",           placeholder: "VP of AI" },
                  { key: "industry",   label: "Industry",            placeholder: "Artificial Intelligence" },
                  { key: "experience", label: "Speaking Experience", placeholder: "e.g. TEDx, industry panels…" },
                  { key: "linkedin",   label: "LinkedIn URL",        placeholder: "https://linkedin.com/in/…" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: "0.78rem", color: sub, marginBottom: 5 }}>{label}</label>
                    <input
                      type={type || "text"}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8,
                        border: `1px solid ${border}`, background: inputBg, color: text,
                        fontSize: "0.88rem", outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
                {status === "error" && (
                  <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: 12 }}>
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 8,
                    background: purple, color: "#fff", fontWeight: 700,
                    fontSize: "0.9rem", border: "none", cursor: "pointer", marginTop: 4,
                    opacity: status === "loading" ? 0.7 : 1,
                  }}
                >
                  {status === "loading" ? "Submitting…" : "Submit Application"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
