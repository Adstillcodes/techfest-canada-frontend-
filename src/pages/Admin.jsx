import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import AdminTabs from "../components/AdminTabs";
import AdminAttendees from "../components/AdminAttendees";
import AdminInventory from "../components/AdminInventory";
import CheckIn from "../components/CheckIn";
import AdminAnalytics from "../components/AdminAnalytics";
import AdminKyc from "../components/AdminKyc";
import AdminEmailCampaigns from "../components/AdminEmailCampaigns";
import AdminAudience from "../components/AdminAudience";
import AdminCampaignCalendar from "../components/AdminCampaignCalendar";

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
   👑 ADMIN MANAGEMENT TAB
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

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChanged")); // optional but good
    navigate("/admin-login");
  };

  const tabs = [
    { label: "Overview", component: Overview },
    { label: "Attendees", component: AdminAttendees },
    { label: "Inventory", component: AdminInventory },
    { label: "Scanner", component: CheckIn },
    { label: "Admins", component: AdminManagement },
    { label: "KYC", component: AdminKyc },
    { label: "Campaigns", component: AdminEmailCampaigns },
    { label: "Calendar", component: AdminCampaignCalendar },
    { label: "Audience", component: AdminAudience },
  ];

  return (
    <>
      <Navbar />

      <div className="container admin-page">

        {/* 🔥 HEADER WITH LOGOUT */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 10
          }}
        >
          <h1 className="admin-title">Admin Control Panel</h1>

          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1.5px solid rgba(239,68,68,0.4)",
              color: "#f87171",
              padding: "10px 18px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Logout
          </button>
        </div>

        <AdminTabs tabs={tabs} />

      </div>
    </>
  );
}