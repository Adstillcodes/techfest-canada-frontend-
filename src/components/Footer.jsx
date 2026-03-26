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

  var bg        = dark ? "#06020f" : "#ffffff";
  var iconColor = dark ? "rgba(200,185,255,0.55)" : "rgba(90,40,180,0.50)";
  var iconHover = dark ? "#ffffff" : "#0d0520";
  var textColor = dark ? "rgba(200,185,255,0.40)" : "rgba(90,40,180,0.45)";
  var linkColor = dark ? "rgba(185,158,255,0.75)" : "#7a3fd1";
  var borderTop = dark ? "1px solid rgba(155,135,245,0.10)" : "1px solid rgba(122,63,209,0.10)";

  return (
    <footer style={{
      background: bg,
      borderTop: borderTop,
      padding: "40px 6% 36px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
    }}>
      {/* Social icons */}
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {/* LinkedIn */}
        <a href="https://www.linkedin.com/company/thetechfestival/posts/?feedView=all" aria-label="LinkedIn"
          style={{ color: iconColor, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
          onMouseEnter={function (e) { e.currentTarget.style.color = iconHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={function (e) { e.currentTarget.style.color = iconColor; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>

        {/* X / Twitter */}
        <a href="#" aria-label="X (Twitter)"
          style={{ color: iconColor, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
          onMouseEnter={function (e) { e.currentTarget.style.color = iconHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={function (e) { e.currentTarget.style.color = iconColor; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
          </svg>
        </a>

        {/* Instagram */}
        <a href="https://www.instagram.com/thetechfestival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram"
          style={{ color: iconColor, transition: "color 0.2s ease, transform 0.2s ease", display: "flex" }}
          onMouseEnter={function (e) { e.currentTarget.style.color = iconHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={function (e) { e.currentTarget.style.color = iconColor; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>
      </div>

      {/* Copyright */}
      <p style={{ fontSize: "0.82rem", color: textColor, margin: 0, letterSpacing: "0.2px" }}>
        © 2026 The Tech Festival Canada. |{" "}
        <Link to="/privacy" style={{ color: linkColor, textDecoration: "none", transition: "opacity 0.2s ease" }}
          onMouseEnter={function (e) { e.currentTarget.style.opacity = "0.7"; }}
          onMouseLeave={function (e) { e.currentTarget.style.opacity = "1"; }}
        >Privacy Policy</Link>
      </p>
    </footer>
  );
}
