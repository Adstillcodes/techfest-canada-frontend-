import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

// ==========================================
// 1. GLOBAL CONSTANTS & HELPERS
// ==========================================
const COUNTRY_CODES = [
  "+1", "+7", "+20", "+27", "+30", "+31", "+32", "+33", "+34", "+36", "+39", "+40", "+41", "+43", "+44", "+45", "+46", "+47", "+48", "+49", "+51", "+52", "+53", "+54", "+55", "+56", "+57", "+58", "+60", "+61", "+62", "+63", "+64", "+65", "+66", "+81", "+82", "+84", "+86", "+90", "+91", "+92", "+93", "+94", "+95", "+98", "+212", "+213", "+216", "+218", "+220", "+221", "+222", "+223", "+224", "+225", "+226", "+227", "+228", "+229", "+230", "+231", "+232", "+233", "+234", "+235", "+236", "+237", "+238", "+239", "+240", "+241", "+242", "+243", "+244", "+245", "+246", "+248", "+249", "+250", "+251", "+252", "+253", "+254", "+255", "+256", "+257", "+258", "+260", "+261", "+262", "+263", "+264", "+265", "+266", "+267", "+268", "+269", "+290", "+291", "+297", "+298", "+299", "+350", "+351", "+352", "+353", "+354", "+355", "+356", "+357", "+358", "+359", "+370", "+371", "+372", "+373", "+374", "+375", "+376", "+377", "+378", "+380", "+381", "+382", "+385", "+386", "+387", "+389", "+420", "+421", "+423", "+500", "+501", "+502", "+503", "+504", "+505", "+506", "+507", "+508", "+509", "+590", "+591", "+592", "+593", "+594", "+595", "+596", "+597", "+598", "+599", "+852", "+853", "+855", "+856", "+880", "+886", "+960", "+961", "+962", "+963", "+964", "+965", "+966", "+967", "+968", "+971", "+972", "+973", "+974", "+975", "+976", "+977", "+992", "+993", "+994", "+995", "+996", "+998"
];

// ==========================================
// 2. STABLE SUB-COMPONENTS
// (Defined completely outside the main loop to prevent scroll/typing bugs)
// ==========================================

function FormInput({ label, required, dark, ...props }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  const inputBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(122,63,209,0.14)";

  return (
    <div style={{ marginBottom: "20px" }}>
      {label && <label style={{ display: "block", color: textMain, fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" }}>{label} {required && <span style={{ color: "#f5a623" }}>*</span>}</label>}
      <input 
        style={{ width: "100%", background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, padding: "14px", borderRadius: "10px", fontSize: "0.95rem", outline: "none", transition: "border 0.2s" }}
        {...props} 
      />
    </div>
  );
}

function FormSelect({ label, required, dark, options, ...props }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  const inputBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(122,63,209,0.14)";

  return (
    <div style={{ marginBottom: "20px" }}>
      {label && <label style={{ display: "block", color: textMain, fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" }}>{label} {required && <span style={{ color: "#f5a623" }}>*</span>}</label>}
      <select 
        style={{ width: "100%", background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, padding: "14px", borderRadius: "10px", fontSize: "0.95rem", outline: "none", appearance: "none", cursor: "pointer" }}
        {...props}
      >
        <option value="">Select...</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function FormRadio({ label, required, name, options, value, onChange, dark }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  const inputBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(122,63,209,0.14)";

  return (
    <div style={{ marginBottom: "24px" }}>
      {label && <label style={{ display: "block", color: textMain, fontSize: "0.85rem", fontWeight: "700", marginBottom: "12px" }}>{label} {required && <span style={{ color: "#f5a623" }}>*</span>}</label>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {options.map(opt => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: "8px", background: inputBg, border: value === opt ? "1px solid #7a3fd1" : `1px solid ${inputBorder}`, padding: "12px 16px", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease" }}>
            <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} style={{ accentColor: "#7a3fd1" }} />
            <span style={{ fontSize: "0.9rem", color: textMain }}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function FormCheckbox({ label, required, name, options, valueArray, onChange, dark }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  const inputBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(122,63,209,0.14)";

  const handleToggle = (opt) => {
    let newArray = [...(valueArray || [])];
    if (newArray.includes(opt)) newArray = newArray.filter(i => i !== opt);
    else newArray.push(opt);
    onChange({ target: { name, value: newArray } });
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      {label && <label style={{ display: "block", color: textMain, fontSize: "0.85rem", fontWeight: "700", marginBottom: "12px" }}>{label} {required && <span style={{ color: "#f5a623" }}>*</span>}</label>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
        {options.map(opt => {
          const isChecked = (valueArray || []).includes(opt);
          return (
            <label key={opt} style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: inputBg, border: isChecked ? "1px solid #7a3fd1" : `1px solid ${inputBorder}`, padding: "12px", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease" }}>
              <input type="checkbox" checked={isChecked} onChange={() => handleToggle(opt)} style={{ accentColor: "#7a3fd1", marginTop: "4px" }} />
              <span style={{ fontSize: "0.85rem", color: textMain, lineHeight: 1.4 }}>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function RichTextEditor({ label, required, value, onChange, dark }) {
  const editorRef = useRef(null);
  const textMain = dark ? "#ffffff" : "#0d0520";
  const borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(122,63,209,0.14)";
  const bgMain = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  const bgToolbar = dark ? "rgba(255,255,255,0.05)" : "rgba(122,63,209,0.05)";

  const exec = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      {label && <label style={{ display: "block", color: textMain, fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" }}>{label} {required && <span style={{ color: "#f5a623" }}>*</span>}</label>}
      <div style={{ background: bgMain, border: `1px solid ${borderColor}`, borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "8px", padding: "10px", background: bgToolbar, borderBottom: `1px solid ${borderColor}` }}>
          <button type="button" onClick={() => exec("bold")} style={{ background: "none", border: "none", color: textMain, cursor: "pointer", fontWeight: "bold", padding: "4px 8px" }}>B</button>
          <button type="button" onClick={() => exec("italic")} style={{ background: "none", border: "none", color: textMain, cursor: "pointer", fontStyle: "italic", padding: "4px 8px" }}>I</button>
          <button type="button" onClick={() => exec("underline")} style={{ background: "none", border: "none", color: textMain, cursor: "pointer", textDecoration: "underline", padding: "4px 8px" }}>U</button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          style={{ minHeight: "120px", padding: "14px", color: textMain, outline: "none", fontSize: "0.95rem", lineHeight: "1.5" }}
          dangerouslySetInnerHTML={{ __html: value || "" }}
        />
      </div>
    </div>
  );
}

function FileUpload({ label, onFileSelect, dark }) {
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  
  const textMain = dark ? "#ffffff" : "#0d0520";
  const borderColor = dark ? "rgba(255,255,255,0.2)" : "rgba(122,63,209,0.2)";
  const bgMain = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20971520) {
      setError("File exceeds the 20MB limit.");
      setFileName("");
      onFileSelect(null);
      return;
    }
    setError("");
    setFileName(file.name);
    onFileSelect(file);
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      {label && <label style={{ display: "block", color: textMain, fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" }}>{label}</label>}
      <label style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: bgMain, border: `1px dashed ${borderColor}`, borderRadius: "12px", cursor: "pointer", color: textMain, fontSize: "0.9rem" }}>
        <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
        {fileName ? `Selected: ${fileName}` : "Click to upload a file (Max 20MB)"}
      </label>
      {error && <span style={{ color: "#ff4d4d", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{error}</span>}
    </div>
  );
}


// ==========================================
// 3. MAIN FORM COMPONENT
// ==========================================
export default function KYCForm() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.body.classList.contains("dark-mode"));
    const obs = new MutationObserver(() => setDark(document.body.classList.contains("dark-mode")));
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const TOTAL_STEPS = 8;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  // Generic handler for standard inputs, dropdowns, and checkboxes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Special handler to strictly limit phone to 10 characters
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData(prev => ({ ...prev, primaryPhone: val }));
  };

  // Progress logic (0% to 100%)
  const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  // Theme Constants
  const bg = dark ? "#06020f" : "#fdfbfa"; // Off-white for light mode background
  const textMain = dark ? "#ffffff" : "#0d0520";
  const textMuted = dark ? "rgba(255,255,255,0.6)" : "rgba(13,5,32,0.68)";
  const inputBg = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  const inputBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(122,63,209,0.14)";
  const progressBg = dark ? "rgba(6,2,15,0.9)" : "rgba(253,251,250,0.95)";
  const btnText = dark ? "#000" : "#fff";
  const btnBg = dark ? "#fff" : "#0d0520";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, transition: "background 0.3s ease, color 0.3s ease" }}>
      <Navbar />

      {/* STICKY PROGRESS BAR */}
      <div style={{ position: "sticky", top: "80px", zIndex: 100, background: progressBg, backdropFilter: "blur(12px)", padding: "20px 5%", borderBottom: `1px solid ${inputBorder}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", color: textMuted }}>
          <span>Step {currentStep} of {TOTAL_STEPS}</span>
          <span>{progressPercent}% Completed</span>
        </div>
        <div style={{ width: "100%", height: "4px", background: dark ? "rgba(255,255,255,0.1)" : "rgba(122,63,209,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, #7a3fd1, #f5a623)", transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* FORM CONTAINER */}
      <div style={{ maxWidth: "840px", margin: "60px auto", padding: "0 5% 100px" }}>
        
        {/* ================= STEP 1: PRIMARY CONTACT INFO ================= */}
        {currentStep === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Join Our Network</h2>
            <p style={{ color: textMuted, marginBottom: "40px" }}>Primary Contact Info — Who should we reach out to regarding your application?</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0 24px" }}>
              <FormInput label="First Name" required name="primaryFirstName" value={formData.primaryFirstName || ""} onChange={handleChange} dark={dark} />
              <FormInput label="Last Name" required name="primaryLastName" value={formData.primaryLastName || ""} onChange={handleChange} dark={dark} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0 24px" }}>
              <FormInput label="Primary Contact Email" required type="email" name="primaryEmail" value={formData.primaryEmail || ""} onChange={handleChange} dark={dark} />
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: textMain, fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" }}>Primary Contact Phone</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select style={{ width: "110px", background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, padding: "14px", borderRadius: "10px", fontSize: "0.95rem", outline: "none", appearance: "none", cursor: "pointer" }} name="primaryPhoneCode" value={formData.primaryPhoneCode || "+1"} onChange={handleChange}>
                    {COUNTRY_CODES.map(code => <option key={code} value={code}>{code}</option>)}
                  </select>
                  <input style={{ flex: 1, background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, padding: "14px", borderRadius: "10px", fontSize: "0.95rem", outline: "none" }} type="tel" placeholder="4165550100" value={formData.primaryPhone || ""} onChange={handlePhoneChange} />
                </div>
              </div>
            </div>

            <FormInput label="Job Title" required name="primaryTitle" value={formData.primaryTitle || ""} onChange={handleChange} dark={dark} />

            <h3 style={{ marginTop: "30px", fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px" }}>Secondary Contact (Optional)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0 24px" }}>
              <FormInput label="Name" name="secondaryName" value={formData.secondaryName || ""} onChange={handleChange} dark={dark} />
              <FormInput label="Job Title" name="secondaryTitle" value={formData.secondaryTitle || ""} onChange={handleChange} dark={dark} />
            </div>
            <FormInput label="Email" type="email" name="secondaryEmail" value={formData.secondaryEmail || ""} onChange={handleChange} dark={dark} />
          </div>
        )}

        {/* ================= STEP 2: COMPANY INFO ================= */}
        {currentStep === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Company Info</h2>
            <p style={{ color: textMuted, marginBottom: "40px" }}>Please provide accurate details to help us optimize your event experience.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0 24px" }}>
              <FormInput label="Company Name" required name="companyName" value={formData.companyName || ""} onChange={handleChange} dark={dark} />
              <FormInput label="Brand Name (if different)" name="brandName" value={formData.brandName || ""} onChange={handleChange} dark={dark} />
            </div>

            <FormInput label="Website" required name="website" value={formData.website || ""} onChange={handleChange} dark={dark} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0 24px" }}>
              <FormSelect label="Country of Headquarters" required name="countryHQ" options={["Canada", "USA", "UK", "Europe", "India", "Middle East", "APAC", "Other"]} value={formData.countryHQ || ""} onChange={handleChange} dark={dark} />
              <FormInput label="City and Country of Main Office" required name="cityMainOffice" value={formData.cityMainOffice || ""} onChange={handleChange} dark={dark} />
            </div>

            <FormRadio label="Do you have operations in Canada?" required name="operationsCanada" options={["Yes", "No", "Planned market entry"]} value={formData.operationsCanada || ""} onChange={handleChange} dark={dark} />
          </div>
        )}

        {/* ================= STEP 3: BUSINESS PROFILE ================= */}
        {currentStep === 3 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Business Profile</h2>
            
            <FormCheckbox label="Which best describes your company? (Select all that apply)" required name="companyDesc" options={["Technology Product Company", "Platform / SaaS Company", "Enterprise Solution Provider", "Consulting / Services Firm", "System Integrator", "Hardware / Infrastructure Provider", "Research / Lab / Deep Tech Company", "Startup", "Government / Trade Body", "Academic / Innovation Institution", "Investor / VC / PE", "Recruitment / Talent", "Media / Community", "Other"]} valueArray={formData.companyDesc} onChange={handleChange} dark={dark} />
            
            <FormSelect label="Primary Industry" required name="primaryIndustry" options={["Artificial Intelligence", "Quantum Computing", "Robotics", "Cybersecurity and Digital Trust", "Climate Technology and Sustainability", "Cross sector / Multi tech"]} value={formData.primaryIndustry || ""} onChange={handleChange} dark={dark} />
            
            <FormCheckbox label="Sub Industry / Category" required name="subIndustry" options={["GenAI / LLMs", "AI Infrastructure / Compute", "AI Agents / Automation", "Data / Analytics / MLOps", "Quantum Hardware", "Quantum Software", "Robotics Hardware", "Industrial Automation", "Cybersecurity Software", "Identity / Zero Trust", "Cloud Security", "Climate / Clean Energy", "Carbon / ESG", "Smart Infrastructure", "Other"]} valueArray={formData.subIndustry} onChange={handleChange} dark={dark} />

            <FormRadio label="Company Stage" name="companyStage" options={["Startup", "Growth Stage", "Scale Up", "Established Enterprise", "Global Corporation"]} value={formData.companyStage || ""} onChange={handleChange} dark={dark} />

            <RichTextEditor label="Describe your product, solution, or offering" required value={formData.productDesc} onChange={(val) => setFormData({...formData, productDesc: val})} dark={dark} />
          </div>
        )}

        {/* ================= STEP 4: PARTICIPATION & OBJECTIVES ================= */}
        {currentStep === 4 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Participation Objectives</h2>
            
            <FormCheckbox label="Type of Participation" required name="participationType" options={["Sponsor", "Exhibitor", "Sponsor and Exhibitor", "Speaker Partner", "Ecosystem Partner", "Startup Exhibitor"]} valueArray={formData.participationType} onChange={handleChange} dark={dark} />
            
            <FormCheckbox label="Package Booked / Under Discussion" name="packageBooked" options={["Single Booth", "Double Booth", "Triple Booth", "Quadruple Booth", "Branding Package", "Thought Leadership Package", "Hosted Buyer Meetings", "Custom Sponsorship", "Not finalized yet"]} valueArray={formData.packageBooked} onChange={handleChange} dark={dark} />

            <FormCheckbox label="Primary reasons for participating (Rank Top 5)" required name="primaryReasons" options={["Brand visibility", "Lead generation", "Sales pipeline creation", "Customer acquisition", "Partnership development", "Investor outreach", "Channel / distributor search", "Market entry into Canada", "Thought leadership / speaking", "Product launch", "PR / media exposure", "Competitive intelligence", "Recruit talent", "Meet government / academia leaders", "Existing customer engagement", "Networking"]} valueArray={formData.primaryReasons} onChange={handleChange} dark={dark} />

            <RichTextEditor label="What would define success for your participation?" required value={formData.successDef} onChange={(val) => setFormData({...formData, successDef: val})} dark={dark} />

            <FormRadio label="Expected ROI timeframe" name="roiTimeframe" options={["Immediate during event", "Within 30 days", "Within 90 days", "Within 6 months", "Long term brand building"]} value={formData.roiTimeframe || ""} onChange={handleChange} dark={dark} />
          </div>
        )}

        {/* ================= STEP 5: SUCCESS METRICS & TARGETS ================= */}
        {currentStep === 5 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Success Metrics & Targets</h2>
            <p style={{ color: textMuted, marginBottom: "20px" }}>Quantify your goals (Optional but highly recommended).</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 16px" }}>
              <FormInput label="Qualified leads target" type="number" name="targetLeads" value={formData.targetLeads || ""} onChange={handleChange} dark={dark} />
              <FormInput label="High value meetings target" type="number" name="targetMeetings" value={formData.targetMeetings || ""} onChange={handleChange} dark={dark} />
              <FormInput label="Hosted buyer meetings target" type="number" name="targetHosted" value={formData.targetHosted || ""} onChange={handleChange} dark={dark} />
              <FormInput label="Curated 1-to-1 meetings target" type="number" name="target1to1" value={formData.target1to1 || ""} onChange={handleChange} dark={dark} />
              <FormInput label="Partnership discussions target" type="number" name="targetPartners" value={formData.targetPartners || ""} onChange={handleChange} dark={dark} />
              <FormInput label="Investor meetings target" type="number" name="targetInvestors" value={formData.targetInvestors || ""} onChange={handleChange} dark={dark} />
            </div>

            <FormCheckbox label="How will your internal team evaluate event success?" name="internalEval" options={["Number of leads", "Quality of leads", "Meetings with named accounts", "Meetings with decision makers", "Market exposure", "Partner conversations", "Sales conversion potential", "Canada market understanding", "Investor traction", "Media and content value"]} valueArray={formData.internalEval} onChange={handleChange} dark={dark} />
          </div>
        )}

        {/* ================= STEP 6: TARGET ACCOUNTS ================= */}
        {currentStep === 6 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Target Accounts</h2>
            
            <FormCheckbox label="Which types of organizations do you most want to meet?" required name="targetOrgs" options={["Enterprises", "Mid market companies", "Startups", "Government departments", "Crown corporations", "Hospitals / health systems", "Banks / insurers", "Manufacturers", "Universities / research institutes", "Utilities / energy companies", "Retailers / consumer brands", "Telecom providers", "Investors / VCs", "Associations / chambers", "System integrators / channel partners"]} valueArray={formData.targetOrgs} onChange={handleChange} dark={dark} />

            <RichTextEditor label="Top 10 companies you would like to meet (One per line)" required value={formData.top10Companies} onChange={(val) => setFormData({...formData, top10Companies: val})} dark={dark} />
            
            <RichTextEditor label="Top 10 titles / designations you would like to meet (One per line)" required value={formData.top10Titles} onChange={(val) => setFormData({...formData, top10Titles: val})} dark={dark} />

            <FormCheckbox label="Preferred seniority level" name="preferredSeniority" options={["Founder", "C Suite", "EVP / SVP", "VP", "Director", "Head / Lead", "Senior Manager", "Manager", "Open to all relevant"]} valueArray={formData.preferredSeniority} onChange={handleChange} dark={dark} />

            <FormCheckbox label="Primary functional buyers you want to meet" name="functionalBuyers" options={["CEO / Founder", "CTO / CIO", "Chief AI Officer", "Chief Data Officer", "Chief Digital Officer", "Chief Innovation Officer", "Chief Information Security Officer", "Chief Sustainability Officer", "COO", "CFO", "CMO / Growth Leader", "Procurement / Sourcing", "Innovation / R&D", "IT / Technology", "Product", "Operations", "Strategy", "Partnerships", "Venture / Investments", "HR / Talent", "Government Affairs"]} valueArray={formData.functionalBuyers} onChange={handleChange} dark={dark} />
            
            <RichTextEditor label="Describe your ideal customer profile (ICP)" required value={formData.icpDesc} onChange={(val) => setFormData({...formData, icpDesc: val})} dark={dark} />
          </div>
        )}

        {/* ================= STEP 7: EVENT DELIVERY PREFERENCES ================= */}
        {currentStep === 7 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Delivery Preferences</h2>
            
            <FormCheckbox label="Which event assets are most valuable to you? (Rank Top 5)" required name="eventAssets" options={["Exhibition booth", "Speaking slot", "Panel participation", "Masterclass / workshop", "Hosted buyer meetings", "Curated B2B meetings", "VIP networking access", "CxO breakfast", "Awards night visibility", "Gala dinner networking", "Branding across venue", "Digital promotion", "Website visibility", "Newsletter inclusion", "Social media promotion", "Press / media introduction", "Investor connect", "Government connect", "Academia connect"]} valueArray={formData.eventAssets} onChange={handleChange} dark={dark} />

            <FormRadio label="Do you want pre-scheduled meetings?" required name="preScheduled" options={["Yes", "No", "Open to discussing"]} value={formData.preScheduled || ""} onChange={handleChange} dark={dark} />

            <FormCheckbox label="What kind of meetings do you prefer?" name="meetingPrefs" options={["1 to 1 hosted buyer meetings", "Curated B2B meetings", "Channel / distributor meetings", "Investor meetings", "Government stakeholder meetings", "Enterprise customer meetings", "Media meetings", "Academic / R&D meetings"]} valueArray={formData.meetingPrefs} onChange={handleChange} dark={dark} />

            <RichTextEditor label="Which message do you most want the market to associate with your brand?" required value={formData.brandMessage} onChange={(val) => setFormData({...formData, brandMessage: val})} dark={dark} />
            
            <RichTextEditor label="Top 3 products or solutions to highlight" value={formData.top3Products} onChange={(val) => setFormData({...formData, top3Products: val})} dark={dark} />
          </div>
        )}

        {/* ================= STEP 8: MARKET & OPERATIONS ================= */}
        {currentStep === 8 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Market & Operations</h2>
            
            <RichTextEditor label="Which competitors do you want to position against or alongside?" value={formData.competitors} onChange={(val) => setFormData({...formData, competitors: val})} dark={dark} />
            
            <RichTextEditor label="Are there any companies you do not want to be placed near?" value={formData.doNotPlaceNear} onChange={(val) => setFormData({...formData, doNotPlaceNear: val})} dark={dark} />

            <FormRadio label="Primary Event Strategy" name="eventStrategy" options={["Defend current market", "Enter new market", "Launch product / solution", "Generate pipeline", "Build brand authority", "Build partnerships", "Explore market"]} value={formData.eventStrategy || ""} onChange={handleChange} dark={dark} />

            <FormCheckbox label="Thought Leadership format" name="tlFormat" options={["Keynote", "Panel", "Fireside chat", "Workshop", "Product demo", "Roundtable", "Podcast / media interview"]} valueArray={formData.tlFormat} onChange={handleChange} dark={dark} />

            <RichTextEditor label="Special notes for fulfillment team" value={formData.specialNotes} onChange={(val) => setFormData({...formData, specialNotes: val})} dark={dark} />

            <FileUpload label="Upload Pitch Deck or Additional Document" onFileSelect={(file) => setFormData({...formData, attachment: file})} dark={dark} />
          </div>
        )}

        {/* ================= NAVIGATION BUTTONS ================= */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${inputBorder}`, paddingTop: "30px", marginTop: "20px" }}>
          <button 
            onClick={prevStep} 
            disabled={currentStep === 1}
            style={{ background: "transparent", color: currentStep === 1 ? (dark ? "rgba(255,255,255,0.2)" : "rgba(13,5,32,0.2)") : textMain, border: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, cursor: currentStep === 1 ? "default" : "pointer" }}
          >
            ← BACK
          </button>
          
          <button 
            onClick={() => { if(currentStep < TOTAL_STEPS) nextStep(); else alert("Form submitted!"); }}
            style={{ background: btnBg, color: btnText, padding: "14px 32px", borderRadius: "12px", border: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}
          >
            {currentStep === TOTAL_STEPS ? "SUBMIT" : "CONTINUE →"}
          </button>
        </div>

      </div>
    </div>
  );
}
