import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SECTIONS = 8;
const LABELS = [
  "Company Info", "Business Profile", "Objectives", "Metrics",
  "Target Accounts", "Customer Profile", "Event Delivery", "Fulfillment"
];

export default function KycForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef(null);

  // Auto-Save: Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("kycFormData");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved form data");
      }
    }
  }, []);

  // Auto-Save: Save to local storage on change
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem("kycFormData", JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData((prev) => {
        const list = prev[name] || [];
        return checked
          ? { ...prev, [name]: [...list, value] }
          : { ...prev, [name]: list.filter((v) => v !== value) };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateSection = () => {
    let isValid = true;
    const newErrors = {};
    const currentDOM = document.getElementById(`section-${currentSection}`);
    
    if (currentDOM) {
      const requiredInputs = currentDOM.querySelectorAll("[required]");
      requiredInputs.forEach((input) => {
        const name = input.name;
        if (input.type === "radio" || input.type === "checkbox") {
          if (!formData[name] || formData[name].length === 0) {
            newErrors[name] = true;
            isValid = false;
          }
        } else if (!formData[name] || formData[name].trim() === "") {
          newErrors[name] = true;
          isValid = false;
        } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[name])) {
          newErrors[name] = true;
          isValid = false;
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
    setCurrentSection((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateSection()) return;

    // TODO: Connect your Submission Logic here (e.g., Salesforce Web-to-Lead or your own API)
    console.log("Form Data Submitted: ", formData);
    
    // Clear auto-save and show success
    localStorage.removeItem("kycFormData");
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progressPercentage = Math.round((currentSection / (TOTAL_SECTIONS - 1)) * 100);

  if (isSubmitted) {
    return (
      <div className="kyc-container success-screen active">
        <div className="success-icon">✓</div>
        <h2>Blueprint Submitted</h2>
        <p>Thank you. Your Participation Success Blueprint has been received. Our fulfillment team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <div className="kyc-container">
      {/* ── STYLES (Adopts global data-theme="dark") ── */}
      <style>{`
        .kyc-container {
          --ink: #0f1117;
          --ink-light: #3a3d4a;
          --ink-muted: #7a7e8e;
          --bg: #f6f4ef;
          --bg-card: #ffffff;
          --gold: #b08d57;
          --gold-pale: #f7f2e9;
          --border: #ddd9d0;
          --red: #c0392b;
          --green: #27745a;
          --section-bg: #0f1117;
          --section-fg: #f6f4ef;
          --radius: 8px;
          background: var(--bg);
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          padding-top: 80px; /* Offset for navbar */
        }

        /* Dark Mode Overrides */
        :global(.dark-mode) .kyc-container, :global([data-theme="dark"]) .kyc-container {
          --ink: #f6f4ef;
          --ink-light: #d1d5db;
          --ink-muted: #9ca3af;
          --bg: #06020f; /* Matched from Navbar */
          --bg-card: #0e0820;
          --gold: #c4607a; /* Adapted to gradient brand color */
          --gold-pale: rgba(196, 96, 122, 0.1);
          --border: rgba(155,135,245,0.18);
          --section-bg: #0a0518;
        }

        .notice-banner { background: var(--gold); color: #fff; text-align: center; padding: 10px 20px; font-weight: 600; font-size: 0.9rem; letter-spacing: 0.5px; }
        .hero { background: var(--section-bg); color: var(--section-fg); padding: 56px 40px; text-align: center; }
        .hero h1 { font-family: 'Orbitron', serif; font-size: clamp(24px, 4vw, 36px); margin-bottom: 12px; }
        .hero p { color: var(--ink-muted); max-width: 520px; margin: 0 auto; }
        
        .progress-bar-wrap { background: var(--section-bg); position: sticky; top: 80px; z-index: 100; padding: 15px 40px; border-bottom: 1px solid var(--border); }
        .progress-track { height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
        .progress-fill { height: '100%'; background: var(--gold); transition: width 0.3s ease; }
        .progress-text { text-align: right; font-size: 0.75rem; color: var(--gold); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;}

        .form-wrap { max-width: 820px; margin: 0 auto; padding: 48px 24px 80px; }
        .section-header { margin-bottom: 32px; }
        .section-number { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
        .section-title { font-size: 28px; color: var(--ink); margin-bottom: 8px; font-weight: 700;}
        .section-desc { font-size: 14px; color: var(--ink-muted); }

        .field-group { margin-bottom: 24px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 600px) { .field-row { grid-template-columns: 1fr; } }
        
        label { display: block; font-size: 13px; font-weight: 600; color: var(--ink-light); margin-bottom: 8px; }
        label .req { color: var(--gold); margin-left: 3px; }
        
        input[type="text"], input[type="email"], input[type="tel"], select, textarea {
          width: 100%; background: var(--bg-card); border: 1.5px solid var(--border); border-radius: var(--radius);
          padding: 12px 14px; font-size: 14px; color: var(--ink); outline: none; transition: 0.2s;
        }
        input:focus, select:focus, textarea:focus { border-color: var(--gold); }
        
        .check-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .check-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: var(--radius); cursor: pointer; background: var(--bg-card); transition: 0.2s; }
        .check-item:hover { border-color: var(--gold); }
        .check-item input { accent-color: var(--gold); margin-top: 2px; width: 16px; height: 16px; cursor: pointer;}
        .check-item.selected { border-color: var(--gold); background: var(--gold-pale); }
        .check-item span { font-size: 13px; color: var(--ink-light); }

        .field-error-msg { font-size: 12px; color: var(--red); margin-top: 6px; }
        .has-error input, .has-error select, .has-error textarea { border-color: var(--red); }

        .nav-row { display: flex; justify-content: space-between; margin-top: 40px; }
        .btn { padding: 12px 28px; border-radius: var(--radius); font-weight: 700; cursor: pointer; border: none; font-size: 14px; transition: 0.2s; }
        .btn-back { background: transparent; color: var(--ink); border: 1.5px solid var(--border); }
        .btn-next { background: var(--gold); color: #fff; }
        
        .success-screen { text-align: center; padding: 100px 20px; }
        .success-icon { width: 64px; height: 64px; background: var(--green); color: white; font-size: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
      `}</style>

      {/* 15-MINUTE NOTICE */}
      <div className="notice-banner">
        ⏳ Note: This comprehensive form takes approximately 15 minutes to complete. Your progress is auto-saved.
      </div>

      <div className="hero">
        <h1>Participation Success Blueprint</h1>
        <p>Sponsor & Exhibitor KYC Form</p>
      </div>

      {/* COMPLETION STATUS BAR */}
      <div className="progress-bar-wrap">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="progress-text">{progressPercentage}% Completed • Step {currentSection + 1} of {TOTAL_SECTIONS}</div>
      </div>

      <div className="form-wrap">
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          
          {/* SECTION 1: Company Information */}
          {currentSection === 0 && (
            <motion.div id="section-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="section-header">
                <div className="section-number">Section 1 of {TOTAL_SECTIONS}</div>
                <div className="section-title">Company Information</div>
                <div className="section-desc">Basic details about your organization and primary contacts.</div>
              </div>

              <div className="field-row">
                <div className={`field-group ${errors.company_name ? "has-error" : ""}`}>
                  <label>Company Name <span className="req">*</span></label>
                  <input type="text" name="company_name" value={formData.company_name || ""} onChange={handleChange} required placeholder="Acme Corporation" />
                  {errors.company_name && <div className="field-error-msg">Required</div>}
                </div>
                <div className="field-group">
                  <label>Brand Name</label>
                  <input type="text" name="brand_name" value={formData.brand_name || ""} onChange={handleChange} placeholder="Acme" />
                </div>
              </div>

              <div className="field-row">
                <div className={`field-group ${errors.website ? "has-error" : ""}`}>
                  <label>Website <span className="req">*</span></label>
                  <input type="url" name="website" value={formData.website || ""} onChange={handleChange} required placeholder="https://acme.com" />
                  {errors.website && <div className="field-error-msg">Required</div>}
                </div>
                <div className={`field-group ${errors.country_hq ? "has-error" : ""}`}>
                  <label>Country of HQ <span className="req">*</span></label>
                  <select name="country_hq" value={formData.country_hq || ""} onChange={handleChange} required>
                    <option value="">Select country…</option>
                    <option>Canada</option><option>USA</option><option>UK</option><option>Europe</option><option>Other</option>
                  </select>
                  {errors.country_hq && <div className="field-error-msg">Required</div>}
                </div>
              </div>

              <div className={`field-group ${errors.canada_ops ? "has-error" : ""}`}>
                <label>Operations in Canada? <span className="req">*</span></label>
                <div className="check-grid">
                  {["Yes", "No", "Planned market entry"].map((opt) => (
                    <label key={opt} className={`check-item ${formData.canada_ops === opt ? 'selected' : ''}`}>
                      <input type="radio" name="canada_ops" value={opt} checked={formData.canada_ops === opt} onChange={handleChange} required />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.canada_ops && <div className="field-error-msg">Please select an option.</div>}
              </div>

              <div className="field-row">
                <div className={`field-group ${errors.primary_email ? "has-error" : ""}`}>
                  <label>Primary Contact Email <span className="req">*</span></label>
                  <input type="email" name="primary_email" value={formData.primary_email || ""} onChange={handleChange} required placeholder="jane@acme.com" />
                  {errors.primary_email && <div className="field-error-msg">Valid email required</div>}
                </div>
                <div className="field-group">
                  <label>Primary Contact Phone</label>
                  <input type="tel" name="primary_phone" value={formData.primary_phone || ""} onChange={handleChange} placeholder="+1 416 555 0100" />
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION 2: Business Profile */}
          {currentSection === 1 && (
             <motion.div id="section-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <div className="section-header">
                <div className="section-number">Section 2 of {TOTAL_SECTIONS}</div>
                <div className="section-title">Business Profile</div>
              </div>
              <div className={`field-group ${errors.primary_industry ? "has-error" : ""}`}>
                <label>Primary Industry <span className="req">*</span></label>
                <select name="primary_industry" value={formData.primary_industry || ""} onChange={handleChange} required>
                  <option value="">Select industry…</option>
                  <option>Artificial Intelligence</option>
                  <option>Quantum Computing</option>
                  <option>Cybersecurity</option>
                  <option>Other</option>
                </select>
                {errors.primary_industry && <div className="field-error-msg">Required</div>}
              </div>
              <div className={`field-group ${errors.product_description ? "has-error" : ""}`}>
                <label>Describe your product, solution, or offering <span className="req">*</span></label>
                <textarea name="product_description" value={formData.product_description || ""} onChange={handleChange} required rows={4} placeholder="Briefly describe what your company does..."></textarea>
                {errors.product_description && <div className="field-error-msg">Required</div>}
              </div>
             </motion.div>
          )}

          {/* ADD REMAINING SECTIONS 3-8 FOLLOWING THE SAME PATTERN */}
          {/* I have stubbed section 3 for brevity, duplicate the <motion.div> blocks above for the rest */}
          {currentSection > 1 && (
             <motion.div id={`section-${currentSection}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <div className="section-header">
                <div className="section-number">Section {currentSection + 1} of {TOTAL_SECTIONS}</div>
                <div className="section-title">{LABELS[currentSection]}</div>
                <div className="section-desc">Please complete the relevant details for this section.</div>
              </div>
              
              {/* Fallback general text area to ensure form validation passes for remaining steps */}
              <div className={`field-group ${errors.additional_notes ? "has-error" : ""}`}>
                <label>Additional Notes <span className="req">*</span></label>
                <textarea name="additional_notes" value={formData.additional_notes || ""} onChange={handleChange} required rows={4} placeholder="Enter details for this step..."></textarea>
                {errors.additional_notes && <div className="field-error-msg">Required</div>}
              </div>
             </motion.div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="nav-row">
            <button type="button" className="btn btn-back" onClick={prevSection} style={{ visibility: currentSection === 0 ? "hidden" : "visible" }}>
              ← Back
            </button>
            
            {currentSection < TOTAL_SECTIONS - 1 ? (
              <button type="button" className="btn btn-next" onClick={nextSection}>
                Continue →
              </button>
            ) : (
              <button type="submit" className="btn btn-next">
                Submit Form
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
