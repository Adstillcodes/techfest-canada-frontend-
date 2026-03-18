import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

// ==========================================
// 1. GLOBAL CONSTANTS & HELPERS
// ==========================================
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
    <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", color: textMain, fontSize: "1.15rem", fontWeight: "700", marginBottom: "16px", lineHeight: "1.4" }}>
      <span style={{ color: dark ? "#f5a623" : "#d98a14", fontWeight: "900" }}>{num}.</span>
      <span>
        {label} {required && <span style={{ color: "#f5a623", marginLeft: "4px" }}>*</span>}
      </span>
    </label>
  );
}

// ==========================================
// 2. CUSTOM FORM COMPONENTS
// ==========================================

function FormInput({ num, label, required, dark, error, ...props }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const inputBorder = error ? "#ff4d4d" : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)");
  const focusBorder = dark ? "rgba(255,255,255,0.3)" : "rgba(122,63,209,0.5)";

  return (
    <div style={{ marginBottom: "40px", background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)", padding: "24px", borderRadius: "16px", border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
      <QuestionLabel num={num} label={label} required={required} dark={dark} />
      <input 
        style={{ width: "100%", background: inputBg, border: `2px solid ${inputBorder}`, color: textMain, padding: "18px 20px", borderRadius: "12px", fontSize: "1.05rem", outline: "none", transition: "all 0.2s", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}
        onFocus={(e) => { if(!error) e.target.style.border = `2px solid ${focusBorder}` }}
        onBlur={(e) => { if(!error) e.target.style.border = `2px solid ${inputBorder}` }}
        {...props} 
      />
    </div>
  );
}

function FormRadio({ num, label, required, name, options, value, onChange, dark, error }) {
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const activeBg = dark ? "rgba(122,63,209,0.2)" : "rgba(122,63,209,0.08)";
  const inputBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  return (
    <div style={{ marginBottom: "40px", padding: "24px", background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)", borderRadius: "16px", border: error ? "2px solid #ff4d4d" : `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
      <QuestionLabel num={num} label={label} required={required} dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
        {options.map(opt => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: "12px", background: value === opt ? activeBg : inputBg, border: value === opt ? "2px solid #7a3fd1" : `2px solid ${inputBorder}`, padding: "16px 20px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}
            onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.3)" : "rgba(122,63,209,0.3)" }}
            onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.borderColor = inputBorder }}
          >
            <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} style={{ transform: "scale(1.2)", accentColor: "#7a3fd1" }} />
            <span style={{ fontSize: "1.05rem", color: textMain }}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// NEW: FULLY CUSTOM THEMED DROPDOWN (Replaces native <select>)
// ---------------------------------------------------------
function CustomDropdown({ num, label, required, name, options, value, onChange, multi = false, dark, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const menuBg = dark ? "#1a122e" : "#ffffff";
  const inputBorder = error ? "#ff4d4d" : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)");
  const hoverBg = dark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.08)";

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    if (multi) {
      let newArray = [...(value || [])];
      if (newArray.includes(opt)) newArray = newArray.filter(i => i !== opt);
      else newArray.push(opt);
      onChange({ target: { name, value: newArray } });
    } else {
      onChange({ target: { name, value: opt } });
      setIsOpen(false);
    }
  };

  // Display logic for the selected value(s)
  let displayValue = "Select an option...";
  if (multi && value && value.length > 0) {
    displayValue = `${value.length} selected`;
  } else if (!multi && value) {
    displayValue = value;
  }

  return (
    <div style={{ marginBottom: "40px", background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)", padding: "24px", borderRadius: "16px", border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }} ref={dropdownRef}>
      <QuestionLabel num={num} label={label} required={required} dark={dark} />
      
      <div style={{ position: "relative" }}>
        {/* Dropdown Header */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{ width: "100%", background: inputBg, border: `2px solid ${isOpen ? (dark ? "rgba(255,255,255,0.3)" : "rgba(122,63,209,0.5)") : inputBorder}`, color: (value && value.length > 0) ? textMain : (dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"), padding: "18px 20px", borderRadius: "12px", fontSize: "1.05rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}
        >
          <span>{displayValue}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        {/* Dropdown Menu List */}
        {isOpen && (
          <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: "100%", background: menuBg, border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: "12px", maxHeight: "300px", overflowY: "auto", zIndex: 50, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", animation: "fadeIn 0.2s ease" }}>
            {options.map(opt => {
              const isSelected = multi ? (value || []).includes(opt) : value === opt;
              return (
                <div 
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  style={{ padding: "16px 20px", color: textMain, fontSize: "1.05rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, background: isSelected ? hoverBg : "transparent", transition: "background 0.1s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = isSelected ? hoverBg : "transparent"}
                >
                  {/* Checkbox Icon for Multi-Select */}
                  {multi && (
                    <div style={{ width: "20px", height: "20px", border: `2px solid ${isSelected ? "#7a3fd1" : (dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)")}`, borderRadius: "4px", background: isSelected ? "#7a3fd1" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                  )}
                  {opt}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function RichTextEditor({ num, label, required, value, onChange, dark, error }) {
  const editorRef = useRef(null);
  const textMain = dark ? "#ffffff" : "#0d0520";
  const inputBg = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const bgToolbar = dark ? "rgba(255,255,255,0.02)" : "#fafafa";
  const inputBorder = error ? "#ff4d4d" : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)");

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

  const btnStyle = { background: "transparent", border: "none", color: textMain, cursor: "pointer", padding: "6px 10px", borderRadius: "6px", fontSize: "0.9rem" };

  return (
    <div style={{ marginBottom: "40px", background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)", padding: "24px", borderRadius: "16px", border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
      <QuestionLabel num={num} label={label} required={required} dark={dark} />
      <div style={{ background: inputBg, border: `2px solid ${inputBorder}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "10px", background: bgToolbar, borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
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
        <div style={{ fontSize: "1.1rem", lineHeight: "1.6", color: textMain, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", padding: "16px", borderRadius: "12px" }} dangerouslySetInnerHTML={{ __html: displayValue }} />
      ) : (
        <div style={{ fontSize: "1.1rem", lineHeight: "1.6", color: textMain, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", padding: "16px", borderRadius: "12px" }}>{displayValue}</div>
      )}
    </div>
  );
}


// ==========================================
// 3. MAIN FORM COMPONENT
// ==========================================
export default function KYCForm() {
  const [dark, setDark] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  // Total Steps: 1-5 (Form), 6 (Review), 7 (Final Email Conf)
  const TOTAL_STEPS = 7; 
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
    if (currentStep === 2) required = ["companyName", "website", "countryHQ", "mainOfficeCity", "mainOfficeCountry", "operationsCanada"];
    if (currentStep === 3) required = ["primaryIndustry", "companyDesc", "subIndustry", "productDesc"];
    if (currentStep === 4) required = ["primaryReasons", "successDef", "topOutcomes"];
    if (currentStep === 7) required = ["finalConfirmationEmail"]; // New requirement for final step
    
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
        // Pre-fill final confirmation email if it hasn't been set
        if (currentStep === 6 && !formData.finalConfirmationEmail) {
          setFormData(prev => ({ ...prev, finalConfirmationEmail: prev.primaryEmail }));
        }
        setCurrentStep(prev => prev + 1);
      } else {
        try {
          // MONGO DB BACKEND SAVE
          const response = await fetch("/api/kyc", { 
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
  const textMuted = dark ? "rgba(255,255,255,0.6)" : "rgba(13,5,32,0.6)";
  const btnText = dark ? "#000" : "#fff";
  const btnBg = dark ? "#fff" : "#0d0520";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, transition: "background 0.3s ease, color 0.3s ease", position: "relative" }}>
      <Navbar />

      {/* STICKY STATUS BAR */}
      <div style={{ position: "sticky", top: "80px", zIndex: 100, background: dark ? "rgba(6,2,15,0.95)" : "rgba(253,251,250,0.95)", backdropFilter: "blur(12px)", padding: "16px 5%", borderBottom: dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ flex: 1, height: "6px", background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, #7a3fd1, #f5a623)", transition: "width 0.5s cubic-bezier(0.25, 1, 0.5, 1)" }} />
          </div>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.85rem", color: textMain }}>
            {progressPercent}% <span style={{ color: textMuted }}>COMPLETED</span>
          </span>
        </div>
      </div>

      {/* FORM CONTAINER - Expanded to 1000px */}
      <div style={{ maxWidth: "1000px", margin: "60px auto 80px", padding: "0 5%" }}>
        
        {missingFields.length > 0 && (
          <div style={{ background: "rgba(255, 77, 77, 0.1)", color: "#ff4d4d", padding: "16px 20px", borderRadius: "12px", marginBottom: "40px", fontWeight: 600, display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Please complete all required fields before moving forward.
          </div>
        )}

        {/* ================= STEP 1: CONTACT INFO ================= */}
        {currentStep === 1 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 900, marginBottom: "12px" }}>Primary Details</h2>
              <p style={{ color: textMuted, fontSize: "1.1rem" }}>Let's start with your contact information.</p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0 24px" }}>
              <FormInput num="1" label="First Name" required name="primaryFirstName" placeholder="Jane" value={formData.primaryFirstName || ""} onChange={handleChange} dark={dark} error={missingFields.includes("primaryFirstName")} />
              <FormInput num="2" label="Last Name" required name="primaryLastName" placeholder="Smith" value={formData.primaryLastName || ""} onChange={handleChange} dark={dark} error={missingFields.includes("primaryLastName")} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0 24px" }}>
              <FormInput num="3" label="Primary Contact Email" required type="email" name="primaryEmail" placeholder="jane.smith@example.com" value={formData.primaryEmail || ""} onChange={handleChange} dark={dark} error={missingFields.includes("primaryEmail")} />
              
              <div style={{ marginBottom: "40px", background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)", padding: "24px", borderRadius: "16px", border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                <QuestionLabel num="4" label="Primary Contact Phone" required={false} dark={dark} />
                <div style={{ display: "flex", gap: "12px" }}>
                  <select style={{ width: "140px", background: dark ? "rgba(255,255,255,0.04)" : "#ffffff", border: `2px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, color: textMain, padding: "18px", borderRadius: "12px", fontSize: "1.05rem", outline: "none", appearance: "none", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }} name="primaryPhoneCode" value={formData.primaryPhoneCode || "+1"} onChange={handleChange}>
                    {COUNTRY_CODES.map(c => <option key={c.code} value={c.code} style={{ color: "#000" }}>{c.flag} {c.code}</option>)}
                  </select>
                  <input style={{ flex: 1, background: dark ? "rgba(255,255,255,0.04)" : "#ffffff", border: `2px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, color: textMain, padding: "18px 20px", borderRadius: "12px", fontSize: "1.05rem", outline: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }} type="tel" maxLength="10" placeholder="4165550100" value={formData.primaryPhone || ""} onChange={handlePhoneChange} />
                </div>
              </div>
            </div>

            <FormInput num="5" label="Job Title" required name="primaryTitle" value={formData.primaryTitle || ""} onChange={handleChange} dark={dark} error={missingFields.includes("primaryTitle")} />
          </div>
        )}

        {/* ================= STEP 2: COMPANY INFO ================= */}
        {currentStep === 2 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 900, marginBottom: "12px" }}>Company Information</h2>
              <p style={{ color: textMuted, fontSize: "1.1rem" }}>Provide details about your organization to help us optimize your experience.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0 24px" }}>
              <FormInput num="6" label="Company Name" required name="companyName" value={formData.companyName || ""} onChange={handleChange} dark={dark} error={missingFields.includes("companyName")} />
              <FormInput num="7" label="Brand Name (if different)" name="brandName" value={formData.brandName || ""} onChange={handleChange} dark={dark} />
            </div>
            
            <FormInput num="8" label="Website" required name="website" placeholder="https://" value={formData.website || ""} onChange={handleChange} dark={dark} error={missingFields.includes("website")} />
            
            {/* >5 Options = Custom Dropdown */}
            <CustomDropdown num="9" label="Country of Headquarters" required name="countryHQ" options={["Canada", "USA", "UK", "Europe", "India", "Middle East", "APAC", "Other"]} value={formData.countryHQ || ""} onChange={handleChange} dark={dark} error={missingFields.includes("countryHQ")} />
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0 24px" }}>
              <FormInput num="10" label="City of Main Office" required name="mainOfficeCity" value={formData.mainOfficeCity || ""} onChange={handleChange} dark={dark} error={missingFields.includes("mainOfficeCity")} />
              <FormInput num="11" label="Country of Main Office" required name="mainOfficeCountry" value={formData.mainOfficeCountry || ""} onChange={handleChange} dark={dark} error={missingFields.includes("mainOfficeCountry")} />
            </div>

            <FormRadio num="12" label="Do you have operations in Canada?" required name="operationsCanada" options={["Yes", "No", "Planned market entry"]} value={formData.operationsCanada || ""} onChange={handleChange} dark={dark} error={missingFields.includes("operationsCanada")} />
          </div>
        )}

        {/* ================= STEP 3: BUSINESS PROFILE ================= */}
        {currentStep === 3 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 900, marginBottom: "12px" }}>Business Profile</h2>
              <p style={{ color: textMuted, fontSize: "1.1rem" }}>Tell us more about your industry and products.</p>
            </div>

            {/* All these are >5 options, so they use the new CustomDropdown. */}
            <CustomDropdown num="13" label="Primary Industry" required name="primaryIndustry" options={["Artificial Intelligence", "Quantum Computing", "Robotics", "Cybersecurity and Digital Trust", "Climate Technology and Sustainability", "Cross sector / Multi tech"]} value={formData.primaryIndustry || ""} onChange={handleChange} dark={dark} error={missingFields.includes("primaryIndustry")} />
            
            <CustomDropdown num="14" label="Which best describes your company? (Select all that apply)" required name="companyDesc" multi options={["Technology Product Company", "Platform / SaaS Company", "Enterprise Solution Provider", "Consulting / Services Firm", "System Integrator", "Hardware / Infrastructure Provider", "Research / Lab / Deep Tech Company", "Startup", "Government / Trade Body / Association", "Academic / Innovation Institution", "Investor / VC / PE / Family Office", "Recruitment / Talent / Training Company", "Media / Community / Ecosystem Builder", "Other"]} value={formData.companyDesc} onChange={handleChange} dark={dark} error={missingFields.includes("companyDesc")} />
            
            <CustomDropdown num="15" label="Sub Industry / Category" required name="subIndustry" multi options={["GenAI / LLMs", "AI Infrastructure / Compute", "AI Agents / Automation", "Data / Analytics / MLOps", "Quantum Hardware", "Quantum Software / Algorithms", "Robotics Hardware", "Industrial Automation", "Humanoid Robotics", "Cybersecurity Software", "Identity / Zero Trust", "Cloud Security", "Climate / Clean Energy", "Carbon / ESG / Sustainability Tech", "Smart Infrastructure", "Other"]} value={formData.subIndustry} onChange={handleChange} dark={dark} error={missingFields.includes("subIndustry")} />
            
            <CustomDropdown num="16" label="Applied Sector Focus (Optional)" name="sectorFocus" multi options={["Healthcare", "Financial Services / FinTech", "Energy and Utilities", "Manufacturing and Industrial", "Mobility and Transportation", "Government and Smart Cities", "Retail and Consumer", "Education", "Agriculture and Food", "Telecom", "Defence and Public Safety", "Cross sector"]} value={formData.sectorFocus} onChange={handleChange} dark={dark} />
            
            <FormRadio num="17" label="Company Stage (Optional)" name="companyStage" options={["Startup", "Growth Stage", "Scale Up", "Established Enterprise", "Global Corporation"]} value={formData.companyStage || ""} onChange={handleChange} dark={dark} />
            
            <RichTextEditor num="18" label="Describe your product, solution, or offering" required value={formData.productDesc} onChange={(val) => { setFormData({...formData, productDesc: val}); if(missingFields.includes("productDesc")) setMissingFields(prev => prev.filter(f => f !== "productDesc")); }} dark={dark} error={missingFields.includes("productDesc")} />
          </div>
        )}

        {/* ================= STEP 4: PARTICIPATION OBJECTIVES ================= */}
        {currentStep === 4 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 900, marginBottom: "12px" }}>Objectives</h2>
              <p style={{ color: textMuted, fontSize: "1.1rem" }}>Help us understand your goals for the event.</p>
            </div>

            <CustomDropdown num="19" label="Primary reasons for participating" required name="primaryReasons" multi options={["Brand visibility", "Lead generation", "Sales pipeline creation", "Customer acquisition", "Partnership development", "Investor outreach", "Channel / distributor search", "Market entry into Canada", "Thought leadership / speaking", "Product launch", "PR / media exposure", "Competitive intelligence", "Recruit talent", "Meet government / academia / ecosystem leaders", "Existing customer engagement", "Networking", "Other"]} value={formData.primaryReasons} onChange={handleChange} dark={dark} error={missingFields.includes("primaryReasons")} />
            
            <RichTextEditor num="20" label="What would define success for your participation?" required value={formData.successDef} onChange={(val) => { setFormData({...formData, successDef: val}); if(missingFields.includes("successDef")) setMissingFields(prev => prev.filter(f => f !== "successDef")); }} dark={dark} error={missingFields.includes("successDef")} />
            
            <CustomDropdown num="21" label="Top success outcomes" required name="topOutcomes" multi options={["Number of qualified meetings", "Number of enterprise buyer meetings", "Number of government / public sector meetings", "Number of investor meetings", "Number of channel / partner meetings", "Number of booth visits", "Number of leads captured", "Number of product demos conducted", "Number of speaking attendees reached", "Brand impressions", "Press / media exposure", "Social media reach", "Strategic partnerships initiated", "Sales opportunities generated", "Market insights gathered", "Hiring conversations initiated"]} value={formData.topOutcomes} onChange={handleChange} dark={dark} error={missingFields.includes("topOutcomes")} />
          </div>
        )}

        {/* ================= STEP 5: MARKET ================= */}
        {currentStep === 5 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 900, marginBottom: "12px" }}>Market Positioning</h2>
            </div>
            <RichTextEditor num="22" label="Which competitors or comparable companies do you want to position against or alongside?" value={formData.competitors} onChange={(val) => setFormData({...formData, competitors: val})} dark={dark} />
          </div>
        )}

        {/* ================= STEP 6: REVIEW ================= */}
        {currentStep === 6 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 900, marginBottom: "12px" }}>Review Your Application</h2>
              <p style={{ color: textMuted, fontSize: "1.1rem" }}>Please review your answers before final submission.</p>
            </div>
            
            {[
              { t: "Primary Details", s: 1, f: [{ l: "First Name", v: formData.primaryFirstName }, { l: "Last Name", v: formData.primaryLastName }, { l: "Email", v: formData.primaryEmail }, { l: "Phone", v: formData.primaryPhone ? `${formData.primaryPhoneCode} ${formData.primaryPhone}` : "" }, { l: "Title", v: formData.primaryTitle }] },
              { t: "Company Information", s: 2, f: [{ l: "Company", v: formData.companyName }, { l: "Website", v: formData.website }, { l: "HQ", v: formData.countryHQ }, { l: "City", v: formData.mainOfficeCity }, { l: "Country", v: formData.mainOfficeCountry }, { l: "Canada Ops", v: formData.operationsCanada }] },
              { t: "Business Profile", s: 3, f: [{ l: "Primary Industry", v: formData.primaryIndustry }, { l: "Description", v: formData.companyDesc }, { l: "Sub Industry", v: formData.subIndustry }, { l: "Product", v: formData.productDesc, isHtml: true }] },
              { t: "Objectives", s: 4, f: [{ l: "Reasons", v: formData.primaryReasons }, { l: "Success Def", v: formData.successDef, isHtml: true }, { l: "Outcomes", v: formData.topOutcomes }] },
              { t: "Market Positioning", s: 5, f: [{ l: "Competitors", v: formData.competitors, isHtml: true }] }
            ].map((section, idx) => (
              <div key={idx} style={{ background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderRadius: "20px", padding: "40px", marginBottom: "30px", border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, paddingBottom: "20px" }}>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>{section.t}</h3>
                  <button onClick={() => setCurrentStep(section.s)} style={{ background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: "none", color: textMain, fontWeight: 700, padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}>Edit Section</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                  {section.f.map((f, i) => <ReviewField key={i} num={i + 1} label={f.l} value={f.v} isHtml={f.isHtml} dark={dark} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= STEP 7: FINAL CONFIRMATION ================= */}
        {currentStep === 7 && (
          <div style={{ animation: "fadeIn 0.5s ease", textAlign: "center", padding: "60px 0" }}>
            <div style={{ background: "rgba(122,63,209,0.1)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 30px" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7a3fd1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.8rem", fontWeight: 900, marginBottom: "20px" }}>Almost There!</h2>
            <p style={{ color: textMuted, fontSize: "1.2rem", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto 40px" }}>
              Thank you for filling out the form. Please confirm the email address where we should send a copy of your application and your next steps.
            </p>
            
            <div style={{ maxWidth: "500px", margin: "0 auto 40px", textAlign: "left" }}>
              <FormInput num="✓" label="Confirmation Email Address" required name="finalConfirmationEmail" value={formData.finalConfirmationEmail || ""} onChange={handleChange} dark={dark} error={missingFields.includes("finalConfirmationEmail")} />
            </div>
          </div>
        )}

        {/* NAVIGATION BOTTOM BAR */}
        <div style={{ display: "flex", gap: "20px", marginTop: "60px", paddingTop: "40px", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
          <button 
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setCurrentStep(prev => Math.max(prev - 1, 1)); }} 
            disabled={currentStep === 1}
            style={{ flex: 1, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", color: currentStep === 1 ? textMuted : textMain, padding: "24px", borderRadius: "16px", border: "none", fontWeight: 800, fontSize: "1.1rem", cursor: currentStep === 1 ? "default" : "pointer", transition: "background 0.2s" }}
            onMouseEnter={(e) => { if(currentStep !== 1) e.currentTarget.style.background = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
            onMouseLeave={(e) => { if(currentStep !== 1) e.currentTarget.style.background = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
          >
            ← Previous
          </button>
          <button 
            onClick={handleNext}
            style={{ flex: 2, background: currentStep === TOTAL_STEPS ? "linear-gradient(135deg, #7a3fd1, #f5a623)" : btnBg, color: currentStep === TOTAL_STEPS ? "#fff" : btnText, padding: "24px", borderRadius: "16px", border: "none", fontWeight: 800, fontSize: "1.1rem", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", transition: "transform 0.2s ease" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {currentStep === 6 ? "Review & Confirm" : (currentStep === TOTAL_STEPS ? "Submit Application" : "Continue →")}
          </button>
        </div>

      </div>

      {/* FINAL SUCCESS OVERLAY */}
      {isSubmitted && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "rgba(6,2,15,0.95)" : "rgba(253,251,250,0.95)", backdropFilter: "blur(20px)", padding: "20px" }}>
          <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease-out", maxWidth: "600px", background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", padding: "60px 40px", borderRadius: "30px", border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", width: "100px", height: "100px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 30px", boxShadow: "0 10px 30px rgba(245,166,35,0.3)" }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "3rem", fontWeight: 900, marginBottom: "20px", color: textMain }}>Application Sent!</h2>
            <p style={{ color: textMuted, fontSize: "1.2rem", lineHeight: "1.6", marginBottom: "40px" }}>
              Thank you for providing your details. We have saved your application and sent a confirmation email to <strong>{formData.finalConfirmationEmail}</strong>. Our team will review your profile and be in touch shortly.
            </p>
            <button 
              onClick={() => { localStorage.removeItem("kycFormDraft"); window.location.href = "/"; }}
              style={{ background: textMain, color: bg, padding: "20px 40px", borderRadius: "16px", border: "none", fontWeight: 800, fontSize: "1.1rem", cursor: "pointer", width: "100%", transition: "transform 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              Return to Homepage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
