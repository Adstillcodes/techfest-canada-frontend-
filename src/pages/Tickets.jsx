import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import { API } from "../utils/api";

// ── Check icon ───────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      style={{ color: "#f5a623", flexShrink: 0, marginTop: 2 }}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ── Pass definitions ─────────────────────────────────────────────────────────
const PASS_META = {
  discover: {
    label: "Discover Pass",
    tagline: "Your gateway to The Tech Festival Canada.",
    description:
      "Ideal for professionals, founders, innovators, students, and business leaders who want access to the core conference experience and the opportunity to engage with the ideas, people, and conversations shaping the future of technology.",
    features: ["Conference access", "Lunch"],
    tier: "discover",
    defaultPrice: 299,
    featured: false,
  },
  connect: {
    label: "Connect Pass",
    tagline: "More than just access to the conference.",
    description:
      "Designed for attendees who want to start the day in a more curated business environment. With entry to the exclusive CxO Breakfast, you can connect with senior leaders and build meaningful relationships before the main conference begins.",
    features: ["Conference access", "CxO Breakfast", "Lunch"],
    tier: "connect",
    defaultPrice: 499,
    featured: false,
  },
  influence: {
    label: "Influence Pass",
    tagline: "A fuller event experience beyond the conference floor.",
    description:
      "Built for decision makers, growth leaders, investors, and professionals who want premium daytime access plus entry to the Gala Dinner and Networking Reception — creating space for higher‑value conversations and stronger business connections.",
    features: [
      "Conference access",
      "CxO Breakfast",
      "Lunch",
      "Gala Dinner & Networking Reception",
    ],
    tier: "influence",
    defaultPrice: 799,
    featured: true,
  },
  power: {
    label: "Power Pass",
    tagline: "The ultimate all‑access experience.",
    description:
      "Built for senior executives, VIP guests, investors, speakers, and leaders who want to experience The Tech Festival Canada at the highest level. With access to every major element of the event, this pass offers the most complete and elevated way to engage with the festival.",
    features: [
      "Conference access",
      "CxO Breakfast",
      "Lunch",
      "Gala Dinner & Networking Reception",
      "Awards Night",
      "VIP Lounge access",
    ],
    tier: "power",
    defaultPrice: 999,
    featured: false,
  },
};

// ── Single glassy pass card ──────────────────────────────────────────────────
function PassCard({ meta, inventoryItem, onPurchase }) {
  const [hovered, setHovered] = useState(false);

  const price     = inventoryItem?.price ?? meta.defaultPrice;
  const remaining = inventoryItem ? Math.max(inventoryItem.total - inventoryItem.sold, 0) : null;
  const soldOut   = remaining !== null && remaining <= 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        flex: "1 1 220px",
        maxWidth: 280,
        minWidth: 220,
        borderRadius: 20,
        padding: "32px 26px 28px",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        background: meta.featured
          ? "linear-gradient(135deg, rgba(122,63,209,0.28) 0%, rgba(245,166,35,0.12) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
        border: meta.featured
          ? "1px solid rgba(122,63,209,0.55)"
          : "1px solid rgba(255,255,255,0.10)",
        boxShadow: meta.featured
          ? "0 8px 48px rgba(122,63,209,0.25), 0 2px 8px rgba(0,0,0,0.4)"
          : "0 4px 32px rgba(0,0,0,0.35)",
        transform: meta.featured ? "scale(1.04)" : hovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        zIndex: meta.featured ? 2 : 1,
      }}
    >
      {/* Most popular badge */}
      {meta.featured && (
        <div style={{
          position: "absolute",
          top: -14,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(90deg, #7a3fd1, #f5a623)",
          color: "white",
          fontSize: "0.62rem",
          fontWeight: 800,
          letterSpacing: "1.4px",
          textTransform: "uppercase",
          padding: "5px 16px",
          borderRadius: 999,
          whiteSpace: "nowrap",
          fontFamily: "'Orbitron', sans-serif",
        }}>
          Most Popular
        </div>
      )}

      {/* Pass name */}
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontWeight: 800,
        fontSize: "0.72rem",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        color: meta.featured ? "#f5a623" : "rgba(160,100,255,0.85)",
        marginBottom: 8,
      }}>
        {meta.label}
      </div>

      {/* Price */}
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontWeight: 900,
        fontSize: "2.6rem",
        color: "white",
        lineHeight: 1,
        marginBottom: 4,
        letterSpacing: "-1px",
        display: "flex",
        alignItems: "baseline",
        gap: 4,
      }}>
        <span>${price.toLocaleString()}</span>
        <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>CAD</span>
      </div>

      {/* Remaining badge */}
      {remaining !== null && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          marginBottom: 16,
          marginTop: 6,
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          color: soldOut ? "#ff6b6b" : remaining <= 20 ? "#f5a623" : "#4ade80",
          background: soldOut ? "rgba(255,107,107,0.1)" : remaining <= 20 ? "rgba(245,166,35,0.1)" : "rgba(74,222,128,0.1)",
          border: `1px solid ${soldOut ? "rgba(255,107,107,0.25)" : remaining <= 20 ? "rgba(245,166,35,0.25)" : "rgba(74,222,128,0.25)"}`,
          borderRadius: 999,
          padding: "3px 10px",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
          {soldOut ? "Sold Out" : `${remaining} spots left`}
        </div>
      )}

      {/* Divider */}
      <div style={{
        width: "100%",
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 50%, transparent)",
        margin: remaining !== null ? "4px 0 16px" : "14px 0 16px",
      }} />

      {/* Tagline */}
      <p style={{
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "rgba(255,255,255,0.85)",
        marginBottom: 8,
        lineHeight: 1.5,
        textAlign: "justify",
      }}>
        {meta.tagline}
      </p>

      {/* Description */}
      <p style={{
        fontSize: "0.76rem",
        color: "rgba(255,255,255,0.5)",
        lineHeight: 1.65,
        marginBottom: 18,
        textAlign: "justify",
        hyphens: "auto",
      }}>
        {meta.description}
      </p>

      {/* Includes label */}
      <div style={{
        fontSize: "0.66rem",
        fontWeight: 700,
        letterSpacing: "1.2px",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)",
        marginBottom: 10,
      }}>
        Includes
      </div>

      {/* Feature list */}
      <ul style={{
        listStyle: "none",
        padding: 0,
        margin: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        {meta.features.map((f) => (
          <li key={f} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.4,
          }}>
            <CheckIcon />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        disabled={soldOut}
        onClick={() => !soldOut && onPurchase(meta.tier)}
        style={{
          marginTop: 24,
          width: "100%",
          padding: "13px 0",
          borderRadius: 12,
          border: "none",
          cursor: soldOut ? "not-allowed" : "pointer",
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 800,
          fontSize: "0.68rem",
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: soldOut ? "rgba(255,255,255,0.3)" : "white",
          background: soldOut
            ? "rgba(255,255,255,0.05)"
            : meta.featured
            ? "linear-gradient(135deg, #7a3fd1, #f5a623)"
            : "rgba(122,63,209,0.35)",
          boxShadow: soldOut || !meta.featured ? "none" : "0 4px 20px rgba(122,63,209,0.4)",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!soldOut && !meta.featured) e.currentTarget.style.background = "rgba(122,63,209,0.55)";
        }}
        onMouseLeave={(e) => {
          if (!soldOut && !meta.featured) e.currentTarget.style.background = "rgba(122,63,209,0.35)";
        }}
      >
        {soldOut ? "Sold Out" : "Get Your Pass"}
      </button>
    </div>
  );
}

// ── Main Tickets page ─────────────────────────────────────────────────────────
export default function Tickets() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`${API}/admin/inventory/public`);
        const data = await res.json();
        setInventory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Inventory fetch failed", err);
      }
    };
    load();
  }, []);

  const getTier = (tier) => inventory.find((i) => i.tier === tier) || null;

  const handlePurchase = async (tier) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Please sign in first"); return; }
      const res = await fetch(`${API}/payments/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      console.error("Purchase error:", err);
      alert(err.message || "Purchase failed");
    }
  };

  const passes      = ["discover", "connect", "influence", "power"];
  const passLabels  = { discover: "Discover", connect: "Connect", influence: "Influence", power: "Power" };
  const allFeatures = [
    "Conference access",
    "Lunch",
    "CxO Breakfast",
    "Gala Dinner & Networking Reception",
    "Awards Night",
    "VIP Lounge access",
  ];
  const passFeatureMap = {
    discover:  [true,  true,  false, false, false, false],
    connect:   [true,  true,  true,  false, false, false],
    influence: [true,  true,  true,  true,  false, false],
    power:     [true,  true,  true,  true,  true,  true ],
  };

  return (
    <>
      <Navbar />

      {/* Clean dark background — no WebGL */}
      <div style={{
        minHeight: "100vh",
        background: "var(--bg-main, #0d0b1a)",
        color: "white",
        position: "relative",
      }}>

        {/* Subtle static radial glow — no animation */}
        <div style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(122,63,209,0.10) 0%, transparent 70%), " +
            "radial-gradient(ellipse 50% 40% at 80% 70%, rgba(245,166,35,0.06) 0%, transparent 70%)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>

          {/* ── Header ── */}
          <div style={{
            textAlign: "center",
            padding: "100px 24px 60px",
            maxWidth: 780,
            margin: "0 auto",
          }}>
            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              letterSpacing: "-1px",
              lineHeight: 1.15,
              marginBottom: 20,
              background: "linear-gradient(135deg, #ffffff 30%, rgba(160,100,255,0.9) 70%, #f5a623)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Choose Your Pass
            </h1>

            <p style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.75,
              textAlign: "justify",
              hyphens: "auto",
            }}>
              Whether you are coming to learn, connect, explore partnerships, or experience the event at the highest
              level, The Tech Festival Canada offers a pass designed for every kind of delegate. From core conference
              access to premium networking and VIP experiences, each tier unlocks a different level of opportunity.
            </p>
          </div>

          {/* ── Cards ── */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "0 24px 80px",
            maxWidth: 1260,
            margin: "0 auto",
          }}>
            {passes.map((key) => (
              <PassCard
                key={key}
                meta={PASS_META[key]}
                inventoryItem={getTier(key)}
                onPurchase={handlePurchase}
              />
            ))}
          </div>

          {/* ── Comparison table ── */}
          <div style={{ maxWidth: 900, margin: "0 auto 80px", padding: "0 24px" }}>
            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
              marginBottom: 28,
            }}>
              Pass Comparison
            </h2>

            <div style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              overflow: "hidden",
            }}>
              {/* Header row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr repeat(4, 100px)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                padding: "14px 24px",
              }}>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                  Feature
                </div>
                {passes.map((p) => (
                  <div key={p} style={{
                    textAlign: "center",
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 800,
                    fontSize: "0.62rem",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    color: p === "influence" ? "#f5a623" : "rgba(255,255,255,0.6)",
                  }}>
                    {passLabels[p]}
                  </div>
                ))}
              </div>

              {/* Feature rows */}
              {allFeatures.map((feature, fi) => (
                <div key={feature} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr repeat(4, 100px)",
                  padding: "13px 24px",
                  borderBottom: fi < allFeatures.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: fi % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                }}>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}>{feature}</div>
                  {passes.map((p) => (
                    <div key={p} style={{ textAlign: "center" }}>
                      {passFeatureMap[p][fi] ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "1rem" }}>—</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Why Upgrade ── */}
          <div style={{ maxWidth: 760, margin: "0 auto 120px", padding: "0 24px", textAlign: "center" }}>
            <div style={{
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              background: "linear-gradient(135deg, rgba(122,63,209,0.12) 0%, rgba(245,166,35,0.06) 100%)",
              border: "1px solid rgba(122,63,209,0.25)",
              borderRadius: 24,
              padding: "48px 40px",
            }}>
              <div style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 800,
                fontSize: "0.65rem",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#f5a623",
                marginBottom: 14,
              }}>
                Why Upgrade Your Pass
              </div>
              <h2 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
                letterSpacing: "-0.5px",
                color: "white",
                marginBottom: 20,
                lineHeight: 1.2,
              }}>
                Every Level Unlocks<br />
                <span style={{ color: "#f5a623" }}>More Opportunity</span>
              </h2>
              <p style={{
                fontSize: "0.88rem",
                color: "rgba(255,255,255,0.58)",
                lineHeight: 1.8,
                textAlign: "justify",
                hyphens: "auto",
              }}>
                Each pass level is designed to unlock a deeper layer of value. As you move up, the experience becomes
                more curated, more exclusive, and more relationship driven. Whether your goal is insight, visibility,
                networking, deal making, or premium access, there is a pass that matches your ambition.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
