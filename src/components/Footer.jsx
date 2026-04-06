import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function TorontoSkyline({ dark }) {
  var base = dark ? "rgba(155,135,245,0.06)" : "rgba(122,63,209,0.05)";
  var mid  = dark ? "rgba(155,135,245,0.10)" : "rgba(122,63,209,0.08)";
  var fore = dark ? "rgba(155,135,245,0.16)" : "rgba(122,63,209,0.12)";
  var hero = dark ? "rgba(185,158,255,0.22)" : "rgba(122,63,209,0.16)";
  var det  = dark ? "rgba(185,158,255,0.05)" : "rgba(122,63,209,0.04)";
  var bg   = dark ? "#06020f" : "#ffffff";

  return (
    <svg viewBox="0 0 1600 400" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax slice" style={{ width: "100%", display: "block" }}>
      <defs>
        <linearGradient id="skyFadeB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="65%" stopColor={bg} stopOpacity="0" />
          <stop offset="100%" stopColor={bg} stopOpacity="1" />
        </linearGradient>
        <linearGradient id="skyFadeT" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg} stopOpacity="1" />
          <stop offset="25%" stopColor={bg} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="skyFadeL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={bg} stopOpacity="1" />
          <stop offset="12%" stopColor={bg} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="skyFadeR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="88%" stopColor={bg} stopOpacity="0" />
          <stop offset="100%" stopColor={bg} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* ══ LAYER 1: Distant haze ══ */}
      <g fill={base}>
        <rect x="40" y="310" width="28" height="90" rx="1" />
        <rect x="72" y="295" width="24" height="105" rx="1" />
        <rect x="100" y="305" width="30" height="95" rx="1" />
        <rect x="134" y="285" width="26" height="115" rx="1" />
        <rect x="164" y="300" width="22" height="100" rx="1" />
        <rect x="190" y="290" width="32" height="110" rx="1" />
        <rect x="226" y="310" width="24" height="90" rx="1" />
        <rect x="254" y="275" width="28" height="125" rx="1" />
        <rect x="286" y="295" width="26" height="105" rx="1" />
        <rect x="320" y="280" width="30" height="120" rx="1" />
        <rect x="354" y="270" width="24" height="130" rx="1" />
        <rect x="382" y="285" width="28" height="115" rx="1" />
        <rect x="414" y="260" width="32" height="140" rx="1" />
        <rect x="450" y="275" width="26" height="125" rx="1" />
        <rect x="1050" y="270" width="30" height="130" rx="1" />
        <rect x="1084" y="260" width="26" height="140" rx="1" />
        <rect x="1114" y="280" width="32" height="120" rx="1" />
        <rect x="1150" y="265" width="28" height="135" rx="1" />
        <rect x="1182" y="285" width="24" height="115" rx="1" />
        <rect x="1210" y="275" width="30" height="125" rx="1" />
        <rect x="1244" y="295" width="26" height="105" rx="1" />
        <rect x="1274" y="280" width="28" height="120" rx="1" />
        <rect x="1306" y="300" width="24" height="100" rx="1" />
        <rect x="1334" y="290" width="30" height="110" rx="1" />
        <rect x="1368" y="305" width="26" height="95" rx="1" />
        <rect x="1398" y="295" width="32" height="105" rx="1" />
        <rect x="1434" y="310" width="28" height="90" rx="1" />
        <rect x="1466" y="300" width="24" height="100" rx="1" />
        <rect x="1494" y="315" width="30" height="85" rx="1" />
        <rect x="1528" y="305" width="26" height="95" rx="1" />
        <rect x="1558" y="315" width="32" height="85" rx="1" />
      </g>

      {/* ══ LAYER 2: Mid-ground ══ */}
      <g fill={mid}>
        <rect x="55" y="288" width="22" height="112" rx="1" />
        <rect x="80" y="272" width="26" height="128" rx="1" />
        <rect x="110" y="282" width="20" height="118" rx="1" />
        <rect x="135" y="260" width="28" height="140" rx="1" />
        <rect x="167" y="275" width="24" height="125" rx="1" />
        <rect x="195" y="265" width="30" height="135" rx="1" />
        <rect x="229" y="280" width="22" height="120" rx="1" />
        <rect x="255" y="252" width="26" height="148" rx="1" />
        <rect x="285" y="268" width="24" height="132" rx="1" />
        <rect x="330" y="255" width="28" height="145" rx="1" />
        <rect x="362" y="240" width="32" height="160" rx="1" />
        <rect x="398" y="250" width="26" height="150" rx="1" />
        <rect x="428" y="235" width="30" height="165" rx="1" />
        <rect x="462" y="248" width="24" height="152" rx="1" />
        <rect x="490" y="230" width="28" height="170" rx="1" />
        <rect x="144" y="252" width="2" height="10" />
        <rect x="209" y="258" width="2" height="9" />
        <rect x="268" y="244" width="2" height="10" />
        <rect x="377" y="232" width="2" height="10" />
        <rect x="442" y="228" width="2" height="9" />
        <rect x="1060" y="240" width="30" height="160" rx="1" />
        <rect x="1094" y="230" width="26" height="170" rx="1" />
        <rect x="1124" y="250" width="28" height="150" rx="1" />
        <rect x="1156" y="238" width="32" height="162" rx="1" />
        <rect x="1192" y="255" width="24" height="145" rx="1" />
        <rect x="1220" y="245" width="28" height="155" rx="1" />
        <rect x="1252" y="265" width="26" height="135" rx="1" />
        <rect x="1282" y="255" width="30" height="145" rx="1" />
        <rect x="1316" y="270" width="24" height="130" rx="1" />
        <rect x="1344" y="260" width="28" height="140" rx="1" />
        <rect x="1376" y="275" width="26" height="125" rx="1" />
        <rect x="1406" y="268" width="30" height="132" rx="1" />
        <rect x="1440" y="280" width="24" height="120" rx="1" />
        <rect x="1468" y="272" width="28" height="128" rx="1" />
        <rect x="1500" y="285" width="26" height="115" rx="1" />
        <rect x="1530" y="278" width="30" height="122" rx="1" />
        <rect x="1106" y="222" width="2" height="10" />
        <rect x="1171" y="230" width="2" height="10" />
        <rect x="1296" y="248" width="2" height="9" />
      </g>

      {/* ══ LAYER 3: Foreground towers ══ */}
      <g fill={fore}>
        <rect x="90" y="258" width="24" height="142" rx="1" />
        <rect x="118" y="242" width="28" height="158" rx="1" />
        <rect x="150" y="250" width="22" height="150" rx="1" />
        <rect x="176" y="235" width="26" height="165" rx="1" />
        <rect x="206" y="248" width="24" height="152" rx="1" />
        <rect x="234" y="230" width="28" height="170" rx="1" />
        <rect x="238" y="222" width="20" height="10" rx="1" />
        <rect x="242" y="214" width="12" height="10" rx="1" />
        <rect x="246" y="208" width="4" height="8" />
        <rect x="340" y="228" width="30" height="172" rx="1" />
        <rect x="374" y="215" width="34" height="185" rx="1" />
        <rect x="412" y="225" width="28" height="175" rx="1" />
        <rect x="444" y="210" width="32" height="190" rx="1" />
        <rect x="480" y="220" width="26" height="180" rx="1" />
        <rect x="354" y="220" width="2" height="10" />
        <rect x="390" y="207" width="2" height="10" />
        <rect x="459" y="202" width="2" height="10" />

        {/* Scotia Plaza */}
        <rect x="870" y="182" width="48" height="218" rx="1" />
        <rect x="876" y="170" width="36" height="14" rx="1" />
        <rect x="881" y="158" width="26" height="14" rx="1" />
        <rect x="886" y="148" width="16" height="12" rx="1" />
        <rect x="890" y="140" width="8" height="10" />
        <rect x="893" y="132" width="2" height="10" />

        {/* First Canadian Place */}
        <rect x="924" y="148" width="52" height="252" rx="1" />
        <rect x="930" y="136" width="40" height="14" rx="1" />
        <rect x="936" y="124" width="28" height="14" rx="1" />
        <rect x="941" y="114" width="18" height="12" rx="1" />
        <rect x="946" y="104" width="8" height="12" />
        <rect x="949" y="96" width="2" height="10" />
        <rect x="930" y="148" width="1.5" height="252" fill={det} />
        <rect x="938" y="148" width="1.5" height="252" fill={det} />
        <rect x="946" y="148" width="1.5" height="252" fill={det} />
        <rect x="954" y="148" width="1.5" height="252" fill={det} />
        <rect x="962" y="148" width="1.5" height="252" fill={det} />
        <rect x="970" y="148" width="1.5" height="252" fill={det} />

        {/* TD Centre */}
        <rect x="982" y="175" width="44" height="225" rx="1" />
        <rect x="1030" y="185" width="38" height="215" rx="1" />
        <rect x="988" y="175" width="1.5" height="225" fill={det} />
        <rect x="996" y="175" width="1.5" height="225" fill={det} />
        <rect x="1004" y="175" width="1.5" height="225" fill={det} />
        <rect x="1012" y="175" width="1.5" height="225" fill={det} />
        <rect x="1020" y="175" width="1.5" height="225" fill={det} />

        {/* Bay Adelaide */}
        <rect x="1072" y="170" width="42" height="230" rx="1" />
        <rect x="1078" y="160" width="30" height="12" rx="1" />
        <rect x="1088" y="148" width="2" height="14" />

        {/* Royal Bank Plaza */}
        <rect x="1118" y="192" width="38" height="208" rx="1" />
        <rect x="1160" y="200" width="34" height="200" rx="1" />
        <rect x="1122" y="184" width="30" height="10" rx="1" />
        <rect x="1126" y="176" width="22" height="10" rx="1" />
        <rect x="1130" y="170" width="14" height="8" />

        {/* Commerce Court */}
        <rect x="1200" y="210" width="36" height="190" rx="1" />
        <rect x="1206" y="200" width="24" height="12" rx="1" />
        <rect x="1214" y="190" width="2" height="12" />

        {/* Brookfield Place */}
        <rect x="1242" y="195" width="40" height="205" rx="1" />
        <rect x="1248" y="185" width="28" height="12" rx="1" />
        <rect x="1253" y="175" width="18" height="12" rx="1" />
        <rect x="1258" y="167" width="8" height="10" />
        <rect x="1261" y="160" width="2" height="9" />

        {/* East towers */}
        <rect x="1288" y="220" width="32" height="180" rx="1" />
        <rect x="1324" y="228" width="28" height="172" rx="1" />
        <rect x="1356" y="238" width="34" height="162" rx="1" />
        <rect x="1394" y="245" width="26" height="155" rx="1" />
        <rect x="1424" y="235" width="30" height="165" rx="1" />
        <rect x="1458" y="250" width="24" height="150" rx="1" />
        <rect x="1486" y="242" width="28" height="158" rx="1" />
        <rect x="1518" y="255" width="26" height="145" rx="1" />
        <rect x="1548" y="248" width="32" height="152" rx="1" />
        <rect x="1303" y="212" width="2" height="10" />
        <rect x="1372" y="230" width="2" height="10" />
        <rect x="1438" y="228" width="2" height="9" />
        <rect x="1500" y="234" width="2" height="10" />
      </g>

      {/* ══ Rogers Centre ══ */}
      <g fill={fore}>
        <path d="M 520,400 Q 520,292 580,272 Q 615,260 650,258 Q 685,260 720,272 Q 780,292 780,400 Z" />
        <path d="M 620,262 Q 600,310 570,400" fill="none" stroke={mid} strokeWidth="1.2" />
        <path d="M 650,258 Q 650,310 650,400" fill="none" stroke={mid} strokeWidth="1.2" />
        <path d="M 680,262 Q 700,310 730,400" fill="none" stroke={mid} strokeWidth="1.2" />
        <path d="M 610,270 Q 650,265 690,270" fill="none" stroke={det} strokeWidth="2" />
        <rect x="510" y="345" width="280" height="55" fill={mid} rx="2" />
        <rect x="510" y="355" width="280" height="1" fill={det} />
        <rect x="510" y="370" width="280" height="1" fill={det} />
      </g>

      {/* ══ CN Tower ══ */}
      <g fill={hero}>
        <polygon points="737,400 755,220 755,60 765,60 765,220 783,400" />
        <rect x="730" y="185" width="60" height="20" rx="8" />
        <rect x="735" y="175" width="50" height="12" rx="6" />
        <rect x="742" y="205" width="36" height="8" rx="4" />
        <rect x="746" y="115" width="28" height="16" rx="5" />
        <rect x="749" y="108" width="22" height="9" rx="4" />
        <rect x="756" y="32" width="8" height="78" />
        <rect x="758" y="8" width="4" height="26" />
        <circle cx="760" cy="7" r="3" />
        <rect x="732" y="192" width="56" height="1.5" rx="1" fill={det} />
        <rect x="732" y="198" width="56" height="1.5" rx="1" fill={det} />
        <rect x="748" y="122" width="24" height="1" rx="1" fill={det} />
        <rect x="755" y="60" width="1.5" height="340" fill={det} />
        <rect x="763" y="60" width="1.5" height="340" fill={det} />
      </g>

      {/* Waterline */}
      <rect x="0" y="392" width="1600" height="8" fill={dark ? "rgba(155,135,245,0.04)" : "rgba(122,63,209,0.03)"} rx="1" />

      {/* Fades */}
      <rect x="0" y="0" width="1600" height="400" fill="url(#skyFadeB)" />
      <rect x="0" y="0" width="1600" height="400" fill="url(#skyFadeT)" />
      <rect x="0" y="0" width="1600" height="400" fill="url(#skyFadeL)" />
      <rect x="0" y="0" width="1600" height="400" fill="url(#skyFadeR)" />
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
      </div>
    </footer>
  );
}
