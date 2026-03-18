import React from "react";

const SPONSORS = [
  { name: "Cvent", logo: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 50'%3E%3Ctext x='100' y='35' font-family='Arial' font-size='36' font-weight='bold' text-anchor='middle' fill='black'%3Ecvent%3C/text%3E%3C/svg%3E" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Constellar", logo: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 250 50'%3E%3Ctext x='125' y='35' font-family='Arial' font-size='32' font-weight='bold' text-anchor='middle' fill='black'%3EConstellar%3C/text%3E%3C/svg%3E" },
  { name: "DHL", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/DHL_Express_logo.svg" },
  { name: "Pinterest", logo: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 50'%3E%3Ctext x='100' y='35' font-family='Arial' font-size='32' font-weight='bold' text-anchor='middle' fill='black'%3EPinterest%3C/text%3E%3C/svg%3E" },
  { name: "Ford", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg" },
  { name: "KPMG", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/KPMG_logo.svg" },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
  { name: "Honeywell", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Honeywell_logo.svg" },
  { name: "Harvard Medical", logo: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 50'%3E%3Ctext x='150' y='35' font-family='Arial' font-size='28' font-weight='bold' text-anchor='middle' fill='black'%3EHarvard Medical%3C/text%3E%3C/svg%3E" },
  { name: "Temasek", logo: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 50'%3E%3Ctext x='100' y='35' font-family='Arial' font-size='32' font-weight='bold' text-anchor='middle' fill='black'%3ETEMASEK%3C/text%3E%3C/svg%3E" },
  { name: "Broadcom", logo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Broadcom_Logo.svg" },
  { name: "VMware", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Vmware.svg" },
  { name: "GE", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/General_Electric_logo.svg" },
];

export default function SponsorMarquee({ dark }) {
  var bg     = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  var border = dark ? "rgba(155,135,245,0.10)" : "rgba(122,63,209,0.08)";
  var fade   = dark ? "#06020f" : "#ffffff";
  var items  = [...SPONSORS, ...SPONSORS];

  return (
    <section style={{ background: bg, borderTop: "1px solid " + border, borderBottom: "1px solid " + border, padding: "32px 0 28px", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes marquee-scroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        .marquee-track { display:flex; width:max-content; animation:marquee-scroll 32s linear infinite; }
        .marquee-track:hover { animation-play-state:paused; }
        .marquee-item { display:flex; align-items:center; justify-content:center; padding:0 44px; border-right:1px solid ${border}; height:44px; flex-shrink:0; }
        .marquee-item img { height:22px; width:auto; max-width:110px; object-fit:contain; opacity:0.40; filter:${dark ? "brightness(0) invert(1)" : "brightness(0)"}; transition:opacity 0.2s ease; }
        .marquee-item:hover img { opacity:0.80; }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 18, fontFamily: "'Orbitron',sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: dark ? "rgba(200,185,255,0.40)" : "rgba(13,5,32,0.35)" }}>
        Our team includes alumni from
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to right, ${fade}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to left, ${fade}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
        <div className="marquee-track">
          {items.map(function (s, i) {
            return (
              <div key={i} className="marquee-item">
                <img src={s.logo} alt={s.name} title={s.name} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
