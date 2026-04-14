import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API } from "../utils/api";

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

function PriceWithAsterisk({ price, color, fontSize, fontWeight, style }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "baseline", gap: 2, ...(style || {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: fontSize || "2.6rem", fontWeight: fontWeight || 900, color: color || "inherit", lineHeight: 1, letterSpacing: "-1px" }}>${typeof price === "number" ? price.toLocaleString() : price}</span>
      <span style={{ color: "#f5a623", fontSize: "0.6em", fontWeight: 900, cursor: "help", lineHeight: 1 }}>*</span>
      {hovered && (
        <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.88)", color: "#fff", fontSize: "0.68rem", fontFamily: "'Orbitron',sans-serif", fontWeight: 700, letterSpacing: "0.5px", padding: "8px 14px", borderRadius: 10, whiteSpace: "nowrap", zIndex: 999, pointerEvents: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
          Price subject to change
        </span>
      )}
    </span>
  );
}

const PASS_META = {
  connect: {
    label: "Connect Pass",
    tagline: "More than just access to the conference.",
    description: "Designed for attendees who want to start the day in a more curated business environment. With entry to the exclusive CxO Breakfast, you can connect with senior leaders and build meaningful relationships before the main conference begins.",
    features: [
      "2x Day Conference Access",
      "2x CxO Breakfasts",
      "2x Luncheons",
      "Expo Floor Access",
      "Networking Breaks",
    ],
    tier: "connect",
    defaultPrice: 599,
    featured: false,
  },
  influence: {
    label: "Influence Pass",
    tagline: "A fuller event experience beyond the conference floor.",
    description: "Built for decision makers, growth leaders, investors, and professionals who want premium daytime access plus entry to the Gala Dinner and Networking Reception — creating space for higher-value conversations and stronger business connections.",
    features: [
      "2x Day Conference Access",
      "2x CxO Breakfasts",
      "2x Luncheons",
      "1x Gala Dinner & Networking Reception",
      "Expo Floor Access",
      "Networking Breaks",
    ],
    tier: "influence",
    defaultPrice: 799,
    featured: true,
  },
  power: {
    label: "Power Pass",
    tagline: "The ultimate all-access experience.",
    description: "Built for senior executives, VIP guests, investors, speakers, and leaders who want to experience The Tech Festival Canada at the highest level. With access to every major element of the event, this pass offers the most complete and elevated way to engage with the festival.",
    features: [
      "2x Day Conference Access",
      "2x CxO Breakfasts",
      "2x Luncheons",
      "1x Gala Dinner & Networking Reception",
      "1x Awards Night",
      "VIP Lounge Access (Both Days)",
      "Expo Floor Access",
      "Networking Breaks",
    ],
    tier: "power",
    defaultPrice: 999,
    featured: false,
  },
};

function PassCard({ meta, inventoryItem, onPurchase, dark }) {
  const [hovered, setHovered] = useState(false);
  const price   = inventoryItem?.price ?? meta.defaultPrice;
  const remaining = inventoryItem ? Math.max(inventoryItem.total - inventoryItem.sold, 0) : null;
  const soldOut = remaining !== null && remaining <= 0;

  const textMain  = dark ? "#ffffff"                : "#0d0520";
  const textMuted = dark ? "rgba(255,255,255,0.65)" : "rgba(13,5,32,0.68)";
  const textLight = dark ? "rgba(255,255,255,0.40)" : "rgba(13,5,32,0.45)";
  const cardBg    = dark
    ? "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)"
    : "#ffffff";
  const cardBorder = dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(122,63,209,0.14)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", flex: "1 1 260px", maxWidth: 340, minWidth: 240,
        borderRadius: 20, padding: "32px 26px 28px", display: "flex", flexDirection: "column",
        backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
        background: meta.featured
          ? (dark ? "linear-gradient(135deg, rgba(122,63,209,0.28) 0%, rgba(245,166,35,0.12) 100%)" : "linear-gradient(135deg, rgba(122,63,209,0.12) 0%, rgba(245,166,35,0.08) 100%)")
          : cardBg,
        border: meta.featured
          ? (dark ? "1px solid rgba(122,63,209,0.55)" : "1px solid rgba(122,63,209,0.40)")
          : cardBorder,
        boxShadow: meta.featured
          ? (dark ? "0 8px 48px rgba(122,63,209,0.25)" : "0 8px 32px rgba(122,63,209,0.18)")
          : (dark ? "0 4px 32px rgba(0,0,0,0.35)" : "0 4px 24px rgba(122,63,209,0.08)"),
        transform: meta.featured ? "scale(1.04)" : hovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        zIndex: meta.featured ? 2 : 1,
      }}
    >
      {meta.featured && (
        <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg, #7a3fd1, #f5a623)", color: "white", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", padding: "5px 16px", borderRadius: 999, whiteSpace: "nowrap", fontFamily: "'Orbitron', sans-serif" }}>
          Most Popular
        </div>
      )}

      <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "1.5px", textTransform: "uppercase", color: meta.featured ? (dark ? "#f5a623" : "#d98a14") : (dark ? "rgba(160,100,255,0.85)" : "#7a3fd1"), marginBottom: 8 }}>
        {meta.label}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
        <PriceWithAsterisk price={price} color={textMain} fontSize="2.6rem" fontWeight={900} />
        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: textLight, letterSpacing: "1px", textTransform: "uppercase" }}>CAD</span>
      </div>

      <p style={{ fontSize: "0.62rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.35)" : "rgba(13,5,32,0.38)", letterSpacing: "0.3px", marginBottom: 4 }}>13% HST included</p>

      <div style={{ width: "100%", height: 1, background: dark ? "linear-gradient(90deg,transparent,rgba(255,255,255,0.12) 50%,transparent)" : "linear-gradient(90deg,transparent,rgba(122,63,209,0.18) 50%,transparent)", margin: "14px 0 16px" }} />

      <p style={{ fontSize: "0.82rem", fontWeight: 600, color: textMain, marginBottom: 8, lineHeight: 1.5, textAlign: "justify" }}>{meta.tagline}</p>
      <p style={{ fontSize: "0.76rem", color: textMuted, lineHeight: 1.65, marginBottom: 18, textAlign: "justify", hyphens: "auto" }}>{meta.description}</p>

      <div style={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: textLight, marginBottom: 10 }}>Includes</div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {meta.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.78rem", color: textMuted, lineHeight: 1.4 }}>
            <CheckIcon />
            {f}
          </li>
        ))}
      </ul>

      <button
        disabled={soldOut}
        onClick={() => !soldOut && onPurchase(meta.tier)}
        style={{ marginTop: 24, width: "100%", padding: "13px 0", borderRadius: 12, border: "none", cursor: soldOut ? "not-allowed" : "pointer", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.68rem", letterSpacing: "1px", textTransform: "uppercase", color: soldOut ? (dark ? "rgba(255,255,255,0.3)" : "rgba(13,5,32,0.3)") : "white", background: soldOut ? (dark ? "rgba(255,255,255,0.05)" : "rgba(13,5,32,0.05)") : meta.featured ? "linear-gradient(135deg, #7a3fd1, #f5a623)" : (dark ? "rgba(122,63,209,0.35)" : "#7a3fd1"), boxShadow: soldOut || !meta.featured ? "none" : "0 4px 20px rgba(122,63,209,0.4)", transition: "all 0.2s" }}
        onMouseEnter={(e) => { if (!soldOut && !meta.featured) e.currentTarget.style.background = dark ? "rgba(122,63,209,0.55)" : "#6330b3"; }}
        onMouseLeave={(e) => { if (!soldOut && !meta.featured) e.currentTarget.style.background = dark ? "rgba(122,63,209,0.35)" : "#7a3fd1"; }}
      >
        {soldOut ? "Sold Out" : "Get Your Pass"}
      </button>
    </div>
  );
}

export default function Tickets() {
  const [inventory, setInventory] = useState([]);
  const [dark, setDark] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setDark(document.body.classList.contains("dark-mode"));
    const obs = new MutationObserver(() => setDark(document.body.classList.contains("dark-mode")));
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setShowSuccessModal(true);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`${API}/admin/inventory/public`);
        const data = await res.json();
        setInventory(Array.isArray(data) ? data : []);
      } catch (err) { console.error("Inventory fetch failed", err); }
    };
    load();
  }, []);

  const getTier = (tier) => inventory.find((i) => i.tier === tier) || null;

  const handlePurchase = async (tier) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/payments/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      console.error("Purchase error:", err);
      alert(err.message || "Purchase failed");
    }
  };

  const passes     = ["connect", "influence", "power"];
  const passLabels = { connect: "Connect", influence: "Influence", power: "Power" };
  const allFeatures = [
    "2x Day Conference Access",
    "Expo Floor Access",
    "Networking Breaks",
    "2x CxO Breakfasts",
    "2x Luncheons",
    "1x Gala Dinner & Networking Reception",
    "1x Awards Night",
    "VIP Lounge Access (Both Days)",
  ];
  const passFeatureMap = {
    connect:   [true, true, true, true,  true,  false, false, false],
    influence: [true, true, true, true,  true,  true,  false, false],
    power:     [true, true, true, true,  true,  true,  true,  true],
  };

  const bg       = dark ? "#06020f" : "#ffffff";
  const textMain = dark ? "#ffffff" : "#0d0520";
  const textMuted= dark ? "rgba(255,255,255,0.60)" : "rgba(13,5,32,0.68)";

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: bg, color: textMain, position: "relative", transition: "background 0.3s ease" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: dark ? "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(122,63,209,0.10) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(245,166,35,0.06) 0%, transparent 70%)" : "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(122,63,209,0.05) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 1, paddingBottom: "1px" }}>
          <div style={{ textAlign: "center", padding: "100px 24px 60px", maxWidth: 780, margin: "0 auto" }}>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 20, color: textMain }}>
              Choose Your Pass
            </h1>
            <p style={{ fontSize: "1rem", color: textMuted, lineHeight: 1.75, textAlign: "justify", hyphens: "auto" }}>
              Whether you are coming to learn, connect, explore partnerships, or experience the event at the highest level, The Tech Festival Canada offers a pass designed for every kind of delegate.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", alignItems: "stretch", padding: "0 24px 80px", maxWidth: 1260, margin: "0 auto" }}>
            {passes.map((key) => (
              <PassCard key={key} meta={PASS_META[key]} inventoryItem={getTier(key)} onPurchase={handlePurchase} dark={dark} />
            ))}
          </div>

          <div style={{ maxWidth: 900, margin: "0 auto 80px", padding: "0 24px" }}>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: "1px", textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.35)" : "rgba(13,5,32,0.40)", textAlign: "center", marginBottom: 28 }}>Pass Comparison</h2>
            <div style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", background: dark ? "rgba(255,255,255,0.04)" : "rgba(122,63,209,0.03)", border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(122,63,209,0.10)", borderRadius: 20, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <div style={{ minWidth: 500 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3, 1fr)", borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(122,63,209,0.10)", padding: "14px 24px" }}>
                  <div style={{ fontSize: "0.7rem", color: textMuted, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", display: "flex", alignItems: "center" }}>Feature</div>
                  {passes.map((p) => (
                    <div key={p} style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.62rem", letterSpacing: "0.8px", textTransform: "uppercase", color: p === "influence" ? (dark ? "#f5a623" : "#d98a14") : textMuted }}>
                      {passLabels[p]}
                    </div>
                  ))}
                </div>
                {allFeatures.map((feature, fi) => (
                  <div key={feature} style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3, 1fr)", padding: "13px 24px", borderBottom: fi < allFeatures.length - 1 ? (dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(122,63,209,0.05)") : "none", background: fi % 2 === 0 ? (dark ? "rgba(255,255,255,0.01)" : "rgba(122,63,209,0.02)") : "transparent" }}>
                    <div style={{ fontSize: "0.78rem", color: dark ? "rgba(255,255,255,0.65)" : "rgba(13,5,32,0.80)", display: "flex", alignItems: "center" }}>{feature}</div>
                    {passes.map((p) => (
                      <div key={p} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {passFeatureMap[p][fi]
                          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={dark ? "#f5a623" : "#d98a14"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                          : <span style={{ color: dark ? "rgba(255,255,255,0.15)" : "rgba(13,5,32,0.15)", fontSize: "1rem", lineHeight: 1 }}>—</span>
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 760, margin: "0 auto 120px", padding: "0 24px", textAlign: "center" }}>
            <div style={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", background: dark ? "linear-gradient(135deg, rgba(122,63,209,0.12) 0%, rgba(245,166,35,0.06) 100%)" : "linear-gradient(135deg, rgba(122,63,209,0.07) 0%, rgba(245,166,35,0.04) 100%)", border: dark ? "1px solid rgba(122,63,209,0.25)" : "1px solid rgba(122,63,209,0.14)", borderRadius: 24, padding: "48px 40px" }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", color: dark ? "#f5a623" : "#d98a14", marginBottom: 14 }}>Why Upgrade Your Pass</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "clamp(1.3rem, 3vw, 1.9rem)", letterSpacing: "-0.5px", color: textMain, marginBottom: 20, lineHeight: 1.2 }}>
                Every Level Unlocks<br /><span style={{ color: dark ? "#f5a623" : "#d98a14" }}>More Opportunity</span>
              </h2>
              <p style={{ fontSize: "0.88rem", color: textMuted, lineHeight: 1.8, textAlign: "justify", hyphens: "auto" }}>
                Each pass level is designed to unlock a deeper layer of value. As you move up, the experience becomes more curated, more exclusive, and more relationship driven.
              </p>
            </div>
          </div>

          <Footer />
        </div>

        {showSuccessModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", width: "100%", maxWidth: "420px", background: dark ? "#120a22" : "#ffffff", padding: "40px 32px", borderRadius: "24px", border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(122,63,209,0.1)" }}>
              <div style={{ textAlign: "center", color: textMain }}>
                <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", margin: "0 0 12px 0", color: "#f5a623" }}>Thank You!</h2>
                <p style={{ opacity: 0.8, margin: 0, fontSize: "1.1rem", lineHeight: 1.6 }}>Thank you for purchasing your ticket.</p>
                <p style={{ opacity: 0.6, marginTop: "8px", fontSize: "0.95rem" }}>Please check your email for the invoice and QR code.</p>
              </div>
              <button onClick={() => { setShowSuccessModal(false); window.location.href = "/"; }}
                style={{ background: "linear-gradient(135deg, #7a3fd1, #f5a623)", border: "none", color: "white", padding: "16px 32px", borderRadius: "12px", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px", fontWeight: 700, width: "100%" }}>
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
