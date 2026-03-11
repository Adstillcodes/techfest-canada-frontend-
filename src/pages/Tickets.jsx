import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer";
import { API } from "../utils/api";
//const API = "https://techfest-canada-backend.onrender.com/api";

export default function Tickets() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD INVENTORY =================
  useEffect(() => {
  const loadInventory = async () => {
    try {
      const res = await fetch(`${API}/admin/inventory/public`);
      const data = await res.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Inventory fetch failed", err);
    }
  };

  loadInventory();
}, []);

  // helper
const getTier = (tier) => {
  const item = inventory.find((i) => i.tier === tier);

  if (!item) {
    return { total: 0, sold: 0, remaining: 0 };
  }

  return {
    ...item,
    remaining: Math.max(item.total - item.sold, 0),
  };
};

  const early = getTier("early");
  const festival = getTier("festival");
  const vip = getTier("vip");

  const isSoldOut = (tier) => tier.remaining <= 0;

const handlePurchase = async (tier) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please sign in first");
      return;
    }

    const res = await fetch(
      `${API}/payments/create-checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    // 🔥 redirect to Stripe
    window.location.href = data.url;
  } catch (err) {
    console.error("Purchase error:", err);
    alert(err.message || "Purchase failed");
  }
};
  return (
    <>
      <Navbar />

      <section className="tickets-section container">
        <h1 className="tickets-title">Delegate Passes</h1>

        <div className="tickets-grid-pricing">
          {/* ================= EARLY ================= */}
          <div className="ticket-card disabled">
            <h3>Early Adopter</h3>
            <div className="ticket-price">CAD {early.price?.toLocaleString()}</div>

            <div className="ticket-badge expired">
              UNAVAILABLE - EXPIRED
            </div>

            <p>
              Initial release pricing for our mailing list
              subscribers.
            </p>

            <button className="btn-outline" disabled>
              SOLD OUT
            </button>
          </div>

          {/* ================= FESTIVAL (MOST POPULAR) ================= */}
          <div className="ticket-card featured">
            <div className="most-popular">MOST POPULAR</div>

            <h3>Festival Pass</h3>
            <div className="ticket-price">CAD CAD {festival.price?.toLocaleString()}</div>

            <div className="ticket-badge remaining">
              {festival.remaining} TICKETS REMAINING
            </div>

            <p>
              Full access to all keynote stages, networking
              events, and the exhibition.
            </p>

            <button
              className="btn-outline"
              disabled={isSoldOut(festival)}
              onClick={()=>handlePurchase("festival")}
            >
              {isSoldOut(festival)
                ? "SOLD OUT"
                : "GET YOUR PASS NOW"}
            </button>
          </div>

          {/* ================= VIP ================= */}
          <div className="ticket-card">
            <h3>VIP Experience</h3>
            <div className="ticket-price">CAD CAD {vip.price?.toLocaleString()}</div>

            <div className="ticket-badge vip">
              ONLY {vip.remaining} VIP SPOTS LEFT
            </div>

            <p>
              Front-row seating, speaker dinner, and
              1-on-1 expert sessions.
            </p>

            <button
              className="btn-outline"
              disabled={isSoldOut(vip)}
                onClick={() => handlePurchase("vip")}
            >
              {isSoldOut(vip)
                ? "SOLD OUT"
                : "CLAIM VIP ACCESS"}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
