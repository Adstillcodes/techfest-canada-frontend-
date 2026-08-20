// src/data/agenda.js
// ─────────────────────────────────────────────────────────────────
// Single source of truth for the TTFC 2026 agenda.
// Imported by BOTH pages/Agenda.jsx and pages/Speakers.jsx so the
// "Show Agenda" button and the agenda's speaker links can never
// disagree about who is speaking where.
//
// Times are 24-hour "HH:MM". Duration is computed from time/endTime,
// never stored, so the two can't drift apart.
//
// speakers:     [{ name, org?, tentative? }]  — real people
// placeholders: ["Hospital CMO", ...]         — unfilled slots from the
//               planning sheet; rendered as "To be confirmed", never linked
// ─────────────────────────────────────────────────────────────────

export const DAYS = {
  1: { label: "Day 1", date: "Oct 26", longDate: "Monday, October 26, 2026" },
  2: { label: "Day 2", date: "Oct 27", longDate: "Tuesday, October 27, 2026" },
};

export const SESSIONS = [
  /* ══════════════════ DAY 1 — 26 Oct 2026 ══════════════════ */
  {
    id: "d1-01", day: 1, time: "09:00", endTime: "09:05",
    title: "Opening Remarks + Land Acknowledgement",
    type: "Opening Remarks", format: "opening", featured: true,
    speakers: [{ name: "Baldeep Singh Pahwa" }],
  },
  {
    id: "d1-02", day: 1, time: "09:05", endTime: "09:15",
    title: "Opening Ceremony",
    type: "Opening Ceremony", format: "opening", featured: true,
    // Line-up withheld until confirmed (per Lubna, 18 Aug).
    // To put names back, re-add `speakers: [...]` and/or `moderator: {...}`.
    speakers: [],
  },
  {
    id: "d1-03", day: 1, time: "09:15", endTime: "09:45",
    title: "Canada's Tech Decade — Build | Secure | Scale",
    type: "Opening Keynote", format: "keynote", featured: true,
    speakers: [{ name: "Hon. Evan Solomon" }],
    moderator: { name: "Baldeep Singh Pahwa" },
    note: "10 min keynote + 30 min fireside + 5 min Q&A",
  },
  {
    id: "d1-04", day: 1, time: "09:45", endTime: "10:15",
    title: "From Investment to Industrial Capacity: Canada's Next Ten Years",
    type: "Opening Keynote", format: "keynote", featured: true,
    speakers: [{ name: "Vic Fedeli" }],
    moderator: { name: "Dominic Miserandino" },
    note: "10 min keynote + 15 min fireside + 5 min Q&A",
  },
  {
    id: "d1-05", day: 1, time: "10:15", endTime: "10:20",
    title: "Light Years: A Decade of Building Quantum in Canada",
    type: "Opening Keynote", format: "keynote", pillar: "quantum",
    speakers: [{ name: "Christian Weedbrook" }],
  },
  {
    id: "d1-06", day: 1, time: "10:20", endTime: "10:45",
    title: "Conviction Before Consensus: A Bet on Canadian Deep Tech",
    type: "Fireside Chat", format: "fireside", pillar: "quantum",
    // Photonic names (Stephanie Simmons / Don Mattrick) withheld until confirmed.
    speakers: [{ name: "Christian Weedbrook" }],
    moderator: { name: "Shawn Abbott" },
  },
  {
    id: "d1-07", day: 1, time: "10:45", endTime: "10:55",
    title: "AM Break", type: "Break", format: "break", isBreak: true,
  },
  {
    id: "d1-08", day: 1, time: "10:55", endTime: "11:10",
    title: "AI Runs on Electricity — What Happens When the Grid Goes Dark?",
    type: "Keynote", format: "keynote", sector: "energy",
    speakers: [{ name: "Dr. Elizabeth Sherwood Randall" }],
  },
  {
    id: "d1-09", day: 1, time: "11:10", endTime: "11:40",
    title: "Canada in the New Global Order",
    type: "Fireside Chat", format: "fireside", featured: true,
    speakers: [
      { name: "Dr. Elizabeth Sherwood Randall" },
      { name: "Christy Clark" },
    ],
    moderator: { name: "Dominic Miserandino" },
  },
  {
    id: "d1-10", day: 1, time: "11:40", endTime: "12:10",
    title: "Allied by Design: Securing the Technologies That Hold the Alliance Together",
    type: "Dual Fireside", format: "fireside", sector: "public",
    speakers: [
      { name: "Brigadier General Kyle Paul" },
      { name: "Nancy Morgan" },
      { name: "Daniel Sax" },
    ],
    moderator: { name: "Dr. Chris Golden" },
  },
  {
    id: "d1-11", day: 1, time: "12:10", endTime: "12:40",
    title: "Reinventing the Intelligent Financial Institution",
    type: "Fireside Chat", format: "fireside", sector: "fintech",
    // Speaker name withheld until confirmed.
    speakers: [],
    moderator: { name: "Baldeep Singh Pahwa" },
  },
  {
    id: "d1-12", day: 1, time: "12:40", endTime: "13:10",
    title: "From Co-Pilots to Core Banking",
    type: "Panel Session", format: "panel", pillar: "ai", sector: "fintech",
    speakers: [
      { name: "Joe Greenwood", org: "Mastercard" },
      { name: "Bijit Ghosh" },
      { name: "Naresh Gunrupu" },
      { name: "Peyman Pardis", org: "Kraken" },
    ],
    moderator: { name: "April Fong" },
    note: "20 min panel + 10 min Q&A",
  },
  {
    id: "d1-13", day: 1, time: "13:10", endTime: "13:55",
    title: "Networking Lunch", type: "Lunch Break", format: "networking", isBreak: true,
  },
  {
    id: "d1-14", day: 1, time: "13:55", endTime: "14:05",
    title: "No Single Vendor Wins: A Boardroom Guide to Enterprise AI Architecture",
    type: "Keynote", format: "keynote", pillar: "ai",
    speakers: [{ name: "Thiru Venkatachalam" }],
  },
  {
    id: "d1-15", day: 1, time: "14:05", endTime: "14:35",
    title: "When Software Starts Talking to Software: MCP, Agents and the Next Wave of Enterprise Automation",
    type: "Dual Fireside", format: "fireside", pillar: "ai",
    speakers: [
      { name: "Thiru Venkatachalam" },
      { name: "Samrah Kazmi" },
      { name: "Queena Cheung" },
      { name: "Roy Pereira" },
    ],
    moderator: { name: "Yvette Schmitter" },
  },
  {
    id: "d1-16", day: 1, time: "14:35", endTime: "15:05",
    title: "Cybersecurity and Digital Trust in the Agentic Age",
    type: "Panel Session", format: "panel", pillar: "cybersecurity",
    speakers: [{ name: "Francois Guay" }, { name: "Chris Hetner" }],
    moderator: { name: "Brennan Lodge" },
    note: "25 min panel + 5 min Q&A",
  },
  {
    id: "d1-17", day: 1, time: "15:05", endTime: "15:35",
    title: "Robotics & the Physical AI Economy: Humanoids, Cobots and Warehouse Autonomy",
    type: "Panel Session", format: "panel", pillar: "robotics",
    speakers: [
      { name: "Ryan Gariepy", org: "Rockwell Automation" },
      { name: "Kulbir (Colin) Singh Dhillon", org: "ImaginQ" },
      { name: "Todd Deaville", org: "Magna" },
      { name: "Laila Burns" },
    ],
    note: "25 min panel + 5 min Q&A",
  },
  {
    id: "d1-18", day: 1, time: "15:35", endTime: "15:45",
    title: "PM Tea Break", type: "Break", format: "break", isBreak: true,
  },
  {
    id: "d1-19", day: 1, time: "15:45", endTime: "16:15",
    title: "Transition Finance, Carbon Credits and Bankability",
    type: "Dual Fireside", format: "fireside", pillar: "climate", sector: "fintech",
    speakers: [
      { name: "Na'im Merchant" },
      { name: "Ed Whittingham" },
      { name: "Dave Hochhalter" },
    ],
    placeholders: ["Canadian Bank representative"],
  },
  {
    id: "d1-20", day: 1, time: "16:45", endTime: "17:15",
    title: "Jobs, Skills, AI and the Human Contract",
    type: "Panel Session", format: "panel", pillar: "ai", featured: true,
    speakers: [
      { name: "Rob Catalano" },
      { name: "John Wilder" },
      { name: "Alyssa Daku" },
    ],
    moderator: { name: "Mariano Allegra" },
  },
  {
    id: "d1-21", day: 1, time: "17:15", endTime: "18:15",
    title: "Awards Evening", type: "Awards", format: "awards", isBreak: true, featured: true,
  },

  /* ══════════════════ DAY 2 — 27 Oct 2026 ══════════════════ */
  {
    id: "d2-01", day: 2, time: "09:00", endTime: "09:05",
    title: "Opening Remarks", type: "Opening Remarks", format: "opening", featured: true,
    speakers: [{ name: "Nicole Louis" }],
  },
  {
    id: "d2-02", day: 2, time: "09:05", endTime: "09:35",
    title: "Build in Canada, Scale to the World: an SMB Way",
    type: "Opening Keynote + Fireside Chat", format: "fireside", featured: true,
    speakers: [
      { name: "Christy Clark" },
    ],
    moderator: { name: "Alicia Pereira" },
  },
  {
    id: "d2-03", day: 2, time: "09:35", endTime: "10:05",
    title: "The Toronto Declaration on Technology, Trust and Competitiveness",
    type: "Panel Session", format: "panel", featured: true,
    speakers: [
      { name: "Kapidhwaja Singh" },
      { name: "Hiten Makim" },
      { name: "Marc Pepin" },
    ],
  },
  {
    id: "d2-04", day: 2, time: "10:05", endTime: "10:35",
    title: "The Quantum Advantage: Separating Signal from Hype",
    type: "Keynote & Fireside", format: "fireside", pillar: "quantum",
    speakers: [{ name: "Prof. Aspuru-Guzik" }],
    moderator: { name: "David Succu" },
  },
  {
    id: "d2-05", day: 2, time: "10:35", endTime: "10:45",
    title: "AM Tea Break", type: "Break", format: "break", isBreak: true,
  },
  {
    id: "d2-06", day: 2, time: "10:45", endTime: "11:15",
    title: "Quantum as Strategic Infrastructure: Can Canada Win the Compute Race?",
    type: "Panel Session", format: "panel", pillar: "quantum", featured: true,
    speakers: [
      { name: "Greg Dick" },
      { name: "Rajesh Patil" },
      { name: "Louise Davey" },
    ],
    moderator: { name: "Luke Preskey" },
  },
  {
    id: "d2-07", day: 2, time: "11:15", endTime: "11:35",
    title: "Every Phone is Now a Stethoscope",
    type: "Keynote Presentation", format: "keynote", sector: "healthcare",
    speakers: [{ name: "Mark Attila Opauszky" }],
  },
  {
    id: "d2-08", day: 2, time: "11:35", endTime: "12:20",
    title: "Clinical AI That Actually Scales",
    type: "Panel Session", format: "panel", pillar: "ai", sector: "healthcare",
    speakers: [
      { name: "Namita Seth Mohta" },
      { name: "Julia Jezmir" },
      { name: "Amy Flood" },
    ],
    placeholders: ["Hospital CMO"],
    moderator: { name: "Laura Cooley" },
  },
  {
    id: "d2-09", day: 2, time: "12:20", endTime: "12:40",
    title: "Artificial Intelligence Beyond the Pilot Phase",
    type: "Keynote + Panel", format: "keynote", pillar: "ai",
    speakers: [{ name: "Daniel Vigdor" }],
    moderator: { name: "Dr. Maha Aziz" },
  },
  {
    id: "d2-10", day: 2, time: "12:40", endTime: "13:25",
    title: "Networking Lunch", type: "Lunch Break", format: "networking", isBreak: true,
  },
  {
    id: "d2-11", day: 2, time: "13:25", endTime: "13:45",
    title: "AI Governance",
    type: "Keynote", format: "keynote", pillar: "ai",
    speakers: [{ name: "Ashley Casovan" }],
  },
  {
    id: "d2-12", day: 2, time: "13:45", endTime: "14:30",
    title: "The Regulator's View on Enterprise AI in Canadian Finance",
    type: "Panel Session", format: "panel", pillar: "ai", sector: "fintech",
    speakers: [
      { name: "Peter Routledge" },
      { name: "Tania Narciso", org: "Kraken" },
      { name: "Fatemah Pirone", org: "Interac" },
      { name: "Vance Lockton" },
    ],
    moderator: { name: "April Fong", org: "Globe and Mail" },
  },
  {
    id: "d2-13", day: 2, time: "14:30", endTime: "15:00",
    title: "Risk Pricing and the Hype Gap",
    type: "Panel Session", format: "panel", pillar: "quantum", sector: "fintech",
    speakers: [
      { name: "Chetan Patel" },
      { name: "David Succu" },
      { name: "Heling (Alex) Pu" },
    ],
    placeholders: ["Quantum banking specialist"],
    moderator: { name: "Louise Davey" },
  },
  {
    id: "d2-14", day: 2, time: "15:00", endTime: "15:30",
    title: "AI in Financial Services: From Main Street Lending to Wall Street Trading",
    type: "Panel Session", format: "panel", pillar: "ai", sector: "fintech",
    speakers: [
      { name: "Sankar Krishnan" },
    ],
    placeholders: ["Speaker to be confirmed"],
  },
  {
    id: "d2-15", day: 2, time: "15:30", endTime: "15:40",
    title: "PM Tea Break", type: "Break", format: "break", isBreak: true,
  },
  {
    id: "d2-16", day: 2, time: "15:40", endTime: "16:10",
    title: "Closing the Women's Health Gap: Innovation, Investment and the Blueprint for Action",
    type: "Panel Session", format: "panel", sector: "healthcare",
    speakers: [{ name: "Amy Flood" }],
    placeholders: ["FemTech representative", "MaRS Discovery District representative"],
  },
  {
    id: "d2-17", day: 2, time: "16:10", endTime: "16:40",
    title: "Powering Canada's Digital and Industrial Future: Grid Intelligence, Asset Optimization and Resilience",
    type: "Panel Session", format: "panel", sector: "energy",
    speakers: [{ name: "Delphine Adenot" }],
    moderator: { name: "April Fong", org: "Globe and Mail", tentative: true },
  },
  {
    id: "d2-18", day: 2, time: "16:40", endTime: "17:10",
    title: "Capital Lifecycle: Raise | Scale | Exit",
    type: "Panel Session", format: "panel", sector: "startups",
    speakers: [
      { name: "Rebecca Griffith" },
      { name: "Argentina Beltran" },
      { name: "Jasmin Ganie-Hobbs" },
    ],
    moderator: { name: "Mathew Growden" },
  },
  {
    id: "d2-19", day: 2, time: "17:10", endTime: "17:40",
    title: "Arctic Readiness, Wildfire Response, and Resilient Infrastructure with Drones & Remote Ops",
    type: "Panel Session", format: "panel", pillar: "climate", sector: "public",
    speakers: [
      { name: "Genevieve Decambra" },
      { name: "Akash Rastogi" },
    ],
  },
  {
    id: "d2-20", day: 2, time: "17:40", endTime: "18:10",
    title: "Securing Connected Devices: From Factory Floor to Fleet",
    type: "Panel Session", format: "panel", pillar: "cybersecurity", sector: "manufacturing",
    speakers: [
      { name: "Vineet Saxena" },
      { name: "Vince Cifani" },
    ],
  },
  {
    id: "d2-21", day: 2, time: "18:10", endTime: "19:40",
    title: "Gala Dinner and Networking Reception",
    type: "Gala", format: "awards", isBreak: true, featured: true,
  },
];

/* ─────────────────────────────────────────────────────────────────
   NAME MATCHING
   The planning sheet and Sanity won't always spell a name the same
   way ("Vic Fedeli" / "Vic Fedelli", "Dr Christian Weedbrook" /
   "Christian Weedbrook"). We normalise both sides and generate a few
   equivalent keys so a photo/link is still found.

   Add an entry to NAME_ALIASES whenever a genuine mismatch appears:
   key = the (normalised) spelling used in the agenda,
   value = the (normalised) spelling used in Sanity.
   ───────────────────────────────────────────────────────────────── */

export const NAME_ALIASES = {
  "vic fedelli": "vic fedeli",
  "geneievve decambra": "genevieve decambra",
  "dave hochhalte": "dave hochhalter",
  "aspuru guzik": "alan aspuru guzik",
  "prof aspuru guzik": "alan aspuru guzik",
  "mathew growdy growden": "mathew growden",
};

const TITLES = [
  "the honourable", "brigadier general", "brig gen", "major general",
  "professor", "prof", "doctor", "dr", "hon", "mr", "mrs", "ms", "miss", "sir", "general",
];

export function normalizeName(raw) {
  let n = String(raw || "")
    .replace(/\(.*?\)/g, " ")        // drop "(Mastercard)", "(Alex)"
    .toLowerCase()
    .replace(/[’‘']/g, "")           // Na'im -> naim
    .replace(/[^a-z\s-]/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // strip any stacked honorifics from the front
  let changed = true;
  while (changed) {
    changed = false;
    for (const t of TITLES) {
      if (n === t) return "";
      if (n.startsWith(t + " ")) { n = n.slice(t.length + 1); changed = true; }
    }
  }
  return n.trim();
}

/** Equivalent lookup keys for one name. */
export function nameKeys(raw) {
  let n = normalizeName(raw);
  if (NAME_ALIASES[n]) n = normalizeName(NAME_ALIASES[n]);
  if (!n) return [];

  const parts = n.split(" ").filter(Boolean);
  const keys = new Set([n]);

  if (parts.length >= 2) {
    const first = parts[0];
    const last = parts[parts.length - 1];
    keys.add(first + " " + last);            // drop middle names
    keys.add(parts[0] + " " + parts[1]);     // "baldeep singh pahwa" ~ "baldeep singh"
    keys.add(last + " " + first[0]);         // "pahwa b"
  }
  return Array.from(keys);
}

export function slugifyName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Build { key -> sanitySpeakerDoc } from a Sanity speaker list. */
export function buildSpeakerIndex(speakerDocs) {
  const index = {};
  (speakerDocs || []).forEach((doc) => {
    nameKeys(doc.name).forEach((k) => {
      if (!index[k]) index[k] = doc;      // first writer wins — keeps it stable
    });
  });
  return index;
}

/** Find the Sanity doc for an agenda name, or null. */
export function matchSpeaker(index, name) {
  if (!index) return null;
  const keys = nameKeys(name);
  for (const k of keys) if (index[k]) return index[k];
  return null;
}

/** Every session a given person appears in (as speaker OR moderator). */
export function sessionsForSpeaker(name) {
  const keys = new Set(nameKeys(name));
  if (!keys.size) return [];
  return SESSIONS.filter((s) => {
    const people = (s.speakers || []).concat(s.moderator ? [s.moderator] : []);
    return people.some((p) => nameKeys(p.name).some((k) => keys.has(k)));
  });
}

/** Role of a person within one session: "speaker" | "moderator" | null */
export function roleInSession(session, name) {
  const keys = new Set(nameKeys(name));
  const isMatch = (p) => p && nameKeys(p.name).some((k) => keys.has(k));
  if ((session.speakers || []).some(isMatch)) return "speaker";
  if (isMatch(session.moderator)) return "moderator";
  return null;
}

export function getDuration(start, end) {
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

/** "14:05" -> "2:05 PM" */
export function formatTime12(t) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${suffix}`;
}
