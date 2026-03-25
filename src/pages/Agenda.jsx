import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Clock, Search, X, ChevronDown,
  Sparkles, Zap, Shield, Cpu, Leaf,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Protection ───────────────────────────────────────────────────
function useProtection() {
  useEffect(() => {
    const noCtx = (e) => e.preventDefault();
    document.addEventListener("contextmenu", noCtx);
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    return () => {
      document.removeEventListener("contextmenu", noCtx);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, []);
}

// ─── Config ───────────────────────────────────────────────────────
const PILLAR_MAP = {
  ai:            { label: "AI / ML",       icon: Sparkles, color: "#b99eff", light: "#7a3fd1" },
  quantum:       { label: "Quantum",        icon: Zap,      color: "#56b3f5", light: "#1878c2" },
  cybersecurity: { label: "Cybersecurity",  icon: Shield,   color: "#f57eb3", light: "#c2287a" },
  robotics:      { label: "Robotics",       icon: Cpu,      color: "#f5a623", light: "#c4780a" },
  climate:       { label: "Climate Tech",   icon: Leaf,     color: "#3fd19c", light: "#1a9e70" },
};

const SECTOR_MAP = {
  fintech:       { label: "Financial Services",      short: "FIN" },
  healthcare:    { label: "Healthcare & Life Sci",   short: "HLT" },
  energy:        { label: "Energy & Infrastructure", short: "ENR" },
  manufacturing: { label: "Manufacturing & Supply",  short: "MFG" },
  public:        { label: "Public Sector & Defence", short: "DEF" },
};

const FORMAT_MAP = {
  networking:  { label: "Networking",          bg: "#3fd19c22", bgL: "#1a9e7022", tc: "#3fd19c", tcL: "#1a9e70" },
  keynote:     { label: "Keynote",             bg: "#b99eff22", bgL: "#7a3fd122", tc: "#b99eff", tcL: "#7a3fd1" },
  fireside:    { label: "Fireside",            bg: "#f5a62322", bgL: "#c4780a22", tc: "#f5a623", tcL: "#c4780a" },
  briefing:    { label: "Boardroom Briefing",  bg: "#56b3f522", bgL: "#1878c222", tc: "#56b3f5", tcL: "#1878c2" },
  panel:       { label: "Panel / Debate",      bg: "#f57eb322", bgL: "#c2287a22", tc: "#f57eb3", tcL: "#c2287a" },
  provocation: { label: "Provocation",         bg: "#f5a62322", bgL: "#c4780a22", tc: "#f5a623", tcL: "#c4780a" },
  break:       { label: "Break",               bg: "#88888818", bgL: "#88888818", tc: "#aaa",    tcL: "#777"    },
  awards:      { label: "Awards / Gala",       bg: "#f5c84222", bgL: "#d4970022", tc: "#f5c842", tcL: "#d49700" },
  opening:     { label: "Opening",             bg: "#b99eff22", bgL: "#7a3fd122", tc: "#b99eff", tcL: "#7a3fd1" },
  dialogue:    { label: "Leadership Dialogue", bg: "#56b3f522", bgL: "#1878c222", tc: "#56b3f5", tcL: "#1878c2" },
  closing:     { label: "Closing",             bg: "#b99eff22", bgL: "#7a3fd122", tc: "#b99eff", tcL: "#7a3fd1" },
};

// ─── Sessions ─────────────────────────────────────────────────────
const SESSIONS = [
  // DAY 1
  { id:"d1-1",  day:1, time:"08:00", endTime:"09:00", title:"Registration, Networking Breakfast & Expo Preview",                                                              format:"networking",  isBreak:true },
  { id:"d1-2",  day:1, time:"09:00", endTime:"09:15", title:"Opening Ceremony: Welcome to The Tech Festival Canada",                                                          format:"opening",     featured:true },
  { id:"d1-3",  day:1, time:"09:15", endTime:"09:40", title:"Opening Keynote: Canada's Tech Decade — Build, Secure, Scale",                                                   format:"keynote",     featured:true },
  { id:"d1-4",  day:1, time:"09:40", endTime:"10:15", title:"Canada in the New Global Order",                                                                                 format:"fireside",    featured:true },
  { id:"d1-5",  day:1, time:"10:15", endTime:"10:30", title:"Artificial Intelligence Beyond the Pilot Phase",                                                                 format:"keynote",     pillar:"ai" },
  { id:"d1-6",  day:1, time:"10:30", endTime:"10:45", title:"Quantum as Strategic Infrastructure",                                                                            format:"keynote",     pillar:"quantum" },
  { id:"d1-7",  day:1, time:"10:45", endTime:"11:00", title:"Cybersecurity and Digital Trust in the Agentic Age",                                                             format:"keynote",     pillar:"cybersecurity" },
  { id:"d1-8",  day:1, time:"11:00", endTime:"11:15", title:"Robotics and the Physical AI Economy",                                                                           format:"keynote",     pillar:"robotics" },
  { id:"d1-9",  day:1, time:"11:15", endTime:"11:30", title:"Climate Tech as Competitiveness Strategy",                                                                       format:"keynote",     pillar:"climate" },
  { id:"d1-10", day:1, time:"11:30", endTime:"11:45", title:"Networking Break",                                                                                               format:"break",       isBreak:true },
  { id:"d1-11", day:1, time:"11:45", endTime:"12:00", title:"Reinventing the Intelligent Financial Institution",                                                               format:"keynote",     sector:"fintech" },
  { id:"d1-12", day:1, time:"12:00", endTime:"12:22", title:"AI × Financial Services: From Copilots to Core Banking",                                                         format:"briefing",    pillar:"ai",            sector:"fintech" },
  { id:"d1-13", day:1, time:"12:22", endTime:"12:44", title:"Quantum × Financial Services: Risk, Pricing and the Hype Gap",                                                   format:"fireside",    pillar:"quantum",       sector:"fintech" },
  { id:"d1-14", day:1, time:"12:44", endTime:"13:06", title:"Cybersecurity × Financial Services: Fraud, Identity and Deepfake Resilience",                                    format:"briefing",    pillar:"cybersecurity", sector:"fintech" },
  { id:"d1-15", day:1, time:"13:06", endTime:"13:28", title:"Robotics × Financial Services: Automation Beyond the Screen",                                                    format:"provocation", pillar:"robotics",      sector:"fintech" },
  { id:"d1-16", day:1, time:"13:28", endTime:"13:50", title:"Climate Tech × Financial Services: Transition Finance, Carbon Markets and Bankability",                          format:"fireside",    pillar:"climate",       sector:"fintech" },
  { id:"d1-17", day:1, time:"13:50", endTime:"14:40", title:"Networking Lunch",                                                                                               format:"networking",  isBreak:true },
  { id:"d1-18", day:1, time:"14:40", endTime:"14:55", title:"The Digitally Resilient Health System",                                                                          format:"keynote",     sector:"healthcare" },
  { id:"d1-19", day:1, time:"14:55", endTime:"15:17", title:"AI × Healthcare: Clinical AI That Actually Scales",                                                              format:"briefing",    pillar:"ai",            sector:"healthcare" },
  { id:"d1-20", day:1, time:"15:17", endTime:"15:39", title:"Quantum × Healthcare: Drug Discovery, Biology and Commercial Timelines",                                          format:"fireside",    pillar:"quantum",       sector:"healthcare" },
  { id:"d1-21", day:1, time:"15:39", endTime:"16:01", title:"Cybersecurity × Healthcare: Securing Hospitals in an AI First Era",                                              format:"briefing",    pillar:"cybersecurity", sector:"healthcare" },
  { id:"d1-22", day:1, time:"16:01", endTime:"16:23", title:"Robotics × Healthcare: Surgical, Lab and Eldercare Automation",                                                  format:"provocation", pillar:"robotics",      sector:"healthcare" },
  { id:"d1-23", day:1, time:"16:23", endTime:"16:45", title:"Climate Tech × Healthcare: Climate Resilient Care Systems",                                                      format:"fireside",    pillar:"climate",       sector:"healthcare" },
  { id:"d1-24", day:1, time:"16:45", endTime:"17:00", title:"Networking Break",                                                                                               format:"break",       isBreak:true },
  { id:"d1-25", day:1, time:"17:00", endTime:"17:35", title:"Jobs, AI and the Human Contract",                                                                                format:"panel",       featured:true },
  { id:"d1-26", day:1, time:"17:35", endTime:"18:05", title:"Canada, the US and the New North American Technology Bargain",                                                    format:"fireside",    featured:true },
  { id:"d1-27", day:1, time:"18:30", endTime:"20:30", title:"Awards Night: Canada's Tech Titans",                                                                             format:"awards",      isBreak:true, featured:true },
  // DAY 2
  { id:"d2-1",  day:2, time:"08:30", endTime:"09:00", title:"Coffee Networking and Media Check-In",                                                                           format:"networking",  isBreak:true },
  { id:"d2-2",  day:2, time:"09:00", endTime:"09:20", title:"Day 2 Opening Address: From Vision to Execution",                                                                format:"opening",     featured:true },
  { id:"d2-3",  day:2, time:"09:20", endTime:"09:50", title:"Build in Canada, Scale to the World",                                                                            format:"dialogue",    featured:true },
  { id:"d2-4",  day:2, time:"09:50", endTime:"10:05", title:"Powering Canada's Digital and Industrial Future",                                                                format:"keynote",     sector:"energy" },
  { id:"d2-5",  day:2, time:"10:05", endTime:"10:27", title:"AI × Energy & Infrastructure: Grid Intelligence, Asset Optimization and Resilience",                             format:"briefing",    pillar:"ai",            sector:"energy" },
  { id:"d2-6",  day:2, time:"10:27", endTime:"10:49", title:"Quantum × Energy & Infrastructure: Materials, Storage and Grid Optimization",                                    format:"fireside",    pillar:"quantum",       sector:"energy" },
  { id:"d2-7",  day:2, time:"10:49", endTime:"11:11", title:"Cybersecurity × Energy & Infrastructure: Protecting Critical Systems from Disruption",                           format:"briefing",    pillar:"cybersecurity", sector:"energy" },
  { id:"d2-8",  day:2, time:"11:11", endTime:"11:33", title:"Robotics × Energy & Infrastructure: Drones, Inspection and Remote Operations",                                   format:"provocation", pillar:"robotics",      sector:"energy" },
  { id:"d2-9",  day:2, time:"11:33", endTime:"11:55", title:"Climate Tech × Energy & Infrastructure: Canada's Grid, Storage and Electrification Challenge",                   format:"briefing",    pillar:"climate",       sector:"energy" },
  { id:"d2-10", day:2, time:"11:55", endTime:"12:10", title:"Networking Break",                                                                                               format:"break",       isBreak:true },
  { id:"d2-11", day:2, time:"12:10", endTime:"12:25", title:"Rebuilding Industrial Competitiveness",                                                                          format:"keynote",     sector:"manufacturing" },
  { id:"d2-12", day:2, time:"12:25", endTime:"12:47", title:"AI × Manufacturing & Mobility: Agentic Operations Across the Supply Chain",                                      format:"briefing",    pillar:"ai",            sector:"manufacturing" },
  { id:"d2-13", day:2, time:"12:47", endTime:"13:09", title:"Quantum × Manufacturing & Mobility: New Materials, Optimization and Industrial Advantage",                        format:"fireside",    pillar:"quantum",       sector:"manufacturing" },
  { id:"d2-14", day:2, time:"13:09", endTime:"13:31", title:"Cybersecurity × Manufacturing & Mobility: Securing the Connected Factory and Autonomous Systems",                 format:"briefing",    pillar:"cybersecurity", sector:"manufacturing" },
  { id:"d2-15", day:2, time:"13:31", endTime:"13:53", title:"Robotics × Manufacturing & Mobility: Humanoids, Cobots and Warehouse Autonomy",                                  format:"provocation", pillar:"robotics",      sector:"manufacturing" },
  { id:"d2-16", day:2, time:"13:53", endTime:"14:15", title:"Climate Tech × Manufacturing & Mobility: Low Carbon Industry and Resilient Production",                          format:"fireside",    pillar:"climate",       sector:"manufacturing" },
  { id:"d2-17", day:2, time:"14:15", endTime:"15:00", title:"Networking Lunch",                                                                                               format:"networking",  isBreak:true },
  { id:"d2-18", day:2, time:"15:00", endTime:"15:15", title:"Technology, Trust and National Capacity",                                                                        format:"keynote",     sector:"public" },
  { id:"d2-19", day:2, time:"15:15", endTime:"15:37", title:"AI × Public Sector & Defence: Trusted AI for Service Delivery and Readiness",                                    format:"briefing",    pillar:"ai",            sector:"public" },
  { id:"d2-20", day:2, time:"15:37", endTime:"15:59", title:"Quantum × Public Sector & Defence: Strategic Advantage in Sensing and Secure Communications",                    format:"fireside",    pillar:"quantum",       sector:"public" },
  { id:"d2-21", day:2, time:"15:59", endTime:"16:21", title:"Cybersecurity × Public Sector & Defence: Zero Trust Government and Digital Sovereignty",                         format:"briefing",    pillar:"cybersecurity", sector:"public" },
  { id:"d2-22", day:2, time:"16:21", endTime:"16:43", title:"Robotics × Public Sector & Defence: Dual Use Systems for Border Security and Emergency Response",                format:"provocation", pillar:"robotics",      sector:"public" },
  { id:"d2-23", day:2, time:"16:43", endTime:"17:05", title:"Climate Tech × Public Sector & Defence: Arctic Readiness, Wildfire Response and Resilient Infrastructure",       format:"briefing",    pillar:"climate",       sector:"public" },
  { id:"d2-24", day:2, time:"17:05", endTime:"17:35", title:"Can Canada Win the Compute Race?",                                                                               format:"panel",       featured:true },
  { id:"d2-25", day:2, time:"17:35", endTime:"18:05", title:"The Toronto Declaration on Technology, Trust and Competitiveness",                                               format:"closing",     featured:true },
  { id:"d2-26", day:2, time:"18:30", endTime:"21:00", title:"Gala Dinner and Networking Reception",                                                                           format:"awards",      isBreak:true, featured:true },
];

function getDuration(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}m`;
}

// ─── Filter Dropdown ──────────────────────────────────────────────
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
              boxShadow: dark
                ? "0 16px 48px rgba(0,0,0,0.7)"
                : "0 8px 32px rgba(0,0,0,0.16)",
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

// ─── Session Card ─────────────────────────────────────────────────
function SessionCard({ s, dark, i }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const fmtInfo    = FORMAT_MAP[s.format];
  const pillar     = s.pillar ? PILLAR_MAP[s.pillar] : null;
  const sector     = s.sector ? SECTOR_MAP[s.sector] : null;
  const accent     = pillar ? (dark ? pillar.color : pillar.light) : (dark ? "#b99eff" : "#7a3fd1");
  const PillarIcon = pillar ? pillar.icon : null;
  const isBreak    = !!s.isBreak;
  const dur        = getDuration(s.time, s.endTime);

  const primaryText   = dark ? "#ffffff"                 : "#0d0520";
  const secondaryText = dark ? "rgba(255,255,255,0.75)"  : "rgba(13,5,32,0.65)";
  const mutedText     = dark ? "rgba(255,255,255,0.48)"  : "rgba(13,5,32,0.42)";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.025, type: "spring", damping: 24 }}
      onClick={() => { if (!isBreak) setExpanded(v => !v); }}
      style={{
        position: "relative", borderRadius: "10px", overflow: "hidden",
        cursor: isBreak ? "default" : "pointer",
        transition: "box-shadow 0.2s",
        background: isBreak
          ? (dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)")
          : (dark ? "rgba(255,255,255,0.04)"  : "#fff"),
        border: dark
          ? `1px solid rgba(255,255,255,${isBreak ? "0.05" : "0.11"})`
          : `1px solid rgba(0,0,0,${isBreak ? "0.05" : "0.08"})`,
        boxShadow: (!isBreak && !dark) ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
      }}
    >
      {!isBreak && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
          background: accent, borderRadius: "10px 0 0 10px",
        }} />
      )}

      <div style={{ padding: isBreak ? "0.9rem 1.2rem" : "1.1rem 1.4rem 1.1rem 1.65rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.8rem" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {!isBreak && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem", marginBottom: "0.58rem" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "0.24rem 0.62rem", borderRadius: "5px",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                  background: dark ? fmtInfo.bg : fmtInfo.bgL,
                  color: dark ? fmtInfo.tc : fmtInfo.tcL,
                }}>
                  {fmtInfo.label}
                </span>

                {s.featured && (
                  <span style={{
                    padding: "0.24rem 0.62rem", borderRadius: "5px",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                    background: `linear-gradient(90deg,${dark ? "#b99eff" : "#7a3fd1"}22,#f5a62322)`,
                    color: dark ? "#b99eff" : "#7a3fd1",
                    border: `1px solid ${dark ? "#b99eff" : "#7a3fd1"}40`,
                  }}>✦ Featured</span>
                )}

                {PillarIcon && pillar && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                    padding: "0.24rem 0.62rem", borderRadius: "5px",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.05em",
                    background: `${accent}1c`, color: accent, border: `1px solid ${accent}38`,
                  }}>
                    <PillarIcon size={11} />{pillar.label}
                  </span>
                )}

                {sector && (
                  <span style={{
                    padding: "0.24rem 0.62rem", borderRadius: "5px",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.05em",
                    background: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)",
                    color: primaryText,
                  }}>
                    {sector.label}
                  </span>
                )}
              </div>
            )}

            <p style={{
              fontWeight: isBreak ? 500 : 700,
              fontSize: isBreak ? "0.95rem" : "1.06rem",
              lineHeight: 1.42,
              color: isBreak ? mutedText : primaryText,
            }}>{s.title}</p>

            {!isBreak && (
              <p style={{ fontSize: "0.82rem", color: mutedText, marginTop: "0.4rem" }}>
                Speaker: To Be Decided
              </p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.22rem", flexShrink: 0 }}>
            <span style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: "0.94rem", fontWeight: 800,
              color: isBreak ? mutedText : accent,
            }}>{s.time}</span>
            <span style={{ fontSize: "0.74rem", color: mutedText }}>{dur}</span>
            {!isBreak && (
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{ color: secondaryText, marginTop: "0.18rem" }}
              >
                <ChevronDown size={15} />
              </motion.div>
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && !isBreak && (
            <motion.div
              key="exp"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                paddingTop: "1rem", marginTop: "1rem",
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)"}`,
                display: "flex", flexWrap: "wrap", gap: "1.75rem",
              }}>
                <div>
                  <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", color: mutedText, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.34rem", fontWeight: 700 }}>Time</p>
                  <p style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.38rem", color: primaryText }}>
                    <Clock size={13} style={{ color: mutedText }} />
                    {s.time} – {s.endTime} · {dur}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", color: mutedText, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.34rem", fontWeight: 700 }}>Speaker</p>
                  <p style={{ fontSize: "0.9rem", color: secondaryText }}>To Be Decided</p>
                </div>
                <div>
                  <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", color: mutedText, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.34rem", fontWeight: 700 }}>Format</p>
                  <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.68rem", fontWeight: 700, color: dark ? fmtInfo.tc : fmtInfo.tcL }}>{fmtInfo.label}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Timeline Group ───────────────────────────────────────────────
function TimeGroup({ time, sessions, dark, base }) {
  return (
    <div style={{ display: "flex", gap: "1.1rem" }}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "flex-end",
        flexShrink: 0, paddingTop: "1rem", width: "52px",
      }}>
        <span style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", fontWeight: 800,
          color: dark ? "rgba(255,255,255,0.52)" : "rgba(13,5,32,0.44)",
          letterSpacing: "0.02em",
        }}>{time}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: "1.1rem" }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
          background: dark ? "rgba(185,158,255,0.65)" : "rgba(122,63,209,0.48)",
        }} />
        <div style={{
          flex: 1, width: "1px", marginTop: "5px",
          background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }} />
      </div>

      <div style={{ flex: 1, paddingTop: "0.6rem", paddingBottom: "0.8rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {sessions.map((s, i) => <SessionCard key={s.id} s={s} dark={dark} i={base + i} />)}
      </div>
    </div>
  );
}

// ─── Shared filter dropdowns + clear-all (used in both bars) ──────
function FilterControls({ activePillar, setActivePillar, activeSector, setActiveSector, search, setSearch, hasFilters, dark, accent, border, inactiveText }) {
  return (
    <>
      <FilterDropdown
        label="TECH PILLAR"
        value={activePillar}
        options={PILLAR_MAP}
        onSelect={setActivePillar}
        dark={dark} accent={accent} border={border} inactiveText={inactiveText}
      />
      <FilterDropdown
        label="SECTOR"
        value={activeSector}
        options={SECTOR_MAP}
        onSelect={setActiveSector}
        dark={dark} accent={accent} border={border} inactiveText={inactiveText}
      />
      <AnimatePresence>
        {hasFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActivePillar(null); setActiveSector(null); setSearch(""); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.34rem",
              padding: "0.5rem 1rem", borderRadius: "10px",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em",
              cursor: "pointer",
              border: `1.5px solid ${dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)"}`,
              background: "transparent", color: inactiveText,
            }}>
            <X size={12} /> CLEAR ALL
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────
export default function AgendaPage() {
  useProtection();

  const [dark, setDark]                 = useState(false);
  const [activeDay, setActiveDay]       = useState(1);
  const [search, setSearch]             = useState("");
  const [activePillar, setActivePillar] = useState(null);
  const [activeSector, setActiveSector] = useState(null);

  useEffect(() => {
    const check = () => setDark(document.body.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const bg           = dark ? "#06020f"                 : "#f8f7fc";
  const text         = dark ? "#ffffff"                 : "#0d0520";
  const accent       = dark ? "#b99eff"                 : "#7a3fd1";
  const border       = dark ? "rgba(255,255,255,0.10)"  : "rgba(0,0,0,0.10)";
  const inactiveText = dark ? "rgba(255,255,255,0.70)"  : "rgba(13,5,32,0.55)";

  const filtered = useMemo(() => SESSIONS.filter(s => {
    if (s.day !== activeDay) return false;
    const q = search.toLowerCase();
    if (q && !s.title.toLowerCase().includes(q)) return false;
    if (activePillar && s.pillar !== activePillar) return false;
    if (activeSector && s.sector !== activeSector) return false;
    return true;
  }), [activeDay, search, activePillar, activeSector]);

  const otherDayResults = useMemo(() => {
    const otherDay = activeDay === 1 ? 2 : 1;
    const count = SESSIONS.filter(s => {
      if (s.day !== otherDay) return false;
      const q = search.toLowerCase();
      if (q && !s.title.toLowerCase().includes(q)) return false;
      if (activePillar && s.pillar !== activePillar) return false;
      if (activeSector && s.sector !== activeSector) return false;
      return true;
    }).length;
    return { day: otherDay, count };
  }, [activeDay, search, activePillar, activeSector]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach(s => {
      if (!map.has(s.time)) map.set(s.time, []);
      map.get(s.time).push(s);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  let cardIdx = 0;
  const hasFilters = !!(activePillar || activeSector || search);

  const filterControlProps = { activePillar, setActivePillar, activeSector, setActiveSector, search, setSearch, hasFilters, dark, accent, border, inactiveText };

  return (
    <>
    <style>{`
      .agenda-gradient-text {
        background: linear-gradient(135deg, var(--grad-start, #b99eff), #f5a623);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        display: inline-block;
      }
      .agenda-stat-text {
        font-family: 'Orbitron', sans-serif;
        font-size: clamp(1.4rem, 2.4vw, 2rem);
        font-weight: 900;
        background: linear-gradient(135deg, var(--grad-start, #b99eff), #f5a623);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        display: inline-block;
      }
      .agenda-search-input::placeholder {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.65rem;
        letter-spacing: 0.05em;
        opacity: 0.45;
      }
      /* Desktop: filters live inside the sticky bar */
      .agenda-filters-desktop { display: flex; }
      .agenda-filters-mobile  { display: none;  }

      /* Mobile: filters drop out of the sticky bar and scroll with the page */
      @media (max-width: 640px) {
        .agenda-filters-desktop { display: none !important; }
        .agenda-filters-mobile  { display: flex !important; }
      }
    `}</style>

    <div style={{
      background: bg,
      minHeight: "100vh",
      color: text,
      overflowX: "clip",
      userSelect: "none",
    }}>

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        padding: "clamp(120px, 18vw, 180px) 5% clamp(60px, 8vw, 100px)",
        background: dark
          ? "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(122,63,209,0.14) 0%, transparent 70%)"
          : "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(122,63,209,0.07) 0%, transparent 70%)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <p style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", fontWeight: 800,
              letterSpacing: "3px", textTransform: "uppercase", color: accent, marginBottom: 18,
            }}>TTFC 2026 — October 26–27, Toronto</p>

            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2.4rem, 6vw, 4.4rem)",
              fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 22,
            }}>
              The <span className="agenda-gradient-text" style={{ "--grad-start": accent }}>Agenda</span>
            </h1>

            <p style={{
              fontSize: "clamp(1.05rem, 1.9vw, 1.25rem)",
              color: dark ? "rgba(255,255,255,0.68)" : "rgba(13,5,32,0.58)",
              lineHeight: 1.75, maxWidth: 620, margin: "0 auto 48px",
            }}>
              Two days of keynotes, fireside chats, boardroom briefings, panels, and networking — organised around five technology pillars and five applied sectors.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1.5rem, 4vw, 3.5rem)", flexWrap: "wrap" }}>
              {[["2","Days"],["50+","Sessions"],["5","Pillars"],["5","Sectors"]].map(([v,l], i) => (
                <motion.div key={l}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, type: "spring", damping: 20 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                  <span className="agenda-stat-text" style={{ "--grad-start": accent }}>{v}</span>
                  <span style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.62rem", fontWeight: 700,
                    color: dark ? "rgba(255,255,255,0.52)" : "rgba(13,5,32,0.46)",
                    textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.12rem",
                  }}>{l}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY BAR: day tabs + search (+ filters on desktop) ─── */}
      <div style={{
        position: "sticky",
        top: "64px",
        zIndex: 40,
        background: dark ? "rgba(6,2,15,0.97)" : "rgba(248,247,252,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${border}`,
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0.8rem 1.5rem 0.85rem" }}>

          {/* ROW 1 — Day tabs + Search bar (always sticky on all screen sizes) */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>

            <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
              {[1, 2].map(d => (
                <motion.button key={d} whileTap={{ scale: 0.96 }} onClick={() => setActiveDay(d)}
                  style={{
                    padding: "0.5rem 1.1rem", borderRadius: "9px",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.05em",
                    cursor: "pointer",
                    background: activeDay === d ? `${accent}28` : "transparent",
                    border: `2px solid ${activeDay === d ? accent : dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)"}`,
                    color: activeDay === d ? accent : inactiveText,
                    transition: "all 0.15s",
                  }}>
                  DAY {d}
                  <span style={{ fontSize: "0.6rem", fontWeight: 600, opacity: 0.55, marginLeft: "0.4rem" }}>
                    {d === 1 ? "OCT 26" : "OCT 27"}
                  </span>
                </motion.button>
              ))}
            </div>

            <div style={{ width: "1px", height: "28px", background: border, flexShrink: 0 }} />

            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1rem", borderRadius: "10px",
              background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
              border: `1.5px solid ${border}`,
              flex: "1 1 160px",
            }}>
              <Search size={14} style={{ color: inactiveText, flexShrink: 0 }} />
              <input
                className="agenda-search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="SEARCH SESSIONS"
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
          </div>

          {/* ROW 2 — Filters: desktop only (stays sticky) */}
          <div className="agenda-filters-desktop" style={{
            alignItems: "center", gap: "0.5rem", marginTop: "0.55rem", flexWrap: "wrap",
          }}>
            <FilterControls {...filterControlProps} />
          </div>

        </div>
      </div>

      {/* ── MOBILE-ONLY filter row: scrolls with the page ─────────── */}
      <div className="agenda-filters-mobile" style={{
        alignItems: "center", gap: "0.5rem", flexWrap: "wrap",
        padding: "0.65rem 1.5rem 0.7rem",
        borderBottom: `1px solid ${border}`,
        background: dark ? "rgba(6,2,15,0.5)" : "rgba(248,247,252,0.5)",
      }}>
        <FilterControls {...filterControlProps} />
      </div>

      {/* ── SCHEDULE ──────────────────────────────────────────────── */}
      <main style={{ padding: "2.8rem 0 7rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>

          <p style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.06em",
            color: dark ? "rgba(255,255,255,0.38)" : "rgba(13,5,32,0.34)",
            marginBottom: "1.5rem",
          }}>
            {filtered.length} session{filtered.length !== 1 ? "s" : ""} · Day {activeDay} — {activeDay === 1 ? "Oct 26" : "Oct 27"}, 2026
          </p>

          {grouped.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "5rem 0", gap: "0.9rem",
            }}>
              <Search size={28} style={{ color: dark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)" }} />

              {otherDayResults.count > 0 ? (
                <>
                  <p style={{
                    fontFamily: "'Orbitron', sans-serif", fontSize: "0.76rem", fontWeight: 700,
                    color: dark ? "rgba(255,255,255,0.85)" : "rgba(13,5,32,0.72)", textAlign: "center",
                    letterSpacing: "0.04em",
                  }}>
                    No sessions on Day {activeDay} match.
                  </p>
                  <p style={{
                    fontSize: "0.88rem",
                    color: dark ? "rgba(255,255,255,0.55)" : "rgba(13,5,32,0.50)",
                    textAlign: "center", maxWidth: "340px", lineHeight: 1.6,
                  }}>
                    <strong style={{ color: accent }}>{otherDayResults.count} matching session{otherDayResults.count > 1 ? "s" : ""}</strong>{" "}
                    found on Day {otherDayResults.day} ({otherDayResults.day === 1 ? "Oct 26" : "Oct 27"}).
                  </p>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveDay(otherDayResults.day)}
                    style={{
                      marginTop: "0.35rem", padding: "0.58rem 1.45rem", borderRadius: "9999px",
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em",
                      cursor: "pointer",
                      background: `${accent}20`, border: `2px solid ${accent}65`, color: accent,
                    }}>
                    SWITCH TO DAY {otherDayResults.day} →
                  </motion.button>
                </>
              ) : (
                <>
                  <p style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em",
                    color: dark ? "rgba(255,255,255,0.50)" : "rgba(13,5,32,0.42)",
                  }}>
                    No sessions match.
                  </p>
                  <button
                    onClick={() => { setSearch(""); setActivePillar(null); setActiveSector(null); }}
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.04em",
                      color: accent, textDecoration: "underline",
                      cursor: "pointer", background: "none", border: "none",
                    }}>
                    Clear all filters
                  </button>
                </>
              )}
            </div>
          ) : (
            grouped.map(([time, sessions]) => {
              const el = <TimeGroup key={time} time={time} sessions={sessions} dark={dark} base={cardIdx} />;
              cardIdx += sessions.length;
              return el;
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
