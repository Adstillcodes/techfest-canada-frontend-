import React from "react";

// IMPORTANT: Ensure all these uploaded image files are placed inside your "public" folder!
const SPONSORS = [
  { name: "Harved Medical", logo: "/image_8726a4.png" },
  { name: "Temasek", logo: "/image_8739cd.png" },
  { name: "Ford", logo: "/image_873644.jpg" },
  { name: "Cvent", logo: "/image_8735ec.png" },
  { name: "Pinterest", logo: "/image_8732a4.png" },
  { name: "DHL", logo: "/image_872a88.png" },
  { name: "Constellar", logo: "/image_872a65.png" },
  { name: "GE", logo: "/image_87279c.jpg" },
  { name: "Broadcom", logo: "/image_872745.png" },
  { name: "VMWare", logo: "/image_872703.png" },
  { name: "Amazon", logo: "/image_8726ca.png" },
];

export default function SponsorMarquee({ dark }) {
  var bg     = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  var border = dark ? "rgba(155,135,245,0.10)" : "rgba(122,63,209,0.08)";
  var fade   = dark ? "#06020f" : "#ffffff";
  var items  = [...SPONSORS, ...SPONSORS]; // Duplicated for the seamless loop

  return (
    <section style={{ background: bg, borderTop: "1px solid " + border, borderBottom: "1px solid " + border, padding: "32px 0 28px", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes marquee-scroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        .marquee-track { display:flex; width:max-content; animation:marquee-scroll 32s linear infinite; }
        .marquee-track:hover { animation-play-state:paused; }
        .marquee-item { display:flex; align-items:center; justify-content:center; padding:0 44px; border-right:1px solid ${border}; height:50px; flex-shrink:0; }
        
        /* Theming Logic: Full Color in Light Mode, Solid White in Dark Mode */
        .marquee-item img { 
          height: 28px; 
          width: auto; 
          max-width: 120px; 
          object-fit: contain; 
          opacity: ${dark ? 0.6 : 0.95}; 
          filter: ${dark ? "brightness(0) invert(1)" : "none"}; 
          transition: all 0.3s ease; 
        }
        
        .marquee-item:hover img { 
          opacity: 1; 
          transform: scale(1.05);
        }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 18, fontFamily: "'Orbitron',sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: dark ? "rgba(200,185,255,0.40)" : "rgba(13,5,32,0.35)" }}>
        Our team includes alumni from
      </div>

      <div style={{ position: "relative" }}>
        {/* Gradient fades using escaped template literals to prevent Vercel build errors */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: \`linear-gradient(to right, \${fade}, transparent)\`, zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: \`linear-gradient(to left, \${fade}, transparent)\`, zIndex: 2, pointerEvents: "none" }} />
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
