import { useState } from "react";
import Navbar from "../components/Navbar.tsx";
import AdminTabs from "../components/AdminTabs";
import AdminAttendees from "../components/AdminAttendees";
import AdminInventory from "../components/AdminInventory";
import CheckIn from "../components/CheckIn";
import AdminAnalytics from "../components/AdminAnalytics";
import AdminKyc from "../components/AdminKyc";

const API = "https://techfest-canada-backend.onrender.com/api";

/* =========================================================
   📊 OVERVIEW TAB
========================================================= */
function Overview() {
  return (
    <div className="admin-card">
<AdminAnalytics />
    </div>
  );
}

/* =========================================================
   👑 ADMIN MANAGEMENT TAB (NEW)
========================================================= */
function AdminManagement() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePromote = async () => {
    if (!email) {
      setMessage("Please enter an email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/admin/promote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessage(data.message || "User promoted successfully");
      setEmail("");
    } catch (err) {
      setMessage(err.message || "Promotion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h2>Admin Management</h2>
      <p>Grant admin access to trusted team members.</p>

      <div className="admin-form-row">
        <input
          type="email"
          placeholder="user@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-input"
        />

        <button
          className="btn-primary"
          onClick={handlePromote}
          disabled={loading}
        >
          {loading ? "Promoting..." : "Make Admin"}
        </button>
      </div>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   🧠 MAIN ADMIN PAGE
========================================================= */
export default function Admin() {
  const tabs = [
    { label: "Overview", component: Overview },
    { label: "Attendees", component: AdminAttendees },
    { label: "Inventory", component: AdminInventory },
    { label: "Scanner", component: CheckIn },
    { label: "Admins", component: AdminManagement }, // ⭐ NEW TAB
    { label: "KYC", component: AdminKyc },
  ];

  return (
    <>
      <Navbar />

      <div className="container admin-page">
        <h1 className="admin-title">Admin Control Panel</h1>
        <AdminTabs tabs={tabs} />
      </div>
    </>
  );
}
