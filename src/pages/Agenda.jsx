import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Calendar, Clock, MapPin, Users, Search, X, ChevronDown,
  Sparkles, Zap, Shield, Cpu, Leaf, Filter, Lock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Protection: disable right-click + text selection ────────────
const useProtection = () => {
  useEffect(() => {
    const noCtx = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", noCtx);
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    return () => {
      document.removeEventListener("contextmenu", noCtx);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, []);
};

// ─── Watermark overlay ───────────────────────────────────────────
function Watermark({ dark }: { dark: boolean }) {
  const now = new Date().toLocaleString("en-CA", { timeZone: "America/Toronto", hour12: false });
  const text = `CONFIDENTIAL · TTFC 2026 · INTERNAL USE ONLY · ${now} EDT`;
  const color = dark ? "rgba(185,158,255,0.055)" : "rgba(122,63,209,0.045)";
  return (
    <div
      aria-hidden
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        pointerEvents: "none", overflow: "hidden",
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${(i % 4) * 26 + 4}%`,
            left: `${Math.floor(i / 4) * 36 - 5}%`,
            transform: "rotate(-28deg)",
            whiteSpace: "nowrap",
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color,
            userSelect: "none",
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}

// ─── Tech Pillars ────────────────────────────────────────────────
const PILLAR_MAP = {
  ai:           { label: "AI / ML",        icon: Sparkles, color: "#b99eff", light: "#7a3fd1" },
  quantum:      { label: "Quantum",         icon: Zap,      color: "#56b3f5", light: "#1878c2" },
  cybersecurity:{ label: "Cybersecurity",   icon: Shield,   color: "#f57eb3", light: "#c2287a" },
  robotics:     { label: "Robotics",        icon: Cpu,      color: "#f5a623", light: "#c4780a" },
  climate:      { label: "Climate Tech",    icon: Leaf,     color: "#3fd19c", light: "#1a9e70" },
} as const;

// ─── Sectors ─────────────────────────────────────────────────────
const SECTOR_MAP = {
  fintech:       { label: "Financial Services",    short: "FIN" },
  healthcare:    { label: "Healthcare & Life Sci", short: "HLT" },
  energy:        { label: "Energy & Infrastructure",short: "ENR" },
  manufacturing: { label: "Manufacturing & Supply",  short: "MFG" },
  public:        { label: "Public Sector & Defence",short: "PUB" },
} as const;

// ─── Session Formats ─────────────────────────────────────────────
const FORMAT_MAP = {
  networking:   { label: "Networking",            bg: "#3fd19c22", bgL: "#1a9e7022", tc: "#3fd19c", tcL: "#1a9e70" },
  keynote:      { label: "Keynote",               bg: "#b99eff22", bgL: "#7a3fd122", tc: "#b99eff", tcL: "#7a3fd1" },
  fireside:     { label: "Fireside",              bg: "#f5a62322", bgL: "#c4780a22", tc: "#f5a623", tcL: "#c4780a" },
  briefing:     { label: "Boardroom Briefing",    bg: "#56b3f522", bgL: "#1878c222", tc: "#56b3f5", tcL: "#1878c2" },
  panel:        { label: "Panel / Debate",        bg: "#f57eb322", bgL: "#c2287a22", tc: "#f57eb3", tcL: "#c2287a" },
  provocation:  { label: "Provocation",           bg: "#f5a62322", bgL: "#c4780a22", tc: "#f5a623", tcL: "#c4780a" },
  break:        { label: "Break",                 bg: "#88888818", bgL: "#88888818", tc: "#999",    tcL: "#666" },
  awards:       { label: "Awards / Gala",         bg: "#f5c84222", bgL: "#d4970022", tc: "#f5c842", tcL: "#d49700" },
  opening:      { label: "Opening",               bg: "#b99eff22", bgL: "#7a3fd122", tc: "#b99eff", tcL: "#7a3fd1" },
  dialogue:     { label: "Leadership Dialogue",   bg: "#56b3f522", bgL: "#1878c222", tc: "#56b3f5", tcL: "#1878c2" },
  closing:      { label: "Closing",               bg: "#b99eff22", bgL: "#7a3fd122", tc: "#b99eff", tcL: "#7a3fd1" },
} as const;

// ─── Data Types ───────────────────────────────────────────────────
interface Session {
  id: string;
  day: 1 | 2;
  time: string;
  endTime: string;
  title: string;
  format: keyof typeof FORMAT_MAP;
  pillar?: keyof typeof PILLAR_MAP;
  sector?: keyof typeof SECTOR_MAP;
  featured?: boolean;
  isBreak?: boolean;
}

// ─── Full Session Data ────────────────────────────────────────────
const SESSIONS: Session[] = [
  // ── DAY 1 ──
  { id:"d1-1",  day:1, time:"08:00", endTime:"09:00", title:"Registration, Networking Breakfast & Expo Preview",                                         format:"networking", isBreak:true },
  { id:"d1-2",  day:1, time:"09:00", endTime:"09:15", title:"Opening Ceremony: Welcome to The Tech Festival Canada",                                      format:"opening", featured:true },
  { id:"d1-3",  day:1, time:"09:15", endTime:"09:40", title:"Opening Keynote: Canada's Tech Decade — Build, Secure, Scale",                               format:"keynote", featured:true },
  { id:"d1-4",  day:1, time:"09:40", endTime:"10:15", title:"Canada in the New Global Order",                                                             format:"fireside", featured:true },
  { id:"d1-5",  day:1, time:"10:15", endTime:"10:30", title:"Artificial Intelligence Beyond the Pilot Phase",                                             format:"keynote", pillar:"ai" },
  { id:"d1-6",  day:1, time:"10:30", endTime:"10:45", title:"Quantum as Strategic Infrastructure",                                                        format:"keynote", pillar:"quantum" },
  { id:"d1-7",  day:1, time:"10:45", endTime:"11:00", title:"Cybersecurity and Digital Trust in the Agentic Age",                                         format:"keynote", pillar:"cybersecurity" },
  { id:"d1-8",  day:1, time:"11:00", endTime:"11:15", title:"Robotics and the Physical AI Economy",                                                       format:"keynote", pillar:"robotics" },
  { id:"d1-9",  day:1, time:"11:15", endTime:"11:30", title:"Climate Tech as Competitiveness Strategy",                                                   format:"keynote", pillar:"climate" },
  { id:"d1-10", day:1, time:"11:30", endTime:"11:45", title:"Networking Break",                                                                           format:"break", isBreak:true },
  { id:"d1-11", day:1, time:"11:45", endTime:"12:00", title:"Reinventing the Intelligent Financial Institution",                                          format:"keynote", sector:"fintech" },
  { id:"d1-12", day:1, time:"12:00", endTime:"12:22", title:"AI × Financial Services: From Copilots to Core Banking",                                     format:"briefing", pillar:"ai", sector:"fintech" },
  { id:"d1-13", day:1, time:"12:22", endTime:"12:44", title:"Quantum × Financial Services: Risk, Pricing and the Hype Gap",                               format:"fireside", pillar:"quantum", sector:"fintech" },
  { id:"d1-14", day:1, time:"12:44", endTime:"13:06", title:"Cybersecurity × Financial Services: Fraud, Identity and Deepfake Resilience",                format:"briefing", pillar:"cybersecurity", sector:"fintech" },
  { id:"d1-15", day:1, time:"13:06", endTime:"13:28", title:"Robotics × Financial Services: Automation Beyond the Screen",                                format:"provocation", pillar:"robotics", sector:"fintech" },
  { id:"d1-16", day:1, time:"13:28", endTime:"13:50", title:"Climate Tech × Financial Services: Transition Finance, Carbon Markets and Bankability",       format:"fireside", pillar:"climate", sector:"fintech" },
  { id:"d1-17", day:1, time:"13:50", endTime:"14:40", title:"Networking Lunch",                                                                           format:"networking", isBreak:true },
  { id:"d1-18", day:1, time:"14:40", endTime:"14:55", title:"The Digitally Resilient Health System",                                                      format:"keynote", sector:"healthcare" },
  { id:"d1-19", day:1, time:"14:55", endTime:"15:17", title:"AI × Healthcare: Clinical AI That Actually Scales",                                          format:"briefing", pillar:"ai", sector:"healthcare" },
  { id:"d1-20", day:1, time:"15:17", endTime:"15:39", title:"Quantum × Healthcare: Drug Discovery, Biology and Commercial Timelines",                      format:"fireside", pillar:"quantum", sector:"healthcare" },
  { id:"d1-21", day:1, time:"15:39", endTime:"16:01", title:"Cybersecurity × Healthcare: Securing Hospitals in an AI First Era",                          format:"briefing", pillar:"cybersecurity", sector:"healthcare" },
  { id:"d1-22", day:1, time:"16:01", endTime:"16:23", title:"Robotics × Healthcare: Surgical, Lab and Eldercare Automation",                              format:"provocation", pillar:"robotics", sector:"healthcare" },
  { id:"d1-23", day:1, time:"16:23", endTime:"16:45", title:"Climate Tech × Healthcare: Climate Resilient Care Systems",                                  format:"fireside", pillar:"climate", sector:"healthcare" },
  { id:"d1-24", day:1, time:"16:45", endTime:"17:00", title:"Networking Break",                                                                           format:"break", isBreak:true },
  { id:"d1-25", day:1, time:"17:00", endTime:"17:35", title:"Jobs, AI and the Human Contract",                                                            format:"panel", featured:true },
  { id:"d1-26", day:1, time:"17:35", endTime:"18:05", title:"Canada, the US and the New North American Technology Bargain",                                format:"fireside", featured:true },
  { id:"d1-27", day:1, time:"18:30", endTime:"20:30", title:"Awards Night: Canada's Tech Titans",                                                         format:"awards", isBreak:true, featured:true },

  // ── DAY 2 ──
  { id:"d2-1",  day:2, time:"08:30", endTime:"09:00", title:"Coffee Networking and Media Check-In",                                                       format:"networking", isBreak:true },
  { id:"d2-2",  day:2, time:"09:00", endTime:"09:20", title:"Day 2 Opening Address: From Vision to Execution",                                            format:"opening", featured:true },
  { id:"d2-3",  day:2, time:"09:20", endTime:"09:50", title:"Build in Canada, Scale to the World",                                                        format:"dialogue", featured:true },
  { id:"d2-4",  day:2, time:"09:50", endTime:"10:05", title:"Powering Canada's Digital and Industrial Future",                                            format:"keynote", sector:"energy" },
  { id:"d2-5",  day:2, time:"10:05", endTime:"10:27", title:"AI × Energy & Infrastructure: Grid Intelligence, Asset Optimization and Resilience",          format:"briefing", pillar:"ai", sector:"energy" },
  { id:"d2-6",  day:2, time:"10:27", endTime:"10:49", title:"Quantum × Energy & Infrastructure: Materials, Storage and Grid Optimization",                 format:"fireside", pillar:"quantum", sector:"energy" },
  { id:"d2-7",  day:2, time:"10:49", endTime:"11:11", title:"Cybersecurity × Energy & Infrastructure: Protecting Critical Systems from Disruption",        format:"briefing", pillar:"cybersecurity", sector:"energy" },
  { id:"d2-8",  day:2, time:"11:11", endTime:"11:33", title:"Robotics × Energy & Infrastructure: Drones, Inspection and Remote Operations",                format:"provocation", pillar:"robotics", sector:"energy" },
  { id:"d2-9",  day:2, time:"11:33", endTime:"11:55", title:"Climate Tech × Energy & Infrastructure: Canada's Grid, Storage and Electrification Challenge",format:"briefing", pillar:"climate", sector:"energy" },
  { id:"d2-10", day:2, time:"11:55", endTime:"12:10", title:"Networking Break",                                                                           format:"break", isBreak:true },
  { id:"d2-11", day:2, time:"12:10", endTime:"12:25", title:"Rebuilding Industrial Competitiveness",                                                      format:"keynote", sector:"manufacturing" },
  { id:"d2-12", day:2, time:"12:25", endTime:"12:47", title:"AI × Manufacturing & Mobility: Agentic Operations Across the Supply Chain",                   format:"briefing", pillar:"ai", sector:"manufacturing" },
  { id:"d2-13", day:2, time:"12:47", endTime:"13:09", title:"Quantum × Manufacturing & Mobility: New Materials, Optimization and Industrial Advantage",     format:"fireside", pillar:"quantum", sector:"manufacturing" },
  { id:"d2-14", day:2, time:"13:09", endTime:"13:31", title:"Cybersecurity × Manufacturing & Mobility: Securing the Connected Factory and Autonomous Systems", format:"briefing", pillar:"cybersecurity", sector:"manufacturing" },
  { id:"d2-15", day:2, time:"13:31", endTime:"13:53", title:"Robotics × Manufacturing & Mobility: Humanoids, Cobots and Warehouse Autonomy",               format:"provocation", pillar:"robotics", sector:"manufacturing" },
  { id:"d2-16", day:2, time:"13:53", endTime:"14:15", title:"Climate Tech × Manufacturing & Mobility: Low Carbon Industry and Resilient Production",        format:"fireside", pillar:"climate", sector:"manufacturing" },
  { id:"d2-17", day:2, time:"14:15", endTime:"15:00", title:"Networking Lunch",                                                                           format:"networking", isBreak:true },
  { id:"d2-18", day:2, time:"15:00", endTime:"15:15", title:"Technology, Trust and National Capacity",                                                    format:"keynote", sector:"public" },
  { id:"d2-19", day:2, time:"15:15", endTime:"15:37", title:"AI × Public Sector & Defence: Trusted AI for Service Delivery and Readiness",                 format:"briefing", pillar:"ai", sector:"public" },
  { id:"d2-20", day:2, time:"15:37", endTime:"15:59", title:"Quantum × Public Sector & Defence: Strategic Advantage in Sensing and Secure Communications",  format:"fireside", pillar:"quantum", sector:"public" },
  { id:"d2-21", day:2, time:"15:59", endTime:"16:21", title:"Cybersecurity × Public Sector & Defence: Zero Trust Government and Digital Sovereignty",       format:"briefing", pillar:"cybersecurity", sector:"public" },
  { id:"d2-22", day:2, time:"16:21", endTime:"16:43", title:"Robotics × Public Sector & Defence: Dual Use Systems for Border Security and Emergency Response", format:"provocation", pillar:"robotics", sector:"public" },
  { id:"d2-23", day:2, time:"16:43", endTime:"17:05", title:"Climate Tech × Public Sector & Defence: Arctic Readiness, Wildfire Response and Resilient Infrastructure", format:"briefing", pillar:"climate", sector:"public" },
  { id:"d2-24", day:2, time:"17:05", endTime:"17:35", title:"Can Canada Win the Compute Race?",                                                           format:"panel", featured:true },
  { id:"d2-25", day:2, time:"17:35", endTime:"18:05", title:"The Toronto Declaration on Technology, Trust and Competitiveness",                           format:"closing", featured:true },
  { id:"d2-26", day:2, time:"18:30", endTime:"21:00", title:"Gala Dinner and Networking Reception",                                                      format:"awards", isBreak:true, featured:true },
];

function fmt(t: string) { return t; }

function duration(start: string, end: string) {
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

// ─── Session Card ─────────────────────────────────────────────────
function SessionCard({ s, dark, i }: { s: Session; dark: boolean; i: number }) {
  const [expanded, setExpanded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const fmt_info = FORMAT_MAP[s.format];
  const pillar = s.pillar ? PILLAR_MAP[s.pillar] : null;
  const sector = s.sector ? SECTOR_MAP[s.sector] : null;
  const accent = pillar ? (dark ? pillar.color : pillar.light) : (dark ? "#b99eff" : "#7a3fd1");
  const PillarIcon = pillar?.icon;

  const isBreak = s.isBreak;
  const dur = duration(s.time, s.endTime);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.03, type: "spring", damping: 24 }}
      // Blur protection — reveal on hover/click
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => !expanded && setRevealed(false)}
      onClick={() => {
        setRevealed(true);
        if (!isBreak) setExpanded(v => !v);
      }}
      style={{
        position: "relative",
        borderRadius: "10px",
        overflow: "hidden",
        cursor: isBreak ? "default" : "pointer",
        filter: revealed || expanded ? "none" : "blur(3px)",
        transition: "filter 0.25s ease",
        background: isBreak
          ? dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)"
          : dark ? "rgba(255,255,255,0.035)" : "#fff",
        border: dark
          ? `1px solid rgba(255,255,255,${isBreak ? "0.04" : "0.09"})`
          : `1px solid rgba(0,0,0,${isBreak ? "0.04" : "0.07"})`,
        boxShadow: !isBreak && !dark ? "0 1px 6px rgba(0,0,0,0.05)" : "none",
      }}
    >
      {/* Blur hint icon */}
      {!revealed && !expanded && !isBreak && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2,
          pointerEvents: "none",
        }}>
          <Lock size={16} style={{ opacity: 0.3, color: dark ? "#fff" : "#000" }} />
        </div>
      )}

      {/* Left accent */}
      {!isBreak && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
          background: accent, borderRadius: "10px 0 0 10px",
        }} />
      )}

      <div style={{ padding: isBreak ? "0.85rem 1.1rem" : "1rem 1.3rem 1rem 1.5rem" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Badges */}
            {!isBreak && (
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.25rem",
                  padding: "0.18rem 0.55rem", borderRadius: "4px",
                  fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  background: dark ? fmt_info.bg : fmt_info.bgL,
                  color: dark ? fmt_info.tc : fmt_info.tcL,
                }}>
                  {fmt_info.label}
                </span>
                {s.featured && (
                  <span style={{
                    padding: "0.18rem 0.55rem", borderRadius: "4px",
                    fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    background: `linear-gradient(90deg,${dark?"#b99eff":"#7a3fd1"}20,#f5a62320)`,
                    color: dark ? "#b99eff" : "#7a3fd1",
                    border: `1px solid ${dark?"#b99eff":"#7a3fd1"}33`,
                  }}>✦ Featured</span>
                )}
                {pillar && PillarIcon && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.25rem",
                    padding: "0.18rem 0.55rem", borderRadius: "4px",
                    fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.05em",
                    background: `${accent}18`, color: accent,
                    border: `1px solid ${accent}30`,
                  }}>
                    <PillarIcon size={10} />
                    {pillar.label}
                  </span>
                )}
                {sector && (
                  <span style={{
                    padding: "0.18rem 0.55rem", borderRadius: "4px",
                    fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.05em",
                    background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
                    color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)",
                  }}>
                    {sector.short}
                  </span>
                )}
              </div>
            )}

            <p style={{
              fontWeight: isBreak ? 400 : 650,
              fontSize: isBreak ? "0.85rem" : "0.98rem",
              lineHeight: 1.4,
              opacity: isBreak ? 0.45 : 1,
            }}>
              {s.title}
            </p>

            {!isBreak && (
              <p style={{ fontSize: "0.75rem", opacity: 0.38, marginTop: "0.4rem" }}>
                Speaker: To Be Decided
              </p>
            )}
          </div>

          {/* Time */}
          <div className="flex flex-col items-end gap-0.5 shrink-0">
            <span style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: "0.88rem", fontWeight: 700,
              color: isBreak ? (dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)") : accent,
            }}>
              {s.time}
            </span>
            <span style={{ fontSize: "0.68rem", opacity: 0.32 }}>{dur}</span>
            {!isBreak && (
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{ opacity: 0.35, marginTop: "0.2rem" }}
              >
                <ChevronDown size={14} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Expanded */}
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
                paddingTop: "0.9rem", marginTop: "0.9rem",
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
              }}>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <p style={{ fontSize: "0.65rem", opacity: 0.35, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Time</p>
                    <p style={{ fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Clock size={12} style={{ opacity: 0.5 }} />
                      {s.time} – {s.endTime} · {dur}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.65rem", opacity: 0.35, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Speaker</p>
                    <p style={{ fontSize: "0.82rem", opacity: 0.65 }}>To Be Decided</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.65rem", opacity: 0.35, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Format</p>
                    <p style={{ fontSize: "0.82rem", color: dark ? fmt_info.tc : fmt_info.tcL, fontWeight: 600 }}>{fmt_info.label}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Timeline group ───────────────────────────────────────────────
function TimeGroup({ time, sessions, dark, base }: { time: string; sessions: Session[]; dark: boolean; base: number }) {
  return (
    <div className="flex gap-4 md:gap-5">
      <div className="flex flex-col items-end shrink-0 pt-4" style={{ width: "48px" }}>
        <span style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: "0.7rem", fontWeight: 700,
          color: dark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)", letterSpacing: "0.02em",
        }}>{time}</span>
      </div>
      <div className="flex flex-col items-center shrink-0 pt-4">
        <div style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: dark ? "rgba(185,158,255,0.5)" : "rgba(122,63,209,0.4)", flexShrink: 0,
        }} />
        <div style={{
          flex: 1, width: "1px", marginTop: "5px",
          background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        }} />
      </div>
      <div className="flex-1 pb-3 space-y-2 pt-2.5">
        {sessions.map((s, i) => <SessionCard key={s.id} s={s} dark={dark} i={base + i} />)}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function AgendaPage() {
  useProtection();

  const [dark, setDark] = useState(false);
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [search, setSearch] = useState("");
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [activeSector, setActiveSector] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setDark(document.body.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const bg = dark ? "#06020f" : "#f8f7fc";
  const text = dark ? "#ffffff" : "#0d0520";
  const accent = dark ? "#b99eff" : "#7a3fd1";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const filtered = useMemo(() => {
    return SESSIONS.filter(s => {
      if (s.day !== activeDay) return false;
      const q = search.toLowerCase();
      if (q && !s.title.toLowerCase().includes(q)) return false;
      if (activePillar && s.pillar !== activePillar) return false;
      if (activeSector && s.sector !== activeSector) return false;
      return true;
    });
  }, [activeDay, search, activePillar, activeSector]);

  const grouped = useMemo(() => {
    const map = new Map<string, Session[]>();
    filtered.forEach(s => {
      if (!map.has(s.time)) map.set(s.time, []);
      map.get(s.time)!.push(s);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const day1Count = SESSIONS.filter(s => s.day === 1 && !s.isBreak).length;
  const day2Count = SESSIONS.filter(s => s.day === 2 && !s.isBreak).length;

  let cardIdx = 0;

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text, overflowX: "hidden", userSelect: "none" }}>
      <Watermark dark={dark} />
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        paddingTop: "5.5rem", paddingBottom: "2.5rem",
        background: dark
          ? "linear-gradient(180deg,#0d0820 0%,#06020f 100%)"
          : "linear-gradient(180deg,#f3eeff 0%,#f8f7fc 100%)",
        borderBottom: `1px solid ${border}`,
      }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 22 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.45rem",
                padding: "0.32rem 0.85rem", borderRadius: "9999px",
                background: `${accent}18`, border: `1px solid ${accent}28`,
                fontSize: "0.74rem", fontWeight: 700, color: accent,
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                <Lock size={11} />
                Confidential — Internal Use Only
              </span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.45rem",
                padding: "0.32rem 0.85rem", borderRadius: "9999px",
                background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${border}`,
                fontSize: "0.74rem", fontWeight: 600, opacity: 0.6,
                letterSpacing: "0.04em",
              }}>
                <Calendar size={11} />
                June 14–15, 2026 · Toronto, Canada
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2rem,5.5vw,3.6rem)",
              fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: "0.9rem",
            }}>
              TTFC 2026{" "}
              <span style={{
                background: `linear-gradient(135deg,${accent},#f5a623)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Agenda
              </span>
            </h1>

            <p style={{ fontSize: "0.95rem", opacity: 0.55, maxWidth: "520px", lineHeight: 1.7, marginBottom: "1.8rem" }}>
              Two full days across five technology pillars and five applied sectors. All sessions subject to change. Speakers to be confirmed.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {[
                { v: "2", l: "Days" },
                { v: "53", l: "Sessions" },
                { v: "5", l: "Tech Pillars" },
                { v: "5", l: "Sectors" },
                { v: "500+", l: "Attendees" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, type: "spring", damping: 20 }}
                  className="flex flex-col items-center"
                >
                  <span style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 900,
                    background: `linear-gradient(135deg,${accent},#f5a623)`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>{s.v}</span>
                  <span style={{ fontSize: "0.72rem", opacity: 0.45, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.15rem" }}>{s.l}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY BAR ── */}
      <div style={{
        position: "sticky", top: "64px", zIndex: 40,
        background: dark ? "rgba(6,2,15,0.97)" : "rgba(248,247,252,0.97)",
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${border}`,
        padding: "0.75rem 0",
      }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center gap-2">

            {/* Day tabs */}
            <div className="flex gap-1 mr-1">
              {([1,2] as const).map(d => (
                <motion.button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "0.4rem 1rem", borderRadius: "8px",
                    fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
                    background: activeDay === d ? `${accent}22` : "transparent",
                    border: `1.5px solid ${activeDay === d ? accent : dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    color: activeDay === d ? accent : dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
                    transition: "all 0.15s",
                  }}
                >
                  Day {d}
                  <span style={{ marginLeft: "0.4rem", opacity: 0.5, fontSize: "0.7rem" }}>
                    {d === 1 ? "Jun 14" : "Jun 15"}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ width: "1px", height: "24px", background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", margin: "0 2px" }} />

            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.45rem",
              padding: "0.38rem 0.8rem", borderRadius: "9999px",
              background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              flex: "1 1 160px", maxWidth: "240px",
            }}>
              <Search size={12} style={{ opacity: 0.4, flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search sessions…"
                style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.8rem", color: text, width: "100%" }}
              />
              {search && <button onClick={() => setSearch("")} style={{ opacity: 0.4, lineHeight: 0 }}><X size={12} /></button>}
            </div>

            {/* Pillar filters */}
            <div className="hidden sm:flex items-center gap-1 flex-wrap">
              {(Object.entries(PILLAR_MAP) as any[]).map(([pid, p]: any) => {
                const c = dark ? p.color : p.light;
                const active = activePillar === pid;
                const Icon = p.icon;
                return (
                  <motion.button
                    key={pid} whileTap={{ scale: 0.96 }}
                    onClick={() => setActivePillar(prev => prev === pid ? null : pid)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.3rem",
                      padding: "0.35rem 0.75rem", borderRadius: "9999px",
                      fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                      border: `1.5px solid ${active ? c : dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      background: active ? `${c}20` : "transparent",
                      color: active ? c : dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
                      transition: "all 0.15s",
                    }}
                  >
                    <Icon size={11} />{p.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Sector filters */}
            <div className="hidden md:flex items-center gap-1 ml-auto flex-wrap">
              {(Object.entries(SECTOR_MAP) as any[]).map(([sid, sec]: any) => {
                const active = activeSector === sid;
                return (
                  <motion.button
                    key={sid} whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveSector(prev => prev === sid ? null : sid)}
                    style={{
                      padding: "0.28rem 0.6rem", borderRadius: "4px",
                      fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em",
                      textTransform: "uppercase", cursor: "pointer",
                      border: `1.5px solid ${active ? accent : dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      background: active ? `${accent}18` : "transparent",
                      color: active ? accent : dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.38)",
                      transition: "all 0.15s",
                    }}
                  >
                    {sec.short}
                  </motion.button>
                );
              })}
            </div>

            {/* Clear */}
            <AnimatePresence>
              {(activePillar || activeSector || search) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => { setActivePillar(null); setActiveSector(null); setSearch(""); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                    padding: "0.38rem 0.75rem", borderRadius: "9999px",
                    fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                    border: `1.5px solid ${dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.14)"}`,
                    background: "transparent", color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)",
                  }}
                >
                  <X size={11} /> Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── SCHEDULE ── */}
      <main style={{ padding: "2.5rem 0 6rem" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          {/* Count + hint */}
          <div className="flex items-center justify-between mb-5">
            <p style={{ fontSize: "0.75rem", opacity: 0.38 }}>
              {filtered.length} sessions · Day {activeDay} — {activeDay === 1 ? "June 14" : "June 15"}, 2026
            </p>
            <span style={{ fontSize: "0.72rem", opacity: 0.3, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Lock size={11} /> Hover to reveal
            </span>
          </div>

          {grouped.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3" style={{ opacity: 0.4 }}>
              <Search size={28} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: "0.9rem" }}>No sessions match your filters.</p>
              <button
                onClick={() => { setSearch(""); setActivePillar(null); setActiveSector(null); }}
                style={{ fontSize: "0.8rem", color: accent, textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}
              >
                Clear filters
              </button>
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

      {/* ── PILLAR LEGEND ── */}
      <section style={{
        borderTop: `1px solid ${border}`, padding: "2.5rem 0",
        background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
      }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <p style={{ fontSize: "0.68rem", opacity: 0.35, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            Technology Pillars
          </p>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(PILLAR_MAP) as any[]).map(([pid, p]: any) => {
              const c = dark ? p.color : p.light;
              const Icon = p.icon;
              return (
                <div key={pid} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.55rem 1rem", borderRadius: "10px",
                  background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                  border: `1px solid ${c}25`,
                  boxShadow: dark ? "none" : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "7px",
                    background: `${c}18`, display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${c}28`,
                  }}>
                    <Icon size={14} style={{ color: c }} />
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: c }}>{p.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
