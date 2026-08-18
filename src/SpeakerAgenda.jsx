// src/components/SpeakerAgenda.jsx
// Drop-in replacement for the "Agenda TBA" block at the bottom of a
// speaker's profile page (/speakers/:slug).
//
// USAGE — in your speaker profile page, replace the "Agenda TBA" markup with:
//
//     import SpeakerAgenda from "../components/SpeakerAgenda";
//     ...
//     <SpeakerAgenda speakerName={speaker.name} dark={dark} />
//
// It reads src/data/agenda.js, so it stays in sync with the Agenda page and
// the "Show Agenda" buttons automatically. If the person isn't in the agenda
// yet it falls back to the "Agenda TBA" empty state on its own.

import { Link } from "react-router-dom";
import { Clock, CalendarDays, ArrowRight, Users } from "lucide-react";
import {
  sessionsForSpeaker, roleInSession, nameKeys,
  DAYS, formatTime12, getDuration,
} from "../data/agenda";

/** true when two spellings refer to the same person */
function sameName(a, b) {
  const ka = new Set(nameKeys(a));
  return nameKeys(b).some((k) => ka.has(k));
}

const FORMAT_LABEL = {
  networking: "Networking",
  keynote: "Keynote",
  fireside: "Fireside",
  briefing: "Boardroom Briefing",
  panel: "Panel / Debate",
  provocation: "Provocation",
  break: "Break",
  awards: "Awards / Gala",
  opening: "Opening",
  dialogue: "Leadership Dialogue",
  closing: "Closing",
};

export default function SpeakerAgenda({ speakerName, dark = false, title = "Agenda" }) {
  const sessions = sessionsForSpeaker(speakerName);

  const text        = dark ? "#ffffff"                : "#0d0520";
  const secondary   = dark ? "rgba(255,255,255,0.72)" : "rgba(13,5,32,0.62)";
  const muted       = dark ? "rgba(255,255,255,0.46)" : "rgba(13,5,32,0.42)";
  const border      = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)";
  const accent      = dark ? "#b99eff"                : "#7a3fd1";
  const cardBg      = dark ? "rgba(255,255,255,0.04)" : "#ffffff";

  const Heading = (
    <h2 style={{
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "clamp(1.1rem, 2.6vw, 1.5rem)", fontWeight: 800,
      letterSpacing: "0.02em", color: text, marginBottom: "1.2rem",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <CalendarDays size={19} style={{ color: accent }} />
      {title}
      {sessions.length > 0 && (
        <span style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem", fontWeight: 800,
          letterSpacing: "0.08em", padding: "3px 9px", borderRadius: 999,
          background: accent + "20", color: accent,
        }}>
          {sessions.length} SESSION{sessions.length !== 1 ? "S" : ""}
        </span>
      )}
    </h2>
  );

  // ── Empty state: keeps the original "Agenda TBA" behaviour ──
  if (sessions.length === 0) {
    return (
      <section style={{ marginTop: "2.5rem" }}>
        {Heading}
        <div style={{
          padding: "2rem 1.5rem", borderRadius: 10, textAlign: "center",
          border: `1px dashed ${border}`, background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        }}>
          <p style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: "0.74rem", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", color: muted,
          }}>
            Agenda TBA
          </p>
          <p style={{ fontSize: "0.86rem", color: muted, marginTop: 8, lineHeight: 1.6 }}>
            Session details for this speaker are being finalised.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginTop: "2.5rem" }}>
      {Heading}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {sessions.map((s) => {
          const role = roleInSession(s, speakerName);
          // everyone else on stage, excluding this speaker
          const others = (s.speakers || [])
            .filter((p) => !sameName(p.name, speakerName))
            .map((p) => p.name);

          return (
            <Link
              key={s.id}
              to={`/agenda?session=${s.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  position: "relative", borderRadius: 10, overflow: "hidden",
                  background: cardBg,
                  border: `1px solid ${border}`,
                  boxShadow: dark ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
                  padding: "1rem 1.2rem 1rem 1.45rem",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = accent + "80";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = border;
                }}
              >
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                  background: accent, borderRadius: "10px 0 0 10px",
                }} />

                <div style={{
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  gap: "0.4rem", marginBottom: "0.55rem",
                }}>
                  <span style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em",
                    textTransform: "uppercase", padding: "0.22rem 0.6rem", borderRadius: 5,
                    background: accent + "1c", color: accent, border: `1px solid ${accent}38`,
                  }}>
                    {DAYS[s.day].label} · {DAYS[s.day].date}
                  </span>
                  <span style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em",
                    textTransform: "uppercase", padding: "0.22rem 0.6rem", borderRadius: 5,
                    background: dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.05)",
                    color: secondary,
                  }}>
                    {s.type || FORMAT_LABEL[s.format] || "Session"}
                  </span>
                  {role === "moderator" && (
                    <span style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em",
                      textTransform: "uppercase", padding: "0.22rem 0.6rem", borderRadius: 5,
                      background: dark ? "rgba(245,166,35,0.16)" : "rgba(196,120,10,0.12)",
                      color: dark ? "#f5a623" : "#c4780a",
                    }}>
                      Moderating
                    </span>
                  )}
                </div>

                <p style={{
                  fontWeight: 700, fontSize: "1rem", lineHeight: 1.4,
                  color: text, marginBottom: "0.5rem",
                }}>
                  {s.title}
                </p>

                <div style={{
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  gap: "0.35rem 1.1rem", fontSize: "0.82rem", color: secondary,
                }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Clock size={13} style={{ color: muted }} />
                    {formatTime12(s.time)} – {formatTime12(s.endTime)} · {getDuration(s.time, s.endTime)}
                  </span>
                  {others.length > 0 && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      color: muted, minWidth: 0,
                    }}>
                      <Users size={13} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 320 }}>
                        with {others.join(", ")}
                      </span>
                    </span>
                  )}
                </div>

                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, marginTop: "0.7rem",
                  fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem", fontWeight: 800,
                  letterSpacing: "0.08em", textTransform: "uppercase", color: accent,
                }}>
                  View in full agenda <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
