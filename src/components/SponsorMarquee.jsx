// components/SponsorMarquee.jsx
// Fetches sponsors from Sanity CMS. Add/remove sponsors in the Sanity Studio
// under the "Sponsor" document type — no code changes needed.

import React, { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../utils/sanity";

// ─── Sanity client ────────────────────────────────────────────────────────────
// Replace these values with your own project settings, or pass them in via
// environment variables (recommended for production).
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "021qtoci",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01", // use today's date or later
  useCdn: true,             // `false` if you need real-time, unpublished data
});

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source);

// ─── GROQ query ───────────────────────────────────────────────────────────────
// Fetches only active sponsors, sorted by the "order" field set in the Studio.
const SPONSORS_QUERY = `
  *[_type == "sponsor" && active == true] | order(order asc) {
    _id,
    name,
    logo,
    url,
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function SponsorsMarquee() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    client
      .fetch(SPONSORS_QUERY)
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

  // Double the list so the CSS marquee loops seamlessly.
  const items = [...sponsors, ...sponsors];

  const fade = "white"; // match your page background color

  if (loading) {
    return (
      <section className="sponsors-marquee" aria-label="Sponsors">
        <p style={{ textAlign: "center", opacity: 0.5 }}>Loading sponsors…</p>
      </section>
    );
  }

  if (error || sponsors.length === 0) {
    // Render nothing (or a fallback) when there are no active sponsors.
    return null;
  }

  return (
    <section className="sponsors-marquee" aria-label="Sponsors">
      <div style={{ position: "relative" }}>
        {/* Fade edges */}
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 100,
            background: `linear-gradient(to right, ${fade}, transparent)`,
            zIndex: 2, pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 100,
            background: `linear-gradient(to left, ${fade}, transparent)`,
            zIndex: 2, pointerEvents: "none",
          }}
        />

        <div className="marquee-track">
          {items.map((sponsor, i) => {
            // Build an optimised image URL (auto format + height cap).
            const logoUrl = urlFor(sponsor.logo).height(60).auto("format").url();

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