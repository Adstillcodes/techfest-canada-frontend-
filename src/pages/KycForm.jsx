import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const COUNTRY_CODES = [
  { code: "+1", flag: "🇨🇦/🇺🇸" }, { code: "+44", flag: "🇬🇧" }, { code: "+91", flag: "🇮🇳" }, 
  { code: "+61", flag: "🇦🇺" }, { code: "+81", flag: "🇯🇵" }, { code: "+49", flag: "🇩🇪" },
  { code: "+33", flag: "🇫🇷" }, { code: "+39", flag: "🇮🇹" }, { code: "+55", flag: "🇧🇷" },
  { code: "+52", flag: "🇲🇽" }, { code: "+34", flag: "🇪🇸" }, { code: "+86", flag: "🇨🇳" },
  { code: "+971", flag: "🇦🇪" }, { code: "+966", flag: "🇸🇦" }, { code: "+27", flag: "🇿🇦" },
  { code: "+65", flag: "🇸🇬" }, { code: "+41", flag: "🇨🇭" }, { code: "+46", flag: "🇸🇪" },
  { code: "+31", flag: "🇳🇱" }, { code: "+972", flag: "🇮🇱" }, { code: "+82", flag: "🇰🇷" },
  { code: "Other", flag: "🌐" }
];

function QuestionLabel({ num, label, required, dark }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", color: textMain, fontSize: "1.1rem", fontWeight: "600", marginBottom: "16px", lineHeight: "1.4" }}>
      <span style={{ color: dark ? "#f5a623" : "#d98a14", fontWeight: "800" }}>{num}.</span>
      <span>
        {label} {required && <span style={{ color: "#f5a623", marginLeft: "4px" }}>*</span>}
      </span>
    </label>
  );
}

function FormInput({ num, label, required, dark, error, ...props }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.03)";
  const inputBorder = error ? "#ff4d4d" : "transparent";

  return (
    <div style={{ marginBottom: "40px" }}>
      <QuestionLabel num={num} label={label} required={required} dark={dark} />
      <input 
        style={{ width: "100%", background: inputBg, border: `2px solid ${inputBorder}`, color: textMain, padding: "18px 20px", borderRadius: "12px", fontSize: "1.05rem", outline: "none", transition: "all 0.2s", boxShadow: dark ? "inset 0 2px 4px rgba(0,0,0,0.2)" : "inset 0 2px 4px rgba(0,0,0,0.05)" }}
        onFocus={(e) => { if(!error) e.target.style.border = `2px solid ${dark ? "rgba(255,255,255,0.2)" : "rgba(122,63,209,0.2)"}` }}
        onBlur={(e) => { if(!error) e.target.style.border = "2px solid transparent" }}
        {...props} 
      />
    </div>
  );
}

function FormSelect({ num, label, required, dark, options, error, ...props }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.03)";
  const inputBorder = error ? "#ff4d4d" : "transparent";

  return (
    <div style={{ marginBottom: "40px" }}>
      <QuestionLabel num={num} label={label} required={required} dark={dark} />
      <select 
        style={{ width: "100%", background: inputBg, border: `2px solid ${inputBorder}`, color: textMain, padding: "18px 20px", borderRadius: "12px", fontSize: "1.05rem", outline: "none", appearance: "none", cursor: "pointer", boxShadow: dark ? "inset 0 2px 4px rgba(0,0,0,0.2)" : "inset 0 2px 4px rgba(0,0,0,0.05)" }}
        {...props}
      >
        <option value="">Select an option...</option>
        {options.map(opt => <option key={opt} value={opt} style={{ color: "#000" }}>{opt}</option>)}
      </select>
    </div>
  );
}

function FormRadio({ num, label, required, name, options, value, onChange, dark, error }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.03)";
  const activeBg = dark ? "rgba(122,63,209,0.2)" : "rgba(122,63,209,0.1)";

  return (
    <div style={{ marginBottom: "40px", padding: error ? "10px" : "0", border: error ? "2px solid #ff4d4d" : "none", borderRadius: "12px" }}>
      <QuestionLabel num={num} label={label} required={required} dark={dark} />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {options.map(opt => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: "12px", background: value === opt ? activeBg : inputBg, border: value === opt ? "2px solid #7a3fd1" : "2px solid transparent", padding: "16px 20px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s ease" }}>
            <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} style={{ transform: "scale(1.2)", accentColor: "#7a3fd1" }} />
            <span style={{ fontSize: "1.05rem", color: textMain }}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function FormCheckbox({ num, label, required, name, options, valueArray, onChange, dark, error }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.03)";
  const activeBg = dark ? "rgba(122,63,209,0.2)" : "rgba(122,63,209,0.1)";

  const handleToggle = (opt) => {
    let newArray = [...(valueArray || [])];
    if (newArray.includes(opt)) newArray = newArray.filter(i => i !== opt);
    else newArray.push(opt);
    onChange({ target: { name, value: newArray } });
  };

  return (
    <div style={{ marginBottom: "40px", padding: error ? "10px" : "0", border: error ? "2px solid #ff4d4d" : "none", borderRadius: "12px" }}>
      <QuestionLabel num={num} label={label} required={required} dark={dark} />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {options.map(opt => {
          const isChecked = (valueArray || []).includes(opt);
          return (
            <label key={opt} style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: isChecked ? activeBg : inputBg, border: isChecked ? "2px solid #7a3fd1" : "2px solid transparent", padding: "16px 20px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s ease" }}>
              <input type="checkbox" checked={isChecked} onChange={() => handleToggle(opt)} style={{ transform: "scale(1.2)", accentColor: "#7a3fd1", marginTop: "4px" }} />
              <span style={{ fontSize: "1.05rem", color: textMain, lineHeight: 1.4 }}>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function RichTextEditor({ num, label, required, value, onChange, dark, error }) {
  const editorRef = useRef(null);
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.03)";
  const bgToolbar = dark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.06)";
  const inputBorder = error ? "#ff4d4d" : "transparent";

  useEffect(() => {
    if (editorRef.current && value && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };

  const btnStyle = { background: "none", border: "none", color: textMain, cursor: "pointer", padding: "6px 10px", borderRadius: "6px", fontSize: "0.9rem" };

  return (
    <div style={{ marginBottom: "40px" }}>
      <QuestionLabel num={num} label={label} required={required} dark={dark} />
      <div style={{ background: inputBg, border: `2px solid ${inputBorder}`, borderRadius: "12px", overflow: "hidden", boxShadow: dark ? "inset 0 2px 4px rgba(0,0,0,0.2)" : "inset 0 2px 4px rgba(0,0,0,0.05)" }}>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "10px", background: bgToolbar, borderBottom: dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" }}>
          <button type="button" onClick={() => exec("bold")} style={{ ...btnStyle, fontWeight: "bold" }}>B</button>
          <button type="button" onClick={() => exec("italic")} style={{ ...btnStyle, fontStyle: "italic" }}>I</button>
          <button type="button" onClick={() => exec("underline")} style={{ ...btnStyle, textDecoration: "underline" }}>U</button>
          <div style={{ width: "1px", background: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", margin: "0 4px" }} />
          <button type="button" onClick={() => exec("insertUnorderedList")} style={{ ...btnStyle }}>• List</button>
          <button type="button" onClick={() => exec("hiliteColor", "yellow")} style={{ ...btnStyle, background: "rgba(245,166,35,0.3)" }}>Highlight</button>
          <div style={{ width: "1px", background: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", margin: "0 4px" }} />
          
          <select onChange={(e) => exec("fontName", e.target.value)} style={{ background: "transparent", border: "none", color: textMain, outline: "none", cursor: "pointer" }}>
            <option value="Arial">Sans-Serif</option>
            <option value="Georgia">Serif</option>
            <option value="Courier New">Monospace</option>
          </select>
          
          <select onChange={(e) => exec("fontSize", e.target.value)} style={{ background: "transparent", border: "none", color: textMain, outline: "none", cursor: "pointer" }}>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>
        </div>

        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          style={{ minHeight: "150px", padding: "20px", color: textMain, outline: "none", fontSize: "1.05rem", lineHeight: "1.6" }}
        />
      </div>
    </div>
  );
}

function ReviewField({ num, label, value, isHtml, dark }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const displayValue = Array.isArray(value) ? value.join(", ") : value;
  const textMain = dark ? "#ffffff" : "#0d0520";
  
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: "#f5a623", marginBottom: "8px", fontWeight: 700 }}>
        {num}. {label}
      </div>
      {isHtml ? (
        <div style={{ fontSize: "1.1rem", lineHeight: "1.6", color: textMain, background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "12px" }} dangerouslySetInnerHTML={{ __html: displayValue }} />
      ) : (
        <div style={{ fontSize: "1.1rem", lineHeight: "1.6", color: textMain, background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "12px" }}>{displayValue}</div>
      )}
    </div>
  );
}


export default function KYCForm() {
  const [dark, setDark] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const TOTAL_STEPS = 6; 
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kycFormDraft");
      if (saved) return JSON.parse(saved);
    }
    return { primaryPhoneCode: "+1" };
  });

  useEffect(() => {
    if (typeof document !== "undefined" && document.body) {
      setDark(document.body.classList.contains("dark-mode"));
      const obs = new MutationObserver(() => setDark(document.body.classList.contains("dark-mode")));
      obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
      return () => obs.disconnect();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kycFormDraft", JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (missingFields.includes(name)) {
      setMissingFields(prev => prev.filter(f => f !== name));
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData(prev => ({ ...prev, primaryPhone: val }));
  };

  const validateStep = () => {
    let required = [];
    if (currentStep === 1) required = ["primaryFirstName", "primaryLastName", "primaryEmail", "primaryTitle"];
    if (currentStep === 2) required = ["companyName", "website", "countryHQ", "mainOfficeCity", "mainOfficeCountry", "operationsCanada", "participationType"];
    if (currentStep === 3) required = ["primaryIndustry", "companyDesc", "subIndustry", "productDesc"];
    if (currentStep === 4) required = ["primaryReasons", "successDef", "topOutcomes"];
    
    const missing = required.filter(field => {
      const val = formData[field];
      return !val || (Array.isArray(val) && val.length === 0);
    });

    if (missing.length > 0) {
      setMissingFields(missing);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    
    setMissingFields([]);
    return true;
  };

  const handleNext = async () => {
    if (validateStep()) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(prev => prev + 1);
      } else {
        try {
          const response = await fetch("/api/kyc-submit", { 
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            throw new Error("Failed to save application");
          }

          localStorage.removeItem("kycFormDraft");
          setIsSubmitted(true);

        } catch (error) {
          console.error("Backend save error", error);
          alert("There was an issue saving your application. Please try again.");
        }
      }
    }
  };

  const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  const bg = dark ? "#06020f" : "#fdfbfa";
  const textMain = dark ? "#ffffff" : "#0d0520";
  const textMuted = dark ? "rgba(255,255,255,0.5)" : "rgba(13,5,32,0.5)";
  const btnText = dark ? "#000" : "#fff";
  const btnBg = dark ? "#fff" : "#0d0520";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, transition: "background 0.3s ease, color 0.3s ease", position: "relative" }}>
      <Navbar />

      <div style={{ position: "sticky", top: "80px", zIndex: 100, background: dark ? "rgba(6,2,15,0.9)" : "rgba(253,251,250,0.9)", backdropFilter: "blur(12px)", padding: "16px 5%", borderBottom: dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto", height: "6px", background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, #7a3fd1, #f5a623)", transition: "width 0.5s cubic-bezier(0.25, 1, 0.5, 1)" }} />
        </div>
      </div>

      <div style={{ maxWidth: "700px", margin: "80px auto 40px", padding: "0 5%" }}>
        
        {missingFields.length > 0 && (
          <div style={{ background: "rgba(255, 77, 77, 0.1)", color: "#ff4d4d", padding: "16px", borderRadius: "12px", marginBottom: "40px", fontWeight: 600 }}>
            Please fill out all required fields before proceeding.
          </div>
        )}

        {currentStep === 1 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <FormInput num="1" label="First Name" required name="primaryFirstName" placeholder="Jane" value={formData.primaryFirstName || ""} onChange={handleChange} dark={dark} error={missingFields.includes("primaryFirstName")} />
            <FormInput num="2" label="Last Name" required name="primaryLastName" placeholder="Smith" value={formData.primaryLastName || ""} onChange={handleChange} dark={dark} error={missingFields.includes("primaryLastName")} />
            <FormInput num="3" label="Primary Contact Email" required type="email" name="primaryEmail" placeholder="jane.smith@example.com" value={formData.primaryEmail || ""} onChange={handleChange} dark={dark} error={missingFields.includes("primaryEmail")} />
            
            <div style={{ marginBottom: "40px" }}>
              <QuestionLabel num="4" label="Primary Contact Phone" required={false} dark={dark} />
              <div style={{ display: "flex", gap: "12px" }}>
                <select style={{ width: "140px", background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: "none", color: textMain, padding: "18px", borderRadius: "12px", fontSize: "1.05rem", outline: "none", appearance: "none", cursor: "pointer" }} name="primaryPhoneCode" value={formData.primaryPhoneCode || "+1"} onChange={handleChange}>
                  {COUNTRY_CODES.map(c => <option key={c.code} value={c.code} style={{ color: "#000" }}>{c.flag} {c.code}</option>)}
                </select>
                <input style={{ flex: 1, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: "none", color: textMain, padding: "18px 20px", borderRadius: "12px", fontSize: "1.05rem", outline: "none" }} type="tel" maxLength="10" placeholder="4165550100" value={formData.primaryPhone || ""} onChange={handlePhoneChange} />
              </div>
            </div>

            <FormInput num="5" label="Job Title" required name="primaryTitle" value={formData.primaryTitle || ""} onChange={handleChange} dark={dark} error={missingFields.includes("primaryTitle")} />
            <FormInput num="6" label="Secondary Contact Name (Optional)" name="secondaryName" value={formData.secondaryName || ""} onChange={handleChange} dark={dark} />
            <FormInput num="7" label="Secondary Contact Title (Optional)" name="secondaryTitle" value={formData.secondaryTitle || ""} onChange={handleChange} dark={dark} />
            <FormInput num="8" label="Secondary Contact Email (Optional)" type="email" name="secondaryEmail" value={formData.secondaryEmail || ""} onChange={handleChange} dark={dark} />
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <FormInput num="9" label="Company Name" required name="companyName" value={formData.companyName || ""} onChange={handleChange} dark={dark} error={missingFields.includes("companyName")} />
            <FormInput num="10" label="Brand Name (if different)" name="brandName" value={formData.brandName || ""} onChange={handleChange} dark={dark} />
            <FormInput num="11" label="Website" required name="website" placeholder="https://" value={formData.website || ""} onChange={handleChange} dark={dark} error={missingFields.includes("website")} />
            <FormSelect num="12" label="Country of Headquarters" required name="countryHQ" options={["Canada", "USA", "UK", "Europe", "India", "Middle East", "APAC", "Other"]} value={formData.countryHQ || ""} onChange={handleChange} dark={dark} error={missingFields.includes("countryHQ")} />
            <FormInput num="13" label="City of Main Office" required name="mainOfficeCity" value={formData.mainOfficeCity || ""} onChange={handleChange} dark={dark} error={missingFields.includes("mainOfficeCity")} />
            <FormInput num="14" label="Country of Main Office" required name="mainOfficeCountry" value={formData.mainOfficeCountry || ""} onChange={handleChange} dark={dark} error={missingFields.includes("mainOfficeCountry")} />
            <FormRadio num="15" label="Do you have operations in Canada?" required name="operationsCanada" options={["Yes", "No", "Planned market entry"]} value={formData.operationsCanada || ""} onChange={handleChange} dark={dark} error={missingFields.includes("operationsCanada")} />
            <FormCheckbox num="16" label="Type of Participation" required name="participationType" options={["Sponsor", "Exhibitor", "Sponsor and Exhibitor", "Speaker Partner", "Ecosystem Partner", "Startup Exhibitor"]} valueArray={formData.participationType} onChange={handleChange} dark={dark} error={missingFields.includes("participationType")} />
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <FormSelect num="17" label="Primary Industry" required name="primaryIndustry" options={["Artificial Intelligence", "Quantum Computing", "Robotics", "Cybersecurity and Digital Trust", "Climate Technology and Sustainability", "Cross sector / Multi tech"]} value={formData.primaryIndustry || ""} onChange={handleChange} dark={dark} error={missingFields.includes("primaryIndustry")} />
            <FormCheckbox num="18" label="Which best describes your company?" required name="companyDesc" options={["Technology Product Company", "Platform / SaaS Company", "Enterprise Solution Provider", "Consulting / Services Firm", "System Integrator", "Hardware / Infrastructure Provider", "Research / Lab / Deep Tech Company", "Startup", "Government / Trade Body / Association", "Academic / Innovation Institution", "Investor / VC / PE / Family Office", "Recruitment / Talent / Training Company", "Media / Community / Ecosystem Builder", "Other"]} valueArray={formData.companyDesc} onChange={handleChange} dark={dark} error={missingFields.includes("companyDesc")} />
            <FormCheckbox num="19" label="Sub Industry / Category" required name="subIndustry" options={["GenAI / LLMs", "AI Infrastructure / Compute", "AI Agents / Automation", "Data / Analytics / MLOps", "Quantum Hardware", "Quantum Software / Algorithms", "Robotics Hardware", "Industrial Automation", "Humanoid Robotics", "Cybersecurity Software", "Identity / Zero Trust", "Cloud Security", "Climate / Clean Energy", "Carbon / ESG / Sustainability Tech", "Smart Infrastructure", "Other"]} valueArray={formData.subIndustry} onChange={handleChange} dark={dark} error={missingFields.includes("subIndustry")} />
            <FormCheckbox num="20" label="Applied Sector Focus (Optional)" name="sectorFocus" options={["Healthcare", "Financial Services / FinTech", "Energy and Utilities", "Manufacturing and Industrial", "Mobility and Transportation", "Government and Smart Cities", "Retail and Consumer", "Education", "Agriculture and Food", "Telecom", "Defence and Public Safety", "Cross sector"]} valueArray={formData.sectorFocus} onChange={handleChange} dark={dark} />
            <FormRadio num="21" label="Company Stage (Optional)" name="companyStage" options={["Startup", "Growth Stage", "Scale Up", "Established Enterprise", "Global Corporation"]} value={formData.companyStage || ""} onChange={handleChange} dark={dark} />
            <RichTextEditor num="22" label="Describe your product, solution, or offering" required value={formData.productDesc} onChange={(val) => { setFormData({...formData, productDesc: val}); if(missingFields.includes("productDesc")) setMissingFields(prev => prev.filter(f => f !== "productDesc")); }} dark={dark} error={missingFields.includes("productDesc")} />
          </div>
        )}

        {currentStep === 4 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <FormCheckbox num="23" label="Primary reasons for participating (Rank Top 5)" required name="primaryReasons" options={["Brand visibility", "Lead generation", "Sales pipeline creation", "Customer acquisition", "Partnership development", "Investor outreach", "Channel / distributor search", "Market entry into Canada", "Thought leadership / speaking", "Product launch", "PR / media exposure", "Competitive intelligence", "Recruit talent", "Meet government / academia / ecosystem leaders", "Existing customer engagement", "Networking", "Other"]} valueArray={formData.primaryReasons} onChange={handleChange} dark={dark} error={missingFields.includes("primaryReasons")} />
            <RichTextEditor num="24" label="What would define success for your participation?" required value={formData.successDef} onChange={(val) => { setFormData({...formData, successDef: val}); if(missingFields.includes("successDef")) setMissingFields(prev => prev.filter(f => f !== "successDef")); }} dark={dark} error={missingFields.includes("successDef")} />
            <FormCheckbox num="25" label="Top success outcomes" required name="topOutcomes" options={["Number of qualified meetings", "Number of enterprise buyer meetings", "Number of government / public sector meetings", "Number of investor meetings", "Number of channel / partner meetings", "Number of booth visits", "Number of leads captured", "Number of product demos conducted", "Number of speaking attendees reached", "Brand impressions", "Press / media exposure", "Social media reach", "Strategic partnerships initiated", "Sales opportunities generated", "Market insights gathered", "Hiring conversations initiated"]} valueArray={formData.topOutcomes} onChange={handleChange} dark={dark} error={missingFields.includes("topOutcomes")} />
          </div>
        )}

        {currentStep === 5 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <RichTextEditor num="26" label="Which competitors or comparable companies do you want to position against or alongside?" value={formData.competitors} onChange={(val) => setFormData({...formData, competitors: val})} dark={dark} />
          </div>
        )}

        {currentStep === 6 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "30px" }}>Review & Submit</h2>
            {[
              { t: "Contact Info", s: 1, f: [{ l: "First Name", v: formData.primaryFirstName }, { l: "Last Name", v: formData.primaryLastName }, { l: "Email", v: formData.primaryEmail }, { l: "Phone", v: formData.primaryPhone ? `${formData.primaryPhoneCode} ${formData.primaryPhone}` : "" }, { l: "Title", v: formData.primaryTitle }] },
              { t: "Company", s: 2, f: [{ l: "Company", v: formData.companyName }, { l: "Website", v: formData.website }, { l: "HQ", v: formData.countryHQ }, { l: "City", v: formData.mainOfficeCity }, { l: "Country", v: formData.mainOfficeCountry }, { l: "Canada Ops", v: formData.operationsCanada }, { l: "Participation", v: formData.participationType }] },
              { t: "Profile", s: 3, f: [{ l: "Primary Industry", v: formData.primaryIndustry }, { l: "Description", v: formData.companyDesc }, { l: "Sub Industry", v: formData.subIndustry }, { l: "Product", v: formData.productDesc, isHtml: true }] },
              { t: "Objectives", s: 4, f: [{ l: "Reasons", v: formData.primaryReasons }, { l: "Success Def", v: formData.successDef, isHtml: true }, { l: "Outcomes", v: formData.topOutcomes }] },
              { t: "Market", s: 5, f: [{ l: "Competitors", v: formData.competitors, isHtml: true }] }
            ].map((section, idx) => (
              <div key={idx} style={{ background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderRadius: "16px", padding: "30px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>{section.t}</h3>
                  <button onClick={() => setCurrentStep(section.s)} style={{ background: "transparent", border: "none", color: "#f5a623", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>EDIT</button>
                </div>
                {section.f.map((f, i) => <ReviewField key={i} num={i + 1} label={f.l} value={f.v} isHtml={f.isHtml} dark={dark} />)}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "20px", marginTop: "60px", paddingBottom: "40px" }}>
          <button 
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setCurrentStep(prev => Math.max(prev - 1, 1)); }} 
            disabled={currentStep === 1}
            style={{ flex: 1, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", color: currentStep === 1 ? textMuted : textMain, padding: "20px", borderRadius: "12px", border: "none", fontWeight: 800, fontSize: "1.1rem", cursor: currentStep === 1 ? "default" : "pointer" }}
          >
            Previous
          </button>
          <button 
            onClick={handleNext}
            style={{ flex: 2, background: currentStep === TOTAL_STEPS ? "linear-gradient(135deg, #7a3fd1, #f5a623)" : btnBg, color: currentStep === TOTAL_STEPS ? "#fff" : btnText, padding: "20px", borderRadius: "12px", border: "none", fontWeight: 800, fontSize: "1.1rem", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          >
            {currentStep === TOTAL_STEPS ? "Submit Application" : "Continue"}
          </button>
        </div>

      </div>

      {isSubmitted && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "rgba(6,2,15,0.9)" : "rgba(253,251,250,0.9)", backdropFilter: "blur(12px)", padding: "20px" }}>
          <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease-out", maxWidth: "500px" }}>
            <div style={{ background: "rgba(245,166,35,0.1)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 30px" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "20px", color: textMain }}>All Done!</h2>
            <p style={{ color: textMuted, fontSize: "1.15rem", lineHeight: "1.6", marginBottom: "40px" }}>
              Thank you for providing your details. We have saved your application and our team will review it shortly.
            </p>
            <button 
              onClick={() => { localStorage.removeItem("kycFormDraft"); window.location.href = "/"; }}
              style={{ background: textMain, color: bg, padding: "18px 40px", borderRadius: "12px", border: "none", fontWeight: 800, fontSize: "1rem", cursor: "pointer", width: "100%" }}
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
