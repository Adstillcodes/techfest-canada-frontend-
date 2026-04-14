import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API } from "../utils/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      style={{ color: "#f5a623", flexShrink: 0, marginTop: 2 }}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ─── Price display ────────────────────────────────────────────────────────────
function PriceWithAsterisk({ price, color, fontSize, fontWeight, style }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "baseline", gap: 2, ...(style || {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: fontSize || "2.6rem", fontWeight: fontWeight || 900, color: color || "inherit", lineHeight: 1, letterSpacing: "-1px" }}>${typeof price === "number" ? price.toLocaleString() : price}</span>
      <span style={{ color: "#f5a623", fontSize: "0.6em", fontWeight: 900, cursor: "help", lineHeight: 1 }}>*</span>
      {hovered && (
        <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.88)", color: "#fff", fontSize: "0.68rem", fontFamily: "'Orbitron',sans-serif", fontWeight: 700, letterSpacing: "0.5px", padding: "8px 14px", borderRadius: 10, whiteSpace: "nowrap", zIndex: 999, pointerEvents: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
          Price subject to change
        </span>
      )}
    </span>
  );
}

// ─── Form data ────────────────────────────────────────────────────────────────
const SALUTATIONS = ["Mr.", "Mrs.", "Ms.", "Dr.", "H.E.", "Hon.", "Prof."];
const JOB_LEVELS = ["Student", "Entry Level", "Mid Level Professional", "Manager", "Senior Manager", "Director", "Vice President", "C-Level / Executive", "Founder / Owner / Partner", "Government / Public Sector", "Investor", "Academic / Research", "Other"];
const JOB_FUNCTIONS = ["Compliance & Risk Management", "Consulting & Advisory", "Cybersecurity", "Data, Analytics & Insights", "Environmental, Social & Corporate Governance (ESG)", "Executive Leadership & Board of Directors", "Finance & Accounting", "HR & Recruiting", "Investing", "Legal", "Marketing & Communications", "Operations & Project Management", "Partnerships", "Policy", "Procurement & Vendor Management", "Product", "Research, Content & Journalism", "Sales, BD & Account Management", "Strategy, Innovation, R&D", "Technology & IT", "Not Applicable"];
const TOPICS = ["Artificial Intelligence", "Quantum Computing", "Cybersecurity", "Robotics & Automation", "Sustainability & CleanTech", "Healthcare & Lifesciences", "Banking, Financial Services & Insurance", "Supply Chain, Manufacturing & Infrastructure", "Defence & Public Safety", "Energy & Utilities"];
const OBJECTIVES = ["Education", "Investments", "Jobs", "Market Entry", "Networking", "Partnerships", "Regulatory and Policy Dialogue", "Solutions", "Talent", "Trends and Insights"];

const EMPTY_FORM = {
  salutation: "", firstName: "", lastName: "", jobTitle: "",
  organisation: "", businessNumber: "", email: "", country: "",
  linkedin: "", jobLevel: "", jobFunction: "",
  topics: [], objectives: [],
  consent1: false, consent2: false,
};

// ─── Questionnaire Modal ──────────────────────────────────────────────────────
function QuestionnaireModal({ dark, tierLabel, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const TOTAL_STEPS = 3;

  const textMain  = dark ? "#ffffff"                : "#0d0520";
  const textMuted = dark ? "rgba(255,255,255,0.65)" : "rgba(13,5,32,0.68)";
  const inputBg   = dark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.04)";
  const inputBorder = dark ? "rgba(255,255,255,0.14)" : "rgba(122,63,209,0.20)";
  const modalBg   = dark ? "#0e0820" : "#ffffff";

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: undefined })); };
  const toggleArr = (key, val) => set(key, form[key].includes(val) ? form[key].filter(x => x !== val) : [...form[key], val]);

  const inputStyle = (err) => ({
    width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${err ? "#e05555" : inputBorder}`,
    background: inputBg, color: textMain, fontFamily: "inherit", fontSize: "0.82rem", outline: "none",
    boxSizing: "border-box", transition: "border 0.2s",
  });
  const labelStyle = { fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: textMuted, display: "block", marginBottom: 6 };
  const fieldStyle = { display: "flex", flexDirection: "column", gap: 0 };
  const errStyle = { fontSize: "0.62rem", color: "#e05555", marginTop: 4 };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
      if (!form.email.trim()) e.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
      if (!form.organisation.trim()) e.organisation = "Required";
      if (!form.country.trim()) e.country = "Required";
    }
    if (step === 2) {
      if (!form.jobLevel) e.jobLevel = "Required";
      if (!form.jobFunction) e.jobFunction = "Required";
    }
    if (step === 3) {
      if (form.topics.length === 0) e.topics = "Select at least one";
      if (form.objectives.length === 0) e.objectives = "Select at least one";
      if (!form.consent1) e.consent1 = "Required";
      if (!form.consent2) e.consent2 = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);
  const submit = () => { if (validateStep()) onSubmit(form); };

  const pillCheck = (val, selected, onClick, err) => (
    <button key={val} onClick={() => onClick(val)}
      style={{ padding: "7px 14px", borderRadius: 999, border: `1px solid ${selected ? "#7a3fd1" : (err ? "#e05555" : inputBorder)}`, background: selected ? "rgba(122,63,209,0.18)" : inputBg, color: selected ? (dark ? "#c8a8ff" : "#7a3fd1") : textMuted, fontSize: "0.72rem", fontWeight: selected ? 700 : 500, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
    >{val}</button>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}>
      <div style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", display: "flex", flexDirection: "column", background: modalBg, borderRadius: 24, border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(122,63,209,0.14)", boxShadow: "0 24px 80px rgba(0,0,0,0.4)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "24px 28px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#f5a623", marginBottom: 4 }}>
                {tierLabel} Pass
              </div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "1rem", color: textMain, margin: 0 }}>
                {step === 1 ? "Your Details" : step === 2 ? "Professional Profile" : "Interests & Consent"}
              </h2>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: textMuted, fontSize: "1.4rem", lineHeight: 1, padding: 4 }}>×</button>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: 6, marginTop: 16, marginBottom: 20 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 999, background: s <= step ? "linear-gradient(90deg, #7a3fd1, #f5a623)" : (dark ? "rgba(255,255,255,0.10)" : "rgba(122,63,209,0.12)"), transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", padding: "0 28px 24px", flexGrow: 1 }}>

          {/* ── Step 1: Personal Details ── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Salutation</label>
                <select value={form.salutation} onChange={e => set("salutation", e.target.value)} style={inputStyle(false)}>
                  <option value="">Select…</option>
                  {SALUTATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>First Name *</label>
                  <input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jane" style={inputStyle(errors.firstName)} />
                  {errors.firstName && <span style={errStyle}>{errors.firstName}</span>}
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Last Name *</label>
                  <input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Smith" style={inputStyle(errors.lastName)} />
                  {errors.lastName && <span style={errStyle}>{errors.lastName}</span>}
                </div>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Job Title</label>
                <input value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)} placeholder="Chief Technology Officer" style={inputStyle(false)} />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Organisation Name *</label>
                <input value={form.organisation} onChange={e => set("organisation", e.target.value)} placeholder="Acme Corp" style={inputStyle(errors.organisation)} />
                {errors.organisation && <span style={errStyle}>{errors.organisation}</span>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Business Number</label>
                <input value={form.businessNumber} onChange={e => set("businessNumber", e.target.value)} placeholder="+1 (416) 000-0000" style={inputStyle(false)} />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Email Address *</label>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="jane@company.com" style={inputStyle(errors.email)} />
                {errors.email && <span style={errStyle}>{errors.email}</span>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Country *</label>
                <input value={form.country} onChange={e => set("country", e.target.value)} placeholder="Canada" style={inputStyle(errors.country)} />
                {errors.country && <span style={errStyle}>{errors.country}</span>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Your LinkedIn URL</label>
                <input value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/yourname" style={inputStyle(false)} />
              </div>
            </div>
          )}

          {/* ── Step 2: Professional Profile ── */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Job Level *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {JOB_LEVELS.map(l => pillCheck(l, form.jobLevel === l, () => set("jobLevel", l), errors.jobLevel))}
                </div>
                {errors.jobLevel && <span style={errStyle}>{errors.jobLevel}</span>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Job Function *</label>
                <select value={form.jobFunction} onChange={e => set("jobFunction", e.target.value)} style={{ ...inputStyle(errors.jobFunction), paddingTop: 10, paddingBottom: 10 }}>
                  <option value="">Select your function…</option>
                  {JOB_FUNCTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.jobFunction && <span style={errStyle}>{errors.jobFunction}</span>}
              </div>
            </div>
          )}

          {/* ── Step 3: Interests & Consent ── */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Topics of Interest * <span style={{ color: textMuted, fontWeight: 500, letterSpacing: 0, textTransform: "none" }}>(select all that apply)</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {TOPICS.map(t => pillCheck(t, form.topics.includes(t), () => toggleArr("topics", t), errors.topics))}
                </div>
                {errors.topics && <span style={errStyle}>{errors.topics}</span>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Your objective of attending The Tech Festival Canada * <span style={{ color: textMuted, fontWeight: 500, letterSpacing: 0, textTransform: "none" }}>(select all that apply)</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {OBJECTIVES.map(o => pillCheck(o, form.objectives.includes(o), () => toggleArr("objectives", o), errors.objectives))}
                </div>
                {errors.objectives && <span style={errStyle}>{errors.objectives}</span>}
              </div>

              {/* Consent */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "20px", background: dark ? "rgba(122,63,209,0.08)" : "rgba(122,63,209,0.04)", borderRadius: 14, border: dark ? "1px solid rgba(122,63,209,0.20)" : "1px solid rgba(122,63,209,0.12)" }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", color: dark ? "#c8a8ff" : "#7a3fd1", marginBottom: 2 }}>Your Consent</div>

                {[
                  { key: "consent1", text: "My consents hereto are given to the organisers and I agree to the organiser's terms of service and privacy policies." },
                  { key: "consent2", text: "I acknowledge and agree that the organisers will collect, use, process and/or disclose my personal information for the purposes of securing my registration and attendance for The Tech Festival Canada, including digital platform usage on the The Tech Festival Canada platform, and consent to the collection, use, processing and/or disclosure of my personal information by the organisers for the purposes of receiving updates on the agenda, activities/events, collaboration projects, industry news relating to The Tech Festival Canada." },
                ].map(({ key, text }, i) => (
                  <label key={key} style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                    <div style={{ position: "relative", flexShrink: 0, marginTop: 1 }}>
                      <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
                      <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${errors[key] ? "#e05555" : (form[key] ? "#7a3fd1" : inputBorder)}`, background: form[key] ? "#7a3fd1" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                        {form[key] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.74rem", color: textMuted, lineHeight: 1.6 }}>
                      <strong style={{ color: textMain, fontWeight: 700 }}>{i + 1}. </strong>{text}
                    </span>
                  </label>
                ))}
                {(errors.consent1 || errors.consent2) && <span style={errStyle}>Both consents are required to proceed.</span>}
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div style={{ padding: "16px 28px 24px", flexShrink: 0, borderTop: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(122,63,209,0.08)", display: "flex", gap: 10 }}>
          {step > 1 && (
            <button onClick={back} style={{ flex: 1, padding: "13px", borderRadius: 12, border: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(122,63,209,0.20)", background: "transparent", color: textMain, fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
              Back
            </button>
          )}
          <button
            onClick={step < TOTAL_STEPS ? next : submit}
            style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #7a3fd1, #f5a623)", color: "white", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 20px rgba(122,63,209,0.35)" }}
          >
            {step < TOTAL_STEPS ? "Continue →" : "Proceed to Payment →"}
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Pass metadata ────────────────────────────────────────────────────────────
const PASS_META = {
  connect: {
    label: "Connect Pass",
    tagline: "More than just access to the conference.",
    description: "Designed for attendees who want to start the day in a more curated business environment. With entry to the exclusive CxO Breakfast, you can connect with senior leaders and build meaningful relationships before the main conference begins.",
    features: ["2x Day Conference Access", "2x CxO Breakfasts", "2x Luncheons", "Expo Floor Access", "Networking Breaks"],
    tier: "connect", defaultPrice: 599, featured: false,
  },
  influence: {
    label: "Influence Pass",
    tagline: "A fuller event experience beyond the conference floor.",
    description: "Built for decision makers, growth leaders, investors, and professionals who want premium daytime access plus entry to the Gala Dinner and Networking Reception — creating space for higher-value conversations and stronger business connections.",
    features: ["2x Day Conference Access", "2x CxO Breakfasts", "2x Luncheons", "1x Gala Dinner & Networking Reception", "Expo Floor Access", "Networking Breaks"],
    tier: "influence", defaultPrice: 799, featured: true,
  },
  power: {
    label: "Power Pass",
    tagline: "The ultimate all-access experience.",
    description: "Built for senior executives, VIP guests, investors, speakers, and leaders who want to experience The Tech Festival Canada at the highest level. With access to every major element of the event, this pass offers the most complete and elevated way to engage with the festival.",
    features: ["2x Day Conference Access", "2x CxO Breakfasts", "2x Luncheons", "1x Gala Dinner & Networking Reception", "1x Awards Night", "VIP Lounge Access (Both Days)", "Expo Floor Access", "Networking Breaks"],
    tier: "power", defaultPrice: 999, featured: false,
  },
};

// ─── Pass Card ────────────────────────────────────────────────────────────────
function PassCard({ meta, inventoryItem, onPurchase, dark }) {
  const [hovered, setHovered] = useState(false);
  const price     = inventoryItem?.price ?? meta.defaultPrice;
  const remaining = inventoryItem ? Math.max(inventoryItem.total - inventoryItem.sold, 0) : null;
  const soldOut   = remaining !== null && remaining <= 0;

  const textMain   = dark ? "#ffffff"                : "#0d0520";
  const textMuted  = dark ? "rgba(255,255,255,0.65)" : "rgba(13,5,32,0.68)";
  const textLight  = dark ? "rgba(255,255,255,0.40)" : "rgba(13,5,32,0.45)";
  const cardBg     = dark ? "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" : "#ffffff";
  const cardBorder = dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(122,63,209,0.14)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", flex: "1 1 260px", maxWidth: 340, minWidth: 240,
        borderRadius: 20, padding: "32px 26px 28px", display: "flex", flexDirection: "column",
        backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
        background: meta.featured
          ? (dark ? "linear-gradient(135deg, rgba(122,63,209,0.28) 0%, rgba(245,166,35,0.12) 100%)" : "linear-gradient(135deg, rgba(122,63,209,0.12) 0%, rgba(245,166,35,0.08) 100%)")
          : cardBg,
        border: meta.featured
          ? (dark ? "1px solid rgba(122,63,209,0.55)" : "1px solid rgba(122,63,209,0.40)")
          : cardBorder,
        boxShadow: meta.featured
          ? (dark ? "0 8px 48px rgba(122,63,209,0.25)" : "0 8px 32px rgba(122,63,209,0.18)")
          : (dark ? "0 4px 32px rgba(0,0,0,0.35)" : "0 4px 24px rgba(122,63,209,0.08)"),
        transform: meta.featured ? "scale(1.04)" : hovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        zIndex: meta.featured ? 2 : 1,
      }}
    >
      {meta.featured && (
        <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg, #7a3fd1, #f5a623)", color: "white", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", padding: "5px 16px", borderRadius: 999, whiteSpace: "nowrap", fontFamily: "'Orbitron', sans-serif" }}>
          Most Popular
        </div>
      )}

      <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "1.5px", textTransform: "uppercase", color: meta.featured ? (dark ? "#f5a623" : "#d98a14") : (dark ? "rgba(160,100,255,0.85)" : "#7a3fd1"), marginBottom: 8 }}>
        {meta.label}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
        <PriceWithAsterisk price={price} color={textMain} fontSize="2.6rem" fontWeight={900} />
        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: textLight, letterSpacing: "1px", textTransform: "uppercase" }}>CAD</span>
      </div>

      <p style={{ fontSize: "0.62rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.35)" : "rgba(13,5,32,0.38)", letterSpacing: "0.3px", marginBottom: 4 }}>13% HST included</p>

      <div style={{ width: "100%", height: 1, background: dark ? "linear-gradient(90deg,transparent,rgba(255,255,255,0.12) 50%,transparent)" : "linear-gradient(90deg,transparent,rgba(122,63,209,0.18) 50%,transparent)", margin: "14px 0 16px" }} />

      <p style={{ fontSize: "0.82rem", fontWeight: 600, color: textMain, marginBottom: 8, lineHeight: 1.5, textAlign: "justify" }}>{meta.tagline}</p>
      <p style={{ fontSize: "0.76rem", color: textMuted, lineHeight: 1.65, marginBottom: 18, textAlign: "justify", hyphens: "auto" }}>{meta.description}</p>

      <div style={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: textLight, marginBottom: 10 }}>Includes</div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {meta.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.78rem", color: textMuted, lineHeight: 1.4 }}>
            <CheckIcon />{f}
          </li>
        ))}
      </ul>

      <button
        disabled={soldOut}
        onClick={() => !soldOut && onPurchase(meta.tier, meta.label)}
        style={{ marginTop: 24, width: "100%", padding: "13px 0", borderRadius: 12, border: "none", cursor: soldOut ? "not-allowed" : "pointer", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.68rem", letterSpacing: "1px", textTransform: "uppercase", color: soldOut ? (dark ? "rgba(255,255,255,0.3)" : "rgba(13,5,32,0.3)") : "white", background: soldOut ? (dark ? "rgba(255,255,255,0.05)" : "rgba(13,5,32,0.05)") : meta.featured ? "linear-gradient(135deg, #7a3fd1, #f5a623)" : (dark ? "rgba(122,63,209,0.35)" : "#7a3fd1"), boxShadow: soldOut || !meta.featured ? "none" : "0 4px 20px rgba(122,63,209,0.4)", transition: "all 0.2s" }}
        onMouseEnter={(e) => { if (!soldOut && !meta.featured) e.currentTarget.style.background = dark ? "rgba(122,63,209,0.55)" : "#6330b3"; }}
        onMouseLeave={(e) => { if (!soldOut && !meta.featured) e.currentTarget.style.background = dark ? "rgba(122,63,209,0.35)" : "#7a3fd1"; }}
      >
        {soldOut ? "Sold Out" : "Get Your Pass"}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Tickets() {
  const [inventory, setInventory]     = useState([]);
  const [dark, setDark]               = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Questionnaire state
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [pendingTier, setPendingTier]   = useState(null);
  const [pendingLabel, setPendingLabel] = useState("");

  useEffect(() => {
    setDark(document.body.classList.contains("dark-mode"));
    const obs = new MutationObserver(() => setDark(document.body.classList.contains("dark-mode")));
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setShowSuccessModal(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`${API}/admin/inventory/public`);
        const data = await res.json();
        setInventory(Array.isArray(data) ? data : []);
      } catch (err) { console.error("Inventory fetch failed", err); }
    };
    load();
  }, []);

  const getTier = (tier) => inventory.find((i) => i.tier === tier) || null;

  // Opens the questionnaire instead of going straight to Stripe
  const handleOpenQuestionnaire = (tier, label) => {
    setPendingTier(tier);
    setPendingLabel(label);
    setQuestionnaireOpen(true);
  };

  // Called after questionnaire is completed — this is the ONLY place Stripe checkout is triggered
  const handlePurchase = async (formData) => {
    setQuestionnaireOpen(false);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/payments/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ tier: pendingTier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      console.error("Purchase error:", err);
      alert(err.message || "Purchase failed");
    }
  };

  const passes     = ["connect", "influence", "power"];
  const passLabels = { connect: "Connect", influence: "Influence", power: "Power" };
  const allFeatures = [
    "2x Day Conference Access", "Expo Floor Access", "Networking Breaks",
    "2x CxO Breakfasts", "2x Luncheons", "1x Gala Dinner & Networking Reception",
    "1x Awards Night", "VIP Lounge Access (Both Days)",
  ];
  const passFeatureMap = {
    connect:   [true, true, true, true,  true,  false, false, false],
    influence: [true, true, true, true,  true,  true,  false, false],
    power:     [true, true, true, true,  true,  true,  true,  true],
  };

  const bg       = dark ? "#06020f" : "#ffffff";
  const textMain = dark ? "#ffffff" : "#0d0520";
  const textMuted= dark ? "rgba(255,255,255,0.60)" : "rgba(13,5,32,0.68)";

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: bg, color: textMain, position: "relative", transition: "background 0.3s ease" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: dark ? "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(122,63,209,0.10) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(245,166,35,0.06) 0%, transparent 70%)" : "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(122,63,209,0.05) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 1, paddingBottom: "1px" }}>
          <div style={{ textAlign: "center", padding: "100px 24px 60px", maxWidth: 780, margin: "0 auto" }}>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 20, color: textMain }}>
              Choose Your Pass
            </h1>
            <p style={{ fontSize: "1rem", color: textMuted, lineHeight: 1.75, textAlign: "justify", hyphens: "auto" }}>
              Whether you are coming to learn, connect, explore partnerships, or experience the event at the highest level, The Tech Festival Canada offers a pass designed for every kind of delegate.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", alignItems: "stretch", padding: "0 24px 80px", maxWidth: 1260, margin: "0 auto" }}>
            {passes.map((key) => (
              <PassCard key={key} meta={PASS_META[key]} inventoryItem={getTier(key)} onPurchase={handleOpenQuestionnaire} dark={dark} />
            ))}
          </div>

          <div style={{ maxWidth: 900, margin: "0 auto 80px", padding: "0 24px" }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: "1px", textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.35)" : "rgba(13,5,32,0.40)", textAlign: "center", marginBottom: 28 }}>Pass Comparison</h2>
            <div style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", background: dark ? "rgba(255,255,255,0.04)" : "rgba(122,63,209,0.03)", border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(122,63,209,0.10)", borderRadius: 20, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <div style={{ minWidth: 500 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3, 1fr)", borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(122,63,209,0.10)", padding: "14px 24px" }}>
                  <div style={{ fontSize: "0.7rem", color: textMuted, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", display: "flex", alignItems: "center" }}>Feature</div>
                  {passes.map((p) => (
                    <div key={p} style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.62rem", letterSpacing: "0.8px", textTransform: "uppercase", color: p === "influence" ? (dark ? "#f5a623" : "#d98a14") : textMuted }}>
                      {passLabels[p]}
                    </div>
                  ))}
                </div>
                {allFeatures.map((feature, fi) => (
                  <div key={feature} style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3, 1fr)", padding: "13px 24px", borderBottom: fi < allFeatures.length - 1 ? (dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(122,63,209,0.05)") : "none", background: fi % 2 === 0 ? (dark ? "rgba(255,255,255,0.01)" : "rgba(122,63,209,0.02)") : "transparent" }}>
                    <div style={{ fontSize: "0.78rem", color: dark ? "rgba(255,255,255,0.65)" : "rgba(13,5,32,0.80)", display: "flex", alignItems: "center" }}>{feature}</div>
                    {passes.map((p) => (
                      <div key={p} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {passFeatureMap[p][fi]
                          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={dark ? "#f5a623" : "#d98a14"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                          : <span style={{ color: dark ? "rgba(255,255,255,0.15)" : "rgba(13,5,32,0.15)", fontSize: "1rem", lineHeight: 1 }}>—</span>
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 760, margin: "0 auto 120px", padding: "0 24px", textAlign: "center" }}>
            <div style={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", background: dark ? "linear-gradient(135deg, rgba(122,63,209,0.12) 0%, rgba(245,166,35,0.06) 100%)" : "linear-gradient(135deg, rgba(122,63,209,0.07) 0%, rgba(245,166,35,0.04) 100%)", border: dark ? "1px solid rgba(122,63,209,0.25)" : "1px solid rgba(122,63,209,0.14)", borderRadius: 24, padding: "48px 40px" }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", color: dark ? "#f5a623" : "#d98a14", marginBottom: 14 }}>Why Upgrade Your Pass</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(1.3rem, 3vw, 1.9rem)", letterSpacing: "-0.5px", color: textMain, marginBottom: 20, lineHeight: 1.2 }}>
                Every Level Unlocks<br /><span style={{ color: dark ? "#f5a623" : "#d98a14" }}>More Opportunity</span>
              </h2>
              <p style={{ fontSize: "0.88rem", color: textMuted, lineHeight: 1.8, textAlign: "justify", hyphens: "auto" }}>
                Each pass level is designed to unlock a deeper layer of value. As you move up, the experience becomes more curated, more exclusive, and more relationship driven.
              </p>
            </div>
          </div>

          <Footer />
        </div>

        {/* ── Questionnaire Modal ── */}
        {questionnaireOpen && (
          <QuestionnaireModal
            dark={dark}
            tierLabel={pendingLabel}
            onClose={() => setQuestionnaireOpen(false)}
            onSubmit={handlePurchase}
          />
        )}

        {/* ── Success Modal ── */}
        {showSuccessModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", width: "100%", maxWidth: "420px", background: dark ? "#120a22" : "#ffffff", padding: "40px 32px", borderRadius: "24px", border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(122,63,209,0.1)" }}>
              <div style={{ textAlign: "center", color: textMain }}>
                <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", margin: "0 0 12px 0", color: "#f5a623" }}>Thank You!</h2>
                <p style={{ opacity: 0.8, margin: 0, fontSize: "1.1rem", lineHeight: 1.6 }}>Thank you for purchasing your ticket.</p>
                <p style={{ opacity: 0.6, marginTop: "8px", fontSize: "0.95rem" }}>Please check your email for the invoice and QR code.</p>
              </div>
              <button onClick={() => { setShowSuccessModal(false); window.location.href = "/"; }}
                style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", border: "none", color: "white", padding: "16px 32px", borderRadius: "12px", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px", fontWeight: 700, width: "100%" }}>
                Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
