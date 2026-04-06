import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function TorontoSkyline({ dark }) {
  var col = dark ? "rgba(155,135,245,0.14)" : "rgba(122,63,209,0.11)";
  var refCol = dark ? "rgba(155,135,245,0.05)" : "rgba(122,63,209,0.04)";
  var sky = "M0,300 L60,300 L60,260 L80,260 L80,240 Q100,220 120,240 L120,260 L150,260 L150,230 L165,230 L165,250 L180,250 L180,220 L195,220 L195,245 L215,245 L215,210 L230,210 L230,235 L250,235 L250,195 L258,190 L266,195 L266,220 L280,220 L280,185 L290,185 L290,170 L300,170 L300,195 L315,195 L315,165 L325,165 L325,150 L335,150 L335,175 L350,175 L350,200 L365,200 L365,160 L375,160 L375,140 L383,135 L391,140 L391,160 L400,160 L400,185 L415,185 L415,155 L425,155 L425,135 L435,135 L435,155 L445,155 L445,180 L460,180 L460,145 L468,145 L468,125 L475,120 L482,125 L482,145 L490,145 L490,175 L505,175 L505,150 L515,150 L515,130 L525,130 L525,150 L535,150 L535,180 L555,180 L555,160 L565,160 L565,140 L573,135 L581,140 L581,160 L590,160 L590,185 L610,185 L610,165 L618,100 L622,55 L625,25 L627,18 L629,15 L631,18 L633,25 L636,55 L640,100 L644,88 L660,88 L664,100 L648,100 L652,165 L660,165 L660,190 L680,190 L680,210 Q700,195 720,210 L720,230 L740,230 L740,185 L750,185 L750,170 L760,170 L760,185 L770,185 L770,215 L790,215 L790,175 L800,175 L800,160 L810,160 L810,175 L820,175 L820,210 L840,210 L840,190 L850,190 L850,175 L860,175 L860,190 L870,190 L870,220 L890,220 L890,240 L910,240 L910,255 L935,255 L935,270 L960,270 L960,280 L1000,280 L1000,290 L1100,290 L1100,295 L1200,300 Z";

  return (
    <svg viewBox="0 0 1200 380" preserveAspectRatio="xMidYMax slice" style={{ width: "100%", display: "block" }} xmlns="http://www.w3.org/2000/svg">
      <path d={sky} fill={col} />
      <g transform="translate(0,600) scale(1,-1)" opacity="0.4">
        <path d={sky} fill={refCol} />
      </g>
    </svg>
  );
}

export default function Footer() {
  var s = useState(false); var dark = s[0]; var setDark = s[1];
  useEffect(function () {
    var sync = function () { setDark(document.body.classList.contains("dark-mode")); };
    sync();
    var mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { mo.disconnect(); };
  }, []);

  var bg   = dark ? "#06020f" : "#ffffff";
  var iCol = dark ? "rgba(200,185,255,0.55)" : "rgba(90,40,180,0.50)";
  var iHov = dark ? "#ffffff" : "#0d0520";
  var tCol = dark ? "rgba(200,185,255,0.40)" : "rgba(90,40,180,0.45)";
  var lCol = dark ? "rgba(185,158,255,0.75)" : "#7a3fd1";
  var bTop = dark ? "1px solid rgba(155,135,245,0.10)" : "1px solid rgba(122,63,209,0.10)";

  return (
    <footer style={{ background: bg, borderTop: bTop, display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
      <div style={{ width: "100%", lineHeight: 0, marginBottom: -8 }}>
        <TorontoSkyline dark={dark} />
      </div>
      <div style={{ background: bg, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "10px 6% 32px" }}>

        {/* Social icons */}
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="https://www.linkedin.com/company/thetechfestival/posts/?feedView=all" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"
            style={{ color: iCol, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
            onMouseEnter={function (e) { e.currentTarget.style.color = iHov; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function (e) { e.currentTarget.style.color = iCol; e.currentTarget.style.transform = "translateY(0)"; }}
          ><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg></a>
          <a href="https://x.com/thetechfestival" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer"
            style={{ color: iCol, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
            onMouseEnter={function (e) { e.currentTarget.style.color = iHov; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function (e) { e.currentTarget.style.color = iCol; e.currentTarget.style.transform = "translateY(0)"; }}
          ><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg></a>
          <a href="https://www.instagram.com/thetechfestival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram" target="_blank" rel="noopener noreferrer"
            style={{ color: iCol, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
            onMouseEnter={function (e) { e.currentTarget.style.color = iHov; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function (e) { e.currentTarget.style.color = iCol; e.currentTarget.style.transform = "translateY(0)"; }}
          ><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg></a>
        </div>

        <p style={{ fontSize: "0.82rem", color: tCol, margin: 0, letterSpacing: "0.2px" }}>
          © 2026 The Tech Festival Canada. |{" "}
          <Link to="/privacy" style={{ color: lCol, textDecoration: "none", transition: "opacity 0.2s ease" }}
            onMouseEnter={function (e) { e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={function (e) { e.currentTarget.style.opacity = "1"; }}
          >Privacy Policy</Link>
        </p>

        {/* AtlasLink Markets */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingBottom: 32 }}>
          <p style={{ fontSize: "0.68rem", color: tCol, margin: 0, letterSpacing: "0.8px", textTransform: "uppercase", fontWeight: 600 }}>An event by AtlasLink Markets</p>
        </div>
      </div>
    </footer>
  );
}
