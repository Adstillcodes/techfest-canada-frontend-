// components/SponsorMarquee.jsx
// Fetches sponsors from Sanity CMS. Add/remove sponsors in the Sanity Studio
// under the "Sponsor" or "Sponsor Marquee" document types — no code changes needed.

import React, { useEffect, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../utils/sanity";

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source);

// ─── GROQ queries ─────────────────────────────────────────────────────────────
const HOME_QUERY = `
  *[_type == "sponsor" && active == true] | order(order asc) {
    _id,
    name,
    logo,
    url,
  }
`;

const SPONSORS_PAGE_QUERY = `
  *[_type == "sponsorMarquee" && active == true] | order(order asc) {
    _id,
    name,
    logo,
    url,
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function SponsorsMarquee({ dark, type = "home", title }) {
  const query = type === "sponsorsPage" ? SPONSORS_PAGE_QUERY : HOME_QUERY;
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client
      .fetch(query)
      .then((data) => {
        setSponsors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch sponsors:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const bg = dark ? "rgba(255,255,255,0.02)" : "rgba(122,63,209,0.02)";
  const border = dark ? "rgba(155,135,245,0.10)" : "rgba(122,63,209,0.08)";
  const fade = dark ? "#06020f" : "#ffffff";

  // Double the list so the CSS marquee loops seamlessly.
  const items = [...sponsors, ...sponsors];

  if (loading) {
    return (
      <section
        style={{
          background: bg,
          borderTop: "1px solid " + border,
          borderBottom: "1px solid " + border,
          padding: "32px 0 28px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            opacity: 0.5,
            fontFamily: "'Orbitron',sans-serif",
            fontSize: "0.6rem",
          }}
        >
          Loading sponsors…
        </p>
      </section>
    );
  }

  if (error || sponsors.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        background: bg,
        borderTop: "1px solid " + border,
        borderBottom: "1px solid " + border,
        padding: "32px 0 28px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 32s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }
        .marquee-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 44px;
          border-right: 1px solid ${border};
          height: 60px;
          flex-shrink: 0;
        }
        .marquee-item img {
          height: 40px;
          width: auto;
          max-width: 180px;
          object-fit: contain;
          opacity: ${dark ? "0.90" : "0.70"};
          filter: ${dark ? "brightness(0) invert(1)" : "none"};
          transition: opacity 0.2s ease;
        }
        .marquee-item:hover img { opacity: 1; }
        .marquee-item img[data-name="Temasek"]    { height: 17px; }
        .marquee-item img[data-name="Amazon"]     { height: 26px; }
        .marquee-item img[data-name="DHL"]        { height: 58px; }
        .marquee-item img[data-name="Constellar"] { height: 50px; }
        .marquee-item img[data-name="Ford"]       { height: 50px; }
        .marquee-item img[data-name="KPMG"]       { height: 46px; }
        .marquee-item img[data-name="Accenture"]  { height: 26px; }
        .marquee-item img[data-name="Cvent"]      { height: 26px; }
        .marquee-item img[data-name="VMware"]     { height: 54px; }
      `}</style>

      <div
        style={{
          textAlign: "center",
          marginBottom: 18,
          fontFamily: "'Orbitron',sans-serif",
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: dark ? "rgba(200,185,255,0.40)" : "rgba(13,5,32,0.35)",
        }}
      >
        {title || "Our team includes alumni from"}
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 100,
            background: `linear-gradient(to right, ${fade}, transparent)`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 100,
            background: `linear-gradient(to left, ${fade}, transparent)`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div className="marquee-track">
          {items.map((sponsor, i) => {
            const logoUrl = urlFor(sponsor.logo)
              .height(60)
              .auto("format")
              .url();

            const img = (
              <img
                src={logoUrl}
                alt={sponsor.name}
                title={sponsor.name}
                data-name={sponsor.name}
                loading="lazy"
              />
            );

            return (
              <div key={`${sponsor._id}-${i}`} className="marquee-item">
                {sponsor.url ? (
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={sponsor.name}
                  >
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
