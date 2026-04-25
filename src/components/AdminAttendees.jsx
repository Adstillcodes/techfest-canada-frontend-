import { useEffect, useState } from "react";

const API = "https://techfest-canada-backend.onrender.com/api";

export default function AdminAttendees() {
  const [isDark, setIsDark] = useState(true);
  const [users, setUsers] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.body.classList.contains("dark-mode"));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/admin/attendees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load attendees");
    }
  };

  const handleSyncFromStripe = async () => {
    setSyncing(true);
    setSyncResult(null);
    
    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${API}/admin/sync-guests-from-stripe`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      setSyncResult(data);
      
      if (data.success) {
        loadUsers();
      }
    } catch (err) {
      console.error("Sync failed:", err);
      setSyncResult({ error: err.message });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const textMain = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const buttonBg = isDark ? "#7a3fd1" : "#7a3fd1";
  const buttonHover = isDark ? "#8b4fe0" : "#6b2fc0";

  return (
    <div className="admin-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className={textMain} style={{ margin: 0 }}>Ticket Holders</h2>
        
        <button
          onClick={handleSyncFromStripe}
          disabled={syncing}
          style={{
            background: syncing ? "#666" : buttonBg,
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: 8,
            cursor: syncing ? "not-allowed" : "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            transition: "background 0.2s",
          }}
        >
          {syncing ? "Syncing..." : "Sync from Stripe"}
        </button>
      </div>

      {syncResult && (
        <div style={{
          padding: "12px 16px",
          marginBottom: 16,
          borderRadius: 8,
          background: syncResult.error ? "#fee" : "#e6f4ea",
          color: syncResult.error ? "#c00" : "#137333",
          fontSize: "0.85rem",
        }}>
          {syncResult.error 
            ? `Error: ${syncResult.error}`
            : `Success! Synced ${syncResult.synced} attendees from Stripe. Skipped ${syncResult.skipped} (already exists or logged-in users).`
          }
        </div>
      )}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Ticket Type</th>
              <th>Ticket ID</th>
              <th>Status</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id || user.id || user.email}>
                <td className={textMain}>{user.name}</td>
                <td className={textMuted}>{user.email}</td>
                <td className={textMain}>{user.ticketType}</td>
                <td className={textMuted}>{user.ticketId}</td>
                <td>
                  <span className={`ticket-badge ${user.checkedIn ? "active" : ""}`}>
                    {user.checkedIn ? "Checked In" : "Not Checked In"}
                  </span>
                </td>
                <td className={textMuted}>
                  {user.purchaseDate
                    ? new Date(user.purchaseDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
