import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar"; // Adjust path if needed

// 1. RICH TEXT EDITOR (Defined OUTSIDE to prevent re-render scroll bugs)
function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);

  const exec = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "8px", padding: "10px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <button type="button" onClick={() => exec("bold")} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontWeight: "bold", padding: "4px 8px" }}>B</button>
        <button type="button" onClick={() => exec("italic")} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontStyle: "italic", padding: "4px 8px" }}>I</button>
        <button type="button" onClick={() => exec("underline")} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", textDecoration: "underline", padding: "4px 8px" }}>U</button>
      </div>
      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        style={{ minHeight: "120px", padding: "14px", color: "#fff", outline: "none", fontSize: "0.95rem", lineHeight: "1.5" }}
        dangerouslySetInnerHTML={{ __html: value || "" }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

// 2. FILE UPLOAD (Max 20MB)
function FileUpload({ onFileSelect }) {
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size (20MB = 20 * 1024 * 1024 bytes)
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
      <label style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "12px", cursor: "pointer", color: "#fff", fontSize: "0.9rem" }}>
        <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
        {fileName ? `Selected: ${fileName}` : "Click to upload a file (Max 20MB)"}
      </label>
      {error && <span style={{ color: "#ff4d4d", fontSize: "0.8rem" }}>{error}</span>}
    </div>
  );
}

// 3. MAIN FORM COMPONENT
export default function KYCForm() {
  const TOTAL_STEPS = 8;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Contact
    firstName: "",
    lastName: "",
    contactEmail: "",
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
      // If user types contactEmail, auto-fill workEmail if it's currently empty
      if (name === "contactEmail" && !prev.workEmail) {
        updated.workEmail = value;
      }
      // If user types workEmail, auto-fill contactEmail if it's currently empty
      if (name === "workEmail" && !prev.contactEmail) {
        updated.contactEmail = value;
      }

      return updated;
    });
  };

  const handleRichTextChange = (html) => setFormData({ ...formData, description: html });
  const handleFileChange = (file) => setFormData({ ...formData, attachment: file });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Progress starts at 0% for Step 1
  const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  const labelStyle = { display: "block", color: "#fff", fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" };
  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "14px", borderRadius: "10px", fontSize: "0.95rem", outline: "none", transition: "border 0.2s" };

  return (
    <div style={{ background: "#06020f", minHeight: "100vh", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      {/* TOP NOTE (Only visible on Step 1) */}
      {currentStep === 1 && (
        <div style={{ background: "#cfa667", color: "#3a2a00", textAlign: "center", padding: "10px", fontSize: "0.85rem", fontWeight: "700" }}>
          ⏳ Note: This comprehensive form takes approximately 15 minutes to complete. Your progress is auto-saved.
        </div>
      )}

      {/* STICKY PROGRESS BAR */}
      <div style={{ position: "sticky", top: "80px", zIndex: 100, background: "rgba(6,2,15,0.9)", backdropFilter: "blur(10px)", padding: "20px 5%", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", color: "rgba(255,255,255,0.6)" }}>
          <span>Step {currentStep} of {TOTAL_STEPS}</span>
          <span>{progressPercent}% Completed</span>
        </div>
        <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, #7a3fd1, #f5a623)", transition: "width 0.4s ease" }} />
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 5%" }}>
        
        {/* ================= STEP 1: CONTACT INFO (Swapped) ================= */}
        {currentStep === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.2rem", fontWeight: 900, marginBottom: "8px" }}>Primary Contact Info</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "40px" }}>Who should we reach out to regarding your application?</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>First Name <span style={{color:"#f5a623"}}>*</span></label>
                <input style={inputStyle} name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div>
                <label style={labelStyle}>Last Name <span style={{color:"#f5a623"}}>*</span></label>
                <input style={inputStyle} name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Primary Contact Email <span style={{color:"#f5a623"}}>*</span></label>
                <input type="email" style={inputStyle} name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="jane@acme.com" />
              </div>
              <div>
                <label style={labelStyle}>Primary Contact Phone</label>
                <input style={inputStyle} name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 416 555 0100" />
              </div>
            </div>
            
            <div style={{ marginBottom: "40px" }}>
              <label style={labelStyle}>Job Title <span style={{color:"#f5a623"}}>*</span></label>
              <input style={inputStyle} name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
            </div>
          </div>
        )}

        {/* ================= STEP 2: COMPANY INFO (Swapped) ================= */}
        {currentStep === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.2rem", fontWeight: 900, marginBottom: "8px" }}>Company Info</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "40px" }}>Please provide accurate details to help us optimize your event experience.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>Company Name <span style={{color:"#f5a623"}}>*</span></label>
                <input style={inputStyle} name="companyName" value={formData.companyName} onChange={handleChange} />
              </div>
              <div>
                <label style={labelStyle}>Brand Name (if different)</label>
                <input style={inputStyle} name="brandName" value={formData.brandName} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
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
              <label style={labelStyle}>Work Email (Auto-filled from Step 1) <span style={{color:"#f5a623"}}>*</span></label>
              <input type="email" style={inputStyle} name="workEmail" value={formData.workEmail} onChange={handleChange} />
            </div>

            <div style={{ marginBottom: "40px" }}>
              <label style={labelStyle}>Operations in Canada? <span style={{color:"#f5a623"}}>*</span></label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                {["Yes", "No", "Planned market entry"].map(opt => (
                  <label key={opt} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.02)", border: formData.operationsInCanada === opt ? "1px solid #7a3fd1" : "1px solid rgba(255,255,255,0.1)", padding: "14px", borderRadius: "10px", cursor: "pointer" }}>
                    <input type="radio" name="operationsInCanada" value={opt} checked={formData.operationsInCanada === opt} onChange={handleChange} style={{ accentColor: "#7a3fd1" }} />
                    <span style={{ fontSize: "0.9rem" }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: ADDITIONAL (Rich Text & File Upload Demo) ================= */}
        {currentStep === 3 && (
          <div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.2rem", fontWeight: 900, marginBottom: "8px" }}>Additional Details</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "40px" }}>Tell us more about your exhibition goals and upload relevant documents.</p>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Describe your goals (Use formatting)</label>
              <RichTextEditor value={formData.description} onChange={handleRichTextChange} placeholder="Enter your text here..." />
            </div>

            <div style={{ marginBottom: "40px" }}>
              <label style={labelStyle}>Upload Pitch Deck or Document</label>
              <FileUpload onFileSelect={handleFileChange} />
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px" }}>
          <button 
            onClick={prevStep} 
            disabled={currentStep === 1}
            style={{ background: "transparent", color: currentStep === 1 ? "rgba(255,255,255,0.2)" : "#fff", border: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, cursor: currentStep === 1 ? "default" : "pointer" }}
          >
            ← BACK
          </button>
          
          <button 
            onClick={nextStep}
            style={{ background: "#fff", color: "#000", padding: "14px 32px", borderRadius: "12px", border: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, cursor: "pointer" }}
          >
            CONTINUE →
          </button>
        </div>

      </div>
    </div>
  );
}
