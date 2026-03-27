import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Footer() {
  var s1 = useState(false); var dark = s1[0]; var setDark = s1[1];

  useEffect(function () {
    setDark(document.body.classList.contains("dark-mode"));
    var obs = new MutationObserver(function () {
      setDark(document.body.classList.contains("dark-mode"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return function () { obs.disconnect(); };
  }, []);

  var bg         = dark ? "#06020f" : "#ffffff";
  var iconColor  = dark ? "rgba(200,185,255,0.55)" : "rgba(90,40,180,0.50)";
  var iconHover  = dark ? "#ffffff" : "#0d0520";
  var textColor  = dark ? "rgba(200,185,255,0.40)" : "rgba(90,40,180,0.45)";
  var linkColor  = dark ? "rgba(185,158,255,0.75)" : "#7a3fd1";
  var borderTop  = dark ? "1px solid rgba(155,135,245,0.10)" : "1px solid rgba(122,63,209,0.10)";

  var bldFar   = dark ? "rgba(255,255,255,0.06)"  : "rgba(0,0,0,0.07)";
  var bldMid   = dark ? "rgba(255,255,255,0.11)"  : "rgba(0,0,0,0.13)";
  var bldNear  = dark ? "rgba(255,255,255,0.18)"  : "rgba(0,0,0,0.20)";
  var bldFront = dark ? "rgba(255,255,255,0.26)"  : "rgba(0,0,0,0.28)";
  var winDim   = dark ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.08)";
  var winBright= dark ? "rgba(255,240,180,0.28)"  : "rgba(0,0,0,0.12)";
  var strk     = dark ? "rgba(255,255,255,0.06)"  : "rgba(0,0,0,0.06)";
  var fadeClr  = bg;

  return (
    <footer style={{
      background: bg,
      borderTop: borderTop,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflow: "hidden",
    }}>

      {/* Toronto Skyline */}
      <div style={{ width: "100%", lineHeight: 0, position: "relative" }}>
        <svg
          viewBox="0 0 1440 260"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice"
          style={{ width: "100%", display: "block" }}
        >
          <defs>
            <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fadeClr} stopOpacity="0" />
              <stop offset="50%" stopColor={fadeClr} stopOpacity="0" />
              <stop offset="100%" stopColor={fadeClr} stopOpacity="1" />
            </linearGradient>
            <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fadeClr} stopOpacity="1" />
              <stop offset="25%" stopColor={fadeClr} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* LAYER 1: distant low silhouette */}
          {[
            [0,215,80,45],[85,210,60,50],[150,218,70,42],[225,212,55,48],[285,216,65,44],
            [355,205,75,55],[435,214,55,46],[495,208,70,52],[570,218,60,42],[635,211,65,49],
            [705,215,55,45],[765,204,80,56],[850,213,60,47],[915,208,70,52],[990,218,55,42],
            [1050,211,65,49],[1120,215,70,45],[1195,204,60,56],[1260,213,75,47],[1340,208,55,52],
            [1400,218,40,42],
          ].map(function(b,i){ return <rect key={"f"+i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} fill={bldFar} />; })}

          {/* LAYER 2: mid background */}
          <rect x="0"   y="188" width="55"  height="72" fill={bldMid} />
          <rect x="60"  y="172" width="65"  height="88" fill={bldMid} />
          <rect x="70"  y="162" width="35"  height="12" fill={bldMid} />
          <rect x="130" y="182" width="50"  height="78" fill={bldMid} />
          <rect x="185" y="165" width="70"  height="95" fill={bldMid} />
          <rect x="260" y="175" width="55"  height="85" fill={bldMid} />
          <rect x="320" y="162" width="65"  height="98" fill={bldMid} />
          <rect x="390" y="172" width="58"  height="88" fill={bldMid} />
          <rect x="452" y="158" width="70"  height="102" fill={bldMid} />
          <rect x="878"  y="172" width="62"  height="88" fill={bldMid} />
          <rect x="944"  y="160" width="72"  height="100" fill={bldMid} />
          <rect x="1020" y="175" width="58"  height="85" fill={bldMid} />
          <rect x="1082" y="165" width="65"  height="95" fill={bldMid} />
          <rect x="1150" y="178" width="52"  height="82" fill={bldMid} />
          <rect x="1205" y="168" width="68"  height="92" fill={bldMid} />
          <rect x="1278" y="180" width="55"  height="80" fill={bldMid} />
          <rect x="1338" y="170" width="65"  height="90" fill={bldMid} />
          <rect x="1408" y="184" width="32"  height="76" fill={bldMid} />

          {/* LAYER 3: foreground buildings */}

          {/* Far left waterfront */}
          <rect x="0"   y="202" width="52"  height="58" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <rect x="5"   y="194" width="28"  height="10" fill={bldNear} />
          <rect x="56"  y="188" width="60"  height="72" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <rect x="76"  y="170" width="2"   height="20" fill={bldNear} />

          {/* Left medium towers */}
          <rect x="122" y="162" width="58"  height="98" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <rect x="128" y="152" width="32"  height="12" fill={bldNear} />
          <rect x="186" y="150" width="65"  height="110" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <rect x="192" y="140" width="36"  height="12" fill={bldNear} />
          <rect x="209" y="128" width="2"   height="14" fill={bldNear} />
          <rect x="257" y="160" width="55"  height="100" fill={bldNear} stroke={strk} strokeWidth="0.5" />

          {/* Left-center tall towers */}
          <rect x="318" y="130" width="62"  height="130" fill={bldFront} stroke={strk} strokeWidth="0.5" />
          <rect x="326" y="120" width="38"  height="12" fill={bldFront} />
          <rect x="343" y="106" width="4"   height="16" fill={bldFront} />
          {[130,150,170,190,210,230].map(function(y,i){
            return <rect key={"ls"+i} x="318" y={y} width="62" height="1" fill={strk} opacity="0.5" />;
          })}

          <rect x="386" y="144" width="55"  height="116" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <rect x="393" y="134" width="32"  height="12" fill={bldNear} />

          {/* Scotia Plaza stepped crown */}
          <rect x="447" y="112" width="68"  height="148" fill={bldFront} stroke={strk} strokeWidth="0.5" />
          <rect x="455" y="100" width="48"  height="14" fill={bldFront} />
          <rect x="465" y="88"  width="28"  height="14" fill={bldFront} />
          <rect x="472" y="76"  width="14"  height="15" fill={bldFront} />
          {[0,1,2,3,4,5].map(function(col){
            return [0,1,2,3,4,5,6,7,8].map(function(row){
              return <rect key={"sc"+col+row} x={452+col*9} y={118+row*14} width="5" height="8" rx="1" fill={winDim} />;
            });
          })}

          <rect x="521" y="138" width="52"  height="122" fill={bldNear} stroke={strk} strokeWidth="0.5" />

          {/* First Canadian Place — tallest tower */}
          <rect x="579" y="74"  width="58"  height="186" fill={bldFront} stroke={strk} strokeWidth="0.7" />
          <rect x="584" y="62"  width="48"  height="14" fill={bldFront} />
          <rect x="591" y="50"  width="34"  height="14" fill={bldFront} />
          <rect x="597" y="40"  width="22"  height="12" fill={bldFront} />
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(function(i){
            return <rect key={"fcp"+i} x={580+i*5} y="74" width="2" height="186" fill={strk} opacity="0.35" />;
          })}
          {[[585,92],[595,92],[605,92],[615,92],[625,92],
            [585,122],[605,122],[625,122],
            [590,152],[610,152],[625,152],
            [585,182],[600,182],[620,182]].map(function(w,i){
            return <rect key={"fw"+i} x={w[0]} y={w[1]} width="4" height="6" rx="0.5" fill={winBright} />;
          })}

          {/* CN TOWER — centred ~x=700 */}
          <polygon points="678,260 692,150 700,260" fill={bldFront} />
          <polygon points="700,260 708,150 722,260" fill={bldFront} />
          <rect x="695" y="54" width="10" height="100" fill={bldFront} />
          <polygon points="692,150 695,132 705,132 708,150" fill={bldFront} />
          {/* Main observation ring */}
          <rect x="672" y="130" width="56" height="20" rx="3" fill={bldFront} />
          <ellipse cx="700" cy="130" rx="32" ry="12" fill={bldFront} />
          {/* Sky pod upper */}
          <rect x="686" y="112" width="28" height="16" rx="2" fill={bldFront} />
          <ellipse cx="700" cy="111" rx="18" ry="6" fill={bldFront} />
          {/* Pod windows/lights */}
          <circle cx="692" cy="121" r="1.5" fill={winBright} />
          <circle cx="700" cy="121" r="1.5" fill={winBright} />
          <circle cx="708" cy="121" r="1.5" fill={winBright} />
          <circle cx="692" cy="140" r="1.5" fill={winBright} />
          <circle cx="708" cy="140" r="1.5" fill={winBright} />
          {/* Antenna */}
          <rect x="699" y="20" width="2" height="36" fill={bldFront} />
          <circle cx="700" cy="18" r="2" fill={bldFront} />

          {/* Right of CN Tower */}
          <rect x="734" y="150" width="50"  height="110" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <rect x="740" y="140" width="30"  height="12" fill={bldNear} />

          {/* Royal Bank Plaza */}
          <rect x="790" y="118" width="62"  height="142" fill={bldFront} stroke={strk} strokeWidth="0.6" />
          <rect x="797" y="106" width="44"  height="14" fill={bldFront} />
          {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(function(i){
            return <rect key={"rb"+i} x="790" y={118+i*11} width="62" height="1" fill={strk} opacity="0.5" />;
          })}
          {[0,1,2,3,4,5].map(function(col){
            return [0,1,2,3,4,5,6].map(function(row){
              return <rect key={"rbw"+col+row} x={794+col*9} y={123+row*15} width="5" height="9" rx="1" fill={winDim} />;
            });
          })}

          <rect x="858"  y="138" width="55"  height="122" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <rect x="865"  y="126" width="36"  height="14" fill={bldNear} />
          <rect x="882"  y="114" width="2"   height="14" fill={bldNear} />

          {/* Right stepped tower */}
          <rect x="919"  y="98"  width="65"  height="162" fill={bldFront} stroke={strk} strokeWidth="0.6" />
          <rect x="926"  y="86"  width="48"  height="14" fill={bldFront} />
          <rect x="935"  y="72"  width="28"  height="16" fill={bldFront} />
          <rect x="942"  y="60"  width="14"  height="14" fill={bldFront} />
          <rect x="948"  y="50"  width="4"   height="12" fill={bldFront} />
          {[0,1,2,3,4,5,6].map(function(col){
            return [0,1,2,3,4,5,6,7,8,9].map(function(row){
              return <rect key={"cr"+col+row} x={923+col*8} y={103+row*14} width="4" height="8" rx="0.5" fill={winDim} />;
            });
          })}

          <rect x="990"  y="130" width="52"  height="130" fill={bldNear} stroke={strk} strokeWidth="0.5" />

          {/* Rogers Centre dome */}
          <path d="M1048,260 Q1048,194 1100,187 Q1152,180 1160,260 Z" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <path d="M1100,187 Q1085,218 1068,260" fill="none" stroke={strk} strokeWidth="0.6" />
          <path d="M1100,187 Q1100,220 1100,260" fill="none" stroke={strk} strokeWidth="0.6" />
          <path d="M1100,187 Q1115,218 1132,260" fill="none" stroke={strk} strokeWidth="0.6" />
          <rect x="1043" y="222" width="122" height="38" fill={bldNear} stroke={strk} strokeWidth="0.5" />

          {/* Far right towers */}
          <rect x="1168" y="134" width="55"  height="126" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <rect x="1175" y="122" width="36"  height="14" fill={bldNear} />

          <rect x="1228" y="110" width="62"  height="150" fill={bldFront} stroke={strk} strokeWidth="0.6" />
          <rect x="1235" y="98"  width="44"  height="14" fill={bldFront} />
          <rect x="1243" y="86"  width="26"  height="14" fill={bldFront} />
          <rect x="1255" y="74"  width="4"   height="14" fill={bldFront} />
          {[0,1,2,3,4,5].map(function(col){
            return [0,1,2,3,4,5,6,7].map(function(row){
              return <rect key={"rr"+col+row} x={1232+col*9} y={116+row*15} width="5" height="9" rx="1" fill={winDim} />;
            });
          })}

          <rect x="1296" y="148" width="52"  height="112" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <rect x="1303" y="136" width="32"  height="14" fill={bldNear} />
          <rect x="1354" y="160" width="58"  height="100" fill={bldNear} stroke={strk} strokeWidth="0.5" />
          <rect x="1361" y="150" width="30"  height="12" fill={bldNear} />
          <rect x="1418" y="174" width="22"  height="86" fill={bldNear} />

          {/* Waterline */}
          <rect x="0" y="257" width="1440" height="3" fill={bldFar} />

          {/* Gradient overlays */}
          <rect x="0" y="0" width="1440" height="260" fill="url(#skyFade)" />
          <rect x="0" y="0" width="1440" height="260" fill="url(#topFade)" />
        </svg>
      </div>

      {/* Social + Copyright */}
      <div style={{
        background: bg,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "16px 6% 32px",
      }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/company/thetechfestival/posts/?feedView=all" aria-label="LinkedIn"
            style={{ color: iconColor, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
            onMouseEnter={function(e){ e.currentTarget.style.color = iconHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function(e){ e.currentTarget.style.color = iconColor; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* X / Twitter */}
          <a href="https://x.com/thetechfestival" aria-label="X (Twitter)"
            style={{ color: iconColor, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
            onMouseEnter={function(e){ e.currentTarget.style.color = iconHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function(e){ e.currentTarget.style.color = iconColor; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/thetechfestival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram"
            style={{ color: iconColor, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
            onMouseEnter={function(e){ e.currentTarget.style.color = iconHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={function(e){ e.currentTarget.style.color = iconColor; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
        </div>

        <p style={{ fontSize: "0.82rem", color: textColor, margin: 0, letterSpacing: "0.2px" }}>
          © 2026 The Tech Festival Canada. |{" "}
          <Link to="/privacy" style={{ color: linkColor, textDecoration: "none", transition: "opacity 0.2s ease" }}
            onMouseEnter={function(e){ e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={function(e){ e.currentTarget.style.opacity = "1"; }}
          >Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
}
