import React, { useState, useEffect, useMemo } from 'react';
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import { Mic, Users, Calendar, Award, ChevronRight, X, Search } from "lucide-react";

var SPEAKERS = [
  {
    name: "Scott D'Cunha",
    title: "CEO",
    company: "Branksome Consulting & Ventures",
    description: "Seasoned marketing and digital executive with over thirty years of experience driving eCommerce and digital transformation at organizations like LCBO and Staples Canada. A Chartered Marketer and Fellow of the Chartered Institute of Marketing.",
    linkedin: "https://ca.linkedin.com/in/scott-d-cunha-0a9a52",
    image: "/scott-dcunha.jpg",
  },
  {
    name: "James Castle",
    title: "CEO, CSO & Founder",
    company: "Terranova Aerospace & Defense Group",
    description: "Globally recognized authority on sovereign AI, cybersecurity governance, and critical infrastructure protection. Founder and Chairperson of the Cyber Security Global Alliance, operating across 21 countries over 4 continents.",
    linkedin: "https://www.linkedin.com/in/jamescastleca/",
    image: "/james-castle.jpg",
  },
  {
    name: "Brennan Lodge",
    title: "Founder & CISO",
    company: "BLodgic Inc. | NYU Adjunct Professor",
    description: "Cybersecurity expert with over 15 years of experience at the intersection of data science, AI, and threat defense. Former Head of Analytics Engines at HSBC, with past roles at Goldman Sachs and BlockFi. LinkedIn Learning instructor on AI security.",
    linkedin: "https://www.linkedin.com/in/brennanlodge/",
    image: "/brennan-lodge.jpg",
  },
  {
    name: "Bijit Ghosh",
    title: "Managing Director",
    company: "Wells Fargo",
    description: "Engineering executive and product innovator leading AI/ML and cloud transformation at scale. Former CTO and Global Head of Cloud Product and Engineering at Deutsche Bank. Prolific thought leader on GenAI, LLMOps, and cloud architecture.",
    linkedin: "https://www.linkedin.com/in/bijit-ghosh-48281a78/",
    image: "/bijit-ghosh.jpg",
  },
  {
    name: "Dominick Miserandino",
    title: "CEO",
    company: "RTM Nexus | RetailWire",
    description: "Internet pioneer and 5x CEO/CMO/CRO with over 30 years scaling businesses across adtech, eCommerce, and digital media. Hosts the Retail Tech Media Leadership podcast and serves on the Engage3 technology board advising on AI-powered retail innovation.",
    linkedin: "https://www.linkedin.com/in/miserandino/",
    image: "/dominick-miserandino.jpg",
  },
];

var INDUSTRIES = [
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

var EXPERIENCE_OPTIONS = [
  "First time — never spoken at a conference",
  "1–5 conferences",
  "5–10 conferences",
  "10–15 conferences",
  "15–25 conferences",
  "25+ conferences",
];

function SpeakerApplicationModal(props) {
  var onClose = props.onClose;
  var dark = props.dark;
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
    fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: "service_gy3fvru",
        template_id: "template_ufqzzep",
        user_id: "gZgYZtLCXPVgUsVj_",
        template_params: {
          to_email: "baldeep@thetechfestival.com",
          from_name: formData.firstName + " " + formData.lastName,
          from_email: formData.email,
          message: "[Speaker Application]\nName: " + formData.firstName + " " + formData.lastName + "\nTitle: " + formData.jobTitle + "\nIndustry: " + formData.industry + "\nExperience: " + formData.experience + "\nLinkedIn: " + (formData.linkedin || "N/A"),
        },
      }),
    }).then(function(res) {
      setLoading(false);
      if (res.ok || res.status === 200) { setSubmitted(true); }
      else { setError("Something went wrong. Please try again."); }
    }).catch(function() {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    });
  }

  var inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    background: inputBg, border: "1px solid " + inputBdr,
    color: textMain, fontSize: "0.92rem", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  };
  var labelStyle = {
    display: "block", fontSize: "0.72rem", fontFamily: "'Orbitron',sans-serif",
    fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase",
    color: textMid, marginBottom: 6,
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", padding: "20px" }}
      onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: bg, width: "100%", maxWidth: 560, borderRadius: 24, border: "1px solid " + inputBdr, boxShadow: "0 24px 64px rgba(0,0,0,0.5)", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
        <div style={{ padding: "28px 32px 0", position: "sticky", top: 0, background: bg, zIndex: 2, paddingBottom: 20, borderBottom: "1px solid " + inputBdr }}>
          <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "transparent", border: "none", color: textMid, cursor: "pointer", padding: 4 }}><X size={20} /></button>
          <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: dark ? "#b99eff" : "#7a3fd1", marginBottom: 6 }}>TTFC 2026</p>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.3rem", fontWeight: 900, color: textMain, marginBottom: 4 }}>Apply to Speak</h2>
          <p style={{ fontSize: "0.85rem", color: textMid, lineHeight: 1.6 }}>We review every application. Our team will be in touch if there's a fit.</p>
        </div>
        <div style={{ padding: "24px 32px 32px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: textMain, marginBottom: 10 }}>Application Received</h3>
              <p style={{ fontSize: "0.9rem", color: textMid, lineHeight: 1.7 }}>We'll review your submission and reach out if there's a match for TTFC 2026.</p>
              <button onClick={onClose} style={{ marginTop: 24, padding: "12px 32px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'Orbitron',sans-serif", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", background: "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#fff" }}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={labelStyle}>First Name *</label><input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" style={inputStyle} /></div>
                <div><label style={labelStyle}>Last Name *</label><input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Smith" style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>Email *</label><input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@company.com" style={inputStyle} /></div>
              <div><label style={labelStyle}>LinkedIn</label><input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="linkedin.com/in/janesmith" style={inputStyle} /></div>
              <div><label style={labelStyle}>Job Title *</label><input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. Chief Technology Officer" style={inputStyle} /></div>
              <div><label style={labelStyle}>Industry *</label><select name="industry" value={formData.industry} onChange={handleChange} style={Object.assign({}, inputStyle, { appearance: "none", cursor: "pointer" })}><option value="">Select your industry</option>{INDUSTRIES.map(function(ind) { return <option key={ind} value={ind}>{ind}</option>; })}</select></div>
              <div><label style={labelStyle}>Speaking Experience *</label><select name="experience" value={formData.experience} onChange={handleChange} style={Object.assign({}, inputStyle, { appearance: "none", cursor: "pointer" })}><option value="">Number of conferences</option>{EXPERIENCE_OPTIONS.map(function(exp) { return <option key={exp} value={exp}>{exp}</option>; })}</select></div>
              {error && <div style={{ fontSize: "0.78rem", color: "#ff6b6b", padding: "10px 14px", background: "rgba(255,107,107,0.10)", borderRadius: 8, border: "1px solid rgba(255,107,107,0.25)" }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ padding: "14px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Orbitron',sans-serif", fontSize: "0.75rem", fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", background: loading ? (dark ? "rgba(122,63,209,0.4)" : "rgba(122,63,209,0.3)") : "linear-gradient(135deg,#7a3fd1,#f5a623)", color: "#ffffff", opacity: loading ? 0.7 : 1 }}>{loading ? "Submitting…" : "Submit Application →"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function SpeakerCard(props) {
  var speaker = props.speaker;
  var dark = props.dark;
  var s1 = useState(false); var expanded = s1[0]; var setExpanded = s1[1];

  var cardBg = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  var cardBdr = dark ? "rgba(155,135,245,0.18)" : "rgba(122,63,209,0.12)";
  var textMain = dark ? "#ffffff" : "#0d0520";
  var textMid = dark ? "rgba(220,210,255,0.70)" : "rgba(13,5,32,0.60)";
  var accent = dark ? "#b99eff" : "#7a3fd1";

  return (
    <div className="speaker-card" style={{
      background: cardBg, border: "1px solid " + cardBdr, borderRadius: 20,
      overflow: "hidden", transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "default", display: "flex", flexDirection: "column",
    }}
      onMouseEnter={function(e) { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = dark ? "0 12px 40px rgba(122,63,209,0.15)" : "0 12px 40px rgba(122,63,209,0.10)"; }}
      onMouseLeave={function(e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Photo */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden", background: dark ? "#120a22" : "#ede8f7" }}>
        <img src={speaker.image} alt={speaker.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={function(e) { e.target.style.display = "none"; }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, " + (dark ? "rgba(6,2,15,0.85)" : "rgba(255,255,255,0.7)") + ", transparent)", pointerEvents: "none" }} />
      </div>

      {/* Info */}
      <div className="speaker-info" style={{ padding: "16px 18px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 className="speaker-name" style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: "0.82rem", fontWeight: 900,
          color: dark ? "#4ade80" : "#1a9e70", textTransform: "uppercase",
          letterSpacing: "0.5px", marginBottom: 3, lineHeight: 1.3,
        }}>{speaker.name}</h3>
        <p className="speaker-title" style={{ fontSize: "0.78rem", fontWeight: 600, color: textMain, marginBottom: 2, lineHeight: 1.35 }}>{speaker.title}</p>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: accent, marginBottom: 10, lineHeight: 1.3 }}>{speaker.company}</p>

        {/* Description — desktop always visible, mobile toggle */}
        <p className="speaker-desc-desktop" style={{ fontSize: "0.76rem", color: textMid, lineHeight: 1.6, flex: 1 }}>{speaker.description}</p>

        <div className="speaker-desc-mobile">
          {expanded ? (
            <p style={{ fontSize: "0.72rem", color: textMid, lineHeight: 1.55, marginBottom: 6 }}>{speaker.description}</p>
          ) : null}
          <button
            className="speaker-readmore-btn"
            onClick={function() { setExpanded(function(v) { return !v; }); }}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontSize: "0.68rem", fontWeight: 700, color: accent,
              fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.5px",
              marginBottom: 6,
            }}
          >{expanded ? "Show less" : "Read more"}</button>
        </div>

        {/* LinkedIn */}
        <a href={speaker.linkedin} target="_blank" rel="noreferrer" className="speaker-li-btn" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          marginTop: 8, padding: "9px 14px", borderRadius: 8,
          background: "#0A66C2", color: "#ffffff", textDecoration: "none",
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.3px",
          transition: "background 0.2s ease",
        }}
          onMouseEnter={function(e) { e.currentTarget.style.background = "#004182"; }}
          onMouseLeave={function(e) { e.currentTarget.style.background = "#0A66C2"; }}
        >
          <LinkedInIcon /> View on LinkedIn
        </a>
      </div>
    </div>
  );
}

export default function Speakers() {
  var s1 = useState(false); var dark = s1[0]; var setDark = s1[1];
  var s2 = useState(false); var modalOpen = s2[0]; var setModalOpen = s2[1];
  var s3 = useState(""); var search = s3[0]; var setSearch = s3[1];

  useEffect(function() {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function() { setDark(document.body.classList.contains("dark-mode")); });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function() { obs.disconnect(); };
  }, []);

  var filtered = useMemo(function() {
    if (!search.trim()) return SPEAKERS;
    var q = search.toLowerCase();
    return SPEAKERS.filter(function(s) {
      return s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q) || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    });
  }, [search]);

  var bg = dark ? "#06020f" : "#ffffff";
  var textMain = dark ? "#ffffff" : "#0d0520";
  var textMid = dark ? "rgba(220,210,255,0.75)" : "rgba(13,5,32,0.60)";
  var accent = dark ? "#b99eff" : "#7a3fd1";
  var cardBdr = dark ? "rgba(155,135,245,0.18)" : "rgba(122,63,209,0.12)";
  var border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

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
        .spk-grid-bg { position:absolute; inset:0; pointer-events:none; background-image:linear-gradient(rgba(${purpleRgb},0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(${purpleRgb},0.06) 1px,transparent 1px); background-size:60px 60px; mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%); }
        .speakers-hero h1 { font-size:clamp(2.4rem,5vw,4rem); font-weight:900; font-family:'Orbitron',sans-serif; line-height:1.05; margin-bottom:1.2rem; color:var(--text-main); }
        .speakers-hero h1 span { color:#f5a623; }
        .spk-sub { font-size:1rem; color:var(--text-muted); max-width:520px; margin:0 auto 2.4rem; line-height:1.75; }
        .spk-cta { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#7a3fd1,#f5a623); color:#fff; border:none; padding:13px 30px; border-radius:999px; font-weight:700; font-size:0.88rem; cursor:pointer; text-decoration:none; transition:opacity 0.2s,transform 0.2s; }
        .spk-cta:hover { opacity:0.88; transform:translateY(-2px); }
        .speakers-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:rgba(${purpleRgb},0.10); border-top:1px solid rgba(${purpleRgb},0.10); border-bottom:1px solid rgba(${purpleRgb},0.10); }
        .stat-cell { display:flex; align-items:center; gap:14px; padding:24px 20px; background:var(--bg-card,rgba(${purpleRgb},0.03)); }
        .stat-icon { width:44px; height:44px; border-radius:12px; background:rgba(${purpleRgb},0.10); border:1px solid rgba(${purpleRgb},0.18); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#7a3fd1; }
        .stat-value { font-family:'Orbitron',sans-serif; font-size:1.4rem; font-weight:900; line-height:1; color:var(--text-main); }
        .stat-label { font-size:0.68rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.8px; margin-top:4px; line-height:1.3; }
        @media(min-width:768px) { .speakers-stats { grid-template-columns:repeat(4,1fr); } }

        /* Grid: 4 desktop, 2 everywhere else */
        .speakers-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        @media(max-width:1100px) { .speakers-grid { grid-template-columns:repeat(2,1fr); gap:20px; } }
        @media(max-width:600px) { .speakers-grid { grid-template-columns:repeat(2,1fr); gap:10px; } }

        /* Desktop: show full desc, hide read more btn */
        .speaker-desc-desktop { display: block; }
        .speaker-desc-mobile { display: none; }

        /* Mobile: hide full desc, show read more toggle */
        @media(max-width:600px) {
          .speaker-desc-desktop { display: none !important; }
          .speaker-desc-mobile { display: block !important; }
          .speaker-card { border-radius: 14px; }
          .speaker-info { padding: 10px 10px 10px !important; }
          .speaker-name { font-size: 0.72rem !important; }
          .speaker-title { font-size: 0.68rem !important; }
          .speaker-li-btn { padding: 7px 10px !important; font-size: 0.65rem !important; gap: 5px !important; }
          .speaker-li-btn svg { width: 12px !important; height: 12px !important; }
        }

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
            <div className="spk-grid-bg" />
            <div style={{ position: "relative", zIndex: 2 }}>
              <h1>World-Class<br /><span>Speakers</span></h1>
              <p className="spk-sub">Hear from the brightest minds in AI, quantum computing, cybersecurity, sustainability, and robotics shaping tomorrow's world.</p>
              <a href="/tickets" className="spk-cta">Secure Your Seat <ChevronRight size={16} /></a>
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

          {/* Sticky Search */}
          <div style={{
            position: "sticky", top: "64px", zIndex: 40,
            background: dark ? "rgba(6,2,15,0.97)" : "rgba(255,255,255,0.97)",
            backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
            borderBottom: "1px solid " + border, padding: "14px 5%",
          }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10, flex: 1,
                padding: "10px 16px", borderRadius: 12,
                background: dark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.04)",
                border: "1.5px solid " + (dark ? "rgba(255,255,255,0.10)" : "rgba(122,63,209,0.12)"),
              }}>
                <Search size={16} style={{ opacity: 0.4, flexShrink: 0 }} />
                <input value={search} onChange={function(e) { setSearch(e.target.value); }}
                  placeholder="Search speakers..."
                  style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.88rem", color: textMain, width: "100%", fontFamily: "inherit" }} />
                {search && <button onClick={function() { setSearch(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: textMid, lineHeight: 0, padding: 0 }}><X size={14} /></button>}
              </div>
              <span style={{ fontSize: "0.75rem", color: textMid, flexShrink: 0, fontWeight: 600 }}>{filtered.length} speaker{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Speaker Grid */}
          <section style={{ padding: "3rem 5%", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: accent, marginBottom: 12 }}>TTFC 2026 Lineup</p>
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,4vw,2.6rem)", fontWeight: 900, color: textMain, marginBottom: 16 }}>Confirmed Speakers</h2>
              <div style={{ width: 60, height: 3, borderRadius: 3, background: "linear-gradient(90deg,#7a3fd1,#f5a623)", margin: "0 auto" }} />
            </div>

            {filtered.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0", gap: 12, opacity: 0.4 }}>
                <Search size={28} style={{ opacity: 0.3 }} />
                <p style={{ fontSize: "0.9rem" }}>No speakers match your search.</p>
                <button onClick={function() { setSearch(""); }} style={{ fontSize: "0.8rem", color: accent, textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}>Clear search</button>
              </div>
            ) : (
              <div className="speakers-grid">
                {filtered.map(function(speaker) {
                  return <SpeakerCard key={speaker.name} speaker={speaker} dark={dark} />;
                })}
              </div>
            )}

            {/* More Coming Soon */}
            <div style={{ textAlign: "center", padding: "3.5rem 0 1rem" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                padding: "16px 36px", borderRadius: 14,
                background: dark ? "rgba(255,255,255,0.04)" : "rgba(122,63,209,0.04)",
                border: "1px solid " + cardBdr,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5a623", boxShadow: "0 0 8px rgba(245,166,35,0.5)", animation: "spk-pulse 2s ease-in-out infinite" }} />
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: textMid }}>More Speakers Coming Soon</span>
              </div>
            </div>
          </section>

          {/* Advisory Council */}
          <section style={{
            padding: "5rem 5%",
            background: dark ? "rgba(122,63,209,0.04)" : "rgba(122,63,209,0.02)",
            borderTop: "1px solid " + cardBdr, borderBottom: "1px solid " + cardBdr,
          }}>
            <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
              <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: accent, marginBottom: 12 }}>Leadership</p>
              <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.6rem,4vw,2.6rem)", fontWeight: 900, color: textMain, marginBottom: 16 }}>Advisory Council</h2>
              <div style={{ width: 60, height: 3, borderRadius: 3, background: "linear-gradient(90deg,#7a3fd1,#f5a623)", margin: "0 auto 28px" }} />
              <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(1.5rem,4vw,2.8rem)", fontWeight: 900, background: "linear-gradient(135deg,#7a3fd1,#f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "1rem" }}>Coming Soon.</h3>
              <p style={{ color: textMid, fontSize: "1rem", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>We are assembling a distinguished advisory council of industry leaders, policymakers, and technology pioneers. Announcements will be made shortly.</p>
            </div>
          </section>

          {/* Apply CTA */}
          <div className="spk-cta-band">
            <div>
              <h3>Want to <span>Speak</span> at TTFC?</h3>
              <p>We're looking for visionary leaders, innovators, and experts to take the stage. Applications for TTFC 2026 are now open.</p>
            </div>
            <button onClick={function() { setModalOpen(true); }} className="spk-cta" style={{ whiteSpace: "nowrap", border: "none" }}>Apply to Speak <ChevronRight size={16} /></button>
          </div>
        </main>
        <Footer />
      </div>

      <style>{`@keyframes spk-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(1.3);} }`}</style>
      {modalOpen && <SpeakerApplicationModal onClose={function() { setModalOpen(false); }} dark={dark} />}
    </>
  );
}
