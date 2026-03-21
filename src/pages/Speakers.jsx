import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import { Mic, Users, Calendar, Award, ChevronRight, X } from "lucide-react";

const INDUSTRIES = [
  "Artificial Intelligence & Machine Learning",
  "Quantum Computing",
  "Cybersecurity",
  "Cloud Computing & Infrastructure",
  "Robotics & Automation",
  "Sustainability & CleanTech",
  "Blockchain & Web3",
  "Biotechnology & HealthTech",
  "FinTech & Digital Payments",
  "Space Technology",
  "EdTech & Future of Work",
  "Smart Cities & IoT",
  "Defence & Public Safety",
  "Supply Chain & Logistics Tech",
  "Enterprise Software & SaaS",
  "Venture Capital & Investment",
  "Government & Public Policy",
  "Media & Communications",
  "Other",
];

const EXPERIENCE_OPTIONS = [
  "First time — never spoken at a conference",
  "1–5 conferences",
  "5–10 conferences",
  "10–15 conferences",
  "15–25 conferences",
  "25+ conferences",
];

function SpeakerApplicationModal({ onClose, dark }) {
  var s1 = useState({ firstName: "", lastName: "", email: "", linkedin: "", industry: "", jobTitle: "", experience: "" });
  var formData = s1[0]; var setFormData = s1[1];
  var s2 = useState(""); var error = s2[0]; var setError = s2[1];
  var s3 = useState(false); var submitted = s3[0]; var setSubmitted = s3[1];
  var s4 = useState(false); var loading = s4[0]; var setLoading = s4[1];

  var bg      = dark ? "#0d0620" : "#ffffff";
  var textMain= dark ? "#ffffff" : "#0d0520";
  var textMid = dark ? "rgba(220,210,255,0.75)" : "rgba(13,5,32,0.65)";
  var inputBg = dark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.04)";
  var inputBdr= dark ? "rgba(155,135,245,0.25)" : "rgba(122,63,209,0.20)";

  function handleChange(e) {
    setFormData(function(prev) { return Object.assign({}, prev, { [e.target.name]: e.target.value }); });
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.industry || !formData.jobTitle || !formData.experience) {
      setError("Please fill in all required fields."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address."); return;
    }
    setLoading(true);
    setTimeout(function() { setLoading(false); setSubmitted(true); }, 1200);
  }

  var inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    background: inputBg, border: "1px solid " + inputBdr,
    color: textMain, fontSize: "0.92rem", outline: "none",
    fontFamily: "inherit", transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  };

  var labelStyle = {
    display: "block", fontSize: "0.72rem", fontFamily: "'Orbitron',sans-serif",
    fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase",
    color: textMid, marginBottom: 6,
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", padding: "20px" }}
      onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: bg, width: "100%", maxWidth: 560, borderRadius: 24, border: "1px solid " + inputBdr, boxShadow: "0 24px 64px rgba(0,0,0,0.5)", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
        {/* Header */}
        <div style={{ padding: "28px 32px 0", position: "sticky", top: 0, background: bg, zIndex: 2, paddingBottom: 20, borderBottom: "1px solid " + inputBdr }}>
          <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "transparent", border: "none", color: textMid, cursor: "pointer", padding: 4 }}>
            <X size={20} />
          </button>
          <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: dark ? "#b99eff" : "#7a3fd1", marginBottom: 6 }}>TTFC 2026</p>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.3rem", fontWeight: 900, color: textMain, marginBottom: 4 }}>Apply to Speak</h2>
          <p style={{ fontSize: "0.85rem", color: textMid, lineHeight: 1.6 }}>We review every application. Our team will be in touch if there's a fit.</p>
        </div>

        <div style={{ padding: "24px 32px 32px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: textMain, marginBottom: 10 }}>Application Received</h3>
              <p style={{ fontSize: "0.9rem", color: textMid, lineHeight: 1.7 }}>Thank you for applying. We'll review your submission and reach out if there's a match for TTFC 2026.</p>
              <button onClick={onClose} style={{ marginTop: 24, padding: "12px 32px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'Orbitron',sans-serif", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", background: "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#fff" }}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Name row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>First Name *</label>
                  <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name *</label>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Smith" style={inputStyle} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@company.com" style={inputStyle} />
              </div>

              {/* LinkedIn */}
              <div>
                <label style={labelStyle}>LinkedIn Profile</label>
                <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="linkedin.com/in/janesmith" style={inputStyle} />
              </div>

              {/* Job Title */}
              <div>
                <label style={labelStyle}>Job Title *</label>
                <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. Chief Technology Officer" style={inputStyle} />
              </div>

              {/* Industry */}
              <div>
                <label style={labelStyle}>Industry *</label>
                <select name="industry" value={formData.industry} onChange={handleChange}
                  style={Object.assign({}, inputStyle, { appearance: "none", cursor: "pointer" })}
                >
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map(function(ind) { return <option key={ind} value={ind}>{ind}</option>; })}
                </select>
              </div>

              {/* Experience */}
              <div>
                <label style={labelStyle}>Speaking Experience *</label>
                <select name="experience" value={formData.experience} onChange={handleChange}
                  style={Object.assign({}, inputStyle, { appearance: "none", cursor: "pointer" })}
                >
                  <option value="">Number of conferences spoken at</option>
                  {EXPERIENCE_OPTIONS.map(function(exp) { return <option key={exp} value={exp}>{exp}</option>; })}
                </select>
              </div>

              {error && (
                <div style={{ fontSize: "0.78rem", color: "#ff6b6b", fontFamily: "'Orbitron',sans-serif", letterSpacing: "0.5px", padding: "10px 14px", background: "rgba(255,107,107,0.10)", borderRadius: 8, border: "1px solid rgba(255,107,107,0.25)" }}>{error}</div>
              )}

              <button type="submit" disabled={loading}
                style={{ padding: "14px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Orbitron',sans-serif", fontSize: "0.75rem", fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", background: loading ? (dark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.3)") : "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#ffffff", marginTop: 4, transition: "opacity 0.2s ease", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Submitting…" : "Submit Application →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Speakers() {
  var s1 = useState(false); var dark = s1[0]; var setDark = s1[1];
  var s2 = useState(false); var modalOpen = s2[0]; var setModalOpen = s2[1];

  useEffect(function() {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function() { setDark(document.body.classList.contains("dark-mode")); });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function() { obs.disconnect(); };
  }, []);

  var stats = [
    { icon: Mic,      value: "50+",   label: "World-Class Speakers" },
    { icon: Users,    value: "1000+", label: "Expected Attendees"   },
    { icon: Calendar, value: "2",     label: "Days of Content"      },
    { icon: Award,    value: "10",    label: "Tech Pillars Covered" },
  ];

  var purpleRgb = "122, 63, 209";
  var orangeRgb = "245, 166, 35";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .speakers-page { min-height:100vh; display:flex; flex-direction:column; background:var(--bg-main); }
        .speakers-hero { position:relative; overflow:hidden; padding:6rem 5% 4rem; text-align:center; }
        .spk-orb-1 { position:absolute; pointer-events:none; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(${purpleRgb},0.25) 0%,transparent 70%); top:-160px; left:-100px; filter:blur(70px); }
        .spk-orb-2 { position:absolute; pointer-events:none; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(${orangeRgb},0.12) 0%,transparent 70%); top:-80px; right:-80px; filter:blur(70px); }
        .spk-grid { position:absolute; inset:0; pointer-events:none; background-image:linear-gradient(rgba(${purpleRgb},0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(${purpleRgb},0.06) 1px,transparent 1px); background-size:60px 60px; mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%); }
        .speakers-hero h1 { font-size:clamp(2.4rem,5vw,4rem); font-weight:900; font-family:'Orbitron',sans-serif; line-height:1.05; margin-bottom:1.2rem; color:var(--text-main); }
        .speakers-hero h1 span { color:#f5a623; }
        .spk-sub { font-size:1rem; color:var(--text-muted); max-width:520px; margin:0 auto 2.4rem; line-height:1.75; }
        .spk-cta { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#7a3fd1,#f5a623); color:#fff; border:none; padding:13px 30px; border-radius:999px; font-weight:700; font-size:0.88rem; cursor:pointer; text-decoration:none; transition:opacity 0.2s,transform 0.2s; }
        .spk-cta:hover { opacity:0.88; transform:translateY(-2px); }
        .speakers-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:rgba(${purpleRgb},0.10); border-top:1px solid rgba(${purpleRgb},0.10); border-bottom:1px solid rgba(${purpleRgb},0.10); margin-bottom:5rem; }
        .stat-cell { display:flex; align-items:center; gap:14px; padding:24px 20px; background:var(--bg-card,rgba(${purpleRgb},0.03)); }
        .stat-icon { width:44px; height:44px; border-radius:12px; background:rgba(${purpleRgb},0.10); border:1px solid rgba(${purpleRgb},0.18); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#7a3fd1; }
        .stat-value { font-family:'Orbitron',sans-serif; font-size:1.4rem; font-weight:900; line-height:1; color:var(--text-main); }
        .stat-label { font-size:0.68rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.8px; margin-top:4px; line-height:1.3; }
        @media(min-width:768px) { .speakers-stats { grid-template-columns:repeat(4,1fr); } }
        .spk-cta-band { margin:0 5% 5rem; border-radius:24px; padding:3.5rem 4rem; background:var(--bg-card); border:1px solid var(--border-main); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:2rem; }
        .spk-cta-band h3 { font-size:1.6rem; font-weight:900; font-family:'Orbitron',sans-serif; color:var(--text-main); margin-bottom:0.5rem; }
        .spk-cta-band h3 span { color:#f5a623; }
        .spk-cta-band p { font-size:0.92rem; color:var(--text-muted); max-width:420px; line-height:1.65; }
        @media(max-width:768px) { .spk-cta-band { padding:2rem; text-align:center; justify-content:center; } .spk-cta-band p { margin:0 auto; } }
      `}} />

      <div className="speakers-page">
        <Navbar />
        <main style={{ flex: 1 }}>

          {/* Hero */}
          <section className="speakers-hero">
            <div className="spk-orb-1" />
            <div className="spk-orb-2" />
            <div className="spk-grid" />
            <div style={{ position: "relative", zIndex: 2 }}>
              <h1>World-Class<br /><span>Speakers</span></h1>
              <p className="spk-sub">
                Hear from the brightest minds in AI, quantum computing, cybersecurity,
                sustainability, and robotics shaping tomorrow's world.
              </p>
              <a href="/tickets" className="spk-cta">
                Secure Your Seat <ChevronRight size={16} />
              </a>
            </div>
          </section>

          {/* Stats */}
          <div className="speakers-stats">
            {stats.map(function(s) {
              var Icon = s.icon;
              return (
                <div className="stat-cell" key={s.label}>
                  <div className="stat-icon"><Icon size={18} /></div>
                  <div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coming Soon */}
          <div style={{ textAlign: "center", padding: "3rem 5% 6rem", maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, background: "linear-gradient(135deg,#7a3fd1,#f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "1.5rem" }}>
              Coming Soon.
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.8 }}>
              We are currently curating our lineup of world-class speakers for TTFC 2026. Announcements will be made shortly.
            </p>
          </div>

          {/* Apply to Speak CTA */}
          <div className="spk-cta-band">
            <div>
              <h3>Want to <span>Speak</span> at TTFC?</h3>
              <p>We're looking for visionary leaders, innovators, and experts to take the stage. Applications for TTFC 2026 are now open.</p>
            </div>
            <button onClick={function() { setModalOpen(true); }} className="spk-cta" style={{ whiteSpace: "nowrap", border: "none" }}>
              Apply to Speak <ChevronRight size={16} />
            </button>
          </div>

        </main>
        <Footer />
      </div>

      {modalOpen && <SpeakerApplicationModal onClose={function() { setModalOpen(false); }} dark={dark} />}
    </>
  );
}
