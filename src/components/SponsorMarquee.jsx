import React from "react";

const SPONSORS = [
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Amazon Web Services", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  { name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" },
  { name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg" },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
  { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
  { name: "SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" },
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

      {/* Label */}
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