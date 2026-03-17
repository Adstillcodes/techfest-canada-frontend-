import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TOTAL_SECTIONS = 8;
const LABELS = [
  "Company Info", "Business Profile", "Objectives", "Metrics",
  "Target Accounts", "Customer Profile", "Event Delivery", "Fulfillment"
];

export default function KycForm() {
  const [isDark, setIsDark] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Theme Observer (Matches your architecture)
  useEffect(() => {
    setIsDark(document.body.classList.contains("dark-mode"));
    const obs = new MutationObserver(() => {
      setIsDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Auto-Save: Load from local storage
  useEffect(() => {
    const savedData = localStorage.getItem("tfc_kyc_data");
    if (savedData) {
      try { setFormData(JSON.parse(savedData)); } catch (e) { console.error("Parse error"); }
    }
  }, []);

  // Auto-Save: Save to local storage on change
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem("tfc_kyc_data", JSON.stringify(formData));
    }
  }, [formData]);

  const bg        = isDark ? "#07030f"                : "#f4f0ff";
  const cardBg    = isDark ? "rgba(255,255,255,0.03)" : "rgba(122,63,209,0.04)";
  const border    = isDark ? "rgba(255,255,255,0.08)" : "rgba(122,63,209,0.18)";
  const textMain  = isDark ? "#ffffff"                : "#0f0520";
  const textMuted = isDark ? "rgba(200,180,255,0.8)"  : "rgba(60,30,110,0.85)";
  const accent    = isDark ? "#b99eff"                : "#7a3fd1";
  const inputBg   = isDark ? "rgba(0,0,0,0.3)"        : "#ffffff";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const list = prev[name] || [];
        return checked ? { ...prev, [name]: [...list, value] } : { ...prev, [name]: list.filter((v) => v !== value) };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateSection = () => {
    let isValid = true;
    const newErrors = {};
    const currentDOM = document.getElementById(`tfc-kyc-step-${currentSection}`);
    
    if (currentDOM) {
      const requiredInputs = currentDOM.querySelectorAll("[required]");
      requiredInputs.forEach((input) => {
        const name = input.name;
        if (input.type === "radio" || input.type === "checkbox") {
          if (!formData[name] || formData[name].length === 0) { newErrors[name] = true; isValid = false; }
        } else if (!formData[name] || formData[name].trim() === "") {
          newErrors[name] = true; isValid = false;
        } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[name])) {
          newErrors[name] = true; isValid = false;
        }
      });
    }
    setErrors(newErrors);
    return isValid;
  };

  const nextSection = () => {
    if (validateSection()) {
      setCurrentSection((prev) => Math.min(prev + 1, TOTAL_SECTIONS - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevSection = () => {
    setCurrentSection((prev) => Math.max(prev - 0, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSection()) return;
      try {
    const res = await fetch(
      "https://techfest-canada-backend.onrender.com/api/kyc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
 const data = await res.json();
if (!res.ok) throw new Error(data.error);
    console.log("Submitted Data:", formData);
    localStorage.removeItem("tfc_kyc_data");
    setIsSubmitted(true);
      } catch (err) {
    console.error(err);
    alert("Submission failed");
  }
};
    window.scrollTo({ top: 0, behavior: "smooth" });
    
 

  const progressPercentage = Math.round(((currentSection + 1) / TOTAL_SECTIONS) * 100);

  if (isSubmitted) {
    return (
      <div style={{ background: bg, minHeight: "100vh", color: textMain, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #7a3fd1, #f5a623)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "2rem", color: "#fff" }}>✓</div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", marginBottom: 16 }}>Blueprint Submitted</h2>
            <p style={{ color: textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>Thank you. Your Participation Success Blueprint has been received. Our fulfillment team will be in touch shortly.</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textMain, overflowX: "hidden" }}>
      <Navbar />
      
      <style>{`
        .tfc-kyc-notice { background: linear-gradient(135deg, #7a3fd1, #f5a623); color: #fff; text-align: center; padding: 12px 20px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.5px; margin-top: 80px; }
        .tfc-kyc-header { padding: 60px 20px 40px; text-align: center; }
        .tfc-kyc-progress-wrap { position: sticky; top: 80px; z-index: 100; background: ${isDark ? 'rgba(7,3,15,0.9)' : 'rgba(244,240,255,0.9)'}; backdrop-filter: blur(10px); padding: 16px 5%; border-bottom: 1px solid ${border}; }
        .tfc-kyc-track { height: 6px; background: ${border}; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .tfc-kyc-fill { height: 100%; background: linear-gradient(90deg, #7a3fd1, #f5a623); transition: width 0.4s ease; }
        
        .tfc-kyc-form-wrap { max-width: 860px; margin: 0 auto; padding: 60px 24px 100px; }
        .tfc-kyc-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        @media (max-width: 640px) { .tfc-kyc-field-row { grid-template-columns: 1fr; gap: 16px; } }
        
        .tfc-kyc-label { display: block; font-size: 0.9rem; font-weight: 600; color: ${textMain}; margin-bottom: 8px; }
        .tfc-kyc-req { color: #f5a623; margin-left: 4px; }
        
        .tfc-kyc-input { width: 100%; background: ${inputBg}; border: 1.5px solid ${border}; border-radius: 12px; padding: 14px 16px; font-family: inherit; font-size: 0.95rem; color: ${textMain}; transition: all 0.2s; }
        .tfc-kyc-input:focus { outline: none; border-color: ${accent}; box-shadow: 0 0 0 3px rgba(122,63,209,0.15); }
        .tfc-kyc-input::placeholder { color: ${textMuted}; opacity: 0.6; }
        
        .tfc-kyc-check-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
        .tfc-kyc-check-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border: 1.5px solid ${border}; border-radius: 12px; cursor: pointer; background: ${cardBg}; transition: all 0.2s; }
        .tfc-kyc-check-item:hover { border-color: ${accent}; }
        .tfc-kyc-check-item.selected { border-color: ${accent}; background: ${isDark ? 'rgba(122,63,209,0.15)' : 'rgba(122,63,209,0.08)'}; }
        .tfc-kyc-check-item input { accent-color: ${accent}; margin-top: 3px; width: 16px; height: 16px; cursor: pointer; }
        
        .tfc-kyc-error-msg { font-size: 0.8rem; color: #ff4d4d; margin-top: 6px; font-weight: 500; }
        .has-error .tfc-kyc-input, .has-error .tfc-kyc-check-item { border-color: #ff4d4d; }
      `}</style>

      <div className="tfc-kyc-notice">
        ⏳ Note: This comprehensive form takes approximately 15 minutes to complete. Your progress is auto-saved.
      </div>

      <div className="tfc-kyc-header">
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: 12 }}>
          Participation <span style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Blueprint</span>
        </h1>
        <p style={{ color: textMuted, fontSize: "1.1rem" }}>Sponsor & Exhibitor KYC Form</p>
      </div>

      <div className="tfc-kyc-progress-wrap">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="tfc-kyc-track">
            <div className="tfc-kyc-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: textMuted, letterSpacing: "1px" }}>
            <span>STEP {currentSection + 1} OF {TOTAL_SECTIONS}</span>
            <span style={{ color: textMain }}>{progressPercentage}% COMPLETED</span>
          </div>
        </div>
      </div>

      <div className="tfc-kyc-form-wrap">
        <form onSubmit={handleSubmit} noValidate>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              id={`tfc-kyc-step-${currentSection}`}
            >
              <div style={{ marginBottom: 40, borderBottom: `1px solid ${border}`, paddingBottom: 24 }}>
                <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.8rem", color: textMain, marginBottom: 8 }}>{LABELS[currentSection]}</h2>
                <p style={{ color: textMuted }}>Please provide accurate details to help us optimize your event experience.</p>
              </div>

              {/* ── SECTION 1: Company Info ── */}
              {currentSection === 0 && (
                <>
                  <div className="tfc-kyc-field-row">
                    <div className={errors.company_name ? "has-error" : ""}>
                      <label className="tfc-kyc-label">Company Name <span className="tfc-kyc-req">*</span></label>
                      <input type="text" name="company_name" className="tfc-kyc-input" value={formData.company_name || ""} onChange={handleChange} required placeholder="Acme Corporation" />
                      {errors.company_name && <div className="tfc-kyc-error-msg">This field is required</div>}
                    </div>
                    <div>
                      <label className="tfc-kyc-label">Brand Name (if different)</label>
                      <input type="text" name="brand_name" className="tfc-kyc-input" value={formData.brand_name || ""} onChange={handleChange} placeholder="Acme" />
                    </div>
                  </div>

                  <div className="tfc-kyc-field-row">
                    <div className={errors.website ? "has-error" : ""}>
                      <label className="tfc-kyc-label">Website <span className="tfc-kyc-req">*</span></label>
                      <input type="url" name="website" className="tfc-kyc-input" value={formData.website || ""} onChange={handleChange} required placeholder="https://acme.com" />
                      {errors.website && <div className="tfc-kyc-error-msg">This field is required</div>}
                    </div>
                    <div className={errors.country_hq ? "has-error" : ""}>
                      <label className="tfc-kyc-label">Country of HQ <span className="tfc-kyc-req">*</span></label>
                      <select name="country_hq" className="tfc-kyc-input" value={formData.country_hq || ""} onChange={handleChange} required>
                        <option value="">Select country…</option>
                        <option>Canada</option><option>USA</option><option>UK</option><option>Europe</option><option>India</option><option>Other</option>
                      </select>
                      {errors.country_hq && <div className="tfc-kyc-error-msg">Please select a country</div>}
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }} className={errors.canada_ops ? "has-error" : ""}>
                    <label className="tfc-kyc-label">Operations in Canada? <span className="tfc-kyc-req">*</span></label>
                    <div className="tfc-kyc-check-grid">
                      {["Yes", "No", "Planned market entry"].map((opt) => (
                        <label key={opt} className={`tfc-kyc-check-item ${formData.canada_ops === opt ? 'selected' : ''}`}>
                          <input type="radio" name="canada_ops" value={opt} checked={formData.canada_ops === opt} onChange={handleChange} required />
                          <span style={{ color: formData.canada_ops === opt ? textMain : textMuted }}>{opt}</span>
                        </label>
                      ))}
                    </div>
                    {errors.canada_ops && <div className="tfc-kyc-error-msg">Please select an option</div>}
                  </div>

                  <div className="tfc-kyc-field-row">
                    <div className={errors.primary_email ? "has-error" : ""}>
                      <label className="tfc-kyc-label">Primary Contact Email <span className="tfc-kyc-req">*</span></label>
                      <input type="email" name="primary_email" className="tfc-kyc-input" value={formData.primary_email || ""} onChange={handleChange} required placeholder="jane@acme.com" />
                      {errors.primary_email && <div className="tfc-kyc-error-msg">Valid email required</div>}
                    </div>
                    <div>
                      <label className="tfc-kyc-label">Primary Contact Phone</label>
                      <input type="tel" name="primary_phone" className="tfc-kyc-input" value={formData.primary_phone || ""} onChange={handleChange} placeholder="+1 416 555 0100" />
                    </div>
                  </div>
                </>
              )}

              {/* ── SECTION 2: Business Profile ── */}
              {currentSection === 1 && (
                <>
                  <div style={{ marginBottom: 24 }} className={errors.company_type ? "has-error" : ""}>
                    <label className="tfc-kyc-label">Which best describes your company? <span className="tfc-kyc-req">*</span></label>
                    <div className="tfc-kyc-check-grid">
                      {["Technology Product", "Platform / SaaS", "Consulting / Services", "Hardware / Infrastructure", "Startup", "Other"].map((opt) => {
                        const isChecked = formData.company_type?.includes(opt);
                        return (
                          <label key={opt} className={`tfc-kyc-check-item ${isChecked ? 'selected' : ''}`}>
                            <input type="checkbox" name="company_type" value={opt} checked={isChecked || false} onChange={handleChange} required={!(formData.company_type?.length > 0)} />
                            <span style={{ color: isChecked ? textMain : textMuted }}>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.company_type && <div className="tfc-kyc-error-msg">Please select at least one option</div>}
                  </div>

                  <div className="tfc-kyc-field-row">
                    <div className={errors.primary_industry ? "has-error" : ""}>
                      <label className="tfc-kyc-label">Primary Industry <span className="tfc-kyc-req">*</span></label>
                      <select name="primary_industry" className="tfc-kyc-input" value={formData.primary_industry || ""} onChange={handleChange} required>
                        <option value="">Select industry…</option>
                        <option>Artificial Intelligence</option><option>Quantum Computing</option><option>Robotics</option><option>Cybersecurity</option><option>Sustainability</option>
                      </select>
                      {errors.primary_industry && <div className="tfc-kyc-error-msg">Required</div>}
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }} className={errors.product_description ? "has-error" : ""}>
                    <label className="tfc-kyc-label">Describe your product, solution, or offering <span className="tfc-kyc-req">*</span></label>
                    <textarea name="product_description" className="tfc-kyc-input" value={formData.product_description || ""} onChange={handleChange} required rows={5} placeholder="Briefly describe what your company does and the core value you deliver..."></textarea>
                    {errors.product_description && <div className="tfc-kyc-error-msg">This field is required</div>}
                  </div>
                </>
              )}

              {/* ── SECTIONS 3-8: Dynamic Fallback Structure ── */}
              {currentSection > 1 && (
                <>
                  <div style={{ marginBottom: 24 }} className={errors[`section_${currentSection}_notes`] ? "has-error" : ""}>
                    <label className="tfc-kyc-label">Detailed Notes for {LABELS[currentSection]} <span className="tfc-kyc-req">*</span></label>
                    <textarea 
                      name={`section_${currentSection}_notes`} 
                      className="tfc-kyc-input" 
                      value={formData[`section_${currentSection}_notes`] || ""} 
                      onChange={handleChange} 
                      required 
                      rows={6} 
                      placeholder={`Please provide your requirements regarding ${LABELS[currentSection].toLowerCase()}...`}
                    ></textarea>
                    {errors[`section_${currentSection}_notes`] && <div className="tfc-kyc-error-msg">This field is required to proceed</div>}
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>

          {/* ── NAVIGATION BUTTONS ── */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${border}` }}>
            <button 
              type="button" 
              onClick={prevSection} 
              style={{ padding: "14px 28px", borderRadius: 12, background: "transparent", border: `1.5px solid ${border}`, color: textMain, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, cursor: "pointer", visibility: currentSection === 0 ? "hidden" : "visible" }}
            >
              ← BACK
            </button>
            
            {currentSection < TOTAL_SECTIONS - 1 ? (
              <button 
                type="button" 
                onClick={nextSection}
                style={{ padding: "14px 36px", borderRadius: 12, background: textMain, color: isDark ? "#000" : "#fff", border: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, cursor: "pointer" }}
              >
                CONTINUE →
              </button>
            ) : (
              <button 
                type="submit"
                style={{ padding: "14px 40px", borderRadius: 12, background: "linear-gradient(135deg, #7a3fd1, #f5a623)", color: "#fff", border: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(122,63,209,0.25)" }}
              >
                SUBMIT BLUEPRINT
              </button>
            )}
          </div>

        </form>
      </div>
      <Footer />
    </div>
  );
}
