import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import { Mic, Users, Calendar, Award, ChevronRight, X, Search } from "lucide-react";
import emailjs from "@emailjs/browser";
import { client, urlFor } from "../utils/sanity";
import SponsorMarquee from "../components/SponsorMarquee";


const STATS = [
  { icon: <Users size={18} />, value: "1000+", label: "Attendees" },
  { icon: <Mic size={18} />, value: "50+", label: "Speakers" },
  { icon: <Calendar size={18} />, value: "2", label: "Days" },
  { icon: <Award size={18} />, value: "5", label: "Tech Pillars Covered" },
];

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Speakers() {
  const [isDark, setIsDark] = useState(true);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const sync = () => setIsDark(document.body.classList.contains("dark-mode"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "speaker"] | order(order asc) {
          _id,
          name,
          title,
          company,
          bio,
          linkedin,
          image
        }`
      )
      .then((data) => {
        setSpeakers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return speakers;
    const q = search.toLowerCase();
    return speakers.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.title?.toLowerCase().includes(q) ||
        s.company?.toLowerCase().includes(q) ||
        s.bio?.toLowerCase().includes(q)
    );
  }, [speakers, search]);

  const bg = isDark ? "#06020f" : "#ffffff";
  const text = isDark ? "#f0eaff" : "#0d0520";
  const sub = isDark ? "rgba(200,185,255,0.55)" : "rgba(13,5,32,0.50)";
  const card = isDark ? "rgba(255,255,255,0.04)" : "rgba(122,63,209,0.04)";
  const border = isDark ? "rgba(155,135,245,0.12)" : "rgba(122,63,209,0.10)";
  const purple = "#9b87f5";

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ paddingTop: 120, paddingBottom: 60, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: isDark
            ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(155,135,245,0.18) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(122,63,209,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            display: "inline-block",
            border: `1px solid ${border}`,
            borderRadius: 999,
            padding: "6px 18px",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: purple,
            marginBottom: 24,
            fontFamily: "'Orbitron', sans-serif",
          }}>
            TTFC 2026 Speaker Lineup
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 6vw, 3.4rem)",
            fontWeight: 800,
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            marginBottom: 20,
          }}>
            Meet Our <span style={{ color: purple }}>Speakers</span>
          </h1>
          <p style={{ fontSize: "1rem", color: sub, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Industry leaders, innovators, and pioneers shaping the future of technology in Canada and beyond.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 32 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: purple, marginBottom: 4 }}>
                  {s.icon}
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Orbitron', sans-serif" }}>{s.value}</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: sub, textTransform: "uppercase", letterSpacing: "1.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY SEARCH ── */}
      <div style={{
        position: "sticky",
        top: 64,
        zIndex: 50,
        background: isDark ? "rgba(6,2,15,0.90)" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${border}`,
        padding: "12px 24px",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: sub }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search speakers by name, company, or topic…"
            style={{
              width: "100%",
              padding: "10px 40px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: card,
              color: text,
              fontSize: "0.9rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: sub }}
            >
              <X size={16} />
            </button>
          )}
        </div>
        {search && (
          <div style={{ textAlign: "center", fontSize: "0.75rem", color: sub, marginTop: 6 }}>
            {filtered.length} speaker{filtered.length !== 1 ? "s" : ""} found
          </div>
        )}
      </div>

      {/* ── SPEAKER GRID ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: sub, padding: 80 }}>Loading speakers…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: sub, padding: 80 }}>No speakers match your search.</div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 28,
          }}>
            {filtered.map((speaker) => (
              <SpeakerCard
                key={speaker._id}
                speaker={speaker}
                isDark={isDark}
                card={card}
                border={border}
                text={text}
                sub={sub}
                purple={purple}
              />
            ))}
          </div>
        )}

        {/* More coming soon */}
        {!loading && (
          <div style={{
            marginTop: 60,
            padding: "28px 32px",
            borderRadius: 16,
            border: `1px solid ${border}`,
            background: card,
            textAlign: "center",
          }}>
            <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>🎤</div>
            <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>More Speakers Coming Soon</div>
            <div style={{ fontSize: "0.85rem", color: sub }}>
              We're finalizing our lineup. Check back for updates.
            </div>
          </div>
        )}
      </section>

      {/* ── WHERE SPEAKERS WORK ── */}
      <SponsorMarquee dark={isDark} title="Where our speakers work at" />

      {/* ── ADVISORY COUNCIL ── */}
      <section style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "60px 24px",
        textAlign: "center",
      }}>
        <div style={{
          padding: "48px 40px",
          borderRadius: 20,
          border: `1px solid ${border}`,
          background: card,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,135,245,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            display: "inline-block",
            border: `1px solid ${border}`,
            borderRadius: 999,
            padding: "5px 16px",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: purple,
            marginBottom: 20,
            fontFamily: "'Orbitron', sans-serif",
          }}>
            Coming Soon
          </div>
          <h2 style={{
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            fontWeight: 800,
            fontFamily: "'Orbitron', sans-serif",
            marginBottom: 12,
          }}>
            Advisory Council
          </h2>
          <p style={{ fontSize: "0.9rem", color: sub, maxWidth: 500, margin: "0 auto" }}>
            Our distinguished advisory council will be announced soon. Industry veterans and thought leaders guiding TTFC's vision.
          </p>
        </div>
      </section>

      {/* ── APPLY TO SPEAK CTA ── */}
      <ApplyToSpeak isDark={isDark} border={border} purple={purple} sub={sub} />

      <Footer />
    </div>
  );
}

/* ── SPEAKER CARD ── */
function SpeakerCard({ speaker, isDark, card, border, text, sub, purple }) {
  const [hovered, setHovered] = React.useState(false);

  const imageUrl = speaker.image ? urlFor(speaker.image).width(400).height(400).url() : null;

  return (
    <div style={{
      borderRadius: 16,
      border: `1px solid ${border}`,
      background: card,
      overflow: "hidden",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      transform: hovered ? "translateY(-4px)" : "translateY(0)",
      boxShadow: hovered
        ? "0 16px 48px rgba(155,135,245,0.20)"
        : "0 2px 12px rgba(0,0,0,0.10)",
    }}>
      {/* Photo */}
      <Link
        to={`/speakers/${speaker._id}`}
        style={{ display: "block", textDecoration: "none" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ position: "relative", paddingTop: "100%", overflow: "hidden", background: isDark ? "#1a0a3e" : "#ede9ff" }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={speaker.name}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease, filter 0.5s ease",
                transform: hovered ? "scale(1.07)" : "scale(1)",
                filter: hovered ? "brightness(1.08) contrast(1.05)" : "brightness(1)",
              }}
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "3rem", color: purple, opacity: 0.4,
            }}>
              <Mic size={48} />
            </div>
          )}
          {/* Purple glow on hover */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 80%, rgba(155,135,245,0.55) 0%, transparent 70%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }} />
          {/* View Profile pill */}
          <div style={{
            position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
            background: "rgba(155,135,245,0.90)",
            color: "#fff",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "1px",
            padding: "5px 14px",
            borderRadius: 999,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            whiteSpace: "nowrap",
          }}>
            View Profile →
          </div>
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "18px 16px 16px" }}>
        <Link to={`/speakers/${speaker._id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: purple, marginBottom: 3 }}>
            {speaker.name}
          </div>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: text, marginBottom: 2 }}>
            {speaker.title}
          </div>
          <div style={{ fontSize: "0.75rem", color: sub, marginBottom: 14 }}>
            {speaker.company}
          </div>
        </Link>

        <Link
          to={`/speakers/${speaker._id}`}
          style={{
            display: "block",
            textAlign: "center",
            padding: "9px 0",
            borderRadius: 8,
            background: "transparent",
            border: `1px solid ${purple}`,
            color: purple,
            fontSize: "0.8rem",
            fontWeight: 700,
            textDecoration: "none",
            marginBottom: 10,
            transition: "background 0.2s ease, color 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = purple; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = purple; }}
        >
          View Profile →
        </Link>

        {/* LinkedIn */}
        {speaker.linkedin && (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "9px 0",
              borderRadius: 8,
              background: "#0A66C2",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: 700,
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#004182")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0A66C2")}
          >
            <LinkedInIcon />
            View on LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}

/* ── APPLY TO SPEAK ── */
function ApplyToSpeak({ isDark, border, purple, sub }) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", title: "", industry: "", experience: "", linkedin: "" });
  const [status, setStatus] = React.useState("idle");

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setStatus("loading");
    try {
      await emailjs.send(
        "service_gy3fvru",
        "template_ufqzzep",
        {
          to_email: "baldeep@thetechfestival.com",
          from_name: form.name,
          from_email: form.email,
          message: `[Speaker Application]\nName: ${form.name}\nEmail: ${form.email}\nTitle: ${form.title}\nIndustry: ${form.industry}\nExperience: ${form.experience}\nLinkedIn: ${form.linkedin}`,
        },
        "gZgYZtLCXPVgUsVj_"
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const card = isDark ? "rgba(255,255,255,0.04)" : "rgba(122,63,209,0.04)";
  const text = isDark ? "#f0eaff" : "#0d0520";
  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(122,63,209,0.06)";

  return (
    <section style={{
      maxWidth: 900,
      margin: "0 auto",
      padding: "0 24px 80px",
    }}>
      <div style={{
        padding: "48px 40px",
        borderRadius: 20,
        border: `1px solid ${border}`,
        background: "linear-gradient(135deg, rgba(155,135,245,0.12) 0%, rgba(245,166,35,0.06) 100%)",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, fontFamily: "'Orbitron', sans-serif", marginBottom: 12, color: text }}>
          Apply to Speak at TTFC 2026
        </h2>
        <p style={{ fontSize: "0.9rem", color: sub, maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7 }}>
          Share your expertise with 1000+ attendees. We're looking for forward-thinking leaders in AI, cybersecurity, fintech, and beyond.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "14px 36px",
            borderRadius: 8,
            background: purple,
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Apply Now <ChevronRight size={16} style={{ verticalAlign: "middle" }} />
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }} onClick={() => setOpen(false)}>
          <div style={{
            background: isDark ? "#110828" : "#fff",
            borderRadius: 16,
            padding: 36,
            maxWidth: 480,
            width: "100%",
            border: `1px solid ${border}`,
            position: "relative",
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} style={{
              position: "absolute", top: 16, right: 16,
              background: "none", border: "none", cursor: "pointer", color: sub,
            }}>
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, marginBottom: 20, color: text }}>Apply to Speak</h3>

            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: purple }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>✓</div>
                <p style={{ fontWeight: 600 }}>Application submitted! We'll be in touch.</p>
              </div>
            ) : (
              <>
                {[
                  { key: "name", label: "Full Name", placeholder: "Jane Smith" },
                  { key: "email", label: "Email", placeholder: "jane@company.com", type: "email" },
                  { key: "title", label: "Job Title", placeholder: "VP of AI" },
                  { key: "industry", label: "Industry", placeholder: "Artificial Intelligence" },
                  { key: "experience", label: "Speaking Experience", placeholder: "e.g. TEDx, industry panels…" },
                  { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/…" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: "0.78rem", color: sub, marginBottom: 5 }}>{label}</label>
                    <input
                      type={type || "text"}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      style={{
                        width: "100%", padding: "10px 12px",
                        borderRadius: 8, border: `1px solid ${border}`,
                        background: inputBg, color: text,
                        fontSize: "0.88rem", outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
                {status === "error" && (
                  <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: 12 }}>
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  style={{
                    width: "100%", padding: "12px",
                    borderRadius: 8, background: purple,
                    color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                    border: "none", cursor: "pointer", marginTop: 4,
                    opacity: status === "loading" ? 0.7 : 1,
                  }}
                >
                  {status === "loading" ? "Submitting…" : "Submit Application"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
