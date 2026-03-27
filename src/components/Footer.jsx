import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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

  // Depth layers — purple-tinted silhouette palette
  var L1   = dark ? "rgba(130,110,230,0.07)" : "rgba(75,25,150,0.07)";
  var L2   = dark ? "rgba(140,120,242,0.13)" : "rgba(82,32,162,0.12)";
  var L3   = dark ? "rgba(155,135,255,0.20)" : "rgba(88,38,172,0.19)";
  var L4   = dark ? "rgba(168,150,255,0.29)" : "rgba(93,43,180,0.27)";
  var CNT  = dark ? "rgba(185,168,255,0.40)" : "rgba(98,48,190,0.35)";

  var iCol = dark ? "rgba(200,185,255,0.55)" : "rgba(90,40,180,0.50)";
  var iHov = dark ? "#ffffff" : "#0d0520";
  var tCol = dark ? "rgba(200,185,255,0.40)" : "rgba(90,40,180,0.45)";
  var lCol = dark ? "rgba(185,158,255,0.75)" : "#7a3fd1";
  var bTop = dark ? "1px solid rgba(155,135,245,0.10)" : "1px solid rgba(122,63,209,0.10)";

  return (
    <footer style={{ background: bg, borderTop: bTop, display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>

      {/* ── TORONTO SKYLINE ── */}
      <div style={{ width: "100%", lineHeight: 0 }}>
        <svg viewBox="0 0 1440 310" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice" style={{ width: "100%", display: "block" }}>
          <defs>
            <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="52%" stopColor={bg} stopOpacity="0" />
              <stop offset="100%" stopColor={bg} stopOpacity="1" />
            </linearGradient>
            <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor={bg} stopOpacity="1" />
              <stop offset="20%" stopColor={bg} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gL" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"  stopColor={bg} stopOpacity="1" />
              <stop offset="9%"  stopColor={bg} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gR" x1="0" y1="0" x2="1" y2="0">
              <stop offset="91%" stopColor={bg} stopOpacity="0" />
              <stop offset="100%" stopColor={bg} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* ─── LAYER 1: Far distant haze ─── */}
          <g fill={L1}>
            <rect x="0"    y="252" width="58"  height="58" />
            <rect x="62"   y="240" width="50"  height="70" />
            <rect x="116"  y="250" width="44"  height="60" />
            <rect x="165"  y="232" width="56"  height="78" />
            <rect x="226"  y="244" width="46"  height="66" />
            <rect x="276"  y="220" width="62"  height="90" />
            <rect x="342"  y="236" width="50"  height="74" />
            <rect x="396"  y="214" width="65"  height="96" />
            <rect x="466"  y="230" width="54"  height="80" />
            <rect x="525"  y="198" width="70"  height="112" />
            <rect x="600"  y="188" width="78"  height="122" />
            <rect x="762"  y="194" width="72"  height="116" />
            <rect x="840"  y="208" width="65"  height="102" />
            <rect x="910"  y="222" width="55"  height="88" />
            <rect x="970"  y="234" width="50"  height="76" />
            <rect x="1025" y="216" width="62"  height="94" />
            <rect x="1092" y="230" width="46"  height="80" />
            <rect x="1143" y="214" width="56"  height="96" />
            <rect x="1204" y="236" width="44"  height="74" />
            <rect x="1254" y="248" width="50"  height="62" />
            <rect x="1309" y="240" width="58"  height="70" />
            <rect x="1372" y="252" width="68"  height="58" />
          </g>

          {/* ─── LAYER 2: Mid background ─── */}
          <g fill={L2}>
            <rect x="0"    y="228" width="54"  height="82" />
            <rect x="6"    y="216" width="30"  height="14" />
            <rect x="58"   y="210" width="64"  height="100" />
            <rect x="67"   y="198" width="38"  height="14" />
            <rect x="128"  y="218" width="52"  height="92" />
            <rect x="186"  y="198" width="66"  height="112" />
            <rect x="195"  y="186" width="40"  height="14" />
            <rect x="258"  y="208" width="56"  height="102" />
            <rect x="320"  y="190" width="65"  height="120" />
            <rect x="330"  y="178" width="38"  height="14" />
            <rect x="391"  y="200" width="58"  height="110" />
            <rect x="455"  y="178" width="70"  height="132" />
            <rect x="464"  y="166" width="45"  height="14" />
            <rect x="531"  y="160" width="60"  height="150" />
            <rect x="540"  y="148" width="38"  height="14" />
            <rect x="876"  y="160" width="60"  height="150" />
            <rect x="885"  y="148" width="38"  height="14" />
            <rect x="943"  y="178" width="70"  height="132" />
            <rect x="952"  y="166" width="45"  height="14" />
            <rect x="1019" y="200" width="58"  height="110" />
            <rect x="1083" y="190" width="65"  height="120" />
            <rect x="1093" y="178" width="38"  height="14" />
            <rect x="1154" y="208" width="56"  height="102" />
            <rect x="1218" y="198" width="66"  height="112" />
            <rect x="1227" y="186" width="40"  height="14" />
            <rect x="1291" y="218" width="52"  height="92" />
            <rect x="1349" y="210" width="64"  height="100" />
            <rect x="1358" y="198" width="38"  height="14" />
            <rect x="1419" y="228" width="21"  height="82" />
          </g>

          {/* ─── LAYER 3: Near-mid buildings ─── */}
          <g fill={L3}>
            <rect x="0"    y="210" width="52"  height="100" />
            <rect x="5"    y="198" width="30"  height="14" />
            <rect x="56"   y="194" width="62"  height="116" />
            <rect x="65"   y="182" width="36"  height="14" />
            <rect x="82"   y="168" width="2"   height="16" />
            <rect x="124"  y="202" width="54"  height="108" />
            <rect x="184"  y="176" width="62"  height="134" />
            <rect x="192"  y="164" width="38"  height="14" />
            <rect x="209"  y="150" width="2"   height="16" />
            <rect x="252"  y="186" width="58"  height="124" />
            <rect x="316"  y="164" width="70"  height="146" />
            <rect x="325"  y="152" width="44"  height="14" />
            <rect x="393"  y="176" width="58"  height="134" />
            <rect x="457"  y="152" width="65"  height="158" />
            <rect x="465"  y="140" width="42"  height="14" />
            <rect x="484"  y="124" width="2"   height="18" />
            <rect x="530"  y="142" width="56"  height="168" />
            <rect x="538"  y="130" width="36"  height="14" />
            {/* Rogers Centre right context */}
            <rect x="883"  y="142" width="56"  height="168" />
            <rect x="891"  y="130" width="36"  height="14" />
            <rect x="947"  y="152" width="65"  height="158" />
            <rect x="955"  y="140" width="42"  height="14" />
            <rect x="974"  y="124" width="2"   height="18" />
            <rect x="1020" y="176" width="58"  height="134" />
            <rect x="1085" y="164" width="70"  height="146" />
            <rect x="1094" y="152" width="44"  height="14" />
            <rect x="1162" y="186" width="58"  height="124" />
            <rect x="1227" y="176" width="62"  height="134" />
            <rect x="1235" y="164" width="38"  height="14" />
            <rect x="1297" y="202" width="54"  height="108" />
            <rect x="1362" y="194" width="62"  height="116" />
            <rect x="1371" y="182" width="36"  height="14" />
            <rect x="1388" y="168" width="2"   height="16" />
          </g>

          {/* ─── LAYER 4: Prominent foreground towers ─── */}
          <g fill={L4}>
            {/* Scotia Plaza — stepped pyramid crown */}
            <rect x="533"  y="142" width="70"  height="168" />
            <rect x="541"  y="128" width="55"  height="16" />
            <rect x="548"  y="114" width="40"  height="16" />
            <rect x="555"  y="102" width="26"  height="14" />
            <rect x="561"  y="92"  width="14"  height="12" />
            <rect x="566"  y="84"  width="4"   height="10" />

            {/* First Canadian Place — tallest rectangular tower */}
            <rect x="594"  y="108" width="62"  height="202" />
            <rect x="602"  y="94"  width="48"  height="16" />
            <rect x="609"  y="80"  width="34"  height="16" />
            <rect x="616"  y="68"  width="20"  height="14" />
            <rect x="621"  y="58"  width="10"  height="12" />
            {/* FCP vertical glazing mullions */}
            <rect x="596"  y="108" width="2"   height="202" fill={L3} opacity="0.5" />
            <rect x="604"  y="108" width="2"   height="202" fill={L3} opacity="0.5" />
            <rect x="612"  y="108" width="2"   height="202" fill={L3} opacity="0.5" />
            <rect x="620"  y="108" width="2"   height="202" fill={L3} opacity="0.5" />
            <rect x="628"  y="108" width="2"   height="202" fill={L3} opacity="0.5" />
            <rect x="636"  y="108" width="2"   height="202" fill={L3} opacity="0.5" />
            <rect x="644"  y="108" width="2"   height="202" fill={L3} opacity="0.5" />
            <rect x="652"  y="108" width="2"   height="202" fill={L3} opacity="0.5" />

            {/* Bay Adelaide West */}
            <rect x="663"  y="134" width="56"  height="176" />
            <rect x="671"  y="122" width="38"  height="14" />
            <rect x="682"  y="106" width="2"   height="18" />

            {/* Royal Bank Plaza — stepped crown */}
            <rect x="766"  y="124" width="66"  height="186" />
            <rect x="774"  y="110" width="50"  height="16" />
            <rect x="781"  y="96"  width="36"  height="16" />
            <rect x="788"  y="84"  width="22"  height="14" />
            <rect x="793"  y="74"  width="8"   height="12" />
            <rect x="796"  y="64"  width="2"   height="12" />

            {/* Right-side tower */}
            <rect x="848"  y="142" width="62"  height="168" />
            <rect x="856"  y="130" width="40"  height="14" />
            <rect x="866"  y="114" width="2"   height="18" />
          </g>

          {/* ─── ROGERS CENTRE ─── */}
          {/* Dome shell */}
          <path d="M 741,310 Q 740,214 796,207 Q 852,200 862,310 Z" fill={L3} />
          {/* Dome ribs */}
          <path d="M 796,207 Q 778,240 760,310" fill="none" stroke={L2} strokeWidth="1" />
          <path d="M 796,207 Q 796,242 796,310" fill="none" stroke={L2} strokeWidth="1" />
          <path d="M 796,207 Q 814,240 832,310" fill="none" stroke={L2} strokeWidth="1" />
          {/* Base podium */}
          <rect x="734"  y="262" width="135"  height="48"  fill={L3} />
          {/* Retractable roof gap detail */}
          <rect x="770"  y="218" width="52"   height="3"   fill={L2} opacity="0.6" />

          {/* ─── CN TOWER ─── centrepiece */}
          <g fill={CNT}>
            {/* Two triangular buttress legs + central shaft as one polygon */}
            <polygon points="643,310 680,180 680,50 700,50 700,180 737,310" />
            {/* Observation level (SkyPod + main pod) */}
            <rect x="656"  y="128" width="68"  height="26"  rx="6" />
            {/* Upper pod */}
            <rect x="666"  y="80"  width="48"  height="24"  rx="4" />
            {/* Narrow upper shaft above upper pod */}
            <rect x="685"  y="24"  width="10"  height="58" />
            {/* Antenna mast */}
            <rect x="688"  y="10"  width="4"   height="18" />
            <circle cx="690" cy="9" r="2.5" />
            {/* Pod window ring details */}
            <rect x="658"  y="138" width="64"  height="2"   rx="1" fill={L3} opacity="0.6" />
            <rect x="668"  y="88"  width="44"  height="2"   rx="1" fill={L3} opacity="0.6" />
          </g>

          {/* ─── GRADIENT FADES ─── */}
          <rect x="0" y="0" width="1440" height="310" fill="url(#gB)" />
          <rect x="0" y="0" width="1440" height="310" fill="url(#gT)" />
          <rect x="0" y="0" width="1440" height="310" fill="url(#gL)" />
          <rect x="0" y="0" width="1440" height="310" fill="url(#gR)" />
        </svg>
      </div>

      {/* ── SOCIAL + COPYRIGHT ── */}
      <div style={{ background: bg, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "10px 6% 32px" }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/company/thetechfestival/posts/?feedView=all" aria-label="LinkedIn"
            style={{ color: iCol, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
            onMouseEnter={function (e) { e.currentTarget.style.color = iHov; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function (e) { e.currentTarget.style.color = iCol; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>

          {/* X */}
          <a href="https://x.com/thetechfestival" aria-label="X (Twitter)"
            style={{ color: iCol, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
            onMouseEnter={function (e) { e.currentTarget.style.color = iHov; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function (e) { e.currentTarget.style.color = iCol; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/thetechfestival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram"
            style={{ color: iCol, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
            onMouseEnter={function (e) { e.currentTarget.style.color = iHov; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function (e) { e.currentTarget.style.color = iCol; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
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
