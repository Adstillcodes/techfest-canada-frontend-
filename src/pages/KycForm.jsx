import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar"; // Adjust path if needed

// Comprehensive list of country dialing codes
const COUNTRY_CODES = [
  "+1", "+7", "+20", "+27", "+30", "+31", "+32", "+33", "+34", "+36", "+39", "+40", "+41", "+43", "+44", "+45", "+46", "+47", "+48", "+49", "+51", "+52", "+53", "+54", "+55", "+56", "+57", "+58", "+60", "+61", "+62", "+63", "+64", "+65", "+66", "+81", "+82", "+84", "+86", "+90", "+91", "+92", "+93", "+94", "+95", "+98", "+212", "+213", "+216", "+218", "+220", "+221", "+222", "+223", "+224", "+225", "+226", "+227", "+228", "+229", "+230", "+231", "+232", "+233", "+234", "+235", "+236", "+237", "+238", "+239", "+240", "+241", "+242", "+243", "+244", "+245", "+246", "+248", "+249", "+250", "+251", "+252", "+253", "+254", "+255", "+256", "+257", "+258", "+260", "+261", "+262", "+263", "+264", "+265", "+266", "+267", "+268", "+269", "+290", "+291", "+297", "+298", "+299", "+350", "+351", "+352", "+353", "+354", "+355", "+356", "+357", "+358", "+359", "+370", "+371", "+372", "+373", "+374", "+375", "+376", "+377", "+378", "+380", "+381", "+382", "+385", "+386", "+387", "+389", "+420", "+421", "+423", "+500", "+501", "+502", "+503", "+504", "+505", "+506", "+507", "+508", "+509", "+590", "+591", "+592", "+593", "+594", "+595", "+596", "+597", "+598", "+599", "+852", "+853", "+855", "+856", "+880", "+886", "+960", "+961", "+962", "+963", "+964", "+965", "+966", "+967", "+968", "+971", "+972", "+973", "+974", "+975", "+976", "+977", "+992", "+993", "+994", "+995", "+996", "+998"
];

// 1. RICH TEXT EDITOR
function RichTextEditor({ value, onChange, placeholder, dark }) {
  const editorRef = useRef(null);
  const borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(122,63,209,0.14)";
  const bgMain = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  const bgToolbar = dark ? "rgba(255,255,255,0.05)" : "rgba(122,63,209,0.05)";
  const textColor = dark ? "#ffffff" : "#0d0520";

  const exec = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div style={{ background: bgMain, border: `1px solid ${borderColor}`, borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: "8px", padding: "10px", background: bgToolbar, borderBottom: `1px solid ${borderColor}` }}>
        <button type="button" onClick={() => exec("bold")} style={{ background: "none", border: "none", color: textColor, cursor: "pointer", fontWeight: "bold", padding: "4px 8px" }}>B</button>
        <button type="button" onClick={() => exec("italic")} style={{ background: "none", border: "none", color: textColor, cursor: "pointer", fontStyle: "italic", padding: "4px 8px" }}>I</button>
        <button type="button" onClick={() => exec("underline")} style={{ background: "none", border: "none", color: textColor, cursor: "pointer", textDecoration: "underline", padding: "4px 8px" }}>U</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        style={{ minHeight: "120px", padding: "14px", color: textColor, outline: "none", fontSize: "0.95rem", lineHeight: "1.5" }}
        dangerouslySetInnerHTML={{ __html: value || "" }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

// 2. FILE UPLOAD (Max 20MB)
function FileUpload({ onFileSelect, dark }) {
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  
  const borderColor = dark ? "rgba(255,255,255,0.2)" : "rgba(122,63,209,0.2)";
  const bgMain = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  const textColor = dark ? "#ffffff" : "#0d0520";

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
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: bgMain, border: `1px dashed ${borderColor}`, borderRadius: "12px", cursor: "pointer", color: textColor, fontSize: "0.9rem" }}>
        <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
        {fileName ? `Selected: ${fileName}` : "Click to upload a file (Max 20MB)"}
      </label>
      {error && <span style={{ color: "#ff4d4d", fontSize: "0.8rem" }}>{error}</span>}
    </div>
  );
}

// 3. MAIN FORM COMPONENT
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
  const [formData, setFormData] = useState({
    // Step 1: Contact
    firstName: "",
    lastName: "",
    contactEmail: "",
    phoneCode: "+1",
    phone: "",
    jobTitle: "",
    // Step 2: Company
    companyName: "",
    brandName: "",
    website: "",
    country: "",
    operationsInCanada: "",
    workEmail: "", // Duplicate field for autofill demo
    // Step 3: Additional
    description: "",
    attachment: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // --- AUTO-FILL LOGIC ---
      if (name === "contactEmail" && !prev.workEmail) {
        updated.workEmail = value;
      }
      if (name === "workEmail" && !prev.contactEmail) {
        updated.contactEmail = value;
      }

      return updated;
    });
  };

  // Restrict phone input to 10 digits only
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setFormData(prev => ({ ...prev, phone: val }));
  };

  const handleRichTextChange = (html) => setFormData({ ...formData, description: html });
  const handleFileChange = (file) => setFormData({ ...formData, attachment: file });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Progress starts at 0%
  const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  // Dynamic Theme Colors
  const bg = dark ? "#06020f" : "#ffffff";
  const textMain = dark ? "#ffffff" : "#0d0520";
  const textMuted = dark ? "rgba(255,255,255,0.6)" : "rgba(13,5,32,0.68)";
  const inputBg = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  const inputBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(122,63,209,0.14)";
  const progressBg = dark ? "rgba(6,2,15,0.9)" : "rgba(255,255,255,0.95)";
  const btnText = dark ? "#000" : "#fff";
  const btnBg = dark ? "#fff" : "#0d0520";

  const labelStyle = { display: "block", color: textMain, fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" };
  const inputStyle = { width: "100%", background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, padding: "14px", borderRadius: "10px", fontSize: "0.95rem", outline: "none", transition: "border 0.2s" };

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, fontFamily: "system-ui, sans-serif", transition: "background 0.3s ease, color 0.3s ease" }}>
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

      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 5% 100px" }}>
        
        {/* ================= STEP 1: CONTACT INFO ================= */}
        {currentStep === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Join Our Network</h2>
            <p style={{ color: textMuted, marginBottom: "40px" }}>Who should we reach out to regarding your application?</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>First Name <span style={{color:"#f5a623"}}>*</span></label>
                <input style={inputStyle} name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div>
                <label style={labelStyle}>Last Name <span style={{color:"#f5a623"}}>*</span></label>
                <input style={inputStyle} name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Primary Contact Email <span style={{color:"#f5a623"}}>*</span></label>
                <input type="email" style={inputStyle} name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="jane@acme.com" />
              </div>
              <div>
                <label style={labelStyle}>Primary Contact Phone</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select style={{...inputStyle, width: "110px", appearance: "none", cursor: "pointer"}} name="phoneCode" value={formData.phoneCode} onChange={handleChange}>
                    {COUNTRY_CODES.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                  <input style={{...inputStyle, flex: 1}} type="tel" name="phone" maxLength={10} value={formData.phone} onChange={handlePhoneChange} placeholder="4165550100" />
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: "40px" }}>
              <label style={labelStyle}>Job Title <span style={{color:"#f5a623"}}>*</span></label>
              <input style={inputStyle} name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
            </div>
          </div>
        )}

        {/* ================= STEP 2: COMPANY INFO ================= */}
        {currentStep === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Company Info</h2>
            <p style={{ color: textMuted, marginBottom: "40px" }}>Please provide accurate details to help us optimize your event experience.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Company Name <span style={{color:"#f5a623"}}>*</span></label>
                <input style={inputStyle} name="companyName" value={formData.companyName} onChange={handleChange} />
              </div>
              <div>
                <label style={labelStyle}>Brand Name (if different)</label>
                <input style={inputStyle} name="brandName" value={formData.brandName} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Website <span style={{color:"#f5a623"}}>*</span></label>
                <input style={inputStyle} name="website" value={formData.website} onChange={handleChange} />
              </div>
              <div>
                <label style={labelStyle}>Country of HQ <span style={{color:"#f5a623"}}>*</span></label>
                <select style={{...inputStyle, appearance: "none", cursor: "pointer"}} name="country" value={formData.country} onChange={handleChange}>
                  <option value="">Select country...</option>
                  <option value="Canada">Canada</option>
                  <option value="USA">United States</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Work Email (Auto-filled) <span style={{color:"#f5a623"}}>*</span></label>
              <input type="email" style={inputStyle} name="workEmail" value={formData.workEmail} onChange={handleChange} />
            </div>

            <div style={{ marginBottom: "40px" }}>
              <label style={labelStyle}>Operations in Canada? <span style={{color:"#f5a623"}}>*</span></label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                {["Yes", "No", "Planned market entry"].map(opt => (
                  <label key={opt} style={{ display: "flex", alignItems: "center", gap: "10px", background: inputBg, border: formData.operationsInCanada === opt ? "1px solid #7a3fd1" : `1px solid ${inputBorder}`, padding: "14px", borderRadius: "10px", cursor: "pointer", transition: "border 0.2s ease" }}>
                    <input type="radio" name="operationsInCanada" value={opt} checked={formData.operationsInCanada === opt} onChange={handleChange} style={{ accentColor: "#7a3fd1" }} />
                    <span style={{ fontSize: "0.9rem", color: textMain }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: ADDITIONAL (Rich Text & File Upload Demo) ================= */}
        {currentStep === 3 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px" }}>Additional Details</h2>
            <p style={{ color: textMuted, marginBottom: "40px" }}>Tell us more about your exhibition goals and upload relevant documents.</p>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Describe your goals (Use formatting)</label>
              <RichTextEditor value={formData.description} onChange={handleRichTextChange} placeholder="Enter your text here..." dark={dark} />
            </div>

            <div style={{ marginBottom: "40px" }}>
              <label style={labelStyle}>Upload Pitch Deck or Document</label>
              <FileUpload onFileSelect={handleFileChange} dark={dark} />
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${inputBorder}`, paddingTop: "30px" }}>
          <button 
            onClick={prevStep} 
            disabled={currentStep === 1}
            style={{ background: "transparent", color: currentStep === 1 ? (dark ? "rgba(255,255,255,0.2)" : "rgba(13,5,32,0.2)") : textMain, border: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, cursor: currentStep === 1 ? "default" : "pointer" }}
          >
            ← BACK
          </button>
          
          <button 
            onClick={nextStep}
            style={{ background: btnBg, color: btnText, padding: "14px 32px", borderRadius: "12px", border: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}
          >
            CONTINUE →
          </button>
        </div>

      </div>
    </div>
  );
}
