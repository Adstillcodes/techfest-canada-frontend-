import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, X, ChevronDown, Sparkles, Zap, Shield, Cpu, Leaf, User 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Config (Identical to Agenda for Consistency) ──────────────────
const PILLAR_MAP = {
  ai:            { label: "AI / ML",       icon: Sparkles, color: "#b99eff", light: "#7a3fd1" },
  quantum:       { label: "Quantum",        icon: Zap,      color: "#56b3f5", light: "#1878c2" },
  cybersecurity: { label: "Cybersecurity",  icon: Shield,   color: "#f57eb3", light: "#c2287a" },
  robotics:      { label: "Robotics",       icon: Cpu,      color: "#f5a623", light: "#c4780a" },
  climate:       { label: "Climate Tech",   icon: Leaf,     color: "#3fd19c", light: "#1a9e70" },
};

const SECTOR_MAP = {
  fintech:       { label: "Financial Services",    short: "FIN" },
  healthcare:    { label: "Healthcare & Life Sci",   short: "HLT" },
  energy:        { label: "Energy & Infrastructure", short: "ENR" },
  manufacturing: { label: "Manufacturing & Supply",  short: "MFG" },
  public:        { label: "Public Sector & Defence", short: "DEF" },
};

/**
 * KEYWORD MAPPING
 * This is the "brain" of your search. Add keywords here to make the 
 * Pillar/Sector filters more accurate when scanning bios.
 */
const MAPPING_KEYWORDS = {
  // Pillars
  ai: ["ai", "machine learning", "ml", "neural", "llm", "intelligence", "data science"],
  quantum: ["quantum", "qubit", "physics", "computing", "cryptography"],
  cybersecurity: ["cyber", "security", "infosec", "threat", "defence", "shield", "encryption"],
  robotics: ["robot", "automation", "hardware", "drone", "mechanical", "engineering", "bot"],
  climate: ["climate", "green", "sustainability", "carbon", "energy", "clean", "environmental"],
  
  // Sectors
  fintech: ["finance", "bank", "trading", "crypto", "payment", "fintech", "wealth"],
  healthcare: ["health", "medical", "biotech", "clinical", "hospital", "pharma", "life sci"],
  energy: ["energy", "grid", "power", "utility", "infrastructure", "nuclear", "solar"],
  manufacturing: ["manufacturing", "supply chain", "logistics", "factory", "production", "mobility"],
  public: ["defence", "defense", "government", "public sector", "policy", "military", "sovereignty", "arctic"]
};

// ─── Reusable Filter Dropdown (Same as Agenda) ────────────────────
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
        {selected ? <><span style={{ opacity: 0.5 }}>{label}:</span>&nbsp;{selected.label}</> : label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} style={{ display: "flex", alignItems: "center" }}>
          <ChevronDown size={13} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0,
              minWidth: "230px", borderRadius: "12px", zIndex: 9999,
              background: dark ? "#130a2a" : "#fff",
              border: `1.5px solid ${border}`,
              boxShadow: "0 16px 48px rgba(0,0,0,0.24)", overflow: "hidden",
            }}>
            {Object.entries(options).map(([key, opt]) => {
              const isActive = value === key;
              const Icon = opt.icon;
              return (
                <button
                  key={key}
                  onClick={() => { onSelect(isActive ? null : key); setOpen(false); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "0.7rem 1rem",
                    fontFamily: "'Orbitron', sans-serif", fontSize: "0.68rem", fontWeight: 700,
                    background: isActive ? `${accent}18` : "none", border: "none",
                    color: isActive ? accent : (dark ? "#fff" : "#0d0520"),
                    display: "flex", alignItems: "center", gap: "0.55rem", cursor: "pointer"
                  }}>
                  {Icon && <Icon size={13} style={{ color: accent }} />}
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Speaker Page ─────────────────────────────────────────────
export default function SpeakerPage() {
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [activePillar, setActivePillar] = useState(null);
  const [activeSector, setActiveSector] = useState(null);

  // Example Speaker Data Structure
  const [speakers, setSpeakers] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      role: "Head of AI Strategy",
      company: "Future Defense Systems",
      bio: "Expert in deploying AI for defense and public sector readiness in the Arctic.",
      image: null
    },
    // ... add more speakers here
  ]);

  useEffect(() => {
    const check = () => setDark(document.body.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const accent = dark ? "#b99eff" : "#7a3fd1";
  const border = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";

  // ─── SMART FILTERING LOGIC ───────────────────────────────────────
  const filteredSpeakers = useMemo(() => {
    return speakers.filter(speaker => {
      // Create one big string of speaker info to scan
      const speakerContent = `${speaker.name} ${speaker.role} ${speaker.company} ${speaker.bio}`.toLowerCase();

      // 1. Standard Search Bar logic
      if (search && !speakerContent.includes(search.toLowerCase())) return false;

      // 2. Tech Pillar logic (Scanning bio/info for keywords)
      if (activePillar) {
        const keywords = MAPPING_KEYWORDS[activePillar] || [];
        const hasMatch = keywords.some(word => speakerContent.includes(word));
        if (!hasMatch) return false;
      }

      // 3. Sector logic (Scanning bio/info for keywords)
      if (activeSector) {
        const keywords = MAPPING_KEYWORDS[activeSector] || [];
        const hasMatch = keywords.some(word => speakerContent.includes(word));
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [speakers, search, activePillar, activeSector]);

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#06020f" : "#f8f7fc", color: dark ? "#fff" : "#0d0520" }}>
      <Navbar />
      
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "8rem 2rem" }}>
        {/* Search & Filter Bar Section */}
        <div style={{ 
          display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", 
          marginBottom: "3rem", paddingBottom: "2rem", borderBottom: `1px solid ${border}` 
        }}>
          {/* Text Search */}
          <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
            <Search 
              size={18} 
              style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} 
            />
            <input
              type="text"
              placeholder="Search speakers, bios, or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "0.75rem 1rem 0.75rem 2.8rem",
                borderRadius: "12px", border: `1.5px solid ${border}`,
                background: dark ? "rgba(255,255,255,0.05)" : "#fff",
                color: dark ? "#fff" : "#0d0520",
                fontFamily: "inherit", fontSize: "0.9rem", outline: "none"
              }}
            />
          </div>

          {/* Dropdowns */}
          <FilterDropdown 
            label="Tech Pillar" options={PILLAR_MAP} value={activePillar} 
            onSelect={setActivePillar} dark={dark} accent={accent} border={border} 
          />
          <FilterDropdown 
            label="Industry Sector" options={SECTOR_MAP} value={activeSector} 
            onSelect={setActiveSector} dark={dark} accent={accent} border={border} 
          />
        </div>

        {/* Results Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
          {filteredSpeakers.map(speaker => (
            <motion.div 
              layout key={speaker.id}
              style={{ 
                padding: "1.5rem", borderRadius: "16px", background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                border: `1px solid ${border}`
              }}
            >
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: accent + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={30} style={{ color: accent }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontFamily: "'Orbitron', sans-serif" }}>{speaker.name}</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.7 }}>{speaker.role}</p>
                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: accent }}>{speaker.company}</p>
                </div>
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: "1.5", opacity: 0.8 }}>{speaker.bio}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
